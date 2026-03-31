package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.auth.*;
import com.campusconnect.model.User;
import com.campusconnect.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse data = authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(data, "Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse data = authService.login(req);
        return ResponseEntity.ok(ApiResponse.ok(data, "Logged in successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthPayload>> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(authService.getProfile(user), "Fetched profile"));
    }

    @PutMapping("/update-profile")
    public ResponseEntity<ApiResponse<AuthPayload>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) MultipartFile avatar) throws IOException {
        AuthPayload data = authService.updateProfile(user, name, department, avatar);
        return ResponseEntity.ok(ApiResponse.ok(data, "Profile updated"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest req) {
        authService.changePassword(user, req);
        return ResponseEntity.ok(ApiResponse.ok(null, "Password changed successfully"));
    }

    @PutMapping("/promote/{userId}")
    public ResponseEntity<ApiResponse<AuthPayload>> promote(@PathVariable String userId) {
        AuthPayload data = authService.promoteUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(data, "User promoted to admin"));
    }
}
