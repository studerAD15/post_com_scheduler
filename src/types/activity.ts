/**
 * activity.ts - Domain types for System Activity Log & Admin Audit Trail.
 */

import { Role } from "./auth";

export type ActivityActionType = "created" | "edited" | "scheduled" | "published" | "deleted";
export type ActivityTargetType = "draft" | "post";

export interface ActivityLogEntry {
  id: string;
  targetId: string;      // ID of draft or post
  targetType: ActivityTargetType;
  actionType: ActivityActionType;
  userId: string;
  username: string;
  userRole: Role;
  userName: string;
  timestamp: string;     // ISO timestamp string
  summary: string;       // Short human-readable description
  title?: string;        // Title of the target draft/post
}

export interface ActivityState {
  items: ActivityLogEntry[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
