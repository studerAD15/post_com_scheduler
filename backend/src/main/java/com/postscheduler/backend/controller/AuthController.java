package com.postscheduler.backend.controller;

import com.postscheduler.backend.dto.ApiResponse;
import com.postscheduler.backend.dto.auth.LoginRequestDto;
import com.postscheduler.backend.dto.auth.LoginResponseDto;
import com.postscheduler.backend.dto.auth.UserResponseDto;
import com.postscheduler.backend.model.User;
import com.postscheduler.backend.service.AuthService;
import com.postscheduler.backend.util.SecurityUtils;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController.java - REST API Endpoints for User Authentication & Profile Inspection.
 *
 * BASE ROUTE: `/api/auth`
 *
 * ENDPOINTS:
 * 1. POST /api/auth/login -> Authenticates user via BCrypt, issues signed JWT token -> 200 OK
 * 2. GET  /api/auth/me    -> Inspects authenticated user profile from SecurityContextHolder -> 200 OK (or 401)
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto dto) {
        log.info("User login attempt for username: {}", dto.getUsername());
        LoginResponseDto response = authService.login(dto);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDto>> getCurrentUser() {
        User user = SecurityUtils.getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        UserResponseDto dto = authService.mapToUserDto(user);
        return ResponseEntity.ok(ApiResponse.success("Current user profile retrieved", dto));
    }
}
