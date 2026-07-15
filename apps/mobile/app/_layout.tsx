import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DatabaseProvider } from "../src/storage/DatabaseProvider";
import { theme } from "../src/theme";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.canvas } }} />
    </DatabaseProvider>
  );
}
