// lib/api/organizations.ts

import { apiClient } from "./client";
import {
  Organization,
  OrganizationWithStats,
  OrganizationStats,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  OrganizationQueryParams,
  OrganizationListResponse,
} from "../../types/organization";
import { ApiResponse } from "../../types";

/**
 * Organizations API client
 */
export const organizationsApi = {
  /**
   * Get all organizations with filtering and pagination
   */
  getAll: async (
    params?: OrganizationQueryParams
  ): Promise<OrganizationListResponse> => {
    const response = await apiClient.get<OrganizationListResponse>(
      "/api/organizations",
      { params }
    );
    return response.data;
  },

  /**
   * Get organization by ID
   */
  getById: async (id: string): Promise<ApiResponse<OrganizationWithStats>> => {
    const response = await apiClient.get<ApiResponse<OrganizationWithStats>>(
      `/api/organizations/${id}`
    );
    return response.data;
  },

  /**
   * Create a new organization
   */
  create: async (
    data: CreateOrganizationInput
  ): Promise<ApiResponse<Organization>> => {
    const response = await apiClient.post<ApiResponse<Organization>>(
      "/api/organizations",
      data
    );
    return response.data;
  },

  /**
   * Update organization
   */
  update: async (
    id: string,
    data: UpdateOrganizationInput
  ): Promise<ApiResponse<Organization>> => {
    const response = await apiClient.put<ApiResponse<Organization>>(
      `/api/organizations/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete organization (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/organizations/${id}`);
  },

  /**
   * Get organization statistics
   */
  getStats: async (id: string): Promise<ApiResponse<OrganizationStats>> => {
    const response = await apiClient.get<ApiResponse<OrganizationStats>>(
      `/api/organizations/${id}/stats`
    );
    return response.data;
  },
};
