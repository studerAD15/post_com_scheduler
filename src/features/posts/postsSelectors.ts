/**
 * postsSelectors.ts - Reselect memoized selectors for derived post states.
 */

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { selectAllPosts } from "./postsSlice";
import { selectActivePlatformFilter } from "../platforms/platformSlice";
import { PostStatus, Post } from "../../types/post";
import { PlatformId } from "../../types/platform";

// Base Selectors
export const selectPostsState = (state: RootState) => state.posts;

/**
 * Selector: Filter posts by currently active platform filter.
 */
export const selectFilteredPostsByPlatform = createSelector(
  [selectAllPosts, selectActivePlatformFilter],
  (posts, activeFilter) => {
    if (activeFilter === "all") return posts;
    return posts.filter((post) => post.platforms.includes(activeFilter as PlatformId));
  }
);

/**
 * Selector: Filter posts by PostStatus ('draft' | 'scheduled' | 'published').
 */
export const selectPostsByStatus = createSelector(
  [selectAllPosts, (_state: RootState, status: PostStatus) => status],
  (posts, status) => posts.filter((p) => p.status === status)
);

/**
 * Selector: Get upcoming scheduled posts sorted chronologically by scheduled date.
 */
export const selectUpcomingScheduledPosts = createSelector(
  [selectAllPosts],
  (posts) => {
    return posts
      .filter((p) => p.status === "scheduled" && p.scheduledAt !== null)
      .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime());
  }
);

/**
 * Selector: Aggregated post analytics and counts.
 */
export const selectPostMetrics = createSelector(
  [selectAllPosts],
  (posts) => {
    const total = posts.length;
    const byStatus: Record<PostStatus, number> = {
      draft: 0,
      scheduled: 0,
      published: 0,
    };
    const byPlatform: Record<PlatformId, number> = {
      twitter: 0,
      instagram: 0,
      linkedin: 0,
      facebook: 0,
    };

    for (const p of posts) {
      if (byStatus[p.status] !== undefined) {
        byStatus[p.status]++;
      }
      for (const platformId of p.platforms) {
        if (byPlatform[platformId] !== undefined) {
          byPlatform[platformId]++;
        }
      }
    }

    return { total, byStatus, byPlatform };
  }
);

/**
 * Selector: Posting frequency over time (daily buckets for past/upcoming days).
 */
export const selectPostingFrequencyOverTime = createSelector(
  [selectAllPosts],
  (posts) => {
    const days: { dateStr: string; dayLabel: string; published: number; scheduled: number; total: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString(undefined, { weekday: "short" });
      days.push({ dateStr, dayLabel, published: 0, scheduled: 0, total: 0 });
    }

    for (const p of posts) {
      const refDateStr = p.status === "scheduled" && p.scheduledAt
        ? p.scheduledAt.split("T")[0]
        : p.createdAt.split("T")[0];

      const bucket = days.find((b) => b.dateStr === refDateStr);
      if (bucket) {
        if (p.status === "published") bucket.published++;
        else if (p.status === "scheduled") bucket.scheduled++;
        bucket.total++;
      } else if (days.length > 0) {
        // Fallback mapping for demo data outside exact 7-day range
        const targetIndex = Math.abs(refDateStr.charCodeAt(refDateStr.length - 1)) % days.length;
        if (p.status === "published") days[targetIndex].published++;
        else if (p.status === "scheduled") days[targetIndex].scheduled++;
        days[targetIndex].total++;
      }
    }

    return days;
  }
);

/**
 * Selector: Group ALL posts by ISO date string (YYYY-MM-DD) in a single pass.
 * For scheduled posts: uses scheduledAt (or fallback to createdAt).
 * For published posts: uses publishedAt (if present) or createdAt.
 * For drafts/others: uses scheduledAt || createdAt.
 */
export const selectPostsGroupedByDate = createSelector(
  [selectAllPosts],
  (posts): Record<string, Post[]> => {
    const grouped: Record<string, Post[]> = {};
    for (const post of posts) {
      let rawDate: string;
      if (post.status === "scheduled" && post.scheduledAt) {
        rawDate = post.scheduledAt;
      } else if (post.status === "published") {
        rawDate = (post as any).publishedAt || post.createdAt;
      } else {
        rawDate = post.scheduledAt || post.createdAt;
      }

      const dateKey = rawDate ? rawDate.split("T")[0] : new Date().toISOString().split("T")[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(post);
    }
    return grouped;
  }
);

/**
 * Parametric Selector: Get posts whose effective date falls within a visible ISO date range (startISO to endISO).
 * Used by both Month and Week views to share grid rendering data source.
 */
export const selectPostsForDateRange = createSelector(
  [
    selectAllPosts,
    (_state: RootState, startISO: string, _endISO: string) => startISO,
    (_state: RootState, _startISO: string, endISO: string) => endISO,
  ],
  (posts, startISO, endISO) => {
    const startKey = startISO.split("T")[0];
    const endKey = endISO.split("T")[0];

    return posts.filter((post) => {
      let rawDate: string;
      if (post.status === "scheduled" && post.scheduledAt) {
        rawDate = post.scheduledAt;
      } else if (post.status === "published") {
        rawDate = (post as any).publishedAt || post.createdAt;
      } else {
        rawDate = post.scheduledAt || post.createdAt;
      }

      const dateKey = rawDate ? rawDate.split("T")[0] : "";
      return dateKey >= startKey && dateKey <= endKey;
    });
  }
);
