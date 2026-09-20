package com.postscheduler.backend.service;

import com.postscheduler.backend.dto.post.MediaAttachmentDto;
import com.postscheduler.backend.dto.post.PostRequestDto;
import com.postscheduler.backend.dto.post.PostResponseDto;
import com.postscheduler.backend.dto.post.SchedulePostRequestDto;
import com.postscheduler.backend.exception.ResourceNotFoundException;
import com.postscheduler.backend.model.MediaAttachment;
import com.postscheduler.backend.model.Post;
import com.postscheduler.backend.model.User;
import com.postscheduler.backend.repository.PostRepository;
import com.postscheduler.backend.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final ActivityLogService activityLogService;

    public PostService(PostRepository postRepository, ActivityLogService activityLogService) {
        this.postRepository = postRepository;
        this.activityLogService = activityLogService;
    }

    public PostResponseDto createPost(PostRequestDto dto) {
        User currentUser = SecurityUtils.getCurrentUser();

        Post post = new Post();
        post.setId("post-" + System.currentTimeMillis());
        post.setTitle(dto.getTitle() != null && !dto.getTitle().trim().isEmpty() ? dto.getTitle().trim() : "Untitled Post");
        post.setContent(dto.getContent());
        post.setPlatforms(dto.getPlatforms() != null ? new ArrayList<>(dto.getPlatforms()) : new ArrayList<>());
        post.setMedia(mapToMediaList(dto.getMedia()));
        post.setStatus(dto.getStatus() != null && !dto.getStatus().trim().isEmpty() ? dto.getStatus().toLowerCase().trim() : "draft");
        post.setScheduledAt(dto.getScheduledAt());

        post.setAuthorId(dto.getAuthorId() != null ? dto.getAuthorId() : (currentUser != null ? currentUser.getId() : "system"));
        post.setAuthorName(dto.getAuthorName() != null ? dto.getAuthorName() : (currentUser != null ? currentUser.getName() : "System"));
        post.setAuthorRole(dto.getAuthorRole() != null ? dto.getAuthorRole() : (currentUser != null ? currentUser.getRole().getValue() : "admin"));

        String now = Instant.now().toString();
        post.setCreatedAt(now);
        post.setUpdatedAt(now);

        Post saved = postRepository.save(post);

        String action = "scheduled".equalsIgnoreCase(saved.getStatus()) ? "scheduled" : "created";
        activityLogService.logActivity(
                saved.getId(),
                "post",
                action,
                ("scheduled".equals(action) ? "Scheduled" : "Created") + " post \"" + saved.getTitle() + "\"",
                saved.getTitle()
        );

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<PostResponseDto> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostResponseDto getPostById(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post with ID \"" + id + "\" was not found."));
        return mapToDto(post);
    }

    public PostResponseDto updatePost(String id, PostRequestDto dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post with ID \"" + id + "\" was not found."));

        if (dto.getTitle() != null) post.setTitle(dto.getTitle());
        if (dto.getContent() != null) post.setContent(dto.getContent());
        if (dto.getPlatforms() != null) post.setPlatforms(new ArrayList<>(dto.getPlatforms()));
        if (dto.getMedia() != null) post.setMedia(mapToMediaList(dto.getMedia()));
        if (dto.getStatus() != null) post.setStatus(dto.getStatus().toLowerCase());
        if (dto.getScheduledAt() != null) post.setScheduledAt(dto.getScheduledAt());

        post.setUpdatedAt(Instant.now().toString());
        Post saved = postRepository.save(post);

        activityLogService.logActivity(
                saved.getId(),
                "post",
                "edited",
                "Updated post \"" + saved.getTitle() + "\"",
                saved.getTitle()
        );

        return mapToDto(saved);
    }

    public PostResponseDto schedulePost(String id, SchedulePostRequestDto dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post with ID \"" + id + "\" was not found for scheduling."));

        post.setStatus("scheduled");
        post.setScheduledAt(dto.getScheduledAt());
        post.setUpdatedAt(Instant.now().toString());
        Post saved = postRepository.save(post);

        activityLogService.logActivity(
                saved.getId(),
                "post",
                "scheduled",
                "Scheduled post \"" + saved.getTitle() + "\" for " + dto.getScheduledAt(),
                saved.getTitle()
        );

        return mapToDto(saved);
    }

    public PostResponseDto publishPost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post with ID \"" + id + "\" was not found for publishing."));

        post.setStatus("published");
        post.setUpdatedAt(Instant.now().toString());
        Post saved = postRepository.save(post);

        activityLogService.logActivity(
                saved.getId(),
                "post",
                "published",
                "Published post \"" + saved.getTitle() + "\" live",
                saved.getTitle()
        );

        return mapToDto(saved);
    }

    public void deletePost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot delete. Post with ID \"" + id + "\" does not exist."));

        String title = post.getTitle();
        postRepository.delete(post);

        activityLogService.logActivity(
                id,
                "post",
                "deleted",
                "Deleted post \"" + title + "\"",
                title
        );
    }

    public PostResponseDto mapToDto(Post post) {
        List<MediaAttachmentDto> mediaDtos = post.getMedia() != null
                ? post.getMedia().stream()
                .map(m -> new MediaAttachmentDto(m.getId(), m.getName(), m.getType(), m.getSize(), m.getUrl()))
                .collect(Collectors.toList())
                : new ArrayList<>();

        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getPlatforms(),
                mediaDtos,
                post.getStatus(),
                post.getScheduledAt(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getAuthorId(),
                post.getAuthorName(),
                post.getAuthorRole()
        );
    }

    private List<MediaAttachment> mapToMediaList(List<MediaAttachmentDto> dtos) {
        if (dtos == null) return new ArrayList<>();
        return dtos.stream()
                .map(d -> new MediaAttachment(d.getId(), d.getName(), d.getType(), d.getSize(), d.getUrl()))
                .collect(Collectors.toList());
    }
}
