package com.postscheduler.backend.controller;

import com.postscheduler.backend.dto.ApiResponse;
import com.postscheduler.backend.dto.activity.ActivityLogResponseDto;
import com.postscheduler.backend.service.ActivityLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * ActivityLogController.java - REST API Endpoints for System Security Audit Log.
 *
 * BASE ROUTE: `/api/activity`
 *
 * RBAC ACCESS:
 * - GET /api/activity -> Requires authority `view_activity_log`.
 *   EXCLUSIVELY GRANTED TO ADMIN. Editor and Viewer requests receive 403 Forbidden.
 */
@RestController
@RequestMapping("/api/activity")
public class ActivityLogController {

    private static final Logger log = LoggerFactory.getLogger(ActivityLogController.class);

    private final ActivityLogService activityLogService;

    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('view_activity_log')")
    public ResponseEntity<ApiResponse<List<ActivityLogResponseDto>>> getActivityLog() {
        log.info("Fetching system activity log entries");
        List<ActivityLogResponseDto> activities = activityLogService.getAllActivities();
        return ResponseEntity.ok(ApiResponse.success("Activity log retrieved successfully", activities));
    }
}
