import * as SQLite from "expo-sqlite";
import { migrations } from "./migrations";

const databaseName = "levera.db";

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

export async function verifyDatabase(db: SQLite.SQLiteDatabase) {
  const now = new Date().toISOString();
  await db.runAsync(
    "INSERT INTO app_meta (key, value) VALUES ('last_successful_start', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    now,
  );

  const health = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = 'last_successful_start'",
  );

  if (!health?.value) {
    throw new Error("SQLite health check did not persist the startup marker");
  }

  return { lastSuccessfulStart: health.value };
}
