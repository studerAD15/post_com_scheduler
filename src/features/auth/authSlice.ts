/**
 * authSlice.ts - Redux Authentication State & JWT Session Management.
 *
 * This slice manages the complete lifecycle of user authentication:
 * 1. Initial State Hydration: On app boot, inspects `localStorage` for `jwt_token`.
 *    If found and unexpired, decodes user payload and initializes authenticated state.
 * 2. Login Flow (`loginThunk`): Dispatches HTTP POST to `/api/auth/login` on Spring Boot.
 *    On 200 OK, persists JWT token and sets `currentUser`.
 * 3. Offline Graceful Fallback: If the backend server is temporarily unreachable,
 *    provides fallback login for demo accounts (`admin`, `editor`, `viewer`).
 * 4. Logout Flow (`logout`): Clears Redux auth state and removes token from storage.
 * 5. Token Expiry Guard (`checkTokenExpiration`): Invalidates session when JWT expires.
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, Role, User, DecodedToken } from "../../types/auth";
import { generateMockJwtToken, decodeToken, isTokenExpired } from "../../utils/jwt";
import { getItem, setItem, removeItem } from "../../utils/storage";
import { apiClient, ApiError, ApiResponse } from "../../api/apiClient";
import type { RootState } from "../../app/store";

// Pre-seeded demo user fixtures for testing and development
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
  const cleanUsername = username.trim().toLowerCase();
  try {
    const res = await apiClient.post<ApiResponse<{ token: string; user: User }>>("/auth/login", {
      username: cleanUsername,
      password: passwordHash,
    });
    const { user, token } = res.data;
    setItem("jwt_token", token);
    return { user, token };
  } catch (err) {
    const isNetworkError =
      (err instanceof ApiError && (err.status === 0 || err.statusText === "NetworkError" || err.message === "Failed to fetch")) ||
      (err instanceof Error && err.message.includes("Failed to fetch"));

    // If backend is offline, enable seamless demo fallback for seeded users
    if (isNetworkError) {
      const seeded = SEEDED_USERS[cleanUsername];
      if (seeded && seeded.passwordHash === passwordHash) {
        const fallbackToken = generateMockJwtToken(seeded.user);
        setItem("jwt_token", fallbackToken);
        return { user: seeded.user, token: fallbackToken };
      }
      return rejectWithValue(
        "Backend server is offline (http://localhost:8080). Please run 'npm run backend' in a separate terminal. (Seeded demo accounts: admin, editor, viewer with password123)."
      );
    }

    if (err instanceof ApiError) {
      return rejectWithValue(err.message || "Invalid username or password.");
    }
    return rejectWithValue("Failed to connect to authentication server.");
  }
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
    clearAuthError(state) {
      state.error = null;
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
      });
  },
});

export const { logout, clearAuthError, checkTokenExpiration } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
