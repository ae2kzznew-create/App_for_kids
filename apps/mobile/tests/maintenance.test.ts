import assert from "node:assert/strict";
import test from "node:test";
import { PersonalService } from "../src/domain/personalService";
import { MemoryPersonalRepository } from "../src/storage/memoryRepository";

test("records maintenance evidence without XP or automatic mastery", async () => {
  const repository = new MemoryPersonalRepository();
  let sequence = 0;
  const service = new PersonalService(repository, {
    now: () => "2026-07-16T12:00:00.000Z",
    createId: (prefix) => `${prefix}_${++sequence}`,
  });
  const goal = await service.createGoal({ profileId: "pavel", displayName: "Pavel", title: "Maintain mobility" });
  const skill = await service.createSkill({ goalId: goal.id, title: "Daily mobility", supportLevel: 1 });
  const maintenance = await service.createQuest({ title: "Ten-minute mobility reset", skillIds: [skill.id], supportLevel: 1, xpReward: 0 });
  const result = await service.finishQuest({ questId: maintenance.id, evidenceNote: "Completed full sequence", reflection: "No pain, keep the same load" });

  assert.equal(result.completion.xpGranted, 0);
  assert.equal(result.event.xpDelta, 0);
  assert.equal((await repository.getSkill(skill.id))?.masteryScore, 0);
  assert.equal((await repository.listCompletedQuests())[0]?.xpGranted, 0);
});
