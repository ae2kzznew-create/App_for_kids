import assert from "node:assert/strict";
import test from "node:test";
import { clampMastery, completeQuest, deriveSkillStatus } from "../src/domain/progress";
import type { Quest } from "../src/domain/types";

const quest: Quest = { id: "quest_1", title: "Design the first vertical slice", supportLevel: 1, status: "active", xpReward: 20, createdAt: "2026-07-15T00:00:00.000Z", updatedAt: "2026-07-15T00:00:00.000Z" };

test("completion emits XP without automatically changing mastery", () => {
  const result = completeQuest({ id: "completion_1", quest, completedAt: "2026-07-15T12:00:00.000Z", evidenceNote: "Architecture document committed", reflection: "Separating XP and mastery keeps progress honest" });
  assert.equal(result.completion.xpGranted, 20);
  assert.equal(result.event.xpDelta, 20);
  assert.equal(result.event.metadata?.hasEvidence, true);
  assert.equal(result.event.metadata?.hasReflection, true);
});

test("archived quests cannot be completed", () => {
  assert.throws(() => completeQuest({ id: "c", quest: { ...quest, status: "archived" }, completedAt: "2026-07-15" }));
});

test("skill status prioritizes pause and due repetition", () => {
  assert.equal(deriveSkillStatus({ paused: true, now: "2026-07-15", stable: false }), "paused");
  assert.equal(deriveSkillStatus({ paused: false, nextReviewAt: "2026-07-14", now: "2026-07-15", stable: true }), "due");
});

test("old practice fades and mastery stays within bounds", () => {
  assert.equal(deriveSkillStatus({ paused: false, lastPracticedAt: "2026-06-01", now: "2026-07-15", stable: true }), "fading");
  assert.equal(clampMastery(120), 100);
  assert.equal(clampMastery(-5), 0);
});
