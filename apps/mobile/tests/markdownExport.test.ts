import assert from "node:assert/strict";
import test from "node:test";
import { buildMarkdownBundle, buildMarkdownDocuments } from "../src/domain/markdownExport";
import type { ExternalNoteLink, Goal, Quest, Skill, WeeklyReview } from "../src/domain/types";
const goal: Goal = { id: "goal_alpha", profileId: "pavel", title: "Build Levera", status: "active", createdAt: "2026-07-01T00:00:00.000Z", updatedAt: "2026-07-16T12:00:00.000Z" };
const skill: Skill = { id: "skill_rn", goalId: goal.id, title: "React Native", supportLevel: 2, status: "stable", masteryScore: 65, nextReviewAt: "2026-07-30T12:00:00.000Z", createdAt: goal.createdAt, updatedAt: goal.updatedAt };
const quest: Quest = { id: "quest_maintain", title: "Maintain navigation", supportLevel: 1, status: "completed", xpReward: 0, createdAt: goal.createdAt, updatedAt: goal.updatedAt };
const review: WeeklyReview = { id: "review_week_29", profileId: "pavel", weekStart: "2026-07-13", achievements: "Shipped export", decisions: "Test round trip", completedAt: goal.updatedAt };
const noteLink: ExternalNoteLink = { id: "external_skill_skill_rn", entityType: "skill", entityId: skill.id, provider: "obsidian", externalPath: "Levera/Skills/React Native.md", updatedAt: goal.updatedAt };

test("exports each entity and external note identity", () => {
  const documents = buildMarkdownDocuments({ goals: [goal], skills: [skill], quests: [{ quest, skillIds: [skill.id] }], reviews: [review], noteLinks: [noteLink] }); assert.equal(documents.length, 4); assert.equal(documents.find((item) => item.entityId === goal.id)?.path, "goals/goal_alpha-build-levera.md");
  const skillDocument = documents.find((item) => item.entityId === skill.id)?.content ?? ""; assert.match(skillDocument, /^---\nlevera_id: "skill_rn"\nlevera_type: "skill"/); assert.match(skillDocument, /goal_id: "goal_alpha"/); assert.match(skillDocument, /mastery_score: 65/); assert.match(skillDocument, /external_note_provider: "obsidian"/); assert.match(skillDocument, /external_note_path: "Levera\/Skills\/React Native.md"/);
  const questDocument = documents.find((item) => item.entityId === quest.id)?.content ?? ""; assert.match(questDocument, /skill_ids: \["skill_rn"\]/); assert.match(questDocument, /maintenance: true/);
});

test("builds a deterministic readable multi-file bundle", () => { const input = { goals: [goal], skills: [skill], quests: [{ quest, skillIds: [skill.id] }], reviews: [review], noteLinks: [noteLink] }; const first = buildMarkdownBundle(input); assert.equal(first, buildMarkdownBundle(input)); assert.match(first, /<!-- levera_file: reviews\/review_week_29-2026-07-13.md -->/); assert.match(first, /levera_id: "review_week_29"/); assert.match(first, /## Decision\n\nTest round trip/); });
