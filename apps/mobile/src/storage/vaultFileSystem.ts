import * as FileSystem from "expo-file-system";
import type { VaultFileSystem } from "../domain/vaultSync";

const { StorageAccessFramework } = FileSystem;

/** Opens the system folder picker and returns the granted directory URI, or null when cancelled. */
export async function requestVaultFolderAccess(): Promise<string | null> {
  const permission = await StorageAccessFramework.requestDirectoryPermissionsAsync();
  return permission.granted ? permission.directoryUri : null;
}

export const safVaultFileSystem: VaultFileSystem = {
  listFiles: (directoryUri) => StorageAccessFramework.readDirectoryAsync(directoryUri),
  readFile: (fileUri) => FileSystem.readAsStringAsync(fileUri),
  writeFile: (fileUri, content) => FileSystem.writeAsStringAsync(fileUri, content),
  createFile: (directoryUri, baseName) => StorageAccessFramework.createFileAsync(directoryUri, baseName, "text/markdown"),
};
