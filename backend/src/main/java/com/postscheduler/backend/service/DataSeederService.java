package com.postscheduler.backend.service;

import com.postscheduler.backend.model.*;
import com.postscheduler.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class DataSeederService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeederService.class);

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final DraftRepository draftRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeederService(UserRepository userRepository,
                             PostRepository postRepository,
                             DraftRepository draftRepository,
                             ActivityLogRepository activityLogRepository,
                             PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.draftRepository = draftRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedPosts();
        seedDrafts();
        seedActivities();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        log.info("Seeding demo user accounts...");
        String encodedPassword = passwordEncoder.encode("password123");

        userRepository.save(new User(
                "usr-admin-01",
                "admin",
                "ADITYA CHHIKARA (Admin)",
                "aditya.admin@company.com",
                Role.ADMIN,
                encodedPassword,
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        ));

        userRepository.save(new User(
                "usr-editor-02",
                "editor",
                "ADITYA CHHIKARA (Editor)",
                "aditya.editor@company.com",
                Role.EDITOR,
                encodedPassword,
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
        ));

        userRepository.save(new User(
                "usr-viewer-03",
                "viewer",
                "ADITYA CHHIKARA (Viewer)",
                "aditya.viewer@company.com",
                Role.VIEWER,
                encodedPassword,
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
        ));
        log.info("Seeded 3 demo accounts (admin, editor, viewer).");
    }

    private void seedPosts() {
        if (postRepository.count() > 0) return;

        log.info("Seeding demo posts...");
        Instant now = Instant.now();

        Post p1 = new Post();
        p1.setId("post-1");
        p1.setTitle("AI Product Announcement");
        p1.setContent("We're launching our new AI-powered workflow automation tools! Automate multi-channel scheduling in seconds. #AI #Automation #Productivity");
        p1.setPlatforms(List.of("twitter", "linkedin"));
        p1.setStatus("published");
        p1.setCreatedAt(now.minus(3, ChronoUnit.DAYS).toString());
        p1.setUpdatedAt(now.minus(3, ChronoUnit.DAYS).toString());
        p1.setAuthorName("ADITYA CHHIKARA (Admin)");
        p1.setAuthorRole("admin");
        p1.setAuthorId("usr-admin-01");
        postRepository.save(p1);

        Post p2 = new Post();
        p2.setId("post-2");
        p2.setTitle("Design System Showcase");
        p2.setContent("Exploring glassmorphism micro-animations and dark-mode color palettes for web apps. Thoughts on this design? 🎨 #DesignSystem #WebDev");
        p2.setPlatforms(List.of("instagram", "facebook"));
        p2.setStatus("scheduled");
        p2.setScheduledAt(now.plus(2, ChronoUnit.DAYS).toString());
        p2.setCreatedAt(now.minus(1, ChronoUnit.DAYS).toString());
        p2.setUpdatedAt(now.minus(1, ChronoUnit.DAYS).toString());
        p2.setAuthorName("ADITYA CHHIKARA (Editor)");
        p2.setAuthorRole("editor");
        p2.setAuthorId("usr-editor-02");
        postRepository.save(p2);

        Post p3 = new Post();
        p3.setId("post-3");
        p3.setTitle("Weekly Tech Newsletter Snippet");
        p3.setContent("TypeScript 5.7 brings improved type inference and performance wins. Here's our summary of top changes for modern frontend engineers.");
        p3.setPlatforms(List.of("linkedin", "twitter"));
        p3.setStatus("scheduled");
        p3.setScheduledAt(now.plus(5, ChronoUnit.DAYS).toString());
        p3.setCreatedAt(now.toString());
        p3.setUpdatedAt(now.toString());
        p3.setAuthorName("ADITYA CHHIKARA (Editor)");
        p3.setAuthorRole("editor");
        p3.setAuthorId("usr-editor-02");
        postRepository.save(p3);
    }

    private void seedDrafts() {
        if (draftRepository.count() > 0) return;

        log.info("Seeding demo drafts...");
        Instant now = Instant.now();

        Draft d1 = new Draft();
        d1.setId("draft-101");
        d1.setTitle("Q3 Roadmap Preview");
        d1.setContent("🚀 Excited to announce our Q3 product roadmap featuring AI-powered multi-channel analytics and automated workflow scheduling! #TechNews #ProductUpdate");
        d1.setPlatforms(List.of("twitter", "linkedin"));
        d1.setStatus("draft");
        d1.setCreatedAt(now.minus(2, ChronoUnit.DAYS).toString());
        d1.setUpdatedAt(now.minus(3, ChronoUnit.HOURS).toString());
        d1.setAuthorId("usr-editor-02");
        d1.setAuthorName("Alex Rivers");
        d1.setAuthorRole("editor");

        List<DraftAuditLogEntry> trail1 = new ArrayList<>();
        trail1.add(new DraftAuditLogEntry("audit-01", "usr-editor-02", "editor_alex", "Alex Rivers", "editor", "created", now.minus(2, ChronoUnit.DAYS).toString(), "Created initial draft outline for Q3 Roadmap announcement."));
        trail1.add(new DraftAuditLogEntry("audit-02", "usr-editor-02", "editor_sam", "Sam Vance", "editor", "updated", now.minus(1, ChronoUnit.DAYS).toString(), "Added LinkedIn channel target and optimized hashtags for engagement."));
        trail1.add(new DraftAuditLogEntry("audit-03", "usr-admin-01", "admin_morgan", "Morgan Vance", "admin", "updated", now.minus(3, ChronoUnit.HOURS).toString(), "Reviewed compliance & added scheduled launch window note."));
        d1.setAuditTrail(trail1);
        draftRepository.save(d1);

        Draft d2 = new Draft();
        d2.setId("draft-102");
        d2.setTitle("Behind the Scenes Design System");
        d2.setContent("A sneak peek at our new design system tokens and glassmorphism UI components. What do you think of this layout? #UIUX #DesignSystem #WebDev");
        d2.setPlatforms(List.of("instagram", "facebook"));
        d2.setStatus("draft");
        d2.setCreatedAt(now.minus(8, ChronoUnit.HOURS).toString());
        d2.setUpdatedAt(now.minus(2, ChronoUnit.HOURS).toString());
        d2.setAuthorId("usr-editor-02");
        d2.setAuthorName("Sam Vance");
        d2.setAuthorRole("editor");

        List<DraftAuditLogEntry> trail2 = new ArrayList<>();
        trail2.add(new DraftAuditLogEntry("audit-04", "usr-editor-02", "editor_sam", "Sam Vance", "editor", "created", now.minus(8, ChronoUnit.HOURS).toString(), "Drafted Behind-the-Scenes design post for Instagram & Facebook."));
        trail2.add(new DraftAuditLogEntry("audit-05", "usr-editor-02", "editor_alex", "Alex Rivers", "editor", "updated", now.minus(2, ChronoUnit.HOURS).toString(), "Polished copy and added brand icon tag."));
        d2.setAuditTrail(trail2);
        draftRepository.save(d2);

        Draft d3 = new Draft();
        d3.setId("draft-103");
        d3.setTitle("Omnitrix Feature Update Campaign");
        d3.setContent("⚡ Unleashing the new Omnitrix Social Suite! Real-time channel sync and multi-user draft auditing are now live. #Omnitrix #SocialTech");
        d3.setPlatforms(List.of("twitter", "instagram", "linkedin"));
        d3.setStatus("draft");
        d3.setCreatedAt(now.minus(24, ChronoUnit.HOURS).toString());
        d3.setUpdatedAt(now.minus(1, ChronoUnit.HOURS).toString());
        d3.setAuthorId("usr-editor-02");
        d3.setAuthorName("Taylor Reed");
        d3.setAuthorRole("editor");

        List<DraftAuditLogEntry> trail3 = new ArrayList<>();
        trail3.add(new DraftAuditLogEntry("audit-06", "usr-editor-02", "editor_taylor", "Taylor Reed", "editor", "created", now.minus(24, ChronoUnit.HOURS).toString(), "Created feature update announcement for Omnitrix platform release."));
        d3.setAuditTrail(trail3);
        draftRepository.save(d3);
    }

    private void seedActivities() {
        if (activityLogRepository.count() > 0) return;

        log.info("Seeding initial activity logs...");
        Instant now = Instant.now();

        activityLogRepository.save(new ActivityLogEntry(
                "act-101", "draft-101", "draft", "created",
                "usr-editor-02", "editor", Role.EDITOR, "ADITYA CHHIKARA (Editor)",
                "Created draft outline for Q3 Roadmap announcement", "Q3 Roadmap Preview"
        ));
        activityLogRepository.save(new ActivityLogEntry(
                "act-102", "draft-101", "draft", "edited",
                "usr-editor-02", "editor", Role.EDITOR, "ADITYA CHHIKARA (Editor)",
                "Updated channels and copy for Q3 Roadmap preview", "Q3 Roadmap Preview"
        ));
        activityLogRepository.save(new ActivityLogEntry(
                "act-103", "post-1", "post", "published",
                "usr-admin-01", "admin", Role.ADMIN, "ADITYA CHHIKARA (Admin)",
                "Published live AI Product Announcement across Twitter and LinkedIn", "AI Product Announcement"
        ));
        activityLogRepository.save(new ActivityLogEntry(
                "act-104", "post-2", "post", "scheduled",
                "usr-editor-02", "editor", Role.EDITOR, "ADITYA CHHIKARA (Editor)",
                "Scheduled Design System Showcase for multi-channel release", "Design System Showcase"
        ));
        activityLogRepository.save(new ActivityLogEntry(
                "act-105", "draft-102", "draft", "created",
                "usr-editor-02", "editor", Role.EDITOR, "ADITYA CHHIKARA (Editor)",
                "Created initial draft for Behind the Scenes Design System", "Behind the Scenes Design System"
        ));
        activityLogRepository.save(new ActivityLogEntry(
                "act-106", "post-3", "post", "scheduled",
                "usr-editor-02", "editor", Role.EDITOR, "ADITYA CHHIKARA (Editor)",
                "Scheduled Weekly Tech Newsletter Snippet", "Weekly Tech Newsletter Snippet"
        ));
    }
}
