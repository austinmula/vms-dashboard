// store/slices/organizationsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { organizationsApi } from "../../lib/api/organizations";
import {
  Organization,
  OrganizationWithStats,
  OrganizationStats,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  OrganizationQueryParams,
} from "../../types/organization";
import type { RootState } from "../index";

interface OrganizationsState {
  organizations: Organization[];
  currentOrganization: OrganizationWithStats | null;
  stats: OrganizationStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: OrganizationsState = {
  organizations: [],
  currentOrganization: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Async Thunks

/**
 * Fetch all organizations with optional query params
 */
export const fetchOrganizations = createAsyncThunk(
  "organizations/fetchAll",
  async (params?: OrganizationQueryParams, { rejectWithValue }) => {
    try {
      const response = await organizationsApi.getAll(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch organizations"
      );
    }
  }
);

/**
 * Fetch organization by ID
 */
export const fetchOrganizationById = createAsyncThunk(
  "organizations/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await organizationsApi.getById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch organization"
      );
    }
  }
);

/**
 * Create new organization
 */
export const createOrganization = createAsyncThunk(
  "organizations/create",
  async (data: CreateOrganizationInput, { rejectWithValue }) => {
    try {
      const response = await organizationsApi.create(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create organization"
      );
    }
  }
);

/**
 * Update organization
 */
export const updateOrganization = createAsyncThunk(
  "organizations/update",
  async (
    { id, data }: { id: string; data: UpdateOrganizationInput },
    { rejectWithValue }
  ) => {
    try {
      const response = await organizationsApi.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update organization"
      );
    }
  }
);

/**
 * Delete organization
 */
export const deleteOrganization = createAsyncThunk(
  "organizations/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await organizationsApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete organization"
      );
    }
  }
);

/**
 * Fetch organization statistics
 */
export const fetchOrganizationStats = createAsyncThunk(
  "organizations/fetchStats",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await organizationsApi.getStats(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch organization stats"
      );
    }
  }
);

// Slice

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrganization: (state) => {
      state.currentOrganization = null;
      state.stats = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Organizations
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Organization By ID
    builder
      .addCase(fetchOrganizationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrganization = action.payload;
      })
      .addCase(fetchOrganizationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Organization
    builder
      .addCase(createOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Organization
    builder
      .addCase(updateOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.organizations.findIndex(
          (org) => org.id === action.payload.id
        );
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
        if (state.currentOrganization?.id === action.payload.id) {
          state.currentOrganization = {
            ...state.currentOrganization,
            ...action.payload,
          };
        }
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Organization
    builder
      .addCase(deleteOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = state.organizations.filter(
          (org) => org.id !== action.payload
        );
        state.pagination.total -= 1;
        if (state.currentOrganization?.id === action.payload) {
          state.currentOrganization = null;
        }
      })
      .addCase(deleteOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Organization Stats
    builder
      .addCase(fetchOrganizationStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrganizationStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchOrganizationStats.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentOrganization } =
  organizationsSlice.actions;
export default organizationsSlice.reducer;

// Selectors
export const selectOrganizations = (state: RootState) =>
  state.organizations.organizations;
export const selectCurrentOrganization = (state: RootState) =>
  state.organizations.currentOrganization;
export const selectOrganizationStats = (state: RootState) =>
  state.organizations.stats;
export const selectOrganizationsLoading = (state: RootState) =>
  state.organizations.loading;
export const selectOrganizationsError = (state: RootState) =>
  state.organizations.error;
export const selectOrganizationsPagination = (state: RootState) =>
  state.organizations.pagination;
