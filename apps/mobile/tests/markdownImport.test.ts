import assert from "node:assert/strict";
import test from "node:test";
import { buildMarkdownBundle } from "../src/domain/markdownExport";
import { importMarkdownBundle, parseMarkdownBundle } from "../src/domain/markdownImport";
import type { Goal, Quest, Skill, WeeklyReview } from "../src/domain/types";
import { MemoryPersonalRepository } from "../src/storage/memoryRepository";
const now = "2026-07-16T12:00:00.000Z";
const goal: Goal = { id: "goal_alpha", profileId: "pavel", title: "Build Levera", status: "active", createdAt: now, updatedAt: now };
const skill: Skill = { id: "skill_rn", goalId: goal.id, title: "React Native", supportLevel: 2, status: "stable", masteryScore: 65, createdAt: now, updatedAt: now };
const quest: Quest = { id: "quest_1", title: "Build import", supportLevel: 1, status: "active", xpReward: 10, createdAt: now, updatedAt: now };
const review: WeeklyReview = { id: "review_1", profileId: "pavel", weekStart: "2026-07-13", decisions: "Test round trips", completedAt: now };
const bundle = buildMarkdownBundle({ goals: [goal], skills: [skill], quests: [{ quest, skillIds: [skill.id] }], reviews: [review] });

test("parses exported Markdown identities", () => { const documents = parseMarkdownBundle(bundle); assert.deepEqual(documents.map((item) => `${item.type}:${item.id}`).sort(), ["goal:goal_alpha", "quest:quest_1", "skill:skill_rn", "weekly_review:review_1"]); });

test("imports twice by stable ID without creating duplicates", async () => {
  const repository = new MemoryPersonalRepository(); const options = { defaultProfileId: "pavel", displayName: "Pavel", importedAt: now };
  const first = await importMarkdownBundle(repository, bundle, options); assert.equal(first.created, 4); assert.equal(first.updated, 0);
  const second = await importMarkdownBundle(repository, bundle, options); assert.equal(second.created, 0); assert.equal(second.updated, 4);
  assert.equal((await repository.listGoals("pavel")).length, 1); assert.equal((await repository.listSkillsForProfile("pavel")).length, 1); assert.equal((await repository.listQuests()).length, 1); assert.equal((await repository.listWeeklyReviews("pavel")).length, 1);
  assert.deepEqual((await repository.listQuestSkills(quest.id)).map((link) => link.skillId), [skill.id]);
});

test("rejects missing identity and broken relations", async () => {
  assert.throws(() => parseMarkdownBundle("---\nlevera_type: \"goal\"\n---\n# Missing"), /levera_id/);
  const repository = new MemoryPersonalRepository();
  const broken = "---\nlevera_id: \"skill_orphan\"\nlevera_type: \"skill\"\ngoal_id: \"missing\"\n---\n# Orphan";
  await assert.rejects(() => importMarkdownBundle(repository, broken, { defaultProfileId: "pavel", displayName: "Pavel", importedAt: now }), /missing goal/);
});
