// store/slices/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthData, Tokens } from "../../types";
import type { RootState } from "../index";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  roles: [],
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthData>) => {
      const { user, tokens } = action.payload;

      state.user = {
        id: user.id,
        email: user.email,
        employeeId: user.employeeId,
        firstName: user.employee?.firstName || "",
        lastName: user.employee?.lastName || "",
        fullName: `${user.employee?.firstName || ""} ${
          user.employee?.lastName || ""
        }`.trim(),
        department: user.employee?.department || "",
        jobTitle: user.employee?.jobTitle || "",
        isActive: user.isActive,
        mfaEnabled: user.mfaEnabled,
        mustChangePassword: user.mustChangePassword,
      };

      state.roles = user.roles || [];
      state.permissions = user.permissions || [];
      state.accessToken = tokens.accessToken;
      state.refreshToken = tokens.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Store tokens in localStorage for API client
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      }
    },

    updateTokens: (state, action: PayloadAction<Tokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.roles = [];
      state.permissions = [];
      state.isAuthenticated = false;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, updateTokens, logout, setLoading } =
  authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectRoles = (state: RootState) => state.auth.roles;
export const selectPermissions = (state: RootState) => state.auth.permissions;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
