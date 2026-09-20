package com.postscheduler.backend.dto.activity;

import com.postscheduler.backend.model.Role;

public class ActivityLogResponseDto {
    private String id;
    private String targetId;
    private String targetType;
    private String actionType;
    private String userId;
    private String username;
    private Role userRole;
    private String userName;
    private String timestamp;
    private String summary;
    private String title;

    public ActivityLogResponseDto() {}

    public ActivityLogResponseDto(String id, String targetId, String targetType, String actionType,
                                 String userId, String username, Role userRole, String userName,
                                 String timestamp, String summary, String title) {
        this.id = id;
        this.targetId = targetId;
        this.targetType = targetType;
        this.actionType = actionType;
        this.userId = userId;
        this.username = username;
        this.userRole = userRole;
        this.userName = userName;
        this.timestamp = timestamp;
        this.summary = summary;
        this.title = title;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Role getUserRole() { return userRole; }
    public void setUserRole(Role userRole) { this.userRole = userRole; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
