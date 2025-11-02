// lib/rbac/permissions.js

// Map your API roles to display-friendly names
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
  VISITOR: "visitor",
};

type Role = {
  id: string;
  name: string;
  displayName: string;
};

export const PERMISSIONS = {
  // User management
  VIEW_USERS: "view_users",
  CREATE_USER: "create_user",
  EDIT_USER: "edit_user",
  DELETE_USER: "delete_user",

  // Employee management
  VIEW_EMPLOYEES: "view_employees",
  CREATE_EMPLOYEE: "create_employee",
  EDIT_EMPLOYEE: "edit_employee",
  DELETE_EMPLOYEE: "delete_employee",

  // Visitor management
  VIEW_VISITORS: "view_visitors",
  CREATE_VISITOR: "create_visitor",
  EDIT_VISITOR: "edit_visitor",
  DELETE_VISITOR: "delete_visitor",

  // System settings
  VIEW_SETTINGS: "view_settings",
  EDIT_SETTINGS: "edit_settings",
  MANAGE_ROLES: "manage_roles",

  // Reports
  VIEW_REPORTS: "view_reports",
  EXPORT_REPORTS: "export_reports",

  //Organization management
  ORGANIZATIONS_READ: "organizations_read",
  ORGANIZATIONS_CREATE: "organizations_create",
  ORGANIZATIONS_UPDATE: "organizations_update",
  ORGANIZATIONS_DELETE: "organizations_delete",
};

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS), // All permissions

  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.CREATE_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.VIEW_VISITORS,
    PERMISSIONS.CREATE_VISITOR,
    PERMISSIONS.EDIT_VISITOR,
    PERMISSIONS.DELETE_VISITOR,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
  ],

  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.VIEW_VISITORS,
    PERMISSIONS.CREATE_VISITOR,
    PERMISSIONS.EDIT_VISITOR,
    PERMISSIONS.VIEW_REPORTS,
  ],

  [ROLES.EMPLOYEE]: [PERMISSIONS.VIEW_VISITORS, PERMISSIONS.CREATE_VISITOR],

  [ROLES.VISITOR]: [PERMISSIONS.VIEW_VISITORS],
};

// Helper function to get permissions for a user's roles
export const getUserPermissions = (roles: Role[]): string[] => {
  if (!roles || !Array.isArray(roles)) return [];

  const allPermissions = new Set<string>();

  roles.forEach((role) => {
    const roleName = typeof role === "string" ? role : role.name;
    const permissions = ROLE_PERMISSIONS[roleName] || [];
    permissions.forEach((permission) => allPermissions.add(permission));
  });

  return Array.from(allPermissions);
};

// Check if user has specific permission
export const hasPermission = (
  userPermissions: string[],
  permission: string
) => {
  return userPermissions.includes(permission);
};

// Check if user has all specified permissions
export const hasAllPermissions = (
  userPermissions: string[],
  permissions: string[]
) => {
  return permissions.every((permission) =>
    userPermissions.includes(permission)
  );
};

// Check if user has any of the specified permissions
export const hasAnyPermission = (
  userPermissions: string[],
  permissions: string[]
) => {
  return permissions.some((permission) => userPermissions.includes(permission));
};

// Check if user has specific role
export const hasRole = (userRoles: Role[], role: string) => {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  return userRoles.some((r) => {
    const roleName = typeof r === "string" ? r : r.name;
    return roleName === role;
  });
};
