/**
 * platformSlice.ts - Redux slice for managing platforms and active platform filters with Local Storage persistence.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PLATFORM_CONFIGS, PlatformConfig, PlatformId } from "../../types/platform";
import { getStoredPlatformFilter, saveStoredPlatformFilter } from "../../utils/storage";
import type { RootState } from "../../app/store";

export interface PlatformSliceState {
  configs: Record<PlatformId, PlatformConfig>;
  activeFilter: PlatformId | "all";
}

const initialState: PlatformSliceState = {
  configs: PLATFORM_CONFIGS,
  activeFilter: getStoredPlatformFilter(),
};

const platformSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    setPlatformFilter(state, action: PayloadAction<PlatformId | "all">) {
      state.activeFilter = action.payload;
      saveStoredPlatformFilter(action.payload);
    },
  },
});

export const { setPlatformFilter } = platformSlice.actions;
export default platformSlice.reducer;

export const selectPlatformConfigs = (state: RootState) => state.platforms.configs;
export const selectActivePlatformFilter = (state: RootState) => state.platforms.activeFilter;
