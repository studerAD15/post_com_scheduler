package com.postscheduler.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.postscheduler.backend.dto.post.PostRequestDto;
import com.postscheduler.backend.dto.post.SchedulePostRequestDto;
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

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PostControllerTest {

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
    @DisplayName("GET /api/posts - All roles (Admin, Editor, Viewer) succeed with 200 OK")
    void getAllPosts_allRolesAllowed() throws Exception {
        mockMvc.perform(get("/api/posts").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));

        mockMvc.perform(get("/api/posts").header("Authorization", "Bearer " + editorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        mockMvc.perform(get("/api/posts").header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));
    }

    @Test
    @DisplayName("GET /api/posts/{id} - Existing post returns 200, non-existent returns 404")
    void getPostById_existingAndNotFound() throws Exception {
        mockMvc.perform(get("/api/posts/post-1").header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is("post-1")));

        mockMvc.perform(get("/api/posts/non-existent-id").header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("was not found")));
    }

    @Test
    @DisplayName("POST /api/posts - Editor succeeds with 201 Created; Admin and Viewer get 403 Forbidden")
    void createPost_rbacEnforcement() throws Exception {
        PostRequestDto dto = new PostRequestDto();
        dto.setTitle("New Tech Launch");
        dto.setContent("Announcing exciting new updates to our platform!");
        dto.setPlatforms(List.of("twitter", "linkedin"));
        dto.setStatus("draft");

        // Admin -> 403 Forbidden (Admin has no post management permissions)
        mockMvc.perform(post("/api/posts")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Access denied")));

        // Editor -> 201 Created
        dto.setTitle("Editor Tech Post");
        mockMvc.perform(post("/api/posts")
                        .header("Authorization", "Bearer " + editorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Editor Tech Post")));

        // Viewer -> 403 Forbidden
        dto.setTitle("Viewer Attempt");
        mockMvc.perform(post("/api/posts")
                        .header("Authorization", "Bearer " + viewerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Access denied")));
    }

    @Test
    @DisplayName("POST /api/posts - Invalid payload returns 400 Bad Request")
    void createPost_validationFailure() throws Exception {
        PostRequestDto invalidDto = new PostRequestDto();
        invalidDto.setTitle("Invalid");
        invalidDto.setContent(""); // Empty content
        invalidDto.setPlatforms(List.of()); // Empty platforms

        mockMvc.perform(post("/api/posts")
                        .header("Authorization", "Bearer " + editorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Validation failed")));
    }

    @Test
    @DisplayName("PUT /api/posts/{id} - Editor succeeds; Admin and Viewer get 403 Forbidden")
    void updatePost_rbacEnforcement() throws Exception {
        PostRequestDto updateDto = new PostRequestDto();
        updateDto.setTitle("Updated Title AI");
        updateDto.setContent("Updated content for AI launch");
        updateDto.setPlatforms(List.of("twitter"));

        // Editor -> 200 OK
        mockMvc.perform(put("/api/posts/post-1")
                        .header("Authorization", "Bearer " + editorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Updated Title AI")));

        // Admin -> 403 Forbidden
        mockMvc.perform(put("/api/posts/post-1")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));

        // Viewer -> 403 Forbidden
        mockMvc.perform(put("/api/posts/post-1")
                        .header("Authorization", "Bearer " + viewerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @DisplayName("PATCH /api/posts/{id}/schedule - Editor succeeds; Admin and Viewer get 403 Forbidden")
    void schedulePost_rbacEnforcement() throws Exception {
        String scheduleTime = Instant.now().plus(3, ChronoUnit.DAYS).toString();
        SchedulePostRequestDto scheduleDto = new SchedulePostRequestDto(scheduleTime);

        // Editor -> 200 OK
        mockMvc.perform(patch("/api/posts/post-2/schedule")
                        .header("Authorization", "Bearer " + editorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(scheduleDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("scheduled")));

        // Admin -> 403 Forbidden
        mockMvc.perform(patch("/api/posts/post-2/schedule")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(scheduleDto)))
                .andExpect(status().isForbidden());

        // Viewer -> 403 Forbidden
        mockMvc.perform(patch("/api/posts/post-2/schedule")
                        .header("Authorization", "Bearer " + viewerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(scheduleDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("PATCH /api/posts/{id}/publish - Editor succeeds; Admin and Viewer get 403 Forbidden")
    void publishPost_rbacEnforcement() throws Exception {
        // Editor -> 200 OK
        mockMvc.perform(patch("/api/posts/post-2/publish")
                        .header("Authorization", "Bearer " + editorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("published")));

        // Admin -> 403 Forbidden
        mockMvc.perform(patch("/api/posts/post-3/publish")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isForbidden());

        // Viewer -> 403 Forbidden
        mockMvc.perform(patch("/api/posts/post-3/publish")
                        .header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("DELETE /api/posts/{id} - Editor can delete; Admin and Viewer get 403 Forbidden")
    void deletePost_rbacEnforcement() throws Exception {
        // First, create a post to delete as Editor
        PostRequestDto dto = new PostRequestDto();
        dto.setTitle("To be deleted by editor");
        dto.setContent("Content to delete");
        dto.setPlatforms(List.of("facebook"));

        String responseJson = mockMvc.perform(post("/api/posts")
                        .header("Authorization", "Bearer " + editorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String createdId = objectMapper.readTree(responseJson).path("data").path("id").asText();

        // Admin attempts delete -> 403 Forbidden
        mockMvc.perform(delete("/api/posts/" + createdId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isForbidden());

        // Viewer attempts delete -> 403 Forbidden
        mockMvc.perform(delete("/api/posts/" + createdId)
                        .header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isForbidden());

        // Editor deletes -> 200 OK
        mockMvc.perform(delete("/api/posts/" + createdId)
                        .header("Authorization", "Bearer " + editorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", containsString("deleted successfully")));

        // Verifying it is now gone -> 404
        mockMvc.perform(get("/api/posts/" + createdId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }
}
