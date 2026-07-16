import assert from "node:assert/strict";
import test from "node:test";
import { buildProgressSummary } from "../src/domain/progressSummary";
import type { CompletedQuestSummary } from "../src/domain/repository";
import type { Goal, Skill } from "../src/domain/types";

const goal = (id: string, title: string): Goal => ({ id, profileId: "pavel", title, status: "active", createdAt: "2026-06-01T00:00:00.000Z", updatedAt: "2026-07-16T00:00:00.000Z" });
const skill = (id: string, goalId: string, title: string, masteryScore: number): Skill => ({ id, goalId, title, supportLevel: 2, status: "growing", masteryScore, createdAt: "2026-06-01T00:00:00.000Z", updatedAt: "2026-07-16T00:00:00.000Z" });
const completion = (questId: string, completedAt: string, xpGranted: number, skillIds: string[]): CompletedQuestSummary => ({ questId, title: questId, completedAt, xpGranted, skillIds });

test("summarizes activity by day week month goal and skill", () => {
  const summary = buildProgressSummary({
    now: "2026-07-16T12:00:00.000Z",
    goals: [goal("product", "Build Levera"), goal("language", "Learn German")],
    skills: [skill("mobile", "product", "React Native", 40), skill("shipping", "product", "Delivery", 20), skill("words", "language", "Vocabulary", 60)],
    history: [
      completion("today", "2026-07-16T08:00:00.000Z", 20, ["mobile"]),
      completion("week", "2026-07-12T08:00:00.000Z", 15, ["shipping"]),
      completion("month", "2026-06-25T08:00:00.000Z", 10, ["words"]),
      completion("old", "2026-05-01T08:00:00.000Z", 5, ["mobile"]),
    ],
  });

  assert.deepEqual(summary.windows.map((window) => [window.key, window.completionCount, window.xp]), [
    ["today", 1, 20],
    ["week", 2, 35],
    ["month", 3, 45],
  ]);
  assert.deepEqual(summary.goalRollups.map((item) => [item.goalId, item.completionCount, item.xp]), [
    ["product", 3, 40],
    ["language", 1, 10],
  ]);
  assert.deepEqual(summary.skillRollups.map((item) => [item.skillId, item.completionCount, item.xp]), [
    ["mobile", 2, 25],
    ["shipping", 1, 15],
    ["words", 1, 10],
  ]);
});
