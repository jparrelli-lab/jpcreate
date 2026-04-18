import { useColorScheme } from "react-native";

export const light = {
  bgApp: "#f4f4f8",
  bgCard: "#ffffff",
  textPrimary: "#111118",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  inputBg: "#f9fafb",
  primary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  tabBar: "#1e1e2e",
};

export const dark = {
  bgApp: "#0f0f17",
  bgCard: "#1a1a2e",
  textPrimary: "#f0f0f8",
  textMuted: "#8888a8",
  border: "#2a2a3e",
  inputBg: "#16162a",
  primary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  tabBar: "#1e1e2e",
};

export type Theme = typeof light;

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === "dark" ? dark : light;
}

// Category accent colors
export const CATEGORY_COLORS: Record<string, string> = {
  slate: "#64748b",
  amber: "#f59e0b",
  blue: "#3b82f6",
  purple: "#a855f7",
  pink: "#ec4899",
  red: "#ef4444",
  yellow: "#eab308",
  indigo: "#6366f1",
  teal: "#14b8a6",
  emerald: "#10b981",
};
