/**
 * draftsSelectors.ts - Reselect memoized selectors for derived drafts states.
 */

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { Draft } from "../../types/draft";

// Base Selector
export const selectDraftsState = (state: RootState) => state.drafts;
export const selectAllDrafts = (state: RootState) => state.drafts.items;
export const selectDraftsStatus = (state: RootState) => state.drafts.status;
export const selectDraftsError = (state: RootState) => state.drafts.error;
export const selectActiveDraftId = (state: RootState) => state.drafts.activeDraftId;

/**
 * Selector: Get active draft object by ID.
 */
export const selectActiveDraft = createSelector(
  [selectAllDrafts, selectActiveDraftId],
  (drafts, activeDraftId) => drafts.find((d) => d.id === activeDraftId) || null
);

/**
 * Selector: Get all unique author & audit user IDs across stored drafts.
 */
export const selectAllDraftUserIds = createSelector(
  [selectAllDrafts],
  (drafts): string[] => {
    const userIds = new Set<string>();
    for (const draft of drafts) {
      userIds.add(draft.authorId || "usr-editor-01");
      if (draft.auditTrail) {
        for (const entry of draft.auditTrail) {
          if (entry.userId) {
            userIds.add(entry.userId);
          }
        }
      }
    }
    return Array.from(userIds);
  }
);

/**
 * Selector: Filter drafts by user ID for Admin user audit view.
 */
export const selectFilteredDraftsByUserId = createSelector(
  [selectAllDrafts, (_state: RootState, userIdFilter: string) => userIdFilter],
  (drafts, userIdFilter): Draft[] => {
    if (!userIdFilter || userIdFilter === "all") return drafts;
    return drafts.filter(
      (d) =>
        d.authorId === userIdFilter ||
        d.auditTrail?.some((a) => a.userId === userIdFilter)
    );
  }
);

/**
 * Selector: Total count of all user revisions across all drafts.
 */
export const selectTotalDraftRevisionsCount = createSelector(
  [selectAllDrafts],
  (drafts): number => {
    return drafts.reduce((acc, d) => acc + (d.auditTrail?.length || 1), 0);
  }
);
