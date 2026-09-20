/**
 * mockDraftsApi.ts - Async mock service for Draft CRUD operations with Local Storage persistence,
 * artificial network latency, and ApiError error handling.
 */

import { Draft } from "../types/draft";
import { getStoredDrafts, saveStoredDrafts } from "../utils/storage";
import { apiClient, ApiError, ApiResponse } from "./apiClient";

const DEFAULT_DELAY_MS = 400;

export const INITIAL_SEED_DRAFTS: Draft[] = [
  {
    id: "draft-101",
    title: "Q3 Roadmap Preview",
    content:
      "🚀 Excited to announce our Q3 product roadmap featuring AI-powered multi-channel analytics and automated workflow scheduling! #TechNews #ProductUpdate",
    platforms: ["twitter", "linkedin"],
    media: [],
    status: "draft",
    scheduledAt: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    authorId: "usr-editor-01",
    authorName: "Alex Rivers",
    authorRole: "editor",
    auditTrail: [
      {
        id: "audit-01",
        userId: "usr-editor-01",
        username: "editor_alex",
        name: "Alex Rivers",
        role: "editor",
        action: "created",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        changesSummary: "Created initial draft outline for Q3 Roadmap announcement.",
      },
      {
        id: "audit-02",
        userId: "usr-editor-02",
        username: "editor_sam",
        name: "Sam Vance",
        role: "editor",
        action: "updated",
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        changesSummary: "Added LinkedIn channel target and optimized hashtags for engagement.",
      },
      {
        id: "audit-03",
        userId: "usr-admin-01",
        username: "admin_morgan",
        name: "Morgan Vance",
        role: "admin",
        action: "updated",
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        changesSummary: "Reviewed compliance & added scheduled launch window note.",
      },
    ],
  },
  {
    id: "draft-102",
    title: "Behind the Scenes Design System",
    content:
      "A sneak peek at our new design system tokens and glassmorphism UI components. What do you think of this layout? #UIUX #DesignSystem #WebDev",
    platforms: ["instagram", "facebook"],
    media: [],
    status: "draft",
    scheduledAt: null,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    authorId: "usr-editor-02",
    authorName: "Sam Vance",
    authorRole: "editor",
    auditTrail: [
      {
        id: "audit-04",
        userId: "usr-editor-02",
        username: "editor_sam",
        name: "Sam Vance",
        role: "editor",
        action: "created",
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        changesSummary: "Drafted Behind-the-Scenes design post for Instagram & Facebook.",
      },
      {
        id: "audit-05",
        userId: "usr-editor-01",
        username: "editor_alex",
        name: "Alex Rivers",
        role: "editor",
        action: "updated",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        changesSummary: "Polished copy and added brand icon tag.",
      },
    ],
  },
  {
    id: "draft-103",
    title: "Omnitrix Feature Update Campaign",
    content:
      "⚡ Unleashing the new Omnitrix Social Suite! Real-time channel sync and multi-user draft auditing are now live. #Omnitrix #SocialTech",
    platforms: ["twitter", "instagram", "linkedin"],
    media: [],
    status: "draft",
    scheduledAt: null,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    authorId: "usr-editor-03",
    authorName: "Taylor Reed",
    authorRole: "editor",
    auditTrail: [
      {
        id: "audit-06",
        userId: "usr-editor-03",
        username: "editor_taylor",
        name: "Taylor Reed",
        role: "editor",
        action: "created",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        changesSummary: "Created feature update announcement for Omnitrix platform release.",
      },
    ],
  },
];

function delay(ms: number = DEFAULT_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockDraftsApi = {
  /**
   * Fetches all saved drafts from Spring Boot backend (with localStorage fallback).
   */
  async fetchDrafts(): Promise<Draft[]> {
    try {
      const res = await apiClient.get<ApiResponse<Draft[]>>("/drafts");
      if (res?.data) {
        saveStoredDrafts(res.data);
        return res.data;
      }
      const stored = getStoredDrafts();
      return stored.length > 0 ? stored : INITIAL_SEED_DRAFTS;
    } catch {
      const stored = getStoredDrafts();
      return stored.length > 0 ? stored : INITIAL_SEED_DRAFTS;
    }
  },

  /**
   * Creates a new draft in backend database (or localStorage if offline).
   */
  async createDraft(draftData: Omit<Draft, "id" | "createdAt" | "updatedAt">): Promise<Draft> {
    try {
      const res = await apiClient.post<ApiResponse<Draft>>("/drafts", draftData);
      return res.data;
    } catch (err) {
      const isNetwork =
        (err instanceof ApiError && (err.status === 0 || err.statusText === "NetworkError")) ||
        (err instanceof Error && err.message.includes("Failed to fetch"));
      if (isNetwork) {
        const drafts = getStoredDrafts();
        const now = new Date().toISOString();
        const newDraft: Draft = {
          ...draftData,
          id: `draft-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        saveStoredDrafts([newDraft, ...drafts]);
        return newDraft;
      }
      throw err;
    }
  },

  /**
   * Updates an existing draft in backend database (or localStorage if offline).
   */
  async updateDraft(id: string, updates: Partial<Draft>): Promise<Draft> {
    try {
      const res = await apiClient.put<ApiResponse<Draft>>(`/drafts/${id}`, updates);
      return res.data;
    } catch (err) {
      const isNetwork =
        (err instanceof ApiError && (err.status === 0 || err.statusText === "NetworkError")) ||
        (err instanceof Error && err.message.includes("Failed to fetch"));
      if (isNetwork) {
        const drafts = getStoredDrafts();
        const existing = drafts.find((d) => d.id === id);
        if (!existing) throw err;
        const updatedDraft: Draft = {
          ...existing,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        saveStoredDrafts(drafts.map((d) => (d.id === id ? updatedDraft : d)));
        return updatedDraft;
      }
      throw err;
    }
  },

  /**
   * Deletes a draft by ID from backend database.
   */
  async deleteDraft(id: string): Promise<string> {
    try {
      await apiClient.delete<ApiResponse<void>>(`/drafts/${id}`);
      return id;
    } catch (err) {
      const isNetwork =
        (err instanceof ApiError && (err.status === 0 || err.statusText === "NetworkError")) ||
        (err instanceof Error && err.message.includes("Failed to fetch"));
      if (isNetwork) {
        const drafts = getStoredDrafts();
        saveStoredDrafts(drafts.filter((d) => d.id !== id));
        return id;
      }
      throw err;
    }
  },

  /**
   * Resets drafts to default seed data.
   */
  async resetToDefaults(): Promise<Draft[]> {
    return await this.fetchDrafts();
  },
};
