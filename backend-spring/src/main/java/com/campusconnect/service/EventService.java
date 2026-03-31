package com.campusconnect.service;

import com.campusconnect.dto.PaginationResponse;
import com.campusconnect.model.Event;
import com.campusconnect.model.User;
import com.campusconnect.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.TemporalAdjusters;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final CloudinaryService cloudinaryService;
    private final MongoTemplate mongoTemplate;

    public PaginationResponse<List<Event>> getEvents(String category, String search, String date, int page, int limit) {
        PageRequest pageable = PageRequest.of(page - 1, limit, Sort.by("date").ascending());

        Page<Event> result;

        if (search != null && !search.isBlank()) {
            // Text search
            Query query = new Query();
            query.addCriteria(Criteria.where("isActive").is(true));
            query.addCriteria(TextCriteria.forDefaultLanguage().matching(search));
            query.with(pageable);

            long total = mongoTemplate.count(query, Event.class);
            List<Event> events = mongoTemplate.find(query, Event.class);

            return PaginationResponse.<List<Event>>builder()
                    .events(events)
                    .pagination(PaginationResponse.Pagination.builder()
                            .page(page).limit(limit).total(total)
                            .pages((int) Math.ceil((double) total / limit))
                            .build())
                    .build();
        }

        Instant[] dateRange = buildDateRange(date);

        if (category != null && !category.isBlank() && dateRange != null) {
            result = eventRepository.findActiveByFiltersCategoryAndDate(category, dateRange[0], dateRange[1], pageable);
        } else if (category != null && !category.isBlank()) {
            result = eventRepository.findActiveByCategory(category, pageable);
        } else if (dateRange != null) {
            result = eventRepository.findActiveByDate(dateRange[0], dateRange[1], pageable);
        } else {
            result = eventRepository.findAllActive(pageable);
        }

        return PaginationResponse.<List<Event>>builder()
                .events(result.getContent())
                .pagination(PaginationResponse.Pagination.builder()
                        .page(page).limit(limit).total(result.getTotalElements())
                        .pages(result.getTotalPages())
                        .build())
                .build();
    }

    public Event getEventById(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new AuthService.NotFoundException("Event not found"));
        if (!event.isActive()) {
            throw new AuthService.NotFoundException("Event not found");
        }
        return event;
    }

    public Event createEvent(User organizer, Event eventData, MultipartFile banner) throws IOException {
        eventData.setOrganizer(organizer.getId());

        if (eventData.getTags() != null && eventData.getTags().size() == 1) {
            // Could be comma-separated string
            String first = eventData.getTags().get(0);
            if (first.contains(",")) {
                eventData.setTags(Arrays.stream(first.split(","))
                        .map(String::trim).filter(s -> !s.isEmpty()).toList());
            }
        }

        if (banner != null && !banner.isEmpty()) {
            eventData.setBanner(cloudinaryService.uploadImage(banner, "cems/events"));
        }

        return eventRepository.save(eventData);
    }

    public Event updateEvent(String id, Event updates, MultipartFile banner) throws IOException {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new AuthService.NotFoundException("Event not found"));

        if (updates.getTitle() != null) event.setTitle(updates.getTitle());
        if (updates.getDescription() != null) event.setDescription(updates.getDescription());
        if (updates.getCategory() != null) event.setCategory(updates.getCategory());
        if (updates.getDate() != null) event.setDate(updates.getDate());
        if (updates.getEndDate() != null) event.setEndDate(updates.getEndDate());
        if (updates.getVenue() != null) event.setVenue(updates.getVenue());
        if (updates.getCapacity() > 0) event.setCapacity(updates.getCapacity());
        if (updates.getRegistrationDeadline() != null) event.setRegistrationDeadline(updates.getRegistrationDeadline());

        if (updates.getTags() != null) {
            List<String> tags = updates.getTags();
            if (tags.size() == 1 && tags.get(0).contains(",")) {
                tags = Arrays.stream(tags.get(0).split(","))
                        .map(String::trim).filter(s -> !s.isEmpty()).toList();
            }
            event.setTags(tags);
        }

        if (banner != null && !banner.isEmpty()) {
            event.setBanner(cloudinaryService.uploadImage(banner, "cems/events"));
        }

        return eventRepository.save(event);
    }

    public void deleteEvent(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new AuthService.NotFoundException("Event not found"));

        event.setActive(false);
        eventRepository.save(event);

        // Cancel all registrations
        mongoTemplate.updateMulti(
                Query.query(Criteria.where("event").is(id).and("status").is("registered")),
                Update.update("status", "cancelled"),
                "registrations"
        );
    }

    public Event cancelEvent(String id, String reason) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new AuthService.NotFoundException("Event not found"));

        event.setCancelled(true);
        event.setCancelReason(reason != null ? reason : "No reason provided");
        return eventRepository.save(event);
    }

    public List<Event> getAdminEvents() {
        return eventRepository.findAllByOrderByCreatedAtDesc();
    }

    public Event getAdminEventById(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new AuthService.NotFoundException("Event not found"));
    }

    private Instant[] buildDateRange(String range) {
        if (range == null || range.isBlank()) return null;

        LocalDate today = LocalDate.now();

        return switch (range) {
            case "today" -> new Instant[]{
                    today.atStartOfDay().toInstant(ZoneOffset.UTC),
                    today.atTime(23, 59, 59).toInstant(ZoneOffset.UTC)
            };
            case "this-week" -> {
                LocalDate monday = today.with(java.time.DayOfWeek.MONDAY);
                LocalDate sunday = monday.plusDays(6);
                yield new Instant[]{
                        monday.atStartOfDay().toInstant(ZoneOffset.UTC),
                        sunday.atTime(23, 59, 59).toInstant(ZoneOffset.UTC)
                };
            }
            case "this-month" -> {
                LocalDate first = today.with(TemporalAdjusters.firstDayOfMonth());
                LocalDate last = today.with(TemporalAdjusters.lastDayOfMonth());
                yield new Instant[]{
                        first.atStartOfDay().toInstant(ZoneOffset.UTC),
                        last.atTime(23, 59, 59).toInstant(ZoneOffset.UTC)
                };
            }
            default -> null;
        };
    }
}
