export interface VaultSettingsStore {
  getFirstAsync<T>(sql: string, ...params: Array<string | number>): Promise<T | null>;
  runAsync(sql: string, ...params: Array<string | number>): Promise<unknown>;
}

const vaultFolderKey = "vault_folder_uri";

export async function readVaultFolderUri(store: VaultSettingsStore): Promise<string | null> {
  const row = await store.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = ?",
    vaultFolderKey,
  );
  return row?.value ?? null;
}

export async function saveVaultFolderUri(store: VaultSettingsStore, directoryUri: string | null): Promise<void> {
  if (directoryUri) {
    await store.runAsync(
      "INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      vaultFolderKey,
      directoryUri,
    );
  } else {
    await store.runAsync("DELETE FROM app_meta WHERE key = ?", vaultFolderKey);
  }
}
