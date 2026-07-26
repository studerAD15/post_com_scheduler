/**
 * postsSlice.ts - Normalized Post state management with createEntityAdapter.
 *
 * Uses `createEntityAdapter<Post>()` to maintain an efficient { ids, entities } structure.
 * All async operations use typed `createAsyncThunk`.
 */

import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { Post, PostStatus, AddPostPayload, UpdatePostPayload } from "../../types/post";
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

// Seed data
const SEED_POSTS: Post[] = [
  {
    id: "post-1",
    title: "AI Product Announcement",
    content: "We're launching our new AI-powered workflow automation tools! Automate multi-channel scheduling in seconds. #AI #Automation #Productivity",
    platforms: ["twitter", "linkedin"],
    media: [],
    status: "published",
    scheduledAt: null,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    authorName: "ADITYA CHHIKARA (Admin)",
  },
  {
    id: "post-2",
    title: "Design System Showcase",
    content: "Exploring glassmorphism micro-animations and dark-mode color palettes for web apps. Thoughts on this design? 🎨 #DesignSystem #WebDev",
    platforms: ["instagram", "facebook"],
    media: [],
    status: "scheduled",
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    authorName: "ADITYA CHHIKARA (Editor)",
  },
  {
    id: "post-3",
    title: "Weekly Tech Newsletter Snippet",
    content: "TypeScript 5.7 brings improved type inference and performance wins. Here's our summary of top changes for modern frontend engineers.",
    platforms: ["linkedin", "twitter"],
    media: [],
    status: "scheduled",
    scheduledAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorName: "ADITYA CHHIKARA (Editor)",
  },
];

// Async Thunks
export const fetchPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((res) => setTimeout(res, 300));
      return SEED_POSTS;
    } catch {
      return rejectWithValue("Failed to fetch posts");
    }
  }
);

export const addPostThunk = createAsyncThunk<Post, AddPostPayload, { rejectValue: string }>(
  "posts/addPost",
  async (payload, { rejectWithValue }) => {
    try {
      await new Promise((res) => setTimeout(res, 400));
      const now = new Date().toISOString();
      const newPost: Post = {
        id: `post-${Date.now()}`,
        title: payload.title || "Untitled Post",
        content: payload.content,
        platforms: payload.platforms,
        media: payload.media || [],
        status: payload.status || "draft",
        scheduledAt: payload.scheduledAt || null,
        createdAt: now,
        updatedAt: now,
        authorName: "ADITYA CHHIKARA",
      };
      return newPost;
    } catch {
      return rejectWithValue("Could not add post");
    }
  }
);

export const updatePostThunk = createAsyncThunk<Post, UpdatePostPayload, { rejectValue: string }>(
  "posts/updatePost",
  async (payload, { rejectWithValue }) => {
    try {
      await new Promise((res) => setTimeout(res, 400));
      const now = new Date().toISOString();
      const updatedPost: Post = {
        id: payload.id,
        title: payload.title,
        content: payload.content,
        platforms: payload.platforms,
        media: payload.media || [],
        status: payload.status || "draft",
        scheduledAt: payload.scheduledAt || null,
        createdAt: now,
        updatedAt: now,
        authorName: "ADITYA CHHIKARA",
      };
      return updatedPost;
    } catch {
      return rejectWithValue("Could not update post");
    }
  }
);

export const schedulePostThunk = createAsyncThunk<
  Post,
  { id: string; scheduledAt: string },
  { rejectValue: string; state: RootState }
>("posts/schedulePost", async ({ id, scheduledAt }, { getState, rejectWithValue }) => {
  try {
    await new Promise((res) => setTimeout(res, 300));
    const state = getState();
    const existing = state.posts.entities[id];
    if (!existing) return rejectWithValue("Post not found");

    return {
      ...existing,
      status: "scheduled" as PostStatus,
      scheduledAt,
      updatedAt: new Date().toISOString(),
      authorName: "ADITYA CHHIKARA",
    };
  } catch {
    return rejectWithValue("Failed to schedule post");
  }
});

export const publishPostThunk = createAsyncThunk<
  Post,
  string,
  { rejectValue: string; state: RootState }
>("posts/publishPost", async (id, { getState, rejectWithValue }) => {
  try {
    await new Promise((res) => setTimeout(res, 400));
    const state = getState();
    const existing = state.posts.entities[id];
    if (!existing) return rejectWithValue("Post not found");

    return {
      ...existing,
      status: "published" as PostStatus,
      updatedAt: new Date().toISOString(),
      authorName: "ADITYA CHHIKARA",
    };
  } catch {
    return rejectWithValue("Failed to publish post");
  }
});

export const deletePostThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      await new Promise((res) => setTimeout(res, 300));
      return id;
    } catch {
      return rejectWithValue("Failed to delete post");
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
        state.feedbackMessage = `Post "${action.payload.title}" created!`;
      })
      // Update Post
      .addCase(updatePostThunk.fulfilled, (state, action) => {
        postsAdapter.upsertOne(state, action.payload);
        state.feedbackMessage = `Post updated successfully!`;
      })
      // Schedule Post
      .addCase(schedulePostThunk.fulfilled, (state, action) => {
        postsAdapter.upsertOne(state, action.payload);
        state.feedbackMessage = `Post scheduled for ${new Date(
          action.payload.scheduledAt!
        ).toLocaleString()}`;
      })
      // Publish Post
      .addCase(publishPostThunk.fulfilled, (state, action) => {
        postsAdapter.upsertOne(state, action.payload);
        state.feedbackMessage = `Post published live!`;
      })
      // Delete Post
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload);
        state.feedbackMessage = `Post removed.`;
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
