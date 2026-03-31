package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.model.Registration;
import com.campusconnect.model.User;
import com.campusconnect.service.RegistrationService;
import com.opencsv.CSVWriter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/{eventId}")
    public ResponseEntity<ApiResponse<Registration>> register(
            @AuthenticationPrincipal User user,
            @PathVariable String eventId) {
        Registration reg = registrationService.registerForEvent(user, eventId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(reg, "Registered successfully"));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<ApiResponse<Void>> cancel(
            @AuthenticationPrincipal User user,
            @PathVariable String eventId) {
        registrationService.cancelOwnRegistration(user, eventId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Registration cancelled"));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> myRegistrations(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(registrationService.getMyRegistrations(user)));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> eventRegistrants(
            @PathVariable String eventId) {
        return ResponseEntity.ok(ApiResponse.ok(registrationService.getEventRegistrants(eventId)));
    }

    @PutMapping("/{id}/attend")
    public ResponseEntity<ApiResponse<Registration>> markAttendance(@PathVariable String id) {
        Registration reg = registrationService.markAttendance(id);
        return ResponseEntity.ok(ApiResponse.ok(reg, "Attendance marked"));
    }

    @GetMapping("/event/{eventId}/export")
    public void exportCsv(@PathVariable String eventId, HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"participants.csv\"");

        List<Map<String, Object>> data = registrationService.getExportData(eventId);

        try (CSVWriter writer = new CSVWriter(response.getWriter())) {
            // Header
            writer.writeNext(new String[]{"name", "email", "rollNumber", "department", "status", "registeredAt", "checkedInAt"});

            for (Map<String, Object> row : data) {
                writer.writeNext(new String[]{
                        str(row.get("name")),
                        str(row.get("email")),
                        str(row.get("rollNumber")),
                        str(row.get("department")),
                        str(row.get("status")),
                        str(row.get("registeredAt")),
                        str(row.get("checkedInAt"))
                });
            }
        }
    }

    private String str(Object obj) {
        return obj != null ? obj.toString() : "";
    }
}
