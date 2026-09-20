/**
 * knowledgeBase.ts - Domain Knowledge Base for the Omnitrix AI Assistant.
 *
 * Sourced directly from the application's actual features, platform constraints,
 * and Role-Based Access Control (RBAC) rules.
 */

export interface KnowledgeItem {
  id: string;
  keywords: string[];
  title: string;
  answer: string;
  relevantRoles?: string[];
  suggestions?: string[];
}

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  // 1. Roles & Permissions (RBAC)
  {
    id: "rbac-overview",
    keywords: ["role", "roles", "permission", "permissions", "rbac", "access", "privilege"],
    title: "Role-Based Access Control (RBAC)",
    answer:
      "OmniPost enforces strict 3-tier Role-Based Access Control:\n\n" +
      "• **EDITOR**: The exclusive content creator. Only Editors can create, edit, schedule, publish, and delete posts, as well as create and modify drafts.\n\n" +
      "• **ADMIN**: Dedicated to security, compliance, and governance. Admins have exclusive access to the system Activity Log and user revision audit trails. Admins cannot create, edit, schedule, or delete posts.\n\n" +
      "• **VIEWER**: Read-only observer. Viewers can inspect published posts, view saved drafts, and review analytics dashboards without editing capabilities.",
    suggestions: [
      "What can my current role do?",
      "How do I switch user roles?",
      "Why can't Admin create posts?",
    ],
  },
  {
    id: "admin-restrictions",
    keywords: ["why admin cannot create", "admin create post", "admin post", "admin publish"],
    title: "Admin Role Responsibilities & Post Restrictions",
    answer:
      "By design, the **ADMIN** role is reserved for security oversight, user governance, and compliance audit inspection. To prevent administrative privilege confusion and enforce clear duty segregation, post lifecycle mutations (create, edit, schedule, publish, delete) are strictly reserved for the **EDITOR** role.",
    suggestions: ["What can my current role do?", "How do I switch user roles?"],
  },
  {
    id: "role-switching",
    keywords: ["switch role", "change role", "logout", "sign out", "switch user"],
    title: "Switching User Accounts & Roles",
    answer:
      "To prevent unauthorized privilege escalation, in-session role toggling is disabled. To switch roles, click **SIGN OUT** in the top navigation bar and log in with your desired account credentials:\n\n" +
      "• `editor` / `password123` (Content creator)\n" +
      "• `admin` / `password123` (Security & audit manager)\n" +
      "• `viewer` / `password123` (Read-only observer)",
    suggestions: ["What can my current role do?", "How do I schedule a post?"],
  },

  // 2. Post Composer & Validation
  {
    id: "post-composer",
    keywords: ["compose", "composer", "create post", "new post", "how to write"],
    title: "Composing Posts & Live Validation",
    answer:
      "Navigate to the **CREATE POST** tab (available to Editors). As you write, the validation engine calculates real-time character counts and media limits for all selected target platforms:\n\n" +
      "• **Twitter**: 280 chars max (safe gauge turns orange at 85%, red over 280)\n" +
      "• **LinkedIn**: 3,000 chars max\n" +
      "• **Instagram**: 2,200 chars max (requires media attachment)\n" +
      "• **Facebook**: 63,206 chars max\n\n" +
      "You can toggle target platforms with a single click and preview live card renders on the right.",
    suggestions: [
      "What are the platform character limits?",
      "How do I schedule a post?",
      "How do I save a draft?",
    ],
  },
  {
    id: "character-limits",
    keywords: ["character limit", "char limit", "limit", "length", "max characters"],
    title: "Platform Character & Media Limits",
    answer:
      "Each social network enforces specific character and media constraints:\n\n" +
      "• **Twitter (X)**: 280 characters | Up to 4 images or 1 video | Max 4 recommended hashtags\n" +
      "• **LinkedIn**: 3,000 characters | Up to 9 images or documents\n" +
      "• **Instagram**: 2,200 characters | 1-10 carousel media items | Up to 30 hashtags\n" +
      "• **Facebook**: 63,206 characters | Up to 10 images or videos",
    suggestions: ["How do I schedule a post?", "How do I save a draft?"],
  },

  // 3. Drafts & Audit Trail
  {
    id: "drafts-management",
    keywords: ["draft", "drafts", "save draft", "auto save", "saved drafts"],
    title: "Drafts & Revision Audit Tracking",
    answer:
      "Saved drafts are stored under the **SAVED DRAFTS** tab. Features include:\n\n" +
      "• **Auto-Saving**: Preserves work-in-progress content across browser sessions.\n" +
      "• **Revision Audit Trail**: Expand any draft card to inspect the timeline of revisions, showing who edited the copy, what changed, and exact timestamps.\n" +
      "• **Edit in Composer**: Click 'EDIT' on any draft to load it back into the Post Composer.",
    suggestions: ["How do I schedule a post?", "What can my current role do?"],
  },

  // 4. Scheduling & Calendar
  {
    id: "scheduling-calendar",
    keywords: ["schedule", "scheduling", "calendar", "reschedule", "drag and drop", "date"],
    title: "Calendar Scheduling & Drag-and-Drop",
    answer:
      "The **CALENDAR** tab provides full-month and weekly views of your scheduled and published content queue:\n\n" +
      "• **Drag-and-Drop**: Simply drag a post card to another day to reschedule its delivery date instantly.\n" +
      "• **Schedule Modal**: Click 'SCHEDULE' from the Composer, Feed, or Calendar to select an exact date and time.\n" +
      "• **Publish Now**: Scheduled posts can be published immediately at any time by clicking 'PUBLISH'.",
    suggestions: ["What are the platform character limits?", "How do I save a draft?"],
  },

  // 5. Analytics & Activity Log
  {
    id: "analytics-telemetry",
    keywords: ["analytics", "metrics", "stats", "telemetry", "kpi"],
    title: "Telemetry & Analytics Overview",
    answer:
      "The **ANALYTICS** board provides real-time telemetry over all published and queued posts:\n\n" +
      "• Total posts count & status breakdown (Published, Scheduled, Drafts)\n" +
      "• Distribution of publications per platform (Twitter, Instagram, LinkedIn, Facebook)\n" +
      "• Mini-board preview available in the Feed sidebar.",
    suggestions: ["What can my current role do?", "How do I schedule a post?"],
  },
  {
    id: "activity-log",
    keywords: ["activity", "activity log", "audit", "security log", "audit log"],
    title: "System Activity & Compliance Audit Log",
    answer:
      "The **ACTIVITY LOG** is an administrative governance console accessible exclusively to the **ADMIN** role. It logs every creation, update, schedule, and deletion event with user identification, IP correlation, and timestamps for compliance accountability.",
    suggestions: ["What can my current role do?", "How do I switch user roles?"],
  },
];
