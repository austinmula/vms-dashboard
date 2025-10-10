"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme as antdTheme, Button, Flex } from "antd";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { useSession } from "next-auth/react";
import { store } from "@/store";
import { useAppDispatch } from "@/hooks/redux";
import { setCredentials, logout, setLoading } from "@/store/slices/authSlice";

// Shape of the theme context
interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within <Providers>");
  return ctx;
};

// AuthSync component to sync NextAuth session with Redux
function AuthSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "loading") {
      dispatch(setLoading(true));
      return;
    }

    if (status === "authenticated" && session?.user) {
      // Sync NextAuth session to Redux
      dispatch(
        setCredentials({
          user: {
            id: session.user.id,
            email: session.user.email,
            employeeId: session.user.employeeId,
            employee: {
              firstName: session.user.firstName,
              lastName: session.user.lastName,
              department: session.user.department,
              jobTitle: session.user.jobTitle,
            },
            roles: session.user.roles,
            isActive: session.user.isActive,
            mfaEnabled: session.user.mfaEnabled,
            mustChangePassword: session.user.mustChangePassword,
          },
          tokens: {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            expiresIn: "24h", // Default value since session.expires is a date
          },
          permissions: session.user.permissions,
        })
      );
    } else if (status === "unauthenticated") {
      dispatch(logout());
    }
  }, [session, status, dispatch]);

  return null;
}

// Persist preference key
const STORAGE_KEY = "color-scheme";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  // Load persisted preference or system preference on mount
  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "dark") {
      setIsDark(true);
      return;
    }
    if (stored === "light") {
      setIsDark(false);
      return;
    }
    // fallback to system
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDark(true);
    }
  }, []);

  // Reflect current mode as an attribute so CSS can react immediately
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      } catch {}
      return next;
    });
  };

  // Merge tokens / algorithms
  const themeConfig = useMemo(
    () => ({
      algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: "#52c41a",
        borderRadius: 16,
        colorBgBase: isDark ? "#0f1419" : "#ffffff",
        colorBgLayout: isDark ? "#0f1419" : "#f5f7fa",
        colorBgContainer: isDark ? "#1b232c" : "#ffffff",
        colorBorder: isDark ? "#32414f" : "#d9dfe5",
        colorText: isDark ? "#e6ecf1" : "#1d2126",
        colorTextSecondary: isDark ? "#92a2b2" : "#5b6570",
        boxShadow: isDark
          ? "0 2px 4px rgba(0,0,0,0.7), 0 6px 18px rgba(0,0,0,0.55)"
          : "0 2px 4px rgba(0,0,0,0.06), 0 6px 18px rgba(0,0,0,0.04)",
      },
      components: {
        Card: {
          colorBgContainer: isDark ? "#1b232c" : "#ffffff",
          boxShadowTertiary: isDark
            ? "0 1px 2px rgba(0,0,0,0.65)"
            : "0 1px 2px rgba(0,0,0,0.08)",
        },
        Layout: {
          bodyBg: isDark ? "#0f1419" : "#f5f7fa",
          headerBg: isDark ? "#1b232c" : "#ffffff",
          footerBg: isDark ? "#1b232c" : "#ffffff",
        },
        Menu: {
          colorItemBg: "transparent",
          colorItemBgSelected: isDark ? "#242f3a" : "#e6f4ff",
        },
      },
    }),
    [isDark]
  );

  // Optional top-right toggle button overlay
  const Toggle = (
    <Flex style={{ position: "fixed", top: 12, right: 12, zIndex: 1000 }}>
      <Button
        size="small"
        onClick={toggleTheme}
        aria-label="Toggle color scheme"
      >
        {isDark ? "Light" : "Dark"} Mode
      </Button>
    </Flex>
  );

  return (
    <Provider store={store}>
      <SessionProvider>
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
          <AntdRegistry>
            <ConfigProvider theme={themeConfig}>
              <AuthSync />
              {Toggle}
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </ThemeContext.Provider>
      </SessionProvider>
    </Provider>
  );
};
