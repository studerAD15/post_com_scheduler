/**
 * auth.ts - Domain types for Authentication, JWT payloads, and RBAC permissions.
 */

export type Role = "admin" | "editor" | "viewer";

export type Permission =
  | "create_post"
  | "edit_post"
  | "delete_post"
  | "schedule_post"
  | "publish_post"
  | "manage_drafts"
  | "view_analytics"
  | "manage_users";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface DecodedToken {
  sub: string;        // user id
  username: string;
  name: string;
  email: string;
  role: Role;
  iat: number;        // issued at timestamp (seconds)
  exp: number;        // expiration timestamp (seconds)
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
