package com.postscheduler.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application.java - Spring Boot Main Application Entry Point.
 *
 * This class launches the embedded Tomcat server on port 8080 and boots the Spring application context.
 *
 * Architectural Components Scanned & Bootstrapped:
 * - Security Configuration: {@link com.postscheduler.backend.config.SecurityConfig}
 * - Authentication & Correlation Filters: {@link com.postscheduler.backend.filter.JwtAuthFilter} & {@link com.postscheduler.backend.filter.CorrelationIdFilter}
 * - REST Controllers: {@code com.postscheduler.backend.controller.*}
 * - Business Services: {@code com.postscheduler.backend.service.*}
 * - JPA Data Repositories: {@code com.postscheduler.backend.repository.*}
 * - Automatic Data Seeding: {@link com.postscheduler.backend.service.DataSeederService}
 */
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
