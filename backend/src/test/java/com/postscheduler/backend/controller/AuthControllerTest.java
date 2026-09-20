package com.postscheduler.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.postscheduler.backend.dto.auth.LoginRequestDto;
import com.postscheduler.backend.model.User;
import com.postscheduler.backend.repository.UserRepository;
import com.postscheduler.backend.service.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Test
    @DisplayName("POST /api/auth/login - Admin succeeds with 200 OK and returns valid JWT")
    void login_adminSuccess() throws Exception {
        LoginRequestDto request = new LoginRequestDto("admin", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", containsString("successful")))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.user.username", is("admin")))
                .andExpect(jsonPath("$.data.user.role", is("admin")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Editor succeeds with 200 OK")
    void login_editorSuccess() throws Exception {
        LoginRequestDto request = new LoginRequestDto("editor", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.user.role", is("editor")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Viewer succeeds with 200 OK")
    void login_viewerSuccess() throws Exception {
        LoginRequestDto request = new LoginRequestDto("viewer", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.user.role", is("viewer")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Invalid password returns 401 Unauthorized")
    void login_invalidPassword_returns401() throws Exception {
        LoginRequestDto request = new LoginRequestDto("admin", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Invalid username or password")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Unknown username returns 401 Unauthorized")
    void login_unknownUser_returns401() throws Exception {
        LoginRequestDto request = new LoginRequestDto("nonexistent_user", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Invalid username or password")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Blank credentials return 400 Bad Request")
    void login_blankCredentials_returns400() throws Exception {
        LoginRequestDto request = new LoginRequestDto("", "");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Validation failed")));
    }

    @Test
    @DisplayName("GET /api/auth/me - Authenticated user returns 200 OK with profile")
    void getCurrentUser_authenticated_returns200() throws Exception {
        User admin = userRepository.findByUsername("admin").orElseThrow();
        String token = jwtService.generateToken(admin);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.username", is("admin")))
                .andExpect(jsonPath("$.data.email", is("aditya.admin@company.com")));
    }

    @Test
    @DisplayName("GET /api/auth/me - Unauthenticated returns 401 Unauthorized with ApiResponse envelope")
    void getCurrentUser_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Unauthorized")));
    }
}
