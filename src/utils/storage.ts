/**
 * storage.ts - Safe generic typed wrapper for localStorage with runtime type guards.
 */

const STORAGE_PREFIX = "post_scheduler_app_";

/**
 * Type guard for arrays of object data.
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
 * Safely writes a generic value to localStorage.
 */
export function setItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(STORAGE_PREFIX + key, serialized);
  } catch (error) {
    console.error(`[storage] Error writing key "${key}":`, error);
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
 * Typed helpers specifically for Draft entity storage.
 */
import { Draft } from "../types/draft";

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

export function saveStoredDrafts(drafts: Draft[]): void {
  setItem<Draft[]>("drafts", drafts);
}
