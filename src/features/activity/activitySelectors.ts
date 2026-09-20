/**
 * activitySelectors.ts - Reselect memoized selectors for System Activity & Audit Trail.
 */

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { ActivityLogEntry } from "../../types/activity";

export interface ActivityFilterCriteria {
  searchQuery?: string;
  targetIdLookup?: string;
  selectedUserFilter?: string;
  selectedActionFilter?: string;
  selectedTypeFilter?: "all" | "draft" | "post";
}

// Base Selectors
export const selectActivityState = (state: RootState) => state.activity;
export const selectAllActivities = (state: RootState) => state.activity.items;
export const selectActivityStatus = (state: RootState) => state.activity.status;

/**
 * Selector: User action statistics aggregated per user across all activity log entries.
 */
export const selectUserActionStats = createSelector([selectAllActivities], (items) => {
  const stats: Record<
    string,
    {
      userId: string;
      userName: string;
      username: string;
      userRole: string;
      total: number;
      created: number;
      edited: number;
      scheduled: number;
      published: number;
      deleted: number;
    }
  > = {};

  for (const item of items) {
    const key = item.userId || item.username || "unknown";
    if (!stats[key]) {
      stats[key] = {
        userId: item.userId || key,
        userName: item.userName || item.username,
        username: item.username,
        userRole: item.userRole,
        total: 0,
        created: 0,
        edited: 0,
        scheduled: 0,
        published: 0,
        deleted: 0,
      };
    }
    stats[key].total++;
    if (item.actionType in stats[key]) {
      stats[key][item.actionType as keyof typeof stats[typeof key]]++;
    }
  }

  return Object.values(stats);
});

/**
 * Selector: Filter activities based on multi-parameter search & lookup criteria.
 */
export const selectFilteredActivities = createSelector(
  [
    selectAllActivities,
    (_state: RootState, criteria: ActivityFilterCriteria) => criteria,
  ],
  (activities, criteria): ActivityLogEntry[] => {
    const searchQuery = criteria.searchQuery?.trim().toLowerCase() || "";
    const targetIdLookup = criteria.targetIdLookup?.trim().toLowerCase() || "";
    const selectedUserFilter = criteria.selectedUserFilter || "all";
    const selectedActionFilter = criteria.selectedActionFilter || "all";
    const selectedTypeFilter = criteria.selectedTypeFilter || "all";

    return activities.filter((act) => {
      // Target ID lookup
      if (targetIdLookup) {
        const targetMatch =
          act.targetId.toLowerCase().includes(targetIdLookup) ||
          act.id.toLowerCase().includes(targetIdLookup);
        if (!targetMatch) return false;
      }

      // User filter
      if (selectedUserFilter !== "all") {
        if (act.userId !== selectedUserFilter && act.username !== selectedUserFilter) {
          return false;
        }
      }

      // Action filter
      if (selectedActionFilter !== "all") {
        if (act.actionType !== selectedActionFilter) return false;
      }

      // Target type filter
      if (selectedTypeFilter !== "all") {
        if (act.targetType !== selectedTypeFilter) return false;
      }

      // Text search query
      if (searchQuery) {
        const match =
          act.summary.toLowerCase().includes(searchQuery) ||
          (act.title && act.title.toLowerCase().includes(searchQuery)) ||
          act.userName.toLowerCase().includes(searchQuery) ||
          act.username.toLowerCase().includes(searchQuery) ||
          act.targetId.toLowerCase().includes(searchQuery);
        if (!match) return false;
      }

      return true;
    });
  }
);
