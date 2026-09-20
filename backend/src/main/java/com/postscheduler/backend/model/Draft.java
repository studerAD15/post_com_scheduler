package com.postscheduler.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "drafts")
public class Draft {

    @Id
    private String id;

    private String title;

    @Column(length = 10000)
    private String content;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "draft_platforms", joinColumns = @JoinColumn(name = "draft_id"))
    @Column(name = "platform")
    private List<String> platforms = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "draft_media", joinColumns = @JoinColumn(name = "draft_id"))
    private List<MediaAttachment> media = new ArrayList<>();

    private String status = "draft";

    private String scheduledAt;

    @Column(nullable = false)
    private String createdAt;

    @Column(nullable = false)
    private String updatedAt;

    private String authorId;
    private String authorName;
    private String authorRole;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "draft_id")
    @OrderBy("timestamp DESC")
    private List<DraftAuditLogEntry> auditTrail = new ArrayList<>();

    public Draft() {}

    @PrePersist
    public void prePersist() {
        String now = Instant.now().toString();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        if (this.updatedAt == null) {
            this.updatedAt = now;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<String> getPlatforms() { return platforms; }
    public void setPlatforms(List<String> platforms) { this.platforms = platforms; }

    public List<MediaAttachment> getMedia() { return media; }
    public void setMedia(List<MediaAttachment> media) { this.media = media; }

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

    public List<DraftAuditLogEntry> getAuditTrail() { return auditTrail; }
    public void setAuditTrail(List<DraftAuditLogEntry> auditTrail) { this.auditTrail = auditTrail; }
}
