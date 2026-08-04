/**
 * postsSlice.ts - Normalized Post state management with createEntityAdapter.
 *
 * Uses `createEntityAdapter<Post>()` to maintain an efficient { ids, entities } structure.
 * Async operations are wired to `mockPostsApi` which persists changes in LocalStorage.
 */

import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { Post, AddPostPayload, UpdatePostPayload } from "../../types/post";
import { mockPostsApi } from "../../api/mockPostsApi";
import { ApiError } from "../../api/apiClient";
import type { RootState } from "../../app/store";

export const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

export interface PostsState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  feedbackMessage: string | null;
}

const initialState = postsAdapter.getInitialState<PostsState>({
  status: "idle",
  error: null,
  feedbackMessage: null,
});

// Helper for error message extraction
function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

// Async Thunks
export const fetchPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      return await mockPostsApi.fetchPosts();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch posts"));
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      if (state.posts.status === "loading") {
        return false;
      }
    },
  }
);

export const addPostThunk = createAsyncThunk<Post, AddPostPayload, { rejectValue: string }>(
  "posts/addPost",
  async (payload, { rejectWithValue }) => {
    try {
      return await mockPostsApi.createPost(payload);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Could not add post"));
    }
  }
);

export const updatePostThunk = createAsyncThunk<Post, UpdatePostPayload, { rejectValue: string }>(
  "posts/updatePost",
  async (payload, { rejectWithValue }) => {
    try {
      return await mockPostsApi.updatePost(payload);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Could not update post"));
    }
  }
);

export const schedulePostThunk = createAsyncThunk<
  Post,
  { id: string; scheduledAt: string },
  { rejectValue: string }
>("posts/schedulePost", async ({ id, scheduledAt }, { rejectWithValue }) => {
  try {
    return await mockPostsApi.schedulePost(id, scheduledAt);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to schedule post"));
  }
});

export const publishPostThunk = createAsyncThunk<Post, string, { rejectValue: string }>(
  "posts/publishPost",
  async (id, { rejectWithValue }) => {
    try {
      return await mockPostsApi.publishPost(id);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to publish post"));
    }
  }
);

export const deletePostThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      return await mockPostsApi.deletePost(id);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to delete post"));
    }
  }
);

export const resetPostsThunk = createAsyncThunk<Post[], void, { rejectValue: string }>(
  "posts/resetPosts",
  async (_, { rejectWithValue }) => {
    try {
      return await mockPostsApi.resetToDefaults();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to reset posts"));
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearFeedback(state) {
      state.feedbackMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load posts";
      })
      // Add Post
      .addCase(addPostThunk.fulfilled, (state, action) => {
        postsAdapter.addOne(state, action.payload);
        state.feedbackMessage = `Post "${action.payload.title}" created & saved to Local Storage!`;
      })
      .addCase(addPostThunk.rejected, (state, action) => {
        state.error = action.payload || "Could not add post";
      })
      // Update Post
      .addCase(updatePostThunk.fulfilled, (state, action) => {
        postsAdapter.upsertOne(state, action.payload);
        state.feedbackMessage = `Post updated successfully in Local Storage!`;
      })
      .addCase(updatePostThunk.rejected, (state, action) => {
        state.error = action.payload || "Could not update post";
      })
      // Schedule Post
      .addCase(schedulePostThunk.fulfilled, (state, action) => {
        postsAdapter.upsertOne(state, action.payload);
        state.feedbackMessage = `Post scheduled for ${new Date(
          action.payload.scheduledAt!
        ).toLocaleString()}`;
      })
      .addCase(schedulePostThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to schedule post";
      })
      // Publish Post
      .addCase(publishPostThunk.fulfilled, (state, action) => {
        postsAdapter.upsertOne(state, action.payload);
        state.feedbackMessage = `Post published live!`;
      })
      .addCase(publishPostThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to publish post";
      })
      // Delete Post
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload);
        state.feedbackMessage = `Post removed from Local Storage.`;
      })
      .addCase(deletePostThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete post";
      })
      // Reset Posts
      .addCase(resetPostsThunk.fulfilled, (state, action) => {
        postsAdapter.setAll(state, action.payload);
        state.feedbackMessage = `Post data reset to default seed items.`;
      });
  },
});

export const { clearFeedback } = postsSlice.actions;
export default postsSlice.reducer;

// Export adapter selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectTotal: selectTotalPosts,
} = postsAdapter.getSelectors((state: RootState) => state.posts);
