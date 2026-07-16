export interface DatabaseHealth {
  lastSuccessfulStart: string;
  previousSuccessfulStart: string | null;
  persistenceVerified: boolean;
}

export interface DatabaseHealthStore {
  getFirstAsync<T>(sql: string, ...params: Array<string | number>): Promise<T | null>;
  getAllAsync<T>(sql: string, ...params: Array<string | number>): Promise<T[]>;
  runAsync(sql: string, ...params: Array<string | number>): Promise<unknown>;
  withTransactionAsync<T>(callback: () => Promise<T>): Promise<T>;
}

const currentStartKey = "last_successful_start";
const previousStartKey = "previous_successful_start";

export async function verifyDatabaseHealth(store: DatabaseHealthStore): Promise<DatabaseHealth> {
  const previous = await store.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = ?",
    currentStartKey,
  );
  const now = new Date().toISOString();

  await store.withTransactionAsync(async () => {
    if (previous?.value) {
      await store.runAsync(
        "INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        previousStartKey,
        previous.value,
      );
    }
    await store.runAsync(
      "INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      currentStartKey,
      now,
    );
  });

  const health = await readDatabaseHealth(store);
  if (!health.lastSuccessfulStart) {
    throw new Error("SQLite health check did not persist the startup marker");
  }
  return health;
}

export async function readDatabaseHealth(store: DatabaseHealthStore): Promise<DatabaseHealth> {
  const rows = await store.getAllAsync<{ key: string; value: string }>(
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
