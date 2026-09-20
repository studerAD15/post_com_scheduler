/**
 * usePermission.ts - Client-Side Role-Based Access Control (RBAC) System.
 *
 * This file defines the frontend authorization rules that mirror the Spring Boot backend
 * authorities assigned in `JwtAuthFilter.java`.
 *
 * ROLE RESPONSIBILITIES:
 * 1. ADMIN (Security, Audit & Governance):
 *    - Has exclusive access to the Security Activity Log (`view_activity_log`).
 *    - Can inspect user revision history on drafts (`view_draft_audit`).
 *    - Has full access to telemetry & analytics boards (`view_analytics`).
 *    - EXPLICITLY RESTRICTED: Admin cannot create, edit, schedule, publish, or delete posts.
 *
 * 2. EDITOR (Content Creator & Lifecycle Manager):
 *    - The exclusive role authorized to create, compose, edit, schedule, publish, and delete posts.
 *    - Can create, update, and manage drafts.
 *
 * 3. VIEWER (Read-Only Observer):
 *    - Read-only observer with access to view published posts, saved drafts, and analytics.
 *    - Mutating buttons and composer navigation are automatically disabled or hidden.
 */

import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "./authSlice";
import { Permission, Role } from "../../types/auth";

export const PERMISSION_MATRIX: Record<Role, Permission[]> = {
  // Admin: Focuses on security, user audit logs, and analytics. No post creation/mutations.
  admin: [
    "manage_drafts",
    "view_drafts",
    "view_analytics",
    "manage_users",
    "view_draft_audit",
    "view_activity_log",
  ],
  // Editor: Exclusive owner of post creation and publishing lifecycle.
  editor: [
    "create_post",
    "edit_post",
    "delete_post",
    "schedule_post",
    "publish_post",
    "manage_drafts",
    "view_drafts",
    "view_analytics",
  ],
  // Viewer: Read-only access to drafts and analytics.
  viewer: ["view_drafts", "view_analytics"],
};

/**
 * Checks if current authenticated user has a specific permission.
 */
export function usePermission(permission: Permission): boolean {
  const user = useAppSelector(selectCurrentUser);
  if (!user || !(user.role in PERMISSION_MATRIX)) return false;
  const userPermissions = PERMISSION_MATRIX[user.role as Role] || [];
  return userPermissions.includes(permission);
}

/**
 * Checks if current user possesses any of the required roles.
 */
export function useHasRole(allowedRoles: Role[]): boolean {
  const user = useAppSelector(selectCurrentUser);
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
