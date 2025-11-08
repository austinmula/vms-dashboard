// lib/api/users.ts

import { apiClient } from "./client";

export interface User {
  id: string;
  employeeId: string;
  email: string;
  isActive: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  roles?: Array<{
    id: string;
    name: string;
  }>;
}

export interface CreateUserInput {
  employeeId: string;
  email: string;
  password: string;
  roleIds?: string[];
  mfaEnabled?: boolean;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  mfaEnabled?: boolean;
  isActive?: boolean;
}

export interface ListUsersQuery {
  search?: string;
  role?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface AssignRolesInput {
  roleIds: string[];
}

export const usersApi = {
  // List users with optional filters
  list: async (query?: ListUsersQuery) => {
    const response = await apiClient.get("/api/users", { params: query });
    return response.data;
  },

  // Get single user by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },

  // Create new user
  create: async (data: CreateUserInput) => {
    const response = await apiClient.post("/api/users", data);
    return response.data;
  },

  // Update user
  update: async (id: string, data: UpdateUserInput) => {
    const response = await apiClient.put(`/api/users/${id}`, data);
    return response.data;
  },

  // Deactivate user (soft delete)
  deactivate: async (id: string) => {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  },

  // Assign roles to user
  assignRoles: async (id: string, data: AssignRolesInput) => {
    const response = await apiClient.put(`/api/users/${id}/roles`, data);
    return response.data;
  },

  // Remove role from user
  removeRole: async (userId: string, roleId: string) => {
    const response = await apiClient.delete(`/api/users/${userId}/roles/${roleId}`);
    return response.data;
  },
};
