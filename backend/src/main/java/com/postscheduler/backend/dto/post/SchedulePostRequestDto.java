package com.postscheduler.backend.dto.post;

import jakarta.validation.constraints.NotBlank;

public class SchedulePostRequestDto {

    @NotBlank(message = "Scheduled time is required.")
    private String scheduledAt;

    public SchedulePostRequestDto() {}

    public SchedulePostRequestDto(String scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }
}
