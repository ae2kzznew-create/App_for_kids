import type { MarkdownDocument } from "./markdownExport";

export interface VaultFileSystem {
  listFiles(directoryUri: string): Promise<string[]>;
  readFile(fileUri: string): Promise<string>;
  writeFile(fileUri: string, content: string): Promise<void>;
  /** Creates a Markdown file; the platform appends the .md extension to baseName. */
  createFile(directoryUri: string, baseName: string): Promise<string>;
}

export interface VaultExportResult {
  total: number;
  created: number;
  updated: number;
}

export function vaultFileName(documentPath: string) {
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
  const result: VaultExportResult = { total: documents.length, created: 0, updated: 0 };
  for (const document of documents) {
    const fileName = vaultFileName(document.path);
    const knownUri = byName.get(fileName);
    if (knownUri) {
      await files.writeFile(knownUri, document.content);
      result.updated += 1;
    } else {
      const createdUri = await files.createFile(directoryUri, fileName.replace(/\.md$/, ""));
      await files.writeFile(createdUri, document.content);
      byName.set(fileName, createdUri);
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
