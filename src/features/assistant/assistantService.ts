/**
 * assistantService.ts - Assistant Intelligence Service & Integration Gateway.
 *
 * Provides contextual knowledge-based responses, role-tailored guidance,
 * and a clearly marked integration point for external LLM proxies.
 */

import { KNOWLEDGE_BASE, KnowledgeItem } from "./knowledgeBase";

export interface AssistantContext {
  role: string;
  userName?: string;
  postsCount?: number;
  draftsCount?: number;
}

export interface AssistantResponse {
  content: string;
  suggestions?: string[];
}

/**
 * =========================================================================
 * INTEGRATION POINT FOR EXTERNAL LLM PROVIDER / BACKEND PROXY
 * =========================================================================
 * If you configure an LLM backend endpoint (e.g. POST /api/assistant/chat),
 * set ENABLE_EXTERNAL_LLM = true and forward the prompt to your server proxy.
 *
 * SECURITY RULE: Never expose private API keys in client-side frontend code.
 * Always proxy requests through your secure backend.
 */
const ENABLE_EXTERNAL_LLM = false;

async function queryExternalLLM(
  prompt: string,
  context: AssistantContext
): Promise<AssistantResponse | null> {
  if (!ENABLE_EXTERNAL_LLM) return null;

  try {
    const res = await fetch("/api/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      content: data.reply || data.content,
      suggestions: data.suggestions || ["What can my current role do?", "How do I schedule a post?"],
    };
  } catch (err) {
    console.warn("External LLM proxy failed, falling back to local knowledge engine:", err);
    return null;
  }
}

/**
 * Core Assistant Intelligence Engine (Local Knowledge + Role Awareness).
 */
export async function getAssistantResponse(
  prompt: string,
  context: AssistantContext
): Promise<AssistantResponse> {
  // 1. Check if external LLM is configured
  const externalResult = await queryExternalLLM(prompt, context);
  if (externalResult) return externalResult;

  const normalized = prompt.trim().toLowerCase();
  const role = (context.role || "guest").toLowerCase();

  // 2. Direct Role Question Handler
  if (
    normalized.includes("my role") ||
    normalized.includes("what can i do") ||
    normalized.includes("my permission") ||
    normalized.includes("what is my role")
  ) {
    if (role === "editor") {
      return {
        content:
          "You are logged in as **EDITOR** (Content Creator).\n\n" +
          "Your capabilities:\n" +
          "• Compose new posts with multi-platform validation\n" +
          "• Save, auto-save, and edit drafts\n" +
          "• Schedule posts via the Calendar or date picker\n" +
          "• Publish posts immediately across Twitter, LinkedIn, Instagram, and Facebook\n" +
          "• Delete posts and manage saved drafts",
        suggestions: [
          "How do I schedule a post?",
          "What are the platform character limits?",
          "How does draft auto-saving work?",
        ],
      };
    } else if (role === "admin") {
      return {
        content:
          "You are logged in as **ADMIN** (Security & Governance).\n\n" +
          "Your capabilities:\n" +
          "• View the exclusive system **Activity Log** (`/api/activity`)\n" +
          "• Inspect draft user revision audit trails (`view_draft_audit`)\n" +
          "• Review high-level telemetry and analytics dashboards\n\n" +
          "*(Note: Post creation, editing, scheduling, and deletion are restricted to the EDITOR role to enforce strict duty segregation.)*",
        suggestions: [
          "Why can't Admin create posts?",
          "How do I switch user roles?",
          "Explain system activity logs",
        ],
      };
    } else {
      return {
        content:
          "You are logged in as **VIEWER** (Read-Only Observer).\n\n" +
          "Your capabilities:\n" +
          "• View published posts and scheduled queues in the Feed\n" +
          "• Inspect saved drafts and review revision audit trails\n" +
          "• Explore telemetry metrics on the Analytics board\n\n" +
          "*(Note: Post composition, scheduling, publishing, and deletion are disabled for Viewers. Switch to an EDITOR account to create content.)*",
        suggestions: [
          "How do I switch user roles?",
          "Explain analytics telemetry",
          "What can an Editor do?",
        ],
      };
    }
  }

  // 3. Keyword Scoring across Domain Knowledge Items
  let bestItem: KnowledgeItem | null = null;
  let bestScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) {
        score += kw.length; // Longer matching phrases carry higher weight
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  // 4. Return Matched Knowledge Item with Role Context Note
  if (bestItem && bestScore > 0) {
    let responseText = bestItem.answer;

    // Helpful Role Warning: If a Viewer or Admin asks how to compose/schedule
    if (
      (bestItem.id === "post-composer" || bestItem.id === "scheduling-calendar") &&
      (role === "viewer" || role === "admin")
    ) {
      responseText +=
        `\n\n💡 **Role Advisory**: You are currently logged in as a **${role.toUpperCase()}**. ` +
        `Post composition and scheduling controls are reserved for **EDITOR** accounts. ` +
        `To test composing or scheduling, click **SIGN OUT** in the header and log in as \`editor\` (\`password123\`).`;
    }

    return {
      content: responseText,
      suggestions: bestItem.suggestions || [
        "What can my current role do?",
        "How do I schedule a post?",
        "What are the platform character limits?",
      ],
    };
  }

  // 5. Intelligent Fallback
  return {
    content:
      "I'm your Omnitrix Social Suite copilot. I can guide you through:\n\n" +
      "1. **Post Composer**: Real-time multi-platform character & media validation\n" +
      "2. **Calendar**: Drag-and-drop scheduling & date-time picking\n" +
      "3. **Drafts**: Auto-saving and revision audit history\n" +
      "4. **RBAC**: Permissions for Editor, Admin, and Viewer roles\n" +
      "5. **Analytics**: Telemetry tracking and distribution graphs\n\n" +
      "Choose a topic below or type a question!",
    suggestions: [
      "What can my current role do?",
      "How do I schedule a post?",
      "What are the platform character limits?",
      "How does draft auto-saving work?",
    ],
  };
}
