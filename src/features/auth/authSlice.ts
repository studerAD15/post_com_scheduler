/**
 * authSlice.ts - Redux slice for JWT authentication and current session state.
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, Role, User, DecodedToken } from "../../types/auth";
import { generateMockJwtToken, decodeToken, isTokenExpired } from "../../utils/jwt";
import { getItem, setItem, removeItem } from "../../utils/storage";
import type { RootState } from "../../app/store";

// Seeded Users
export const SEEDED_USERS: Record<string, { user: User; passwordHash: string }> = {
  admin: {
    user: {
      id: "usr-admin-01",
      username: "admin",
      name: "ADITYA CHHIKARA (Admin)",
      email: "aditya.admin@company.com",
      role: "admin",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
    passwordHash: "password123",
  },
  editor: {
    user: {
      id: "usr-editor-02",
      username: "editor",
      name: "ADITYA CHHIKARA (Editor)",
      email: "aditya.editor@company.com",
      role: "editor",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    passwordHash: "password123",
  },
  viewer: {
    user: {
      id: "usr-viewer-03",
      username: "viewer",
      name: "ADITYA CHHIKARA (Viewer)",
      email: "aditya.viewer@company.com",
      role: "viewer",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
    passwordHash: "password123",
  },
};

// Check existing stored token on app boot
const storedToken = getItem<string | null>("jwt_token", null);
let initialUser: User | null = null;
let initialAuth = false;

if (storedToken && !isTokenExpired(storedToken)) {
  const decoded = decodeToken<DecodedToken>(storedToken);
  if (decoded) {
    initialUser = {
      id: decoded.sub,
      username: decoded.username,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
    initialAuth = true;
  }
}

const initialState: AuthState = {
  user: initialUser,
  token: storedToken,
  isAuthenticated: initialAuth,
  status: "idle",
  error: null,
};

export const loginThunk = createAsyncThunk<
  { user: User; token: string },
  { username: string; passwordHash: string },
  { rejectValue: string }
>("auth/login", async ({ username, passwordHash }, { rejectWithValue }) => {
  await new Promise((res) => setTimeout(res, 500)); // simulated latency

  const found = SEEDED_USERS[username.toLowerCase().trim()];
  if (!found || found.passwordHash !== passwordHash) {
    return rejectWithValue("Invalid username or password. Try 'admin' / 'password123'.");
  }

  const token = generateMockJwtToken(found.user, 3600); // 1 hour token
  setItem("jwt_token", token);

  return { user: found.user, token };
});

export const switchRoleThunk = createAsyncThunk<
  { user: User; token: string },
  Role,
  { rejectValue: string }
>("auth/switchRole", async (newRole, { rejectWithValue }) => {
  const targetUsername = newRole; // 'admin', 'editor', or 'viewer'
  const found = SEEDED_USERS[targetUsername];
  if (!found) return rejectWithValue("Invalid role selected");

  const token = generateMockJwtToken(found.user, 3600);
  setItem("jwt_token", token);

  return { user: found.user, token };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      removeItem("jwt_token");
    },
    checkTokenExpiration(state) {
      if (state.token && isTokenExpired(state.token)) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = "Session expired. Please log in again.";
        removeItem("jwt_token");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      .addCase(switchRoleThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      });
  },
});

export const { logout, checkTokenExpiration } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
