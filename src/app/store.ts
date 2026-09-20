/**
 * store.ts - Centralized Redux Store Configuration.
 *
 * This file sets up the single source of truth for all global application state
 * using Redux Toolkit's `configureStore`.
 *
 * Slices included:
 * - `posts`: Manages published, scheduled, and draft posts using normalized entity state (`createEntityAdapter`).
 * - `drafts`: Manages work-in-progress drafts, auto-saving, and revision audit logs.
 * - `platforms`: Manages active target platforms (Twitter, Instagram, LinkedIn, Facebook) and filtering state.
 * - `auth`: Manages authenticated user credentials, JWT tokens, and login/logout state machines.
 * - `activity`: Manages administrative security audit logs for tracking user actions.
 *
 * Middleware:
 * - `omnitrixMiddleware`: Intercepts dispatched actions to trigger Ben 10 / Omnitrix themed sound effects.
 * - `serializableCheck: false`: Configured to avoid warnings on Date objects and synthetic events.
 *
 * Type Exports:
 * - `RootState`: Inferred state type representing the entire Redux state tree.
 * - `AppDispatch`: Inferred dispatch type for dispatching thunks and actions with full TypeScript checking.
 */

import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import draftsReducer from "../features/drafts/draftsSlice";
import platformReducer from "../features/platforms/platformSlice";
import authReducer from "../features/auth/authSlice";
import activityReducer from "../features/activity/activitySlice";
import assistantReducer from "../features/assistant/assistantSlice";
import { omnitrixMiddleware } from "../components/omnitrix/omnitrixMiddleware";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    drafts: draftsReducer,
    platforms: platformReducer,
    auth: authReducer,
    activity: activityReducer,
    assistant: assistantReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(omnitrixMiddleware),
});

// TypeScript type inference for typed hooks (useAppDispatch, useAppSelector)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
