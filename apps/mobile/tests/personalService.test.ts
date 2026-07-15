import assert from "node:assert/strict";
import test from "node:test";
import { PersonalService } from "../src/domain/personalService";
import { MemoryPersonalRepository } from "../src/storage/memoryRepository";

function setup() {
  const repository = new MemoryPersonalRepository();
  let sequence = 0;
  const service = new PersonalService(repository, { now: () => "2026-07-15T20:00:00.000Z", createId: (prefix) => `${prefix}_${++sequence}` });
  return { repository, service };
}

test("creates, archives and restores a goal", async () => {
  const { repository, service } = setup();
  const goal = await service.createGoal({ profileId: "pavel", displayName: "Pavel", title: "  Build Levera  " });
  assert.equal(goal.title, "Build Levera");
  assert.equal((await repository.listGoals("pavel")).length, 1);
  assert.equal((await service.setGoalStatus(goal.id, "archived")).status, "archived");
  assert.equal((await service.setGoalStatus(goal.id, "active")).status, "active");
});

test("prevents adding skills to archived goals", async () => {
  const { service } = setup();
  const goal = await service.createGoal({ profileId: "pavel", displayName: "Pavel", title: "Build Levera" });
  await service.setGoalStatus(goal.id, "archived");
  await assert.rejects(() => service.createSkill({ goalId: goal.id, title: "React Native", supportLevel: 2 }), /archived goal/);
});

test("creates a linked quest, completes it and exposes history", async () => {
  const { repository, service } = setup();
  const goal = await service.createGoal({ profileId: "pavel", displayName: "Pavel", title: "Build Levera" });
  const skill = await service.createSkill({ goalId: goal.id, title: "React Native", supportLevel: 2 });
  const quest = await service.createQuest({ title: "Build the first form", skillIds: [skill.id], supportLevel: 2, xpReward: 20 });
  await service.finishQuest({ questId: quest.id, evidenceNote: "Committed service layer", reflection: "Transactions keep completion honest" });

  const history = await repository.listCompletedQuests();
  assert.equal(history[0]?.title, "Build the first form");
  assert.equal(history[0]?.evidenceNote, "Committed service layer");
  assert.deepEqual(history[0]?.skillIds, [skill.id]);
  assert.equal((await repository.listSkillHistory(skill.id)).length, 1);
  assert.equal((await repository.listSkillsForProfile("pavel"))[0]?.id, skill.id);
});

test("rejects empty titles and quests without skills", async () => {
  const { service } = setup();
  await assert.rejects(() => service.createGoal({ profileId: "pavel", displayName: "Pavel", title: "   " }), /required/);
  await assert.rejects(() => service.createQuest({ title: "Orphan quest", skillIds: [], supportLevel: 1 }), /at least one skill/);
});
