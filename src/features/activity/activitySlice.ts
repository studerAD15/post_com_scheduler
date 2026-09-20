/**
 * activitySlice.ts - Redux Slice for System Activity, Audit Trails & Governance.
 *
 * ROLE & ACCESS:
 * - This slice is exclusively accessible by the ADMIN role (`view_activity_log`).
 * - Fetches audit entries from Spring Boot's `/api/activity` endpoint.
 * - Records who created, edited, scheduled, published, or deleted drafts and posts.
 * - Provides compliance tracking, user identification, and operational accountability.
 */

import { createSlice, createAsyncThunk, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { ActivityLogEntry, ActivityState } from "../../types/activity";
import { getStoredActivities, saveStoredActivities } from "../../utils/storage";
import { apiClient, ApiResponse } from "../../api/apiClient";
import type { RootState } from "../../app/store";

// Initial seed activities displayed in development and offline modes
export const INITIAL_SEED_ACTIVITIES: ActivityLogEntry[] = [
  {
    id: "act-101",
    targetId: "draft-101",
    targetType: "draft",
    actionType: "created",
    userId: "usr-editor-02",
    username: "editor",
    userRole: "editor",
    userName: "ADITYA CHHIKARA (Editor)",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    summary: "Created draft outline for Q3 Roadmap announcement",
    title: "Q3 Roadmap Preview",
  },
  {
    id: "act-102",
    targetId: "draft-101",
    targetType: "draft",
    actionType: "edited",
    userId: "usr-editor-02",
    username: "editor",
    userRole: "editor",
    userName: "ADITYA CHHIKARA (Editor)",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    summary: "Updated channels and copy for Q3 Roadmap preview",
    title: "Q3 Roadmap Preview",
  },
  {
    id: "act-103",
    targetId: "post-1",
    targetType: "post",
    actionType: "published",
    userId: "usr-admin-01",
    username: "admin",
    userRole: "admin",
    userName: "ADITYA CHHIKARA (Admin)",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    summary: "Published live AI Product Announcement across Twitter and LinkedIn",
    title: "AI Product Announcement",
  },
  {
    id: "act-104",
    targetId: "post-2",
    targetType: "post",
    actionType: "scheduled",
    userId: "usr-editor-02",
    username: "editor",
    userRole: "editor",
    userName: "ADITYA CHHIKARA (Editor)",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    summary: "Scheduled Design System Showcase for multi-channel release",
    title: "Design System Showcase",
  },
  {
    id: "act-105",
    targetId: "draft-102",
    targetType: "draft",
    actionType: "created",
    userId: "usr-editor-02",
    username: "editor",
    userRole: "editor",
    userName: "ADITYA CHHIKARA (Editor)",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    summary: "Created initial draft for Behind the Scenes Design System",
    title: "Behind the Scenes Design System",
  },
  {
    id: "act-106",
    targetId: "post-3",
    targetType: "post",
    actionType: "scheduled",
    userId: "usr-editor-02",
    username: "editor",
    userRole: "editor",
    userName: "ADITYA CHHIKARA (Editor)",
    timestamp: new Date().toISOString(),
    summary: "Scheduled Weekly Tech Newsletter Snippet",
    title: "Weekly Tech Newsletter Snippet",
  },
];

const initialState: ActivityState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchActivitiesThunk = createAsyncThunk<ActivityLogEntry[], void>(
  "activity/fetchActivities",
  async () => {
    try {
      const res = await apiClient.get<ApiResponse<ActivityLogEntry[]>>("/activity");
      return res.data;
    } catch {
      const items = getStoredActivities();
      return items.length > 0 ? items : INITIAL_SEED_ACTIVITIES;
    }
  }
);

export const recordActivityThunk = createAsyncThunk<
  ActivityLogEntry,
  Omit<ActivityLogEntry, "id" | "timestamp">
>("activity/recordActivity", async (payload, { getState }) => {
  const now = new Date().toISOString();
  const entry: ActivityLogEntry = {
    ...payload,
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now,
  };

  const state = getState() as RootState;
  const current = state.activity.items;
  const updated = [entry, ...current];
  saveStoredActivities(updated);

  return entry;
});

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    addActivityDirect(state, action: PayloadAction<ActivityLogEntry>) {
      state.items.unshift(action.payload);
      saveStoredActivities(state.items);
    },
    resetActivities(state) {
      state.items = INITIAL_SEED_ACTIVITIES;
      saveStoredActivities(INITIAL_SEED_ACTIVITIES);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivitiesThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(recordActivityThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { addActivityDirect, resetActivities } = activitySlice.actions;
export default activitySlice.reducer;

export {
  selectAllActivities,
  selectActivityStatus,
  selectUserActionStats,
  selectFilteredActivities,
} from "./activitySelectors";

