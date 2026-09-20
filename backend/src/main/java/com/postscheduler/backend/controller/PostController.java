package com.postscheduler.backend.controller;

import com.postscheduler.backend.dto.ApiResponse;
import com.postscheduler.backend.dto.post.PostRequestDto;
import com.postscheduler.backend.dto.post.PostResponseDto;
import com.postscheduler.backend.dto.post.SchedulePostRequestDto;
import com.postscheduler.backend.service.PostService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * PostController.java - REST API Endpoints for Multi-Platform Social Posts.
 *
 * BASE ROUTE: `/api/posts`
 *
 * ENDPOINT & RBAC MATRIX:
 * 1. POST   /api/posts             -> Create post (`create_post`) -> 201 Created (Editor only)
 * 2. GET    /api/posts             -> Fetch all posts (`view_analytics`) -> 200 OK (Admin, Editor, Viewer)
 * 3. GET    /api/posts/{id}        -> Fetch post by ID (`view_analytics`) -> 200 OK (Admin, Editor, Viewer)
 * 4. PUT    /api/posts/{id}        -> Update post (`edit_post`) -> 200 OK (Editor only)
 * 5. PATCH  /api/posts/{id}/schedule -> Schedule post (`schedule_post`) -> 200 OK (Editor only)
 * 6. PATCH  /api/posts/{id}/publish  -> Publish post (`publish_post`) -> 200 OK (Editor only)
 * 7. DELETE /api/posts/{id}        -> Delete post (`delete_post`) -> 200 OK (Editor only)
 *
 * NOTE: Admin and Viewer roles will receive 403 Forbidden on any mutation (POST, PUT, PATCH, DELETE).
 */
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private static final Logger log = LoggerFactory.getLogger(PostController.class);

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('create_post')")
    public ResponseEntity<ApiResponse<PostResponseDto>> createPost(@Valid @RequestBody PostRequestDto dto) {
        log.info("Creating new post with title: {}", dto.getTitle());
        PostResponseDto created = postService.createPost(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Post created successfully", created));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('view_analytics')")
    public ResponseEntity<ApiResponse<List<PostResponseDto>>> getAllPosts() {
        log.info("Fetching all posts");
        List<PostResponseDto> posts = postService.getAllPosts();
        return ResponseEntity.ok(ApiResponse.success("Posts retrieved successfully", posts));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('view_analytics')")
    public ResponseEntity<ApiResponse<PostResponseDto>> getPostById(@PathVariable String id) {
        log.info("Fetching post ID: {}", id);
        PostResponseDto post = postService.getPostById(id);
        return ResponseEntity.ok(ApiResponse.success("Post retrieved successfully", post));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('edit_post')")
    public ResponseEntity<ApiResponse<PostResponseDto>> updatePost(@PathVariable String id,
                                                                   @Valid @RequestBody PostRequestDto dto) {
        log.info("Updating post ID: {}", id);
        PostResponseDto updated = postService.updatePost(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Post updated successfully", updated));
    }

    @PatchMapping("/{id}/schedule")
    @PreAuthorize("hasAuthority('schedule_post')")
    public ResponseEntity<ApiResponse<PostResponseDto>> schedulePost(@PathVariable String id,
                                                                     @Valid @RequestBody SchedulePostRequestDto dto) {
        log.info("Scheduling post ID: {} for {}", id, dto.getScheduledAt());
        PostResponseDto scheduled = postService.schedulePost(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Post scheduled successfully", scheduled));
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAuthority('publish_post')")
    public ResponseEntity<ApiResponse<PostResponseDto>> publishPost(@PathVariable String id) {
        log.info("Publishing post ID: {}", id);
        PostResponseDto published = postService.publishPost(id);
        return ResponseEntity.ok(ApiResponse.success("Post published successfully", published));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('delete_post')")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable String id) {
        log.info("Deleting post ID: {}", id);
        postService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.success("Post deleted successfully", null));
    }
}
