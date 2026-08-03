/**
 * storage.ts - Safe generic typed wrapper for localStorage with runtime type guards,
 * exception handling (quota exceeded), and entity-specific persistence helpers.
 */

import { Draft } from "../types/draft";
import { Post } from "../types/post";
import { PlatformId } from "../types/platform";

export const STORAGE_PREFIX = "post_scheduler_app_";

/**
 * Type guard for generic arrays.
 */
function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Safely retrieves an item from localStorage with generic fallback and optional guard.
 */
export function getItem<T>(
  key: string,
  fallback: T,
  guard?: (data: unknown) => data is T
): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    if (guard) {
      return guard(parsed) ? parsed : fallback;
    }
    return parsed as T;
  } catch (error) {
    console.warn(`[storage] Error reading key "${key}":`, error);
    return fallback;
  }
}

/**
 * Safely writes a generic value to localStorage with QuotaExceeded error detection.
 */
export function setItem<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(STORAGE_PREFIX + key, serialized);
    return true;
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      console.error(`[storage] LocalStorage quota exceeded when writing key "${key}".`);
    } else {
      console.error(`[storage] Error writing key "${key}":`, error);
    }
    return false;
  }
}

/**
 * Removes an item from localStorage.
 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (error) {
    console.error(`[storage] Error removing key "${key}":`, error);
  }
}

/**
 * Type guard for Draft objects.
 */
export function isDraft(obj: unknown): obj is Draft {
  if (typeof obj !== "object" || obj === null) return false;
  const d = obj as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    typeof d.content === "string" &&
    Array.isArray(d.platforms) &&
    typeof d.createdAt === "string"
  );
}

export function isDraftArray(obj: unknown): obj is Draft[] {
  return isUnknownArray(obj) && obj.every(isDraft);
}

export function getStoredDrafts(): Draft[] {
  return getItem<Draft[]>("drafts", [], isDraftArray);
}

export function saveStoredDrafts(drafts: Draft[]): boolean {
  return setItem<Draft[]>("drafts", drafts);
}

/**
 * Type guard for Post objects.
 */
export function isPost(obj: unknown): obj is Post {
  if (typeof obj !== "object" || obj === null) return false;
  const p = obj as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.content === "string" &&
    Array.isArray(p.platforms) &&
    typeof p.status === "string" &&
    typeof p.createdAt === "string"
  );
}

export function isPostArray(obj: unknown): obj is Post[] {
  return isUnknownArray(obj) && obj.every(isPost);
}

export function getStoredPosts(): Post[] {
  return getItem<Post[]>("posts", [], isPostArray);
}

export function saveStoredPosts(posts: Post[]): boolean {
  return setItem<Post[]>("posts", posts);
}

/**
 * Typed helpers for Platform Filter persistence.
 */
export function getStoredPlatformFilter(): PlatformId | "all" {
  return getItem<PlatformId | "all">("platform_filter", "all");
}

export function saveStoredPlatformFilter(filter: PlatformId | "all"): boolean {
  return setItem<PlatformId | "all">("platform_filter", filter);
}

/**
 * Clears all app-related items from Local Storage.
 */
export function clearAllAppStorage(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("[storage] Error clearing app local storage:", error);
  }
}

/**
 * Calculates current storage stats for debug / UI status display.
 */
export function getStorageStats(): { postsCount: number; draftsCount: number; bytesUsed: number } {
  let bytesUsed = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const val = localStorage.getItem(key) || "";
        bytesUsed += (key.length + val.length) * 2;
      }
    }
  } catch {
    // Ignore error
  }

  const posts = getStoredPosts();
  const drafts = getStoredDrafts();
  return {
    postsCount: posts.length,
    draftsCount: drafts.length,
    bytesUsed,
  };
}
