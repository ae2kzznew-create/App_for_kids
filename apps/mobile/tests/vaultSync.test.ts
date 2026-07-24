import assert from "node:assert/strict";
import test from "node:test";
import type { MarkdownDocument } from "../src/domain/markdownExport";
import { parseMarkdownBundle } from "../src/domain/markdownImport";
import {
  exportDocumentsToVault,
  fileDisplayName,
  isLeveraDocument,
  legacyVaultFileName,
  readVaultBundle,
  vaultFileName,
  type VaultFileSystem,
} from "../src/domain/vaultSync";

const directoryUri = "content://com.android.externalstorage.documents/tree/primary%3ALeveraVault";

function createVault(initialFiles: Record<string, string> = {}) {
  const files = new Map<string, string>();
  const uriFor = (name: string) => `${directoryUri}/document/primary%3ALeveraVault%2F${encodeURIComponent(name)}`;
  for (const [name, content] of Object.entries(initialFiles)) files.set(uriFor(name), content);
  const fileSystem: VaultFileSystem = {
    listFiles: async () => [...files.keys()],
    readFile: async (fileUri) => {
      const content = files.get(fileUri);
      if (content === undefined) throw new Error(`Missing file: ${fileUri}`);
      return content;
    },
    writeFile: async (fileUri, content) => {
      if (!files.has(fileUri)) throw new Error(`Missing file: ${fileUri}`);
      files.set(fileUri, content);
    },
    createFile: async (_directory, baseName) => {
      const fileUri = uriFor(`${baseName}.md`);
      if (files.has(fileUri)) throw new Error(`File already exists: ${fileUri}`);
      files.set(fileUri, "");
      return fileUri;
    },
  };
  return { files, fileSystem, uriFor };
}

function sampleDocument(
  folder: string,
  id: string,
  type: MarkdownDocument["entityType"],
  title: string,
): MarkdownDocument {
  return {
    path: `${folder}/${id}-${title}.md`,
    entityId: id,
    entityType: type,
    content: `---\nlevera_id: ${JSON.stringify(id)}\nlevera_type: ${JSON.stringify(type)}\n---\n\n# ${title}\n`,
  };
}

test("vaultFileName places documents inside the Levera folder tree", () => {
  assert.equal(vaultFileName("goals/goal_1-first-goal.md"), "Levera/goals/goal_1-first-goal.md");
});

test("legacyVaultFileName flattens folders into the old root file names", () => {
  assert.equal(legacyVaultFileName("goals/goal_1-first-goal.md"), "goals__goal_1-first-goal.md");
});

test("fileDisplayName decodes SAF document URIs", () => {
  const { uriFor } = createVault();
  assert.equal(fileDisplayName(uriFor("goals__goal_1.md")), "goals__goal_1.md");
  assert.equal(fileDisplayName(uriFor("Levera/goals/goal_1.md")), "goal_1.md");
});

test("isLeveraDocument requires frontmatter with levera_id", () => {
  assert.equal(isLeveraDocument('---\nlevera_id: "goal_1"\nlevera_type: "goal"\n---\n\n# Title\n'), true);
  assert.equal(isLeveraDocument("# Just an Obsidian note"), false);
});

test("export creates tree files once and skips unchanged files on re-export", async () => {
  const { files, fileSystem, uriFor } = createVault();
  const goalDocument = sampleDocument("goals", "goal_1", "goal", "first");
  const skillDocument = sampleDocument("skills", "skill_1", "skill", "strength");
  const documents = [goalDocument, skillDocument];
  const first = await exportDocumentsToVault(fileSystem, directoryUri, documents);
  assert.deepEqual(first, { total: 2, created: 2, updated: 0, unchanged: 0 });
  assert.equal(files.size, 2);
  assert.equal(files.get(uriFor("Levera/goals/goal_1-first.md")), goalDocument.content);
  assert.equal(files.get(uriFor("Levera/skills/skill_1-strength.md")), skillDocument.content);

  const second = await exportDocumentsToVault(fileSystem, directoryUri, documents);
  assert.deepEqual(second, { total: 2, created: 0, updated: 0, unchanged: 2 });
  assert.equal(files.size, 2);
});

test("export rewrites only documents whose content changed", async () => {
  const { files, fileSystem, uriFor } = createVault();
  const goalDocument = sampleDocument("goals", "goal_1", "goal", "first");
  const skillDocument = sampleDocument("skills", "skill_1", "skill", "strength");
  await exportDocumentsToVault(fileSystem, directoryUri, [goalDocument, skillDocument]);

  const changedGoal = { ...goalDocument, content: `${goalDocument.content}\nUpdated.\n` };
  const result = await exportDocumentsToVault(fileSystem, directoryUri, [changedGoal, skillDocument]);
  assert.deepEqual(result, { total: 2, created: 0, updated: 1, unchanged: 1 });
  assert.equal(files.get(uriFor("Levera/goals/goal_1-first.md")), changedGoal.content);
  assert.equal(files.size, 2);
});

test("export updates legacy flat root files in place without duplicating them", async () => {
  const goalDocument = sampleDocument("goals", "goal_1", "goal", "first");
  const { files, fileSystem, uriFor } = createVault({
    "goals__goal_1-first.md": "outdated content",
  });
  const result = await exportDocumentsToVault(fileSystem, directoryUri, [goalDocument]);
  assert.deepEqual(result, { total: 1, created: 0, updated: 1, unchanged: 0 });
  assert.equal(files.size, 1);
  assert.equal(files.get(uriFor("goals__goal_1-first.md")), goalDocument.content);
});

test("readVaultBundle keeps only Levera documents and round-trips through the bundle parser", async () => {
  const { fileSystem } = createVault({
    "random-note.md": "# Just an Obsidian note\n\nNo frontmatter here.",
    "image.png": "binary",
  });
  const documents = [
    sampleDocument("goals", "goal_1", "goal", "first"),
    sampleDocument("quests", "quest_1", "quest", "practice"),
  ];
  await exportDocumentsToVault(fileSystem, directoryUri, documents);

  const bundle = await readVaultBundle(fileSystem, directoryUri);
  const parsed = parseMarkdownBundle(bundle);
  assert.deepEqual(parsed.map((item) => item.id).sort(), ["goal_1", "quest_1"]);
});

test("readVaultBundle fails when the folder has no Levera markdown", async () => {
  const { fileSystem } = createVault({ "random-note.md": "# Just a note" });
  await assert.rejects(() => readVaultBundle(fileSystem, directoryUri), /No Levera Markdown files/);
});
