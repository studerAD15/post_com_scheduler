package com.postscheduler.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.postscheduler.backend.dto.ApiResponse;
import com.postscheduler.backend.filter.CorrelationIdFilter;
import com.postscheduler.backend.filter.JwtAuthFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * SecurityConfig.java - Spring Security 6 & Method-Level Security Architecture.
 *
 * KEY SECURITY HIGHLIGHTS:
 * 1. Stateless Session Management: Configured with `SessionCreationPolicy.STATELESS`.
 *    The server holds no session state in memory; each incoming request is authenticated
 *    via its cryptographically signed JWT Bearer token.
 * 2. Method-Level Security (`@EnableMethodSecurity`): Enables granular RBAC on controller methods
 *    using `@PreAuthorize("hasAuthority('...')")`.
 * 3. Filter Chain Ordering:
 *    - `CorrelationIdFilter`: Injected first to stamp every request with a unique tracing ID.
 *    - `JwtAuthFilter`: Injected before Spring's authentication filter to validate JWT tokens
 *      and populate the `SecurityContextHolder`.
 * 4. Standardized JSON Error Envelopes:
 *    - `authenticationEntryPoint`: Writes HTTP 401 JSON envelope on missing/expired credentials.
 *    - `accessDeniedHandler`: Writes HTTP 403 JSON envelope on insufficient role permissions.
 * 5. Public Whitelist: `/api/health`, `/api/auth/login`, and H2 console are open; all other routes require JWT.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorrelationIdFilter correlationIdFilter;
    private final CorsConfigurationSource corsConfigurationSource;
    private final ObjectMapper objectMapper;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                          CorrelationIdFilter correlationIdFilter,
                          CorsConfigurationSource corsConfigurationSource,
                          ObjectMapper objectMapper) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.correlationIdFilter = correlationIdFilter;
        this.corsConfigurationSource = corsConfigurationSource;
        this.objectMapper = objectMapper;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)) // For H2 console
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            ApiResponse<Void> apiResponse = ApiResponse.error("Unauthorized: Authentication token is missing or invalid.");
                            objectMapper.writeValue(response.getOutputStream(), apiResponse);
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            ApiResponse<Void> apiResponse = ApiResponse.error("Access denied: You do not have permission to perform this action.");
                            objectMapper.writeValue(response.getOutputStream(), apiResponse);
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/health", "/api/auth/login", "/h2-console/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(correlationIdFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
