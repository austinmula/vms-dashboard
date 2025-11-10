// hooks/useAuth.ts

import { useSelector, useDispatch } from "react-redux";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectRoles,
  selectPermissions,
  selectAccessToken,
  logout as logoutAction,
} from "@/store/slices/authSlice";
import { authApi } from "@/lib/api/client";

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const roles = useSelector(selectRoles);
  const permissions = useSelector(selectPermissions);
  const accessToken = useSelector(selectAccessToken);

  const logout = async () => {
    try {
      // Call your API logout endpoint
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear Redux state
      dispatch(logoutAction());
      // Sign out from NextAuth
      await nextAuthSignOut({ redirect: false });
      // Redirect to login
      window.location.href = "/auth/login";
    }
  };

  return {
    user,
    roles,
    permissions,
    isAuthenticated,
    isLoading,
    accessToken,
    logout,
  };
}
