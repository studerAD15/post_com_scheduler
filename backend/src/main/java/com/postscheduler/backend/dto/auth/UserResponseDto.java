package com.postscheduler.backend.dto.auth;

import com.postscheduler.backend.model.Role;

public class UserResponseDto {
    private String id;
    private String username;
    private String name;
    private String email;
    private Role role;
    private String avatarUrl;

    public UserResponseDto() {}

    public UserResponseDto(String id, String username, String name, String email, Role role, String avatarUrl) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.role = role;
        this.avatarUrl = avatarUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
