// lib/api/permissions.ts

import { apiClient } from "./client";

export interface Permission {
  id: string;
  name: string;
  slug: string;
  resource: string;
  action: string;
  description?: string;
  isSystemPermission: boolean;
  createdAt: string;
  roleCount?: number;
  roles?: PermissionRole[];
}

export interface PermissionRole {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
}

export interface CreatePermissionInput {
  name: string;
  slug: string;
  resource: string;
  action: string;
  description?: string;
  isSystemPermission?: boolean;
}

export interface UpdatePermissionInput {
  name?: string;
  description?: string;
}

export interface ListPermissionsQuery {
  search?: string;
  resource?: string;
  action?: string;
  isSystemPermission?: boolean;
  limit?: number;
  offset?: number;
}

export const permissionsApi = {
  /**
   * List all permissions with optional filtering
   */
  list: async (query?: ListPermissionsQuery) => {
    const response = await apiClient.get("/api/permissions", { params: query });
    return response.data;
  },

  /**
   * Create a new permission
   */
  create: async (data: CreatePermissionInput) => {
    const response = await apiClient.post("/api/permissions", data);
    return response.data;
  },

  /**
   * Get permission details by ID
   */
  getById: async (id: string) => {
    const response = await apiClient.get(`/api/permissions/${id}`);
    return response.data;
  },

  /**
   * Update permission details
   */
  update: async (id: string, data: UpdatePermissionInput) => {
    const response = await apiClient.put(`/api/permissions/${id}`, data);
    return response.data;
  },

  /**
   * Delete a permission
   */
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/permissions/${id}`);
    return response.data;
  },

  /**
   * Get list of available resources
   */
  getResources: async () => {
    const response = await apiClient.get("/api/permissions/resources");
    return response.data;
  },

  /**
   * Get list of available actions
   */
  getActions: async () => {
    const response = await apiClient.get("/api/permissions/actions");
    return response.data;
  },
};
