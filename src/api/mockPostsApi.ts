/**
 * mockPostsApi.ts - Async mock service for Post CRUD operations with Local Storage persistence,
 * artificial network latency, and ApiError error handling.
 */

import { Post, AddPostPayload, UpdatePostPayload } from "../types/post";
import { getStoredPosts, saveStoredPosts } from "../utils/storage";
import { ApiError } from "./apiClient";

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
   * Fetches posts from Local Storage (seeds defaults if empty).
   */
  async fetchPosts(): Promise<Post[]> {
    await delay(300);
    let posts = getStoredPosts();
    if (posts.length === 0) {
      posts = INITIAL_SEED_POSTS;
      saveStoredPosts(posts);
    }
    return posts;
  },

  /**
   * Creates a new post and persists to Local Storage.
   */
  async createPost(payload: AddPostPayload): Promise<Post> {
    await delay(400);

    if (!payload.content || payload.content.trim().length === 0) {
      throw new ApiError(400, "Bad Request", "Post content cannot be empty.");
    }
    if (!payload.platforms || payload.platforms.length === 0) {
      throw new ApiError(400, "Bad Request", "At least one target platform must be selected.");
    }

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

    const current = await this.fetchPosts();
    const updated = [newPost, ...current];
    const success = saveStoredPosts(updated);

    if (!success) {
      throw new ApiError(507, "Insufficient Storage", "Failed to save post to Local Storage.");
    }

    return newPost;
  },

  /**
   * Updates an existing post in Local Storage.
   */
  async updatePost(payload: UpdatePostPayload): Promise<Post> {
    await delay(400);

    const current = await this.fetchPosts();
    const index = current.findIndex((p) => p.id === payload.id);

    if (index === -1) {
      throw new ApiError(404, "Not Found", `Post with ID "${payload.id}" was not found.`);
    }

    const updatedPost: Post = {
      ...current[index],
      title: payload.title,
      content: payload.content,
      platforms: payload.platforms,
      media: payload.media || [],
      status: payload.status || current[index].status,
      scheduledAt: payload.scheduledAt !== undefined ? payload.scheduledAt : current[index].scheduledAt,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedPost;
    saveStoredPosts(current);

    return updatedPost;
  },

  /**
   * Schedules a post to a specific ISO date/time.
   */
  async schedulePost(id: string, scheduledAt: string): Promise<Post> {
    await delay(300);

    const current = await this.fetchPosts();
    const index = current.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new ApiError(404, "Not Found", `Post with ID "${id}" was not found for scheduling.`);
    }

    const scheduledPost: Post = {
      ...current[index],
      status: "scheduled",
      scheduledAt,
      updatedAt: new Date().toISOString(),
    };

    current[index] = scheduledPost;
    saveStoredPosts(current);

    return scheduledPost;
  },

  /**
   * Marks a post as published live.
   */
  async publishPost(id: string): Promise<Post> {
    await delay(400);

    const current = await this.fetchPosts();
    const index = current.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new ApiError(404, "Not Found", `Post with ID "${id}" was not found for publishing.`);
    }

    const publishedPost: Post = {
      ...current[index],
      status: "published",
      updatedAt: new Date().toISOString(),
    };

    current[index] = publishedPost;
    saveStoredPosts(current);

    return publishedPost;
  },

  /**
   * Deletes a post from Local Storage.
   */
  async deletePost(id: string): Promise<string> {
    await delay(300);

    const current = await this.fetchPosts();
    const filtered = current.filter((p) => p.id !== id);

    if (filtered.length === current.length) {
      throw new ApiError(404, "Not Found", `Post with ID "${id}" does not exist.`);
    }

    saveStoredPosts(filtered);
    return id;
  },

  /**
   * Resets posts to default seed values.
   */
  async resetToDefaults(): Promise<Post[]> {
    await delay(200);
    saveStoredPosts(INITIAL_SEED_POSTS);
    return INITIAL_SEED_POSTS;
  },
};
