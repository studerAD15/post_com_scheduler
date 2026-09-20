package com.postscheduler.backend.service;

import com.postscheduler.backend.dto.draft.DraftAuditLogDto;
import com.postscheduler.backend.dto.draft.DraftRequestDto;
import com.postscheduler.backend.dto.draft.DraftResponseDto;
import com.postscheduler.backend.dto.post.MediaAttachmentDto;
import com.postscheduler.backend.exception.ResourceNotFoundException;
import com.postscheduler.backend.model.Draft;
import com.postscheduler.backend.model.DraftAuditLogEntry;
import com.postscheduler.backend.model.MediaAttachment;
import com.postscheduler.backend.model.User;
import com.postscheduler.backend.repository.DraftRepository;
import com.postscheduler.backend.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DraftService {

    private final DraftRepository draftRepository;
    private final ActivityLogService activityLogService;

    public DraftService(DraftRepository draftRepository, ActivityLogService activityLogService) {
        this.draftRepository = draftRepository;
        this.activityLogService = activityLogService;
    }

    public DraftResponseDto createDraft(DraftRequestDto dto) {
        User currentUser = SecurityUtils.getCurrentUser();

        Draft draft = new Draft();
        draft.setId("draft-" + UUID.randomUUID().toString());
        draft.setTitle(dto.getTitle() != null && !dto.getTitle().trim().isEmpty() ? dto.getTitle().trim() : "Untitled Draft");
        draft.setContent(dto.getContent() != null ? dto.getContent() : "");
        draft.setPlatforms(dto.getPlatforms() != null ? new ArrayList<>(dto.getPlatforms()) : new ArrayList<>());
        draft.setMedia(mapToMediaList(dto.getMedia()));
        draft.setStatus("draft");
        draft.setScheduledAt(dto.getScheduledAt());

        draft.setAuthorId(dto.getAuthorId() != null ? dto.getAuthorId() : (currentUser != null ? currentUser.getId() : "system"));
        draft.setAuthorName(dto.getAuthorName() != null ? dto.getAuthorName() : (currentUser != null ? currentUser.getName() : "System"));
        draft.setAuthorRole(dto.getAuthorRole() != null ? dto.getAuthorRole() : (currentUser != null ? currentUser.getRole().getValue() : "admin"));

        String now = Instant.now().toString();
        draft.setCreatedAt(now);
        draft.setUpdatedAt(now);

        // Auto-append "created" audit entry
        String auditId = "audit-" + UUID.randomUUID().toString().substring(0, 8);
        DraftAuditLogEntry initialAudit = new DraftAuditLogEntry(
                auditId,
                draft.getAuthorId(),
                currentUser != null ? currentUser.getUsername() : "system",
                draft.getAuthorName(),
                draft.getAuthorRole(),
                "created",
                now,
                "Created initial draft outline for \"" + draft.getTitle() + "\"."
        );
        draft.getAuditTrail().add(initialAudit);

        Draft saved = draftRepository.save(draft);

        activityLogService.logActivity(
                saved.getId(),
                "draft",
                "created",
                "Created draft \"" + saved.getTitle() + "\"",
                saved.getTitle()
        );

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<DraftResponseDto> getAllDrafts() {
        return draftRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DraftResponseDto getDraftById(String id) {
        Draft draft = draftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Draft with ID \"" + id + "\" was not found."));
        return mapToDto(draft);
    }

    public DraftResponseDto updateDraft(String id, DraftRequestDto dto) {
        Draft draft = draftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Draft with ID \"" + id + "\" was not found."));

        User currentUser = SecurityUtils.getCurrentUser();
        String now = Instant.now().toString();

        StringBuilder changes = new StringBuilder("Updated draft properties: ");
        if (dto.getTitle() != null && !dto.getTitle().equals(draft.getTitle())) {
            changes.append("title; ");
            draft.setTitle(dto.getTitle());
        }
        if (dto.getContent() != null && !dto.getContent().equals(draft.getContent())) {
            changes.append("content; ");
            draft.setContent(dto.getContent());
        }
        if (dto.getPlatforms() != null) {
            changes.append("platforms; ");
            draft.setPlatforms(new ArrayList<>(dto.getPlatforms()));
        }
        if (dto.getMedia() != null) {
            changes.append("media; ");
            draft.setMedia(mapToMediaList(dto.getMedia()));
        }
        if (dto.getStatus() != null) {
            draft.setStatus(dto.getStatus().toLowerCase());
        }
        if (dto.getScheduledAt() != null) {
            draft.setScheduledAt(dto.getScheduledAt());
        }

        draft.setUpdatedAt(now);

        // Auto-append "updated" audit entry
        String auditId = "audit-" + UUID.randomUUID().toString().substring(0, 8);
        DraftAuditLogEntry updateAudit = new DraftAuditLogEntry(
                auditId,
                currentUser != null ? currentUser.getId() : draft.getAuthorId(),
                currentUser != null ? currentUser.getUsername() : "editor",
                currentUser != null ? currentUser.getName() : draft.getAuthorName(),
                currentUser != null ? currentUser.getRole().getValue() : draft.getAuthorRole(),
                "updated",
                now,
                changes.toString()
        );
        draft.getAuditTrail().add(0, updateAudit);

        Draft saved = draftRepository.save(draft);

        activityLogService.logActivity(
                saved.getId(),
                "draft",
                "edited",
                "Updated draft \"" + saved.getTitle() + "\"",
                saved.getTitle()
        );

        return mapToDto(saved);
    }

    public void deleteDraft(String id) {
        Draft draft = draftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot delete. Draft with ID \"" + id + "\" does not exist."));

        String title = draft.getTitle();
        draftRepository.delete(draft);

        activityLogService.logActivity(
                id,
                "draft",
                "deleted",
                "Deleted draft \"" + title + "\"",
                title
        );
    }

    public DraftResponseDto mapToDto(Draft draft) {
        List<MediaAttachmentDto> mediaDtos = draft.getMedia() != null
                ? draft.getMedia().stream()
                .map(m -> new MediaAttachmentDto(m.getId(), m.getName(), m.getType(), m.getSize(), m.getUrl()))
                .collect(Collectors.toList())
                : new ArrayList<>();

        List<DraftAuditLogDto> auditDtos = draft.getAuditTrail() != null
                ? draft.getAuditTrail().stream()
                .map(a -> new DraftAuditLogDto(a.getId(), a.getUserId(), a.getUsername(), a.getName(), a.getRole(), a.getAction(), a.getTimestamp(), a.getChangesSummary()))
                .collect(Collectors.toList())
                : new ArrayList<>();

        return new DraftResponseDto(
                draft.getId(),
                draft.getTitle(),
                draft.getContent(),
                draft.getPlatforms(),
                mediaDtos,
                draft.getStatus(),
                draft.getScheduledAt(),
                draft.getCreatedAt(),
                draft.getUpdatedAt(),
                draft.getAuthorId(),
                draft.getAuthorName(),
                draft.getAuthorRole(),
                auditDtos
        );
    }

    private List<MediaAttachment> mapToMediaList(List<MediaAttachmentDto> dtos) {
        if (dtos == null) return new ArrayList<>();
        return dtos.stream()
                .map(d -> new MediaAttachment(d.getId(), d.getName(), d.getType(), d.getSize(), d.getUrl()))
                .collect(Collectors.toList());
    }
}
