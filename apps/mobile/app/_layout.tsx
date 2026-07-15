import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PersonalAppProvider } from "../src/application/PersonalAppProvider";
import { DatabaseProvider } from "../src/storage/DatabaseProvider";
import { theme } from "../src/theme";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <PersonalAppProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.canvas } }} />
      </PersonalAppProvider>
    </DatabaseProvider>
  );
}
