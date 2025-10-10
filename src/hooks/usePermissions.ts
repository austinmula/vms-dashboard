// hooks/usePermissions.js

import { useSelector } from "react-redux";
import { selectPermissions, selectRoles } from "@/store/slices/authSlice";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasRole,
} from "@/lib/rbac/permissions";

export function usePermissions() {
  const permissions = useSelector(selectPermissions);
  const roles = useSelector(selectRoles);

  return {
    permissions,
    roles,
    hasPermission: (permission: string) => hasPermission(permissions, permission),
    hasAllPermissions: (perms: string[]) => hasAllPermissions(permissions, perms),
    hasAnyPermission: (perms: string[]) => hasAnyPermission(permissions, perms),
    hasRole: (role: string) => hasRole(roles, role),
  };
}
