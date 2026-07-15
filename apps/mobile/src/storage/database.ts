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
      await db.runAsync("INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)", migration.version, migration.name, new Date().toISOString());
    });
  }
  return db;
}
