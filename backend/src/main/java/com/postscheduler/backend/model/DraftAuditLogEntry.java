package com.postscheduler.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "draft_audit_logs")
public class DraftAuditLogEntry {

    @Id
    private String id;

    private String userId;
    private String username;
    private String name;
    private String role;
    private String action; // "created", "updated", "scheduled", "status_change"

    @Column(nullable = false)
    private String timestamp;

    @Column(length = 1000)
    private String changesSummary;

    public DraftAuditLogEntry() {}

    public DraftAuditLogEntry(String id, String userId, String username, String name, String role, String action, String timestamp, String changesSummary) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.name = name;
        this.role = role;
        this.action = action;
        this.timestamp = timestamp;
        this.changesSummary = changesSummary;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getChangesSummary() { return changesSummary; }
    public void setChangesSummary(String changesSummary) { this.changesSummary = changesSummary; }
}
