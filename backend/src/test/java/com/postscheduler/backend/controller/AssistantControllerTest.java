package com.postscheduler.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.postscheduler.backend.dto.assistant.AssistantChatRequestDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AssistantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/assistant/chat - Permitted without auth, returns 200 OK with tactical reply")
    void chat_success() throws Exception {
        AssistantChatRequestDto request = new AssistantChatRequestDto();
        request.setPrompt("What is the best time to schedule posts?");

        mockMvc.perform(post("/api/assistant/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", containsString("generated")))
                .andExpect(jsonPath("$.data.reply", notNullValue()))
                .andExpect(jsonPath("$.data.suggestions", not(empty())));
    }

    @Test
    @DisplayName("POST /api/assistant/chat - Contextual role awareness returns appropriate reply")
    void chat_withContext_success() throws Exception {
        AssistantChatRequestDto.AssistantContextDto context = new AssistantChatRequestDto.AssistantContextDto();
        context.setRole("EDITOR");
        context.setUserName("Test Editor");

        AssistantChatRequestDto request = new AssistantChatRequestDto("What are my role permissions?", context);

        mockMvc.perform(post("/api/assistant/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.reply", containsString("EDITOR")));
    }

    @Test
    @DisplayName("POST /api/assistant/chat - Blank prompt returns 400 Bad Request")
    void chat_blankPrompt_returns400() throws Exception {
        AssistantChatRequestDto request = new AssistantChatRequestDto();
        request.setPrompt("   ");

        mockMvc.perform(post("/api/assistant/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }
}
