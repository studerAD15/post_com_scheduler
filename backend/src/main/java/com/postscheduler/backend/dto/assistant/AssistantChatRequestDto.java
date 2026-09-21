package com.postscheduler.backend.dto.assistant;

import jakarta.validation.constraints.NotBlank;

public class AssistantChatRequestDto {

    @NotBlank(message = "Prompt cannot be blank")
    private String prompt;

    private AssistantContextDto context;

    public AssistantChatRequestDto() {
    }

    public AssistantChatRequestDto(String prompt, AssistantContextDto context) {
        this.prompt = prompt;
        this.context = context;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public AssistantContextDto getContext() {
        return context;
    }

    public void setContext(AssistantContextDto context) {
        this.context = context;
    }

    public static class AssistantContextDto {
        private String role;
        private String userName;
        private Integer postsCount;
        private Integer draftsCount;

        public AssistantContextDto() {
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public Integer getPostsCount() {
            return postsCount;
        }

        public void setPostsCount(Integer postsCount) {
            this.postsCount = postsCount;
        }

        public Integer getDraftsCount() {
            return draftsCount;
        }

        public void setDraftsCount(Integer draftsCount) {
            this.draftsCount = draftsCount;
        }
    }
}
