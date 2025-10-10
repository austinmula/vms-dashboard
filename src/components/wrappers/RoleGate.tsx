// components/RoleGate.js

import { usePermissions } from "@/hooks/usePermissions";
import React from "react";

export function RoleGate({
  children,
  allowedRoles = [],
  fallback = null,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}) {
  const { hasRole } = usePermissions();

  const hasAccess = allowedRoles.some((role) => hasRole(role));

  if (!hasAccess) {
    return fallback;
  }

  return children;
}
