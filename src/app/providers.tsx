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
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <AntdRegistry>
        <ConfigProvider theme={themeConfig}>
          {Toggle}
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </ThemeContext.Provider>
  );
};
