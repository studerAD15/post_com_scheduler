package com.postscheduler.backend.controller;

import com.postscheduler.backend.dto.ApiResponse;
import com.postscheduler.backend.dto.assistant.AssistantChatRequestDto;
import com.postscheduler.backend.dto.assistant.AssistantChatResponseDto;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/**
 * AssistantController.java - REST API Endpoint for the Omnitrix AI Tactical Assistant.
 *
 * BASE ROUTE: `/api/assistant`
 *
 * ENDPOINTS:
 * 1. POST /api/assistant/chat -> Processes tactical user queries with domain context and recommendations.
 */
@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    private static final Logger log = LoggerFactory.getLogger(AssistantController.class);

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AssistantChatResponseDto>> chat(
            @Valid @RequestBody AssistantChatRequestDto request) {

        String prompt = request.getPrompt().trim();
        log.info("Assistant chat prompt received: {}", prompt);

        AssistantChatResponseDto response = generateResponse(prompt, request.getContext());
        return ResponseEntity.ok(ApiResponse.success("Assistant response generated", response));
    }

    private AssistantChatResponseDto generateResponse(String prompt, AssistantChatRequestDto.AssistantContextDto context) {
        String lower = prompt.toLowerCase(Locale.ROOT);
        String role = (context != null && context.getRole() != null) ? context.getRole().toUpperCase(Locale.ROOT) : "VIEWER";
        String userName = (context != null && context.getUserName() != null) ? context.getUserName() : "Cadet";

        String reply;
        List<String> suggestions = new ArrayList<>();

        if (lower.contains("schedule") || lower.contains("best time") || lower.contains("when to post")) {
            reply = "⚡ **Omnitrix Transmission Timing Protocol:**\n\n" +
                    "- **LinkedIn**: Tuesday & Thursday, 9:00 AM – 11:00 AM (Peak professional engagement).\n" +
                    "- **Twitter / X**: Mon-Fri, 12:00 PM – 3:00 PM & 5:00 PM (High-velocity discourse).\n" +
                    "- **Instagram**: Wednesday 11:00 AM and Friday 10:00 AM (Visual prime-time).\n" +
                    "- **Facebook**: Mon-Wed, 1:00 PM – 4:00 PM (Broad community reach).\n\n" +
                    "Pro-tip: Use the **Schedule** tab to lock in your calendar slots across multi-channels!";
            suggestions = Arrays.asList("How do I schedule a post?", "What are the character limits?", "How do drafts work?");
        } else if (lower.contains("limit") || lower.contains("character") || lower.contains("length")) {
            reply = "📏 **Platform Transmission Limits:**\n\n" +
                    "- **Twitter/X**: 280 characters (keep it snappy like XLR8!).\n" +
                    "- **LinkedIn**: 3,000 characters (detailed technical breakdowns).\n" +
                    "- **Instagram**: 2,200 characters (first 125 characters visible before fold).\n" +
                    "- **Facebook**: 63,206 characters (optimal engagement under 80 words).\n\n" +
                    "OmniPost's composer automatically tracks character counts and alerts you if you exceed platform quotas.";
            suggestions = Arrays.asList("Give me hashtag tips", "Best times to post", "How do I switch aliens?");
        } else if (lower.contains("role") || lower.contains("permission") || lower.contains("rbac") || lower.contains("access")) {
            reply = String.format("🛡️ **Omnitrix Security Clearance (Current role: %s):**\n\n", role) +
                    "- **ADMIN**: Full omniversal override. Compose, schedule, publish, delete any post, manage team roles, and view global audit logs.\n" +
                    "- **EDITOR**: Tactical deployment. Create, edit, schedule, and publish posts and drafts. Cannot delete team members or modify system policies.\n" +
                    "- **VIEWER**: Tactical observer. View scheduled broadcasts, drafts, and analytics dashboards in read-only mode.\n\n" +
                    "You can test different clearances via the top Role Switcher Bar in the app header!";
            suggestions = Arrays.asList("What can I do as Editor?", "What can Admin do?", "View Analytics overview");
        } else if (lower.contains("alien") || lower.contains("avatar") || lower.contains("omnitrix") || lower.contains("hero") || lower.contains("transform")) {
            reply = "🧬 **Omnitrix DNA Core Database:**\n\n" +
                    "You have access to 10 battle-ready alien avatars:\n" +
                    "1. **Pyronite (Heatblast)**: Plasma fury & high-energy announcements.\n" +
                    "2. **Kineceleran (XLR8)**: Hyper-speed micro-posts & real-time trends.\n" +
                    "3. **Petrosapien (Diamondhead)**: Crystal-durable evergreen content.\n" +
                    "4. **Galvan (Grey Matter)**: High-IQ data analytics & thought leadership.\n" +
                    "5. **Tetramand (Four Arms)**: Heavy-duty multi-channel campaign blasts.\n" +
                    "6. **Necrofriggian (Big Chill)**: Cool composure & crisis management.\n" +
                    "7. **Sonorosian (Echo Echo)**: Sonic multi-platform cross-posting.\n" +
                    "8. **Conductoid (Feedback)**: Energy-channeling viral outreach.\n" +
                    "9. **Segmentasapien (Bloxx)**: Modular content blocks & carousels.\n" +
                    "10. **Methanosian (Swampfire)**: Regenerative engagement & comment moderation.\n\n" +
                    "Click the alien icon at the top of this widget to initiate the DNA transformation sequence!";
            suggestions = Arrays.asList("Switch alien avatar", "Show platform limits", "Help with content ideas");
        } else if (lower.contains("draft") || lower.contains("save")) {
            reply = "📝 **Tactical Draft Repository:**\n\n" +
                    "OmniPost automatically saves your work in progress. You can store unfinished posts in the **Drafts** tab, " +
                    "refine them with your team, and publish or schedule them whenever your campaign window opens.";
            suggestions = Arrays.asList("How do I publish a draft?", "Best time to post", "What are the character limits?");
        } else if (lower.contains("analytic") || lower.contains("metric") || lower.contains("insight") || lower.contains("stat")) {
            reply = "📊 **Omnitrix Tactical Telemetry (Analytics):**\n\n" +
                    "Monitor engagement velocity, channel breakdown, top-performing posts, and audience conversion rates in the **Analytics** tab.\n" +
                    "Filter telemetry by date range, platform, or post status to optimize future deployments.";
            suggestions = Arrays.asList("When to post for best engagement?", "Platform limits", "Admin vs Editor permissions");
        } else if (lower.contains("hello") || lower.contains("hi") || lower.contains("hey") || lower.contains("start")) {
            reply = String.format("Greetings, %s! 🌌 Omnitrix Tactical Assistant online with %s clearance.\n\n" +
                    "I can guide your multi-channel deployment, recommend prime broadcast times, check character limits, or calibrate your alien DNA avatar. How may I assist your mission today?",
                    userName, role);
            suggestions = Arrays.asList("Best times to post", "Platform character limits", "Explain roles & permissions", "Switch alien avatar");
        } else {
            reply = String.format("📡 **Omnitrix Neural Core Analysis:**\n\n" +
                    "Regarding \"%s\": In OmniPost, every broadcast can be seamlessly composed, synchronized across social platforms, and scheduled for peak audience resonance.\n\n" +
                    "Whether you need help with copy length, platform constraints, scheduling frequency, or clearance permissions, I am ready to advise.",
                    prompt);
            suggestions = Arrays.asList("Best times to post", "Platform limits", "Role clearances", "Switch alien avatar");
        }

        return new AssistantChatResponseDto(reply, suggestions);
    }
}
