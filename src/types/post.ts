/**
 * post.ts - Domain types for media attachments, post entities, and validation outputs.
 */

import { PlatformId } from "./platform";

export type PostStatus = "draft" | "scheduled" | "published";

export interface MediaAttachment {
  id: string;
  name: string;
  type: string; // MIME type e.g. "image/jpeg"
  size: number; // bytes
  url: string;  // preview data URL or mock URL
}

export type WarningState = "safe" | "warning" | "over-limit";

export interface ValidationResult {
  platformId: PlatformId;
  isValid: boolean;
  charCount: number;
  maxChars: number;
  remainingChars: number;
  charPercentage: number;
  warningState: WarningState;
  hashtagCount: number;
  maxHashtags: number;
  errors: string[];
  warnings: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  platforms: PlatformId[];
  media: MediaAttachment[];
  status: PostStatus;
  scheduledAt: string | null; // ISO string
  createdAt: string;         // ISO string
  updatedAt: string;         // ISO string
  authorId?: string;
  authorName?: string;
  authorRole?: string;
}

export interface AddPostPayload {
  title: string;
  content: string;
  platforms: PlatformId[];
  media?: MediaAttachment[];
  status?: PostStatus;
  scheduledAt?: string | null;
  authorId?: string;
  authorName?: string;
  authorRole?: string;
}

export interface UpdatePostPayload extends AddPostPayload {
  id: string;
}
