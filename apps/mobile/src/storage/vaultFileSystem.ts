import * as FileSystem from "expo-file-system";
import type { VaultFileSystem } from "../domain/vaultSync";

const { StorageAccessFramework } = FileSystem;

const MAX_DEPTH = 4;

/** Opens the system folder picker and returns the granted directory URI, or null when cancelled. */
export async function requestVaultFolderAccess(): Promise<string | null> {
  const permission = await StorageAccessFramework.requestDirectoryPermissionsAsync();
  return permission.granted ? permission.directoryUri : null;
}

function entryDisplayName(uri: string) {
  const decoded = decodeURIComponent(uri);
  const separator = Math.max(decoded.lastIndexOf("/"), decoded.lastIndexOf(":"));
  return separator >= 0 ? decoded.slice(separator + 1) : decoded;
}

/**
 * Recursively collects Markdown file URIs. SAF gives no cheap directory flag,
 * so entries without a file extension are probed as folders; probing a plain
 * file throws and the entry is skipped.
 */
async function listMarkdownFiles(directoryUri: string, depth: number): Promise<string[]> {
  const found: string[] = [];
  const entries = await StorageAccessFramework.readDirectoryAsync(directoryUri);
  for (const uri of entries) {
    const name = entryDisplayName(uri);
    if (name.startsWith(".")) continue;
    if (name.toLowerCase().endsWith(".md")) {
      found.push(uri);
      continue;
    }
    if (name.includes(".") || depth >= MAX_DEPTH) continue;
    try {
      found.push(...(await listMarkdownFiles(uri, depth + 1)));
    } catch {
      // Not a folder — skip.
    }
  }
  return found;
}

async function ensureSubdirectory(parentUri: string, name: string): Promise<string> {
  const entries = await StorageAccessFramework.readDirectoryAsync(parentUri);
  const existing = entries.find((uri) => entryDisplayName(uri) === name);
  if (existing) return existing;
  return StorageAccessFramework.makeDirectoryAsync(parentUri, name);
}

export const safVaultFileSystem: VaultFileSystem = {
  listFiles: (directoryUri) => listMarkdownFiles(directoryUri, 0),
  readFile: (fileUri) => FileSystem.readAsStringAsync(fileUri),
  writeFile: (fileUri, content) => FileSystem.writeAsStringAsync(fileUri, content),
  createFile: async (directoryUri, baseName) => {
    const segments = baseName.split("/").filter(Boolean);
    const fileBase = segments.pop() ?? baseName;
    let parentUri = directoryUri;
    for (const segment of segments) parentUri = await ensureSubdirectory(parentUri, segment);
    return StorageAccessFramework.createFileAsync(parentUri, fileBase, "text/markdown");
  },
};
