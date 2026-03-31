package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.PaginationResponse;
import com.campusconnect.dto.event.CancelEventRequest;
import com.campusconnect.model.Event;
import com.campusconnect.model.User;
import com.campusconnect.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<List<Event>>>> getEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String date,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        PaginationResponse<List<Event>> data = eventService.getEvents(category, search, date, page, limit);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> getEventById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getEventById(id)));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<Event>>> getAdminEvents() {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getAdminEvents()));
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Event>> getAdminEventById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getAdminEventById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Event>> createEvent(
            @AuthenticationPrincipal User user,
            @ModelAttribute Event event,
            @RequestParam(required = false) MultipartFile banner) throws IOException {
        Event created = eventService.createEvent(user, event, banner);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Event created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> updateEvent(
            @PathVariable String id,
            @ModelAttribute Event event,
            @RequestParam(required = false) MultipartFile banner) throws IOException {
        Event updated = eventService.updateEvent(id, event, banner);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Event updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Event deactivated successfully"));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Event>> cancelEvent(
            @PathVariable String id,
            @RequestBody(required = false) CancelEventRequest req) {
        String reason = req != null ? req.getReason() : null;
        Event event = eventService.cancelEvent(id, reason);
        return ResponseEntity.ok(ApiResponse.ok(event, "Event cancelled successfully"));
    }
}
