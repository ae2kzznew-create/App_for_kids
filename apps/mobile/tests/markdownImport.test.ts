import assert from "node:assert/strict";
import test from "node:test";
import { buildMarkdownBundle } from "../src/domain/markdownExport";
import { importMarkdownBundle, parseMarkdownBundle } from "../src/domain/markdownImport";
import type { ExternalNoteLink, Goal, Quest, Skill, WeeklyReview } from "../src/domain/types";
import { MemoryPersonalRepository } from "../src/storage/memoryRepository";
const now = "2026-07-16T12:00:00.000Z";
const goal: Goal = { id: "goal_alpha", profileId: "pavel", title: "Build Levera", status: "active", createdAt: now, updatedAt: now };
const skill: Skill = { id: "skill_rn", goalId: goal.id, title: "React Native", supportLevel: 2, status: "stable", masteryScore: 65, createdAt: now, updatedAt: now };
const quest: Quest = { id: "quest_1", title: "Build import", supportLevel: 1, status: "active", xpReward: 10, createdAt: now, updatedAt: now };
const review: WeeklyReview = { id: "review_1", profileId: "pavel", weekStart: "2026-07-13", decisions: "Test round trips", completedAt: now };
const noteLink: ExternalNoteLink = { id: "external_skill_skill_rn", entityType: "skill", entityId: skill.id, provider: "obsidian", externalPath: "Levera/Skills/React Native.md", updatedAt: now };
const bundle = buildMarkdownBundle({ goals: [goal], skills: [skill], quests: [{ quest, skillIds: [skill.id] }], reviews: [review], noteLinks: [noteLink] });

test("parses exported Markdown identities", () => { const documents = parseMarkdownBundle(bundle); assert.deepEqual(documents.map((item) => `${item.type}:${item.id}`).sort(), ["goal:goal_alpha", "quest:quest_1", "skill:skill_rn", "weekly_review:review_1"]); });

test("round-trips entities and external notes twice without duplicates", async () => {
  const repository = new MemoryPersonalRepository(); const options = { defaultProfileId: "pavel", displayName: "Pavel", importedAt: now };
  const first = await importMarkdownBundle(repository, bundle, options); assert.equal(first.created, 4); assert.equal(first.updated, 0); const second = await importMarkdownBundle(repository, bundle, options); assert.equal(second.created, 0); assert.equal(second.updated, 4);
  assert.equal((await repository.listGoals("pavel")).length, 1); assert.equal((await repository.listSkillsForProfile("pavel")).length, 1); assert.equal((await repository.listQuests()).length, 1); assert.equal((await repository.listWeeklyReviews("pavel")).length, 1); assert.deepEqual((await repository.listQuestSkills(quest.id)).map((link) => link.skillId), [skill.id]); assert.equal((await repository.getExternalNoteLink("skill", skill.id))?.externalPath, noteLink.externalPath); assert.equal(repository.externalNoteLinks.size, 1);
});

test("replaces a same-week review that arrives with a different id", async () => {
  const repository = new MemoryPersonalRepository(); const options = { defaultProfileId: "pavel", displayName: "Pavel", importedAt: now };
  await importMarkdownBundle(repository, bundle, options);
  const webReview = "---\nlevera_id: \"review_web_1\"\nlevera_type: \"weekly_review\"\nprofile_id: \"pavel\"\nweek_start: \"2026-07-13\"\ncompleted_at: \"2026-07-16T18:00:00.000Z\"\n---\n\n# Weekly review · 2026-07-13\n\n## Decision\n\nWeb decision";
  await importMarkdownBundle(repository, webReview, options);
  const reviews = await repository.listWeeklyReviews("pavel");
  assert.equal(reviews.length, 1); assert.equal(reviews[0]?.id, "review_web_1"); assert.equal(reviews[0]?.decisions, "Web decision");
});

test("creates a completion with XP for a quest completed on the computer", async () => {
  const repository = new MemoryPersonalRepository(); const options = { defaultProfileId: "pavel", displayName: "Pavel", importedAt: now };
  await importMarkdownBundle(repository, bundle, options);
  const webQuest = "---\nlevera_id: \"quest_web_done\"\nlevera_type: \"quest\"\nskill_ids: [\"skill_rn\"]\nstatus: \"completed\"\nsupport_level: 1\nxp_reward: 30\ncompleted_at: \"2026-07-16T18:00:00.000Z\"\n---\n\n# Web quest";
  await importMarkdownBundle(repository, webQuest, options);
  const completions = await repository.listCompletions("quest_web_done");
  assert.equal(completions.length, 1); assert.equal(completions[0]?.xpGranted, 30); assert.equal(completions[0]?.completedAt, "2026-07-16T18:00:00.000Z");
  const events = await repository.listProgressEvents("quest_web_done");
  assert.equal(events[0]?.type, "quest_completed"); assert.equal(events[0]?.xpDelta, 30);
  await importMarkdownBundle(repository, webQuest, options);
  assert.equal((await repository.listCompletions("quest_web_done")).length, 1);
});

test("does not invent a completion when completed_at is missing", async () => {
  const repository = new MemoryPersonalRepository(); const options = { defaultProfileId: "pavel", displayName: "Pavel", importedAt: now };
  await importMarkdownBundle(repository, bundle, options);
  const webQuest = "---\nlevera_id: \"quest_web_plain\"\nlevera_type: \"quest\"\nskill_ids: [\"skill_rn\"]\nstatus: \"completed\"\nxp_reward: 20\n---\n\n# Web quest without timestamp";
  await importMarkdownBundle(repository, webQuest, options);
  assert.equal((await repository.listCompletions("quest_web_plain")).length, 0);
});

test("rejects missing identity, broken relations and unsafe note URLs", async () => {
  assert.throws(() => parseMarkdownBundle("---\nlevera_type: \"goal\"\n---\n# Missing"), /levera_id/); const repository = new MemoryPersonalRepository(); const options = { defaultProfileId: "pavel", displayName: "Pavel", importedAt: now };
  await assert.rejects(() => importMarkdownBundle(repository, "---\nlevera_id: \"skill_orphan\"\nlevera_type: \"skill\"\ngoal_id: \"missing\"\n---\n# Orphan", options), /missing goal/);
  await assert.rejects(() => importMarkdownBundle(repository, "---\nlevera_id: \"goal_bad\"\nlevera_type: \"goal\"\nexternal_note_url: \"javascript:alert(1)\"\n---\n# Unsafe", options), /Поддерживаются/);
});
