package com.postscheduler.backend.dto.draft;

import com.postscheduler.backend.dto.post.MediaAttachmentDto;

import java.util.List;

public class DraftRequestDto {

    private String title;
    private String content;
    private List<String> platforms;
    private List<MediaAttachmentDto> media;
    private String status;
    private String scheduledAt;
    private String authorId;
    private String authorName;
    private String authorRole;

    public DraftRequestDto() {}

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

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }
}
