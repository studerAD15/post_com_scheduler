/**
 * store.ts - Centralized Redux store configuration.
 */

import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import draftsReducer from "../features/drafts/draftsSlice";
import platformReducer from "../features/platforms/platformSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    drafts: draftsReducer,
    platforms: platformReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
