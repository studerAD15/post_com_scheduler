package com.postscheduler.backend.filter;

import com.postscheduler.backend.model.User;
import com.postscheduler.backend.repository.UserRepository;
import com.postscheduler.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
/**
 * JwtAuthFilter.java - Request Authentication Filter & Server-Side RBAC Authority Engine.
 *
 * HOW IT WORKS:
 * 1. Request Interception: Inherits {@link OncePerRequestFilter} to process every incoming HTTP request.
 * 2. Header Extraction: Looks for the `Authorization: Bearer <jwt>` header.
 * 3. Token Verification: Validates HMAC-SHA256 signature and checks expiry timestamp.
 * 4. User Context Hydration: Extracts `userId` (sub claim), retrieves User entity from the database,
 *    and maps their role to explicit {@link GrantedAuthority} privileges via {@code getAuthoritiesForUser(user)}.
 * 5. SecurityContext Authentication: Builds a {@link UsernamePasswordAuthenticationToken} containing the user
 *    and granted authorities, populating {@link SecurityContextHolder}.
 *
 * RBAC AUTHORITY MAPPINGS:
 * - ADMIN: Security & governance (`view_activity_log`, `view_draft_audit`, `manage_users`, `view_analytics`, `manage_drafts`, `view_drafts`).
 *   NOTE: ADMIN has NO post-management permissions (cannot create, edit, schedule, publish, or delete posts).
 * - EDITOR: Full post and draft creator (`create_post`, `edit_post`, `delete_post`, `schedule_post`, `publish_post`, `manage_drafts`, `view_drafts`, `view_analytics`).
 * - VIEWER: Read-only observer (`view_drafts`, `view_analytics`).
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        if (!jwtService.isTokenValid(jwt)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String userId = jwtService.extractUserId(jwt);
        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                List<GrantedAuthority> authorities = getAuthoritiesForUser(user);
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(user, null, authorities);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }

    public static List<GrantedAuthority> getAuthoritiesForUser(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        switch (user.getRole()) {
            case ADMIN -> {
                authorities.add(new SimpleGrantedAuthority("manage_drafts"));
                authorities.add(new SimpleGrantedAuthority("view_drafts"));
                authorities.add(new SimpleGrantedAuthority("view_analytics"));
                authorities.add(new SimpleGrantedAuthority("manage_users"));
                authorities.add(new SimpleGrantedAuthority("view_draft_audit"));
                authorities.add(new SimpleGrantedAuthority("view_activity_log"));
            }
            case EDITOR -> {
                authorities.add(new SimpleGrantedAuthority("create_post"));
                authorities.add(new SimpleGrantedAuthority("edit_post"));
                authorities.add(new SimpleGrantedAuthority("delete_post"));
                authorities.add(new SimpleGrantedAuthority("schedule_post"));
                authorities.add(new SimpleGrantedAuthority("publish_post"));
                authorities.add(new SimpleGrantedAuthority("manage_drafts"));
                authorities.add(new SimpleGrantedAuthority("view_drafts"));
                authorities.add(new SimpleGrantedAuthority("view_analytics"));
            }
            case VIEWER -> {
                authorities.add(new SimpleGrantedAuthority("view_drafts"));
                authorities.add(new SimpleGrantedAuthority("view_analytics"));
            }
        }

        return authorities;
    }
}
