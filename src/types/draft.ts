/**
 * draft.ts - Domain types for draft management & reducer actions.
 */

import { PlatformId } from "./platform";
import { MediaAttachment, PostStatus } from "./post";

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
