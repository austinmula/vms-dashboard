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
  // System admin
  SYSTEM_ADMIN: "system:admin",

  // User management
  USERS_READ: "users:read",
  USERS_CREATE: "users:create",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",
  USERS_ASSIGN_ROLES: "users:assign-roles",

  // Organization management
  ORGANIZATIONS_READ: "organizations:read",
  ORGANIZATIONS_CREATE: "organizations:create",
  ORGANIZATIONS_UPDATE: "organizations:update",
  ORGANIZATIONS_DELETE: "organizations:delete",

  // Visitor management
  VISITORS_READ: "visitors:read",
  VISITORS_CREATE: "visitors:create",
  VISITORS_UPDATE: "visitors:update",
  VISITORS_DELETE: "visitors:delete",

  // Visit management
  VISITS_MANAGE: "visits:manage",
  VISITS_CHECKIN: "visits:checkin",
};

// Role-based permissions mapping
// NOTE: This is now handled by the backend. These mappings are kept for reference only.
// The actual permissions come from the backend in the login response.
// These values now match the backend permission format (resource:action)
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_ASSIGN_ROLES,
    PERMISSIONS.ORGANIZATIONS_READ,
    PERMISSIONS.ORGANIZATIONS_CREATE,
    PERMISSIONS.ORGANIZATIONS_UPDATE,
    PERMISSIONS.ORGANIZATIONS_DELETE,
    PERMISSIONS.VISITORS_READ,
    PERMISSIONS.VISITORS_CREATE,
    PERMISSIONS.VISITORS_UPDATE,
    PERMISSIONS.VISITORS_DELETE,
    PERMISSIONS.VISITS_MANAGE,
    PERMISSIONS.VISITS_CHECKIN,
  ],

  [ROLES.ADMIN]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.ORGANIZATIONS_READ,
    PERMISSIONS.ORGANIZATIONS_CREATE,
    PERMISSIONS.ORGANIZATIONS_UPDATE,
    PERMISSIONS.VISITORS_READ,
    PERMISSIONS.VISITORS_CREATE,
    PERMISSIONS.VISITORS_UPDATE,
    PERMISSIONS.VISITORS_DELETE,
    PERMISSIONS.VISITS_MANAGE,
    PERMISSIONS.VISITS_CHECKIN,
  ],

  [ROLES.MANAGER]: [
    PERMISSIONS.VISITORS_READ,
    PERMISSIONS.VISITORS_CREATE,
    PERMISSIONS.VISITORS_UPDATE,
    PERMISSIONS.VISITS_MANAGE,
    PERMISSIONS.VISITS_CHECKIN,
  ],

  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VISITORS_READ,
    PERMISSIONS.VISITORS_CREATE,
    PERMISSIONS.VISITS_CHECKIN,
  ],

  [ROLES.VISITOR]: [PERMISSIONS.VISITORS_READ],
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
