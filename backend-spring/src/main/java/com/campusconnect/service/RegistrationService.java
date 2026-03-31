package com.campusconnect.service;

import com.campusconnect.model.Event;
import com.campusconnect.model.Registration;
import com.campusconnect.model.User;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.RegistrationRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final MongoTemplate mongoTemplate;

    public Registration registerForEvent(User student, String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AuthService.NotFoundException("Event not found"));

        if (!event.isActive()) throw new AuthService.NotFoundException("Event not found");
        if (event.isCancelled()) throw new AuthService.BadRequestException("Event is cancelled");

        if (event.getRegistrationDeadline() != null && Instant.now().isAfter(event.getRegistrationDeadline())) {
            throw new AuthService.BadRequestException("Registration deadline has passed");
        }

        if (event.getRegisteredCount() >= event.getCapacity()) {
            throw new AuthService.BadRequestException("Event is full");
        }

        Registration existing = registrationRepository.findByStudentAndEvent(student.getId(), eventId).orElse(null);

        if (existing != null && !"cancelled".equals(existing.getStatus())) {
            throw new AuthService.ConflictException("Already registered");
        }

        Registration registration;
        if (existing != null && "cancelled".equals(existing.getStatus())) {
            existing.setStatus("registered");
            existing.setRegisteredAt(Instant.now());
            existing.setCheckedInAt(null);
            registration = registrationRepository.save(existing);
        } else {
            registration = new Registration();
            registration.setStudent(student.getId());
            registration.setEvent(eventId);
            registration.setStatus("registered");
            registration = registrationRepository.save(registration);
        }

        // Increment count
        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepository.save(event);

        // Send confirmation email
        emailService.sendEmail(
                student.getEmail(),
                "Registration Confirmed: " + event.getTitle(),
                "You have successfully registered for " + event.getTitle() + " on " + event.getDate() + "."
        );

        return registration;
    }

    public void cancelOwnRegistration(User student, String eventId) {
        Registration registration = registrationRepository.findByStudentAndEvent(student.getId(), eventId)
                .orElseThrow(() -> new AuthService.NotFoundException("Registration not found"));

        if ("cancelled".equals(registration.getStatus())) {
            throw new AuthService.NotFoundException("Registration not found");
        }

        registration.setStatus("cancelled");
        registrationRepository.save(registration);

        // Decrement count
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("id").is(eventId)),
                new Update().inc("registeredCount", -1),
                Event.class
        );
    }

    public List<Map<String, Object>> getMyRegistrations(User student) {
        List<Registration> rows = registrationRepository
                .findByStudentAndStatusNotOrderByRegisteredAtDesc(student.getId(), "cancelled");

        // Populate event data
        return rows.stream().map(reg -> {
            Map<String, Object> map = new HashMap<>();
            map.put("_id", reg.getId());
            map.put("student", reg.getStudent());
            map.put("status", reg.getStatus());
            map.put("registeredAt", reg.getRegisteredAt());
            map.put("checkedInAt", reg.getCheckedInAt());
            map.put("createdAt", reg.getCreatedAt());
            map.put("updatedAt", reg.getUpdatedAt());

            Event event = eventRepository.findById(reg.getEvent()).orElse(null);
            map.put("event", event);
            return map;
        }).toList();
    }

    public List<Map<String, Object>> getEventRegistrants(String eventId) {
        List<Registration> rows = registrationRepository
                .findByEventAndStatusNotOrderByRegisteredAtDesc(eventId, "cancelled");

        return rows.stream().map(reg -> {
            Map<String, Object> map = new HashMap<>();
            map.put("_id", reg.getId());
            map.put("event", reg.getEvent());
            map.put("status", reg.getStatus());
            map.put("registeredAt", reg.getRegisteredAt());
            map.put("checkedInAt", reg.getCheckedInAt());
            map.put("createdAt", reg.getCreatedAt());
            map.put("updatedAt", reg.getUpdatedAt());

            User user = userRepository.findById(reg.getStudent()).orElse(null);
            if (user != null) {
                Map<String, Object> studentMap = new HashMap<>();
                studentMap.put("_id", user.getId());
                studentMap.put("name", user.getName());
                studentMap.put("email", user.getEmail());
                studentMap.put("rollNumber", user.getRollNumber());
                studentMap.put("department", user.getDepartment());
                map.put("student", studentMap);
            }
            return map;
        }).toList();
    }

    public Registration markAttendance(String registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new AuthService.NotFoundException("Registration not found"));

        registration.setStatus("attended");
        registration.setCheckedInAt(Instant.now());
        return registrationRepository.save(registration);
    }

    public List<Map<String, Object>> getExportData(String eventId) {
        List<Registration> rows = registrationRepository
                .findByEventAndStatusNotOrderByRegisteredAtDesc(eventId, "cancelled");

        return rows.stream().map(reg -> {
            User student = userRepository.findById(reg.getStudent()).orElse(null);
            Map<String, Object> map = new HashMap<>();
            map.put("name", student != null ? student.getName() : "-");
            map.put("email", student != null ? student.getEmail() : "-");
            map.put("rollNumber", student != null && student.getRollNumber() != null ? student.getRollNumber() : "-");
            map.put("department", student != null && student.getDepartment() != null ? student.getDepartment() : "-");
            map.put("status", reg.getStatus());
            map.put("registeredAt", reg.getRegisteredAt() != null ? reg.getRegisteredAt().toString() : "");
            map.put("checkedInAt", reg.getCheckedInAt() != null ? reg.getCheckedInAt().toString() : "");
            return map;
        }).toList();
    }
}
