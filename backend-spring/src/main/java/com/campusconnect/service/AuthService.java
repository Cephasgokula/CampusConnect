package com.campusconnect.service;

import com.campusconnect.dto.auth.*;
import com.campusconnect.model.User;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final CloudinaryService cloudinaryService;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail().toLowerCase())) {
            throw new ConflictException("User already exists");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("student");
        user.setRollNumber(req.getRollNumber());
        user.setDepartment(req.getDepartment());

        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getRole());
        return AuthResponse.builder()
                .token(token)
                .user(toAuthPayload(user))
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getRole());
        return AuthResponse.builder()
                .token(token)
                .user(toAuthPayload(user))
                .build();
    }

    public AuthPayload getProfile(User user) {
        return toAuthPayload(user);
    }

    public AuthPayload updateProfile(User currentUser, String name, String department, MultipartFile avatar) throws IOException {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (name != null && !name.isBlank()) user.setName(name);
        if (department != null && !department.isBlank()) user.setDepartment(department);

        if (avatar != null && !avatar.isEmpty()) {
            String url = cloudinaryService.uploadImage(avatar, "cems/avatars");
            user.setAvatar(url);
        }

        user = userRepository.save(user);
        return toAuthPayload(user);
    }

    public void changePassword(User currentUser, ChangePasswordRequest req) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    public AuthPayload promoteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        user.setRole("admin");
        user = userRepository.save(user);
        return toAuthPayload(user);
    }

    public static AuthPayload toAuthPayload(User user) {
        return AuthPayload.builder()
                ._id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .department(user.getDepartment())
                .rollNumber(user.getRollNumber())
                .avatar(user.getAvatar())
                .build();
    }

    // --- Inner exception classes for clarity ---

    public static class ConflictException extends RuntimeException {
        public ConflictException(String msg) { super(msg); }
    }

    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String msg) { super(msg); }
    }

    public static class NotFoundException extends RuntimeException {
        public NotFoundException(String msg) { super(msg); }
    }

    public static class BadRequestException extends RuntimeException {
        public BadRequestException(String msg) { super(msg); }
    }
}
