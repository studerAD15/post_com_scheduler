package com.postscheduler.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.postscheduler.backend.dto.draft.DraftRequestDto;
import com.postscheduler.backend.model.User;
import com.postscheduler.backend.repository.UserRepository;
import com.postscheduler.backend.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class DraftControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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
    @DisplayName("GET /api/drafts - Admin, Editor, and Viewer can all read drafts (200 OK)")
    void getAllDrafts_rbacVerification() throws Exception {
        // Admin -> 200 OK
        mockMvc.perform(get("/api/drafts").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));

        // Editor -> 200 OK
        mockMvc.perform(get("/api/drafts").header("Authorization", "Bearer " + editorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        // Viewer -> 200 OK (Verifying fix: Viewer now has read access to drafts)
        mockMvc.perform(get("/api/drafts").header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("GET /api/drafts/{id} - Viewer can read single draft (200 OK); 404 on not found")
    void getDraftById_viewerReadAndNotFound() throws Exception {
        mockMvc.perform(get("/api/drafts/draft-101").header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is("draft-101")));

        mockMvc.perform(get("/api/drafts/unknown-draft").header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @DisplayName("POST /api/drafts - Admin & Editor can create; Viewer is 403 Forbidden")
    void createDraft_rbacEnforcement() throws Exception {
        DraftRequestDto dto = new DraftRequestDto();
        dto.setTitle("New Feature Spec Draft");
        dto.setContent("Brainstorming notes for upcoming launch.");
        dto.setPlatforms(List.of("twitter", "linkedin"));

        // Admin -> 201 Created
        mockMvc.perform(post("/api/drafts")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("New Feature Spec Draft")));

        // Editor -> 201 Created
        dto.setTitle("Editor Draft Entry");
        mockMvc.perform(post("/api/drafts")
                        .header("Authorization", "Bearer " + editorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)));

        // Viewer -> 403 Forbidden
        dto.setTitle("Viewer Attempted Draft");
        mockMvc.perform(post("/api/drafts")
                        .header("Authorization", "Bearer " + viewerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Access denied")));
    }

    @Test
    @DisplayName("PUT /api/drafts/{id} - Editor can update; Viewer is 403 Forbidden")
    void updateDraft_rbacEnforcement() throws Exception {
        DraftRequestDto updateDto = new DraftRequestDto();
        updateDto.setTitle("Q3 Roadmap Revised");
        updateDto.setContent("Updated copy with revised target dates");
        updateDto.setPlatforms(List.of("twitter"));

        // Editor -> 200 OK
        mockMvc.perform(put("/api/drafts/draft-101")
                        .header("Authorization", "Bearer " + editorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Q3 Roadmap Revised")));

        // Viewer -> 403 Forbidden
        mockMvc.perform(put("/api/drafts/draft-101")
                        .header("Authorization", "Bearer " + viewerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @DisplayName("DELETE /api/drafts/{id} - Editor can delete; Viewer is 403 Forbidden")
    void deleteDraft_rbacEnforcement() throws Exception {
        // Create draft first
        DraftRequestDto dto = new DraftRequestDto();
        dto.setTitle("Draft to delete");
        dto.setContent("Content to delete");
        dto.setPlatforms(List.of("linkedin"));

        String json = mockMvc.perform(post("/api/drafts")
                        .header("Authorization", "Bearer " + editorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String createdId = objectMapper.readTree(json).path("data").path("id").asText();

        // Viewer -> 403 Forbidden
        mockMvc.perform(delete("/api/drafts/" + createdId)
                        .header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isForbidden());

        // Editor -> 200 OK
        mockMvc.perform(delete("/api/drafts/" + createdId)
                        .header("Authorization", "Bearer " + editorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", containsString("deleted successfully")));

        // Confirm deleted -> 404
        mockMvc.perform(get("/api/drafts/" + createdId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }
}
