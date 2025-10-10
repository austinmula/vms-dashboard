// components/PermissionGate.js

import { usePermissions } from "@/hooks/usePermissions";
import React from "react";

export function PermissionGate({
  children,
  permission,
  permissions,
  requireAll = true,
  fallback = null,
}: {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } =
    usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return fallback;
  }

  return children;
}
