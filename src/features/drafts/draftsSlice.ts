/**
 * draftsSlice.ts - Redux Toolkit slice for managing drafts state.
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Draft } from "../../types/draft";
import { mockDraftsApi } from "../../api/mockDraftsApi";
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

export const fetchDraftsThunk = createAsyncThunk<Draft[], void, { rejectValue: string }>(
  "drafts/fetchDrafts",
  async (_, { rejectWithValue }) => {
    try {
      return await mockDraftsApi.fetchDrafts();
    } catch {
      return rejectWithValue("Failed to fetch drafts");
    }
  }
);

export const saveDraftThunk = createAsyncThunk<
  Draft,
  Omit<Draft, "id" | "createdAt" | "updatedAt">,
  { rejectValue: string }
>("drafts/saveDraft", async (draftData, { rejectWithValue }) => {
  try {
    return await mockDraftsApi.createDraft(draftData);
  } catch {
    return rejectWithValue("Failed to save draft");
  }
});

export const updateDraftThunk = createAsyncThunk<
  Draft,
  { id: string; updates: Partial<Draft> },
  { rejectValue: string }
>("drafts/updateDraft", async ({ id, updates }, { rejectWithValue }) => {
  try {
    return await mockDraftsApi.updateDraft(id, updates);
  } catch {
    return rejectWithValue("Failed to update draft");
  }
});

export const deleteDraftThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  "drafts/deleteDraft",
  async (id, { rejectWithValue }) => {
    try {
      return await mockDraftsApi.deleteDraft(id);
    } catch {
      return rejectWithValue("Failed to delete draft");
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
      .addCase(saveDraftThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update
      .addCase(updateDraftThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteDraftThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export const { setActiveDraft } = draftsSlice.actions;
export default draftsSlice.reducer;

export const selectAllDrafts = (state: RootState) => state.drafts.items;
export const selectDraftsStatus = (state: RootState) => state.drafts.status;
export const selectActiveDraft = (state: RootState) =>
  state.drafts.items.find((d) => d.id === state.drafts.activeDraftId);
