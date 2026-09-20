package com.postscheduler.backend.controller;

import com.postscheduler.backend.dto.ApiResponse;
import com.postscheduler.backend.dto.draft.DraftRequestDto;
import com.postscheduler.backend.dto.draft.DraftResponseDto;
import com.postscheduler.backend.service.DraftService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * DraftController.java - REST API Endpoints for Saved Drafts & Revision Audit.
 *
 * BASE ROUTE: `/api/drafts`
 *
 * ENDPOINTS & RBAC:
 * 1. POST   /api/drafts      -> Save new draft (`manage_drafts`) -> 201 Created
 * 2. GET    /api/drafts      -> List all drafts (`view_drafts`) -> 200 OK (Admin, Editor, Viewer)
 * 3. GET    /api/drafts/{id} -> Get draft with revision audit trail (`view_drafts`) -> 200 OK
 * 4. PUT    /api/drafts/{id} -> Update draft (`manage_drafts`) -> 200 OK
 * 5. DELETE /api/drafts/{id} -> Delete draft (`manage_drafts`) -> 200 OK
 */
@RestController
@RequestMapping("/api/drafts")
public class DraftController {

    private static final Logger log = LoggerFactory.getLogger(DraftController.class);

    private final DraftService draftService;

    public DraftController(DraftService draftService) {
        this.draftService = draftService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('manage_drafts')")
    public ResponseEntity<ApiResponse<DraftResponseDto>> createDraft(@RequestBody DraftRequestDto dto) {
        log.info("Creating new draft with title: {}", dto.getTitle());
        DraftResponseDto created = draftService.createDraft(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Draft created successfully", created));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('view_drafts')")
    public ResponseEntity<ApiResponse<List<DraftResponseDto>>> getAllDrafts() {
        log.info("Fetching all drafts");
        List<DraftResponseDto> drafts = draftService.getAllDrafts();
        return ResponseEntity.ok(ApiResponse.success("Drafts retrieved successfully", drafts));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('view_drafts')")
    public ResponseEntity<ApiResponse<DraftResponseDto>> getDraftById(@PathVariable String id) {
        log.info("Fetching draft ID: {}", id);
        DraftResponseDto draft = draftService.getDraftById(id);
        return ResponseEntity.ok(ApiResponse.success("Draft retrieved successfully", draft));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('manage_drafts')")
    public ResponseEntity<ApiResponse<DraftResponseDto>> updateDraft(@PathVariable String id,
                                                                     @RequestBody DraftRequestDto dto) {
        log.info("Updating draft ID: {}", id);
        DraftResponseDto updated = draftService.updateDraft(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Draft updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('manage_drafts')")
    public ResponseEntity<ApiResponse<Void>> deleteDraft(@PathVariable String id) {
        log.info("Deleting draft ID: {}", id);
        draftService.deleteDraft(id);
        return ResponseEntity.ok(ApiResponse.success("Draft deleted successfully", null));
    }
}
