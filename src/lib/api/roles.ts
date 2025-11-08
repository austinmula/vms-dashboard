// lib/api/roles.ts

import { apiClient } from "./client";

export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  organizationId: string;
  isSystemRole: boolean;
  isActive: boolean;
  priority: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
  permissionCount?: number;
  userCount?: number;
}

export interface Permission {
  id: string;
  name: string;
  slug: string;
  resource: string;
  action: string;
  description?: string;
  isSystemPermission: boolean;
  createdAt: string;
}

export interface CreateRoleInput {
  name: string;
  slug: string;
  description?: string;
  organizationId: string;
  isSystemRole?: boolean;
  permissionIds?: string[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface ListRolesQuery {
  search?: string;
  isActive?: boolean;
  isSystemRole?: boolean;
  organizationId?: string;
  limit?: number;
  offset?: number;
}

export interface AssignPermissionsInput {
  permissionIds: string[];
}

export interface RoleUser {
  id: string;
  email: string;
  isActive: boolean;
  assignedAt: string;
}

export const rolesApi = {
  /**
   * List all roles with optional filtering
   */
  list: async (query?: ListRolesQuery) => {
    const response = await apiClient.get("/api/roles", { params: query });
    return response.data;
  },

  /**
   * Create a new role
   */
  create: async (data: CreateRoleInput) => {
    const response = await apiClient.post("/api/roles", data);
    return response.data;
  },

  /**
   * Get role details by ID
   */
  getById: async (id: string) => {
    const response = await apiClient.get(`/api/roles/${id}`);
    return response.data;
  },

  /**
   * Update role details
   */
  update: async (id: string, data: UpdateRoleInput) => {
    const response = await apiClient.put(`/api/roles/${id}`, data);
    return response.data;
  },

  /**
   * Delete a role (soft delete)
   */
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/roles/${id}`);
    return response.data;
  },

  /**
   * Assign permissions to a role
   */
  assignPermissions: async (id: string, data: AssignPermissionsInput) => {
    const response = await apiClient.put(`/api/roles/${id}/permissions`, data);
    return response.data;
  },

  /**
   * Remove a permission from a role
   */
  removePermission: async (id: string, permissionId: string) => {
    const response = await apiClient.delete(
      `/api/roles/${id}/permissions/${permissionId}`
    );
    return response.data;
  },

  /**
   * Get all users assigned to a specific role
   */
  getRoleUsers: async (id: string) => {
    const response = await apiClient.get(`/api/roles/${id}/users`);
    return response.data;
  },
};
