package com.postscheduler.backend.dto.post;

import java.util.List;

public class PostResponseDto {
    private String id;
    private String title;
    private String content;
    private List<String> platforms;
    private List<MediaAttachmentDto> media;
    private String status;
    private String scheduledAt;
    private String createdAt;
    private String updatedAt;
    private String authorId;
    private String authorName;
    private String authorRole;

    public PostResponseDto() {}

    public PostResponseDto(String id, String title, String content, List<String> platforms,
                           List<MediaAttachmentDto> media, String status, String scheduledAt,
                           String createdAt, String updatedAt, String authorId,
                           String authorName, String authorRole) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.platforms = platforms;
        this.media = media;
        this.status = status;
        this.scheduledAt = scheduledAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorRole = authorRole;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<String> getPlatforms() { return platforms; }
    public void setPlatforms(List<String> platforms) { this.platforms = platforms; }

    public List<MediaAttachmentDto> getMedia() { return media; }
    public void setMedia(List<MediaAttachmentDto> media) { this.media = media; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }
}
