import assert from "node:assert/strict";
import test from "node:test";
import { PersonalService } from "../src/domain/personalService";
import { buildRepetitionQueue, repetitionIntervalDays, repetitionStatus, scheduleSkillAfterReview } from "../src/domain/repetition";
import type { Skill } from "../src/domain/types";
import { MemoryPersonalRepository } from "../src/storage/memoryRepository";

const skill = (overrides: Partial<Skill> = {}): Skill => ({
  id: "skill_1",
  goalId: "goal_1",
  title: "React Native",
  supportLevel: 2,
  status: "growing",
  masteryScore: 35,
  createdAt: "2026-07-01T12:00:00.000Z",
  updatedAt: "2026-07-01T12:00:00.000Z",
  ...overrides,
});

test("increases repetition intervals with reviewed mastery", () => {
  assert.deepEqual([0, 20, 40, 60, 80].map(repetitionIntervalDays), [1, 3, 7, 14, 30]);
  const scheduled = scheduleSkillAfterReview(skill({ masteryScore: 65 }), "2026-07-16T12:00:00.000Z");
  assert.equal(scheduled.status, "stable");
  assert.equal(scheduled.nextReviewAt, "2026-07-30T12:00:00.000Z");
});

test("derives due and fading states without destroying mastery", () => {
  const due = skill({ masteryScore: 72, status: "stable", nextReviewAt: "2026-07-15T12:00:00.000Z" });
  const fading = skill({ id: "skill_2", title: "Delivery", masteryScore: 80, status: "stable", nextReviewAt: "2026-07-01T12:00:00.000Z" });
  assert.equal(repetitionStatus(due, "2026-07-16T12:00:00.000Z"), "due");
  assert.equal(repetitionStatus(fading, "2026-07-16T12:00:00.000Z"), "fading");
  assert.equal(buildRepetitionQueue([due, fading], "2026-07-16T12:00:00.000Z")[0]?.id, "skill_2");
  assert.equal(fading.masteryScore, 80);
});

test("pauses and recovers a skill without XP or lost progress", async () => {
  const repository = new MemoryPersonalRepository();
  let sequence = 0;
  const service = new PersonalService(repository, {
    now: () => "2026-07-16T12:00:00.000Z",
    createId: (prefix) => `${prefix}_${++sequence}`,
  });
  const goal = await service.createGoal({ profileId: "pavel", displayName: "Pavel", title: "Build Levera" });
  const created = await service.createSkill({ goalId: goal.id, title: "React Native", supportLevel: 2 });
  const paused = await service.pauseSkill(created.id);
  assert.equal(paused.status, "paused");
  assert.equal(paused.masteryScore, created.masteryScore);

  const recovered = await service.recoverSkill(created.id);
  assert.equal(recovered.status, "growing");
  assert.equal(recovered.supportLevel, 3);
  assert.equal(recovered.nextReviewAt, "2026-07-17T12:00:00.000Z");
  assert.equal(recovered.masteryScore, created.masteryScore);

  const events = await repository.listProgressEvents(created.id);
  assert.equal(events.length, 2);
  assert.ok(events.every((event) => event.xpDelta === 0));
  assert.equal(events[1]?.metadata?.reason, "gentle_recovery");
});
