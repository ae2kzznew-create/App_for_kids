import { Appearance } from "react-native";

const lightColors = {
  canvas: "#F7F5F0",
  surface: "#FFFFFF",
  soft: "#EEEAE2",
  text: "#1C1C1E",
  muted: "#77736C",
  border: "#DED9CF",
  blue: "#1A6FE8",
  blueSoft: "#E7F0FD",
  green: "#3F8F66",
  greenSoft: "#E7F2EB",
  orange: "#C77A35",
  orangeSoft: "#F8EBDD",
  red: "#C95B50",
} as const;

const darkColors = {
  canvas: "#121416",
  surface: "#1B1F24",
  soft: "#2A2F36",
  text: "#F7F5F0",
  muted: "#B4ADA2",
  border: "#363C45",
  blue: "#6EA8FF",
  blueSoft: "#1B2C47",
  green: "#67B88B",
  greenSoft: "#193326",
  orange: "#D79A58",
  orangeSoft: "#38281B",
  red: "#E3847B",
} as const;

const isDark = Appearance.getColorScheme() === "dark";

export const theme = {
  mode: isDark ? "dark" : "light",
  isDark,
  colors: isDark ? darkColors : lightColors,
  radius: { small: 8, medium: 12, large: 18 },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
} as const;
