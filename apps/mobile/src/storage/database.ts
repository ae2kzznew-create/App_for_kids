import * as SQLite from "expo-sqlite";
import { migrations } from "./migrations";

const databaseName = "levera.db";
const currentStartKey = "last_successful_start";
const previousStartKey = "previous_successful_start";

export interface DatabaseHealth {
  lastSuccessfulStart: string;
  previousSuccessfulStart: string | null;
  persistenceVerified: boolean;
}

export async function openDatabase() {
  const db = await SQLite.openDatabaseAsync(databaseName);
  await db.execAsync("PRAGMA foreign_keys = ON;");
  await db.execAsync("CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, applied_at TEXT NOT NULL);");

  const applied = await db.getAllAsync<{ version: number }>("SELECT version FROM schema_migrations ORDER BY version");
  const versions = new Set(applied.map((row) => row.version));

  for (const migration of migrations) {
    if (versions.has(migration.version)) continue;
    await db.withTransactionAsync(async () => {
      await db.execAsync(migration.sql);
      await db.runAsync(
        "INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)",
        migration.version,
        migration.name,
        new Date().toISOString(),
      );
    });
  }

  await verifyDatabase(db);
  return db;
}

export async function verifyDatabase(db: SQLite.SQLiteDatabase): Promise<DatabaseHealth> {
  const previous = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = ?",
    currentStartKey,
  );
  const now = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    if (previous?.value) {
      await db.runAsync(
        "INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        previousStartKey,
        previous.value,
      );
    }
    await db.runAsync(
      "INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      currentStartKey,
      now,
    );
  });

  const health = await readDatabaseHealth(db);
  if (!health.lastSuccessfulStart) {
    throw new Error("SQLite health check did not persist the startup marker");
  }
  return health;
}

export async function readDatabaseHealth(db: SQLite.SQLiteDatabase): Promise<DatabaseHealth> {
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    "SELECT key, value FROM app_meta WHERE key IN (?, ?)",
    currentStartKey,
    previousStartKey,
  );
  const values = new Map(rows.map((row) => [row.key, row.value]));
  const lastSuccessfulStart = values.get(currentStartKey) ?? "";
  const previousSuccessfulStart = values.get(previousStartKey) ?? null;

  return {
    lastSuccessfulStart,
    previousSuccessfulStart,
    persistenceVerified: Boolean(lastSuccessfulStart && previousSuccessfulStart),
  };
}
