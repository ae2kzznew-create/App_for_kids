import type { SQLiteDatabase } from "expo-sqlite";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import { openDatabase } from "./database";

type DatabaseState =
  | { status: "loading"; database: null; error: null }
  | { status: "ready"; database: SQLiteDatabase; error: null }
  | { status: "error"; database: null; error: Error };

const DatabaseContext = createContext<DatabaseState>({ status: "loading", database: null, error: null });

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DatabaseState>({ status: "loading", database: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: "loading", database: null, error: null });
    openDatabase()
      .then((database) => {
        if (active) setState({ status: "ready", database, error: null });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const normalized = error instanceof Error ? error : new Error("Unknown database initialization error");
        setState({ status: "error", database: null, error: normalized });
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const value = useMemo(() => state, [state]);

  if (state.status === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={theme.colors.blue} />
        <Text style={styles.message}>Подготавливаю локальные данные</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Не удалось открыть локальную базу</Text>
        <Text style={styles.message}>{state.error.message}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setAttempt((value) => value + 1)}
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
        >
          <Text style={styles.retryButtonText}>Попробовать снова</Text>
        </Pressable>
      </View>
    );
  }

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase() {
  const state = useContext(DatabaseContext);
  if (state.status !== "ready") {
    throw new Error("useDatabase must be used after database initialization");
  }
  return state.database;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
    backgroundColor: theme.colors.canvas,
  },
  errorTitle: { color: theme.colors.red, fontSize: 18, fontWeight: "700", textAlign: "center" },
  message: { color: theme.colors.muted, fontSize: 15, lineHeight: 22, textAlign: "center" },
  retryButton: {
    minHeight: 46,
    minWidth: 180,
    borderRadius: 12,
    backgroundColor: theme.colors.blue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginTop: 4,
  },
  retryButtonPressed: { opacity: 0.8 },
  retryButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
});
