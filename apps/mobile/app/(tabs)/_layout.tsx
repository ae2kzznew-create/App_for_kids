import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { theme } from "../../src/theme";

const icon = (name: keyof typeof MaterialCommunityIcons.glyphMap) =>
  ({ color, size }: { color: string; size: number }) => <MaterialCommunityIcons name={name} color={color} size={size} />;

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.colors.blue,
      tabBarInactiveTintColor: theme.colors.muted,
      tabBarStyle: { backgroundColor: theme.colors.canvas, borderTopColor: theme.colors.border, height: 76, paddingTop: 8, paddingBottom: 10 },
      tabBarLabelStyle: { fontSize: 14, fontWeight: "600" }
    }}>
      <Tabs.Screen name="index" options={{ title: "Сегодня", tabBarIcon: icon("view-dashboard-outline") }} />
      <Tabs.Screen name="skills" options={{ title: "Навыки", tabBarIcon: icon("graph-outline") }} />
      <Tabs.Screen name="progress" options={{ title: "Прогресс", tabBarIcon: icon("chart-line") }} />
      <Tabs.Screen name="review" options={{ title: "Обзор", tabBarIcon: icon("notebook-check-outline") }} />
      <Tabs.Screen name="settings" options={{ title: "Связи", tabBarIcon: icon("connection") }} />
    </Tabs>
  );
}
