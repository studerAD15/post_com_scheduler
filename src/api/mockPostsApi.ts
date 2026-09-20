/**
 * mockPostsApi.ts - Async mock service for Post CRUD operations with Local Storage persistence,
 * artificial network latency, and ApiError error handling.
 */

import { Post, AddPostPayload, UpdatePostPayload } from "../types/post";
import { getStoredPosts, saveStoredPosts } from "../utils/storage";
import { apiClient, ApiError, ApiResponse } from "./apiClient";

const DEFAULT_DELAY_MS = 400;

export const INITIAL_SEED_POSTS: Post[] = [
  {
    id: "post-1",
    title: "AI Product Announcement",
    content:
      "We're launching our new AI-powered workflow automation tools! Automate multi-channel scheduling in seconds. #AI #Automation #Productivity",
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
    content:
      "Exploring glassmorphism micro-animations and dark-mode color palettes for web apps. Thoughts on this design? 🎨 #DesignSystem #WebDev",
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
    content:
      "TypeScript 5.7 brings improved type inference and performance wins. Here's our summary of top changes for modern frontend engineers.",
    platforms: ["linkedin", "twitter"],
    media: [],
    status: "scheduled",
    scheduledAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorName: "ADITYA CHHIKARA (Editor)",
  },
];

function delay(ms: number = DEFAULT_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockPostsApi = {
  /**
   * Fetches posts from Spring Boot backend (with localStorage fallback).
   */
  async fetchPosts(): Promise<Post[]> {
    try {
      const res = await apiClient.get<ApiResponse<Post[]>>("/posts");
      if (res?.data) {
        saveStoredPosts(res.data);
        return res.data;
      }
      const stored = getStoredPosts();
      return stored.length > 0 ? stored : INITIAL_SEED_POSTS;
    } catch {
      const stored = getStoredPosts();
      return stored.length > 0 ? stored : INITIAL_SEED_POSTS;
    }
  },

  /**
   * Creates a new post and persists to backend database (or localStorage if offline).
   */
  async createPost(payload: AddPostPayload): Promise<Post> {
    try {
      const res = await apiClient.post<ApiResponse<Post>>("/posts", payload);
      return res.data;
    } catch (err) {
      const isNetwork =
        (err instanceof ApiError && (err.status === 0 || err.statusText === "NetworkError")) ||
        (err instanceof Error && err.message.includes("Failed to fetch"));
      if (isNetwork) {
        const posts = getStoredPosts();
        const now = new Date().toISOString();
        const newPost: Post = {
          ...payload,
          media: payload.media || [],
          status: payload.status || "draft",
          scheduledAt: payload.scheduledAt || null,
          id: `post-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        saveStoredPosts([newPost, ...posts]);
        return newPost;
      }
      throw err;
    }
  },

  /**
   * Updates an existing post in backend database (or localStorage if offline).
   */
  async updatePost(payload: UpdatePostPayload): Promise<Post> {
    try {
      const res = await apiClient.put<ApiResponse<Post>>(`/posts/${payload.id}`, payload);
      return res.data;
    } catch (err) {
      const isNetwork =
        (err instanceof ApiError && (err.status === 0 || err.statusText === "NetworkError")) ||
        (err instanceof Error && err.message.includes("Failed to fetch"));
      if (isNetwork) {
        const posts = getStoredPosts();
        const existing = posts.find((p) => p.id === payload.id);
        if (!existing) throw err;
        const updatedPost: Post = {
          ...existing,
          ...payload,
          updatedAt: new Date().toISOString(),
        };
        saveStoredPosts(posts.map((p) => (p.id === payload.id ? updatedPost : p)));
        return updatedPost;
      }
      throw err;
    }
  },

  /**
   * Schedules a post to a specific ISO date/time.
   */
  async schedulePost(id: string, scheduledAt: string): Promise<Post> {
    try {
      const res = await apiClient.patch<ApiResponse<Post>>(`/posts/${id}/schedule`, { scheduledAt });
      return res.data;
    } catch (err) {
      const isNetwork =
        (err instanceof ApiError && (err.status === 0 || err.statusText === "NetworkError")) ||
        (err instanceof Error && err.message.includes("Failed to fetch"));
      if (isNetwork) {
        const posts = getStoredPosts();
        const existing = posts.find((p) => p.id === id);
        if (!existing) throw err;
        const updatedPost: Post = {
          ...existing,
          status: "scheduled",
          scheduledAt,
          updatedAt: new Date().toISOString(),
        };
        saveStoredPosts(posts.map((p) => (p.id === id ? updatedPost : p)));
        return updatedPost;
      }
      throw err;
    }
  },

  /**
   * Marks a post as published live.
   */
  async publishPost(id: string): Promise<Post> {
    try {
      const res = await apiClient.patch<ApiResponse<Post>>(`/posts/${id}/publish`);
      return res.data;
    } catch (err) {
      const isNetwork =
        (err instanceof ApiError && (err.status === 0 || err.statusText === "NetworkError")) ||
        (err instanceof Error && err.message.includes("Failed to fetch"));
      if (isNetwork) {
        const posts = getStoredPosts();
        const existing = posts.find((p) => p.id === id);
        if (!existing) throw err;
        const updatedPost: Post = {
          ...existing,
          status: "published",
          updatedAt: new Date().toISOString(),
        };
        saveStoredPosts(posts.map((p) => (p.id === id ? updatedPost : p)));
        return updatedPost;
      }
      throw err;
    }
  },

  /**
   * Deletes a post from backend database.
   */
  async deletePost(id: string): Promise<string> {
    try {
      await apiClient.delete<ApiResponse<void>>(`/posts/${id}`);
      return id;
    } catch (err) {
      const isNetwork =
        (err instanceof ApiError && (err.status === 0 || err.statusText === "NetworkError")) ||
        (err instanceof Error && err.message.includes("Failed to fetch"));
      if (isNetwork) {
        const posts = getStoredPosts();
        saveStoredPosts(posts.filter((p) => p.id !== id));
        return id;
      }
      throw err;
    }
  },

  /**
   * Resets posts to default seed values.
   */
  async resetToDefaults(): Promise<Post[]> {
    return await this.fetchPosts();
  },
};
