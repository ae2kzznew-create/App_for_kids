import type { SQLiteDatabase } from "expo-sqlite";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import { openDatabase } from "./database";

type DatabaseState =
  | { status: "loading"; database: null; error: null }
  | { status: "ready"; database: SQLiteDatabase; error: null }
  | { status: "error"; database: null; error: Error };

const DatabaseContext = createContext<DatabaseState>({ status: "loading", database: null, error: null });

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DatabaseState>({ status: "loading", database: null, error: null });

  useEffect(() => {
    let active = true;
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
  }, []);

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
});
