/**
 * omnitrixMiddleware.ts - Redux listener middleware watching tracked thunk lifecycle actions.
 * Triggers Omnitrix action transitions for pending (>400ms), fulfilled, and rejected thunk states.
 */

import { Middleware } from "@reduxjs/toolkit";
import { triggerOmnitrixTransition } from "./useOmnitrixTransition";

// Map of in-flight pending timers keyed by requestId
const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();

export const omnitrixMiddleware: Middleware = () => (next) => (action: any) => {
  const result = next(action);

  if (!action || typeof action.type !== "string") {
    return result;
  }

  const { type, meta, payload } = action;

  // Tracked thunk prefixes (mutations / user actions only)
  const isTrackedAction =
    type.startsWith("posts/") ||
    type.startsWith("drafts/") ||
    type.startsWith("auth/");

  if (!isTrackedAction) return result;

  // Ignore background read-only thunks & token expiration checks
  if (
    type.includes("fetchPosts") ||
    type.includes("fetchDrafts") ||
    type.includes("checkToken")
  ) {
    return result;
  }

  const requestId = meta?.requestId;

  // 1. Pending Action handling (trigger spin loading if > 400ms in-flight)
  if (type.endsWith("/pending")) {
    // Ignore initial background fetch actions
    if (type.includes("fetchPosts") || type.includes("fetchDrafts") || type.includes("checkToken")) {
      return result;
    }

    if (requestId) {
      const timer = setTimeout(() => {
        triggerOmnitrixTransition({
          status: "loading",
          message: "OMNITRIX SEQUENCE IN PROGRESS...",
          id: requestId,
        });
      }, 400);
      pendingTimers.set(requestId, timer);
    }
  }

  // 2. Fulfilled Action handling
  if (type.endsWith("/fulfilled")) {
    if (requestId && pendingTimers.has(requestId)) {
      clearTimeout(pendingTimers.get(requestId)!);
      pendingTimers.delete(requestId);
    }

    let message = "ACTION FULFILLED";
    let shouldTrigger = true;

    if (type.includes("addPost")) {
      const title = payload?.title ? `"${payload.title}"` : "Post";
      message = `${title} CREATED & SAVED!`;
    } else if (type.includes("schedulePost")) {
      message = "POST SCHEDULED SUCCESSFULLY!";
    } else if (type.includes("publishPost")) {
      message = "POST PUBLISHED LIVE!";
    } else if (type.includes("deletePost")) {
      message = "POST REMOVED FROM STORAGE";
    } else if (type.includes("saveDraft")) {
      const title = payload?.title ? `"${payload.title}"` : "Draft";
      message = `${title} SAVED TO DRAFTS!`;
    } else if (type.includes("updateDraft")) {
      message = "DRAFT UPDATED SUCCESSFULLY!";
    } else if (type.includes("deleteDraft")) {
      message = "DRAFT REMOVED";
    } else if (type.includes("resetPosts") || type.includes("resetDrafts")) {
      message = "SYSTEM DATA RESET TO DEFAULTS";
    } else {
      shouldTrigger = false;
    }

    if (shouldTrigger) {
      triggerOmnitrixTransition({
        status: "success",
        message,
        id: requestId,
      });
    }
  }

  // 3. Rejected Action handling
  if (type.endsWith("/rejected")) {
    if (requestId && pendingTimers.has(requestId)) {
      clearTimeout(pendingTimers.get(requestId)!);
      pendingTimers.delete(requestId);
    }

    // Ignore noise reject actions
    if (type.includes("fetchPosts") || type.includes("fetchDrafts")) {
      return result;
    }

    const errorMessage = typeof payload === "string" ? payload : "OPERATION FAILED";
    triggerOmnitrixTransition({
      status: "error",
      message: `ERROR: ${errorMessage.toUpperCase()}`,
      id: requestId,
    });
  }

  return result;
};
