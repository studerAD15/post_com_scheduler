/**
 * draftsSlice.ts - Redux Toolkit slice for managing drafts state with Local Storage persistence.
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Draft } from "../../types/draft";
import { mockDraftsApi } from "../../api/mockDraftsApi";
import { ApiError } from "../../api/apiClient";
import type { RootState } from "../../app/store";

export interface DraftsSliceState {
  items: Draft[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  activeDraftId: string | null;
}

const initialState: DraftsSliceState = {
  items: [],
  status: "idle",
  error: null,
  activeDraftId: null,
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export const fetchDraftsThunk = createAsyncThunk<Draft[], void, { rejectValue: string }>(
  "drafts/fetchDrafts",
  async (_, { rejectWithValue }) => {
    try {
      return await mockDraftsApi.fetchDrafts();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch drafts"));
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      if (state.drafts.status === "loading") {
        return false;
      }
    },
  }
);

import { recordActivityThunk } from "../activity/activitySlice";

export const saveDraftThunk = createAsyncThunk<
  Draft,
  Omit<Draft, "id" | "createdAt" | "updatedAt">,
  { rejectValue: string }
>("drafts/saveDraft", async (draftData, { dispatch, getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState;
    const user = state.auth.user;
    const enrichedData = {
      ...draftData,
      authorId: draftData.authorId || user?.id,
      authorName: draftData.authorName || user?.name,
      authorRole: draftData.authorRole || user?.role,
    };
    const newDraft = await mockDraftsApi.createDraft(enrichedData);
    if (user) {
      dispatch(
        recordActivityThunk({
          targetId: newDraft.id,
          targetType: "draft",
          actionType: "created",
          userId: user.id,
          username: user.username,
          userRole: user.role,
          userName: user.name,
          summary: `Created draft "${newDraft.title || "Untitled Draft"}"`,
          title: newDraft.title || "Untitled Draft",
        })
      );
    }
    return newDraft;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to save draft"));
  }
});

export const updateDraftThunk = createAsyncThunk<
  Draft,
  { id: string; updates: Partial<Draft> },
  { rejectValue: string }
>("drafts/updateDraft", async ({ id, updates }, { dispatch, getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState;
    const user = state.auth.user;
    const updatedDraft = await mockDraftsApi.updateDraft(id, updates);
    if (user) {
      dispatch(
        recordActivityThunk({
          targetId: updatedDraft.id,
          targetType: "draft",
          actionType: "edited",
          userId: user.id,
          username: user.username,
          userRole: user.role,
          userName: user.name,
          summary: `Updated draft "${updatedDraft.title || "Untitled Draft"}"`,
          title: updatedDraft.title || "Untitled Draft",
        })
      );
    }
    return updatedDraft;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to update draft"));
  }
});

export const deleteDraftThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  "drafts/deleteDraft",
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const user = state.auth.user;
      const existingDraft = state.drafts.items.find((d) => d.id === id);
      const deletedId = await mockDraftsApi.deleteDraft(id);
      if (user) {
        dispatch(
          recordActivityThunk({
            targetId: deletedId,
            targetType: "draft",
            actionType: "deleted",
            userId: user.id,
            username: user.username,
            userRole: user.role,
            userName: user.name,
            summary: `Deleted draft "${existingDraft?.title || deletedId}"`,
            title: existingDraft?.title || deletedId,
          })
        );
      }
      return deletedId;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to delete draft"));
    }
  }
);

export const resetDraftsThunk = createAsyncThunk<Draft[], void, { rejectValue: string }>(
  "drafts/resetDrafts",
  async (_, { rejectWithValue }) => {
    try {
      return await mockDraftsApi.resetToDefaults();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to reset drafts"));
    }
  }
);

const draftsSlice = createSlice({
  name: "drafts",
  initialState,
  reducers: {
    setActiveDraft(state, action: PayloadAction<string | null>) {
      state.activeDraftId = action.payload;
    },
    clearDraftsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDraftsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDraftsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchDraftsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load drafts";
      })
      // Save
      .addCase(saveDraftThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveDraftThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(saveDraftThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to save draft";
      })
      // Update
      .addCase(updateDraftThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateDraftThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateDraftThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update draft";
      })
      // Delete
      .addCase(deleteDraftThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteDraftThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteDraftThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete draft";
      })
      // Reset
      .addCase(resetDraftsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetDraftsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(resetDraftsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to reset drafts";
      });
  },
});

export const { setActiveDraft, clearDraftsError } = draftsSlice.actions;
export default draftsSlice.reducer;

export {
  selectAllDrafts,
  selectDraftsStatus,
  selectDraftsError,
  selectActiveDraftId,
  selectActiveDraft,
  selectAllDraftUserIds,
  selectFilteredDraftsByUserId,
  selectTotalDraftRevisionsCount,
} from "./draftsSelectors";

