import assert from "node:assert/strict";
import test from "node:test";
import { buildMarkdownBundle } from "../src/domain/markdownExport";
import { loadMarkdownExportInput } from "../src/domain/markdownExportInput";
import type { ExternalNoteLink, Goal, Quest, QuestSkill, Skill, WeeklyReview } from "../src/domain/types";
import { MemoryPersonalRepository } from "../src/storage/memoryRepository";

const now = "2026-07-16T12:00:00.000Z";
const goal: Goal = { id: "goal_alpha", profileId: "pavel", title: "Build Levera", status: "active", createdAt: now, updatedAt: now };
const skill: Skill = { id: "skill_rn", goalId: goal.id, title: "React Native", supportLevel: 2, status: "stable", masteryScore: 65, createdAt: now, updatedAt: now };
const quest: Quest = { id: "quest_1", title: "Build export", supportLevel: 1, status: "active", xpReward: 10, createdAt: now, updatedAt: now };
const questLink: QuestSkill = { questId: quest.id, skillId: skill.id, contributionWeight: 1 };
const review: WeeklyReview = { id: "review_1", profileId: "pavel", weekStart: "2026-07-13", decisions: "Keep going", completedAt: now };
const noteLinks: ExternalNoteLink[] = [
  { id: "external_goal_goal_alpha", entityType: "goal", entityId: goal.id, provider: "obsidian", externalPath: "Levera/goals/goal_alpha-build-levera.md", updatedAt: now },
  { id: "external_skill_skill_rn", entityType: "skill", entityId: skill.id, provider: "obsidian", externalPath: "Levera/skills/skill_rn-react-native.md", updatedAt: now },
  { id: "external_quest_quest_1", entityType: "quest", entityId: quest.id, provider: "web", externalUrl: "https://example.com/quests/1", updatedAt: now },
  { id: "external_review_review_1", entityType: "review", entityId: review.id, provider: "obsidian", externalPath: "Levera/reviews/review_1.md", updatedAt: now },
];

test("loads Markdown export input with saved external note links", async () => {
  const repository = new MemoryPersonalRepository();
  await repository.ensureProfile({ id: "pavel", displayName: "Pavel", createdAt: now, updatedAt: now });
  await repository.saveGoal(goal);
  await repository.saveSkill(skill);
  await repository.saveQuest(quest, [questLink]);
  await repository.saveImportedWeeklyReview(review);
  await Promise.all(noteLinks.map((link) => repository.saveExternalNoteLink(link)));

  const input = await loadMarkdownExportInput(repository, "pavel");

  assert.equal(input.goals.length, 1);
  assert.equal(input.skills.length, 1);
  assert.equal(input.quests.length, 1);
  assert.equal(input.reviews.length, 1);
  assert.deepEqual(input.quests[0], { quest, skillIds: [skill.id] });
  assert.deepEqual(
    input.noteLinks?.map((link) => `${link.entityType}:${link.entityId}`).sort(),
    ["goal:goal_alpha", "quest:quest_1", "review:review_1", "skill:skill_rn"],
  );

  const bundle = buildMarkdownBundle(input);
  assert.match(bundle, /external_note_path: "Levera\/goals\/goal_alpha-build-levera.md"/);
  assert.match(bundle, /external_note_path: "Levera\/skills\/skill_rn-react-native.md"/);
  assert.match(bundle, /external_note_url: "https:\/\/example.com\/quests\/1"/);
  assert.match(bundle, /external_note_path: "Levera\/reviews\/review_1.md"/);
});
