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
