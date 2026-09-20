package com.postscheduler.backend.config;

import com.postscheduler.backend.model.User;
import com.postscheduler.backend.repository.UserRepository;
import com.postscheduler.backend.service.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityAndCrossCuttingTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Test
    @DisplayName("GET /api/health - Publicly accessible and wrapped in ApiResponse envelope")
    void healthCheck_returnsApiResponseEnvelope() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", containsString("healthy")))
                .andExpect(jsonPath("$.data", containsString("running")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    @DisplayName("OPTIONS /api/posts - CORS preflight allows http://localhost:5173")
    void cors_preflightSuccess() throws Exception {
        mockMvc.perform(options("/api/posts")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "Authorization, Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    @DisplayName("Correlation ID Filter - Preserves existing X-Correlation-ID")
    void correlationId_preservedWhenProvided() throws Exception {
        String testCorrelationId = "custom-test-trace-id-999";

        mockMvc.perform(get("/api/health")
                        .header("X-Correlation-ID", testCorrelationId))
                .andExpect(status().isOk())
                .andExpect(header().string("X-Correlation-ID", testCorrelationId));
    }

    @Test
    @DisplayName("Correlation ID Filter - Generates new X-Correlation-ID if omitted")
    void correlationId_generatedWhenMissing() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-Correlation-ID"))
                .andExpect(header().string("X-Correlation-ID", not(emptyOrNullString())));
    }

    @Test
    @DisplayName("Security EntryPoint - 401 response has structured ApiResponse JSON envelope")
    void unauthorized_returnsStructuredApiResponseEnvelope() throws Exception {
        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string("Content-Type", containsString("application/json")))
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Unauthorized")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    @DisplayName("Access Denied Handler - 403 response has structured ApiResponse JSON envelope")
    void forbidden_returnsStructuredApiResponseEnvelope() throws Exception {
        User viewer = userRepository.findByUsername("viewer").orElseThrow();
        String viewerToken = jwtService.generateToken(viewer);

        mockMvc.perform(get("/api/activity")
                        .header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isForbidden())
                .andExpect(header().string("Content-Type", containsString("application/json")))
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Access denied")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }
}
