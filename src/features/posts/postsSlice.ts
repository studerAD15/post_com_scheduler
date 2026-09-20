/**
 * postsSlice.ts - Normalized Post State Management with Redux Toolkit Entity Adapter.
 *
 * ARCHITECTURAL DESIGN:
 * 1. Normalized State Shape: Uses `createEntityAdapter<Post>()` to store posts in a normalized
 *    `{ ids: string[], entities: Record<string, Post> }` structure. This ensures O(1) lookups
 *    and prevents deeply nested state mutations.
 * 2. Automatic Sorting: The `sortComparer` automatically orders posts descending by creation date.
 * 3. Async Operations (Thunks):
 *    - `fetchPosts`: Loads posts on initial render.
 *    - `addPostThunk`: Creates a new post (draft, scheduled, or published).
 *    - `updatePostThunk`: Edits existing post text, platforms, or media.
 *    - `schedulePostThunk`: Sets scheduled ISO date/time on a post.
 *    - `publishPostThunk`: Transitions post status to "published".
 *    - `deletePostThunk`: Removes post from store and storage.
 * 4. User Feedback: Automatically sets and clears transient `feedbackMessage` alerts.
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

import { recordActivityThunk } from "../activity/activitySlice";

export const addPostThunk = createAsyncThunk<Post, AddPostPayload, { rejectValue: string }>(
  "posts/addPost",
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const user = state.auth.user;
      const enrichedPayload = {
        ...payload,
        authorId: payload.authorId || user?.id,
        authorName: payload.authorName || user?.name,
        authorRole: payload.authorRole || user?.role,
      };
      const createdPost = await mockPostsApi.createPost(enrichedPayload);
      if (user) {
        dispatch(
          recordActivityThunk({
            targetId: createdPost.id,
            targetType: "post",
            actionType: createdPost.status === "scheduled" ? "scheduled" : "created",
            userId: user.id,
            username: user.username,
            userRole: user.role,
            userName: user.name,
            summary: `${createdPost.status === "scheduled" ? "Scheduled" : "Created"} post "${createdPost.title}"`,
            title: createdPost.title,
          })
        );
      }
      return createdPost;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Could not add post"));
    }
  }
);

export const updatePostThunk = createAsyncThunk<Post, UpdatePostPayload, { rejectValue: string }>(
  "posts/updatePost",
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const user = state.auth.user;
      const updatedPost = await mockPostsApi.updatePost(payload);
      if (user) {
        dispatch(
          recordActivityThunk({
            targetId: updatedPost.id,
            targetType: "post",
            actionType: "edited",
            userId: user.id,
            username: user.username,
            userRole: user.role,
            userName: user.name,
            summary: `Updated post "${updatedPost.title}"`,
            title: updatedPost.title,
          })
        );
      }
      return updatedPost;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Could not update post"));
    }
  }
);

export const schedulePostThunk = createAsyncThunk<
  Post,
  { id: string; scheduledAt: string },
  { rejectValue: string }
>("posts/schedulePost", async ({ id, scheduledAt }, { dispatch, getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState;
    const user = state.auth.user;
    const scheduledPost = await mockPostsApi.schedulePost(id, scheduledAt);
    if (user) {
      dispatch(
        recordActivityThunk({
          targetId: scheduledPost.id,
          targetType: "post",
          actionType: "scheduled",
          userId: user.id,
          username: user.username,
          userRole: user.role,
          userName: user.name,
          summary: `Scheduled post "${scheduledPost.title}" for ${new Date(scheduledAt).toLocaleString()}`,
          title: scheduledPost.title,
        })
      );
    }
    return scheduledPost;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to schedule post"));
  }
});

export const publishPostThunk = createAsyncThunk<Post, string, { rejectValue: string }>(
  "posts/publishPost",
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const user = state.auth.user;
      const publishedPost = await mockPostsApi.publishPost(id);
      if (user) {
        dispatch(
          recordActivityThunk({
            targetId: publishedPost.id,
            targetType: "post",
            actionType: "published",
            userId: user.id,
            username: user.username,
            userRole: user.role,
            userName: user.name,
            summary: `Published post "${publishedPost.title}" live`,
            title: publishedPost.title,
          })
        );
      }
      return publishedPost;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to publish post"));
    }
  }
);

export const deletePostThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  "posts/deletePost",
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const user = state.auth.user;
      const existingPost = state.posts.entities[id];
      const deletedId = await mockPostsApi.deletePost(id);
      if (user) {
        dispatch(
          recordActivityThunk({
            targetId: deletedId,
            targetType: "post",
            actionType: "deleted",
            userId: user.id,
            username: user.username,
            userRole: user.role,
            userName: user.name,
            summary: `Deleted post "${existingPost?.title || deletedId}"`,
            title: existingPost?.title || deletedId,
          })
        );
      }
      return deletedId;
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
      .addCase(addPostThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPostThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.addOne(state, action.payload);
        state.feedbackMessage = `Post "${action.payload.title}" created & saved to Local Storage!`;
      })
      .addCase(addPostThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Could not add post";
      })
      // Update Post
      .addCase(updatePostThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePostThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.upsertOne(state, action.payload);
        state.feedbackMessage = `Post updated successfully in Local Storage!`;
      })
      .addCase(updatePostThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Could not update post";
      })
      // Schedule Post
      .addCase(schedulePostThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(schedulePostThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.upsertOne(state, action.payload);
        state.feedbackMessage = `Post scheduled for ${new Date(
          action.payload.scheduledAt!
        ).toLocaleString()}`;
      })
      .addCase(schedulePostThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to schedule post";
      })
      // Publish Post
      .addCase(publishPostThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(publishPostThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.upsertOne(state, action.payload);
        state.feedbackMessage = `Post published live!`;
      })
      .addCase(publishPostThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to publish post";
      })
      // Delete Post
      .addCase(deletePostThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.removeOne(state, action.payload);
        state.feedbackMessage = `Post removed from Local Storage.`;
      })
      .addCase(deletePostThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete post";
      })
      // Reset Posts
      .addCase(resetPostsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPostsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.setAll(state, action.payload);
        state.feedbackMessage = `Post data reset to default seed items.`;
      })
      .addCase(resetPostsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to reset posts";
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

export const selectPostsStatus = (state: RootState) => state.posts.status;
export const selectPostsError = (state: RootState) => state.posts.error;
export const selectFeedbackMessage = (state: RootState) => state.posts.feedbackMessage;
