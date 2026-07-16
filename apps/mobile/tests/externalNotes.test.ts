import assert from "node:assert/strict";
import test from "node:test";
import { createExternalNoteLink, externalNoteDisplayValue, externalNoteOpenUrl } from "../src/domain/externalNotes";
import { MemoryPersonalRepository } from "../src/storage/memoryRepository";
const now = "2026-07-16T18:00:00.000Z";

test("builds encoded Obsidian URI from a vault path", () => {
  const link = createExternalNoteLink("skill", "skill_1", "Levera/Skills/React Native.md", now);
  assert.equal(link.provider, "obsidian"); assert.equal(link.externalPath, "Levera/Skills/React Native.md");
  assert.equal(externalNoteOpenUrl(link), "obsidian://open?path=Levera%2FSkills%2FReact%20Native.md");
});

test("keeps explicit Obsidian and web URLs", () => {
  const obsidian = createExternalNoteLink("quest", "quest_1", "obsidian://open?vault=Levera&file=Quest", now);
  const web = createExternalNoteLink("quest", "quest_2", "https://example.com/note", now);
  assert.equal(externalNoteOpenUrl(obsidian), "obsidian://open?vault=Levera&file=Quest"); assert.equal(web.provider, "web"); assert.equal(externalNoteDisplayValue(web), "https://example.com/note");
  assert.throws(() => createExternalNoteLink("quest", "quest_3", "javascript:alert(1)", now), /Поддерживаются/);
});

test("persists one external link per entity", async () => {
  const repository = new MemoryPersonalRepository(); const first = createExternalNoteLink("skill", "skill_1", "Skills/First.md", now); const second = createExternalNoteLink("skill", "skill_1", "Skills/Updated.md", "2026-07-16T18:05:00.000Z");
  await repository.saveExternalNoteLink(first); await repository.saveExternalNoteLink(second);
  assert.equal((await repository.getExternalNoteLink("skill", "skill_1"))?.externalPath, "Skills/Updated.md");
  await repository.deleteExternalNoteLink("skill", "skill_1"); assert.equal(await repository.getExternalNoteLink("skill", "skill_1"), null);
});
