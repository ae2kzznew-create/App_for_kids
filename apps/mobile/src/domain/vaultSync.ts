import type { MarkdownDocument } from "./markdownExport";

export interface VaultFileSystem {
  /** Lists Markdown file URIs in the folder, including files inside subfolders. */
  listFiles(directoryUri: string): Promise<string[]>;
  readFile(fileUri: string): Promise<string>;
  writeFile(fileUri: string, content: string): Promise<void>;
  /**
   * Creates a Markdown file; baseName may contain "/" separators for
   * subfolders (created on demand); the platform appends the .md extension to
   * the final segment.
   */
  createFile(directoryUri: string, baseName: string): Promise<string>;
}

export interface VaultExportResult {
  total: number;
  created: number;
  updated: number;
  unchanged: number;
}

/** Root subfolder inside the vault where Levera keeps its file tree. */
export const VAULT_ROOT_FOLDER = "Levera";

/** Relative path of a document inside the vault tree: Levera/goals/<id>-<slug>.md */
export function vaultFileName(documentPath: string) {
  return `${VAULT_ROOT_FOLDER}/${documentPath}`;
}

/** File name used by the legacy flat layout (goals__<id>-<slug>.md in the vault root). */
export function legacyVaultFileName(documentPath: string) {
  return documentPath.replace(/\//g, "__");
}

export function fileDisplayName(fileUri: string) {
  const decoded = decodeURIComponent(fileUri);
  const separator = Math.max(decoded.lastIndexOf("/"), decoded.lastIndexOf(":"));
  return separator >= 0 ? decoded.slice(separator + 1) : decoded;
}

export function isLeveraDocument(content: string) {
  const value = content.trim();
  return value.startsWith("---") && /(^|\n)levera_id\s*:/.test(value);
}

export async function exportDocumentsToVault(
  files: VaultFileSystem,
  directoryUri: string,
  documents: MarkdownDocument[],
): Promise<VaultExportResult> {
  const existing = await files.listFiles(directoryUri);
  const byName = new Map(existing.map((uri) => [fileDisplayName(uri), uri] as const));
  const result: VaultExportResult = { total: documents.length, created: 0, updated: 0, unchanged: 0 };
  for (const document of documents) {
    const baseName = fileDisplayName(document.path);
    const knownUri = byName.get(baseName) ?? byName.get(legacyVaultFileName(document.path));
    if (knownUri) {
      let currentContent: string | null = null;
      try {
        currentContent = await files.readFile(knownUri);
      } catch {
        currentContent = null;
      }
      if (currentContent === document.content) {
        result.unchanged += 1;
      } else {
        await files.writeFile(knownUri, document.content);
        result.updated += 1;
      }
    } else {
      const createdUri = await files.createFile(directoryUri, vaultFileName(document.path).replace(/\.md$/, ""));
      await files.writeFile(createdUri, document.content);
      byName.set(baseName, createdUri);
      result.created += 1;
    }
  }
  return result;
}

export async function readVaultBundle(files: VaultFileSystem, directoryUri: string): Promise<string> {
  const uris = await files.listFiles(directoryUri);
  const markdownUris = uris
    .filter((uri) => fileDisplayName(uri).toLowerCase().endsWith(".md"))
    .sort((left, right) => fileDisplayName(left).localeCompare(fileDisplayName(right)));
  const chunks: string[] = [];
  for (const uri of markdownUris) {
    const content = (await files.readFile(uri)).trim();
    if (!isLeveraDocument(content)) continue;
    chunks.push(`<!-- levera_file: ${fileDisplayName(uri)} -->\n${content}`);
  }
  if (chunks.length === 0) throw new Error("No Levera Markdown files found in the sync folder");
  return chunks.join("\n\n");
}
