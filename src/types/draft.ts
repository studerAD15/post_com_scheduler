/**
 * draft.ts - Domain types for draft management & reducer actions.
 */

import { PlatformId } from "./platform";
import { MediaAttachment, PostStatus } from "./post";

export interface DraftAuditLogEntry {
  id: string;
  userId: string;
  username: string;
  name: string;
  role: string;
  action: "created" | "updated" | "scheduled" | "status_change";
  timestamp: string;
  changesSummary: string;
}

export interface Draft {
  id: string;
  title: string;
  content: string;
  platforms: PlatformId[];
  media: MediaAttachment[];
  status: PostStatus;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  authorName?: string;
  authorRole?: string;
  auditTrail?: DraftAuditLogEntry[];
}

export type DraftAction =
  | { type: "SET_DRAFTS"; payload: Draft[] }
  | { type: "ADD_DRAFT"; payload: Draft }
  | { type: "UPDATE_DRAFT"; payload: Draft }
  | { type: "DELETE_DRAFT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

export interface DraftState {
  drafts: Draft[];
  isLoading: boolean;
  error: string | null;
}
