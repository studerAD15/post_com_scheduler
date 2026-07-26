/**
 * ProtectedRoute.tsx - React Router v6 Outlet protection wrapper for RBAC.
 */

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "../../features/auth/authSlice";
import { Role, Permission } from "../../types/auth";
import { useHasRole, usePermission } from "../../features/auth/usePermission";

export interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const hasRole = useHasRole(allowedRoles || ["admin", "editor", "viewer"]);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const hasAccess = usePermission(permission);
  if (!hasAccess) return <>{fallback}</>;
  return <>{children}</>;
};
