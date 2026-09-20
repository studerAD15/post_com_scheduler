package com.postscheduler.backend.service;

import com.postscheduler.backend.dto.activity.ActivityLogResponseDto;
import com.postscheduler.backend.model.ActivityLogEntry;
import com.postscheduler.backend.model.Role;
import com.postscheduler.backend.model.User;
import com.postscheduler.backend.repository.ActivityLogRepository;
import com.postscheduler.backend.util.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    public void logActivity(String targetId, String targetType, String actionType,
                            String summary, String title) {
        User user = SecurityUtils.getCurrentUser();
        String userId = user != null ? user.getId() : "system";
        String username = user != null ? user.getUsername() : "system";
        Role userRole = user != null ? user.getRole() : Role.ADMIN;
        String userName = user != null ? user.getName() : "System Automation";

        logActivityWithUser(targetId, targetType, actionType, userId, username, userRole, userName, summary, title);
    }

    public void logActivityWithUser(String targetId, String targetType, String actionType,
                                    String userId, String username, Role userRole, String userName,
                                    String summary, String title) {
        String id = "act-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 5);
        ActivityLogEntry entry = new ActivityLogEntry(id, targetId, targetType, actionType,
                userId, username, userRole, userName, summary, title);
        activityLogRepository.save(entry);
    }

    public List<ActivityLogResponseDto> getAllActivities() {
        return activityLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ActivityLogResponseDto mapToDto(ActivityLogEntry entry) {
        return new ActivityLogResponseDto(
                entry.getId(),
                entry.getTargetId(),
                entry.getTargetType(),
                entry.getActionType(),
                entry.getUserId(),
                entry.getUsername(),
                entry.getUserRole(),
                entry.getUserName(),
                entry.getTimestamp(),
                entry.getSummary(),
                entry.getTitle()
        );
    }
}
