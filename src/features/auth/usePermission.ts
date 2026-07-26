/**
 * usePermission.ts - Custom typed hook for Role-Based Access Control (RBAC).
 */

import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "./authSlice";
import { Permission, Role } from "../../types/auth";

export const PERMISSION_MATRIX: Record<Role, Permission[]> = {
  admin: [
    "create_post",
    "edit_post",
    "delete_post",
    "schedule_post",
    "publish_post",
    "manage_drafts",
    "view_analytics",
    "manage_users",
  ],
  editor: [
    "create_post",
    "edit_post",
    "schedule_post",
    "publish_post",
    "manage_drafts",
    "view_analytics",
  ],
  viewer: ["view_analytics"],
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
