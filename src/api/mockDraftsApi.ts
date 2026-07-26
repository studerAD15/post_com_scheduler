/**
 * mockDraftsApi.ts - Async mock service returning Promises with artificial latency & failure simulation.
 */

import { Draft } from "../types/draft";
import { getStoredDrafts, saveStoredDrafts } from "../utils/storage";

const DEFAULT_DELAY_MS = 500;

// Seed initial drafts if local storage is empty
const INITIAL_SEED_DRAFTS: Draft[] = [
  {
    id: "draft-101",
    title: "Q3 Roadmap Preview",
    content: "🚀 Excited to announce our Q3 product roadmap featuring AI-powered multi-channel analytics and automated workflow scheduling! #TechNews #ProductUpdate",
    platforms: ["twitter", "linkedin"],
    media: [],
    status: "draft",
    scheduledAt: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "draft-102",
    title: "Behind the Scenes Design System",
    content: "A sneak peek at our new design system tokens and glassmorphism UI components. What do you think of this layout? #UIUX #DesignSystem #WebDev",
    platforms: ["instagram", "facebook"],
    media: [],
    status: "draft",
    scheduledAt: null,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

function delay(ms: number = DEFAULT_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockDraftsApi = {
  /**
   * Fetches all saved drafts asynchronously.
   */
  async fetchDrafts(): Promise<Draft[]> {
    await delay(400);
    let drafts = getStoredDrafts();
    if (drafts.length === 0) {
      drafts = INITIAL_SEED_DRAFTS;
      saveStoredDrafts(drafts);
    }
    return drafts;
  },

  /**
   * Creates a new draft.
   */
  async createDraft(draftData: Omit<Draft, "id" | "createdAt" | "updatedAt">): Promise<Draft> {
    await delay(500);
    const now = new Date().toISOString();
    const newDraft: Draft = {
      ...draftData,
      id: `draft-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    const current = getStoredDrafts();
    const updated = [newDraft, ...current];
    saveStoredDrafts(updated);

    return newDraft;
  },

  /**
   * Updates an existing draft.
   */
  async updateDraft(id: string, updates: Partial<Draft>): Promise<Draft> {
    await delay(400);
    const current = getStoredDrafts();
    const index = current.findIndex((d) => d.id === id);

    if (index === -1) {
      throw new Error(`Draft with ID "${id}" was not found.`);
    }

    const updatedDraft: Draft = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedDraft;
    saveStoredDrafts(current);

    return updatedDraft;
  },

  /**
   * Deletes a draft by ID.
   */
  async deleteDraft(id: string): Promise<string> {
    await delay(400);
    const current = getStoredDrafts();
    const filtered = current.filter((d) => d.id !== id);
    saveStoredDrafts(filtered);
    return id;
  },
};
