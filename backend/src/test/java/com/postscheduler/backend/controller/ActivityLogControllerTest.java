package com.postscheduler.backend.controller;

import com.postscheduler.backend.model.User;
import com.postscheduler.backend.repository.UserRepository;
import com.postscheduler.backend.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ActivityLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private String adminToken;
    private String editorToken;
    private String viewerToken;

    @BeforeEach
    void setUp() {
        User admin = userRepository.findByUsername("admin").orElseThrow();
        User editor = userRepository.findByUsername("editor").orElseThrow();
        User viewer = userRepository.findByUsername("viewer").orElseThrow();

        adminToken = jwtService.generateToken(admin);
        editorToken = jwtService.generateToken(editor);
        viewerToken = jwtService.generateToken(viewer);
    }

    @Test
    @DisplayName("GET /api/activity - Admin succeeds with 200 OK and activity list")
    void getActivityLog_adminAllowed() throws Exception {
        mockMvc.perform(get("/api/activity").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].summary", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/activity - Editor is explicitly 403 Forbidden")
    void getActivityLog_editorForbidden() throws Exception {
        mockMvc.perform(get("/api/activity").header("Authorization", "Bearer " + editorToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Access denied")));
    }

    @Test
    @DisplayName("GET /api/activity - Viewer is explicitly 403 Forbidden")
    void getActivityLog_viewerForbidden() throws Exception {
        mockMvc.perform(get("/api/activity").header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Access denied")));
    }

    @Test
    @DisplayName("GET /api/activity - Unauthenticated request is 401 Unauthorized")
    void getActivityLog_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/activity"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Unauthorized")));
    }
}
