import assert from "node:assert/strict";
import test from "node:test";
import { buildSkillGraphLevels } from "../src/domain/skillGraph";
import type { Skill, SkillEdge } from "../src/domain/types";

const skill = (id: string): Skill => ({
  id,
  goalId: "goal_1",
  title: id.toUpperCase(),
  supportLevel: 2,
  status: "growing",
  masteryScore: 0,
  createdAt: "2026-07-16T00:00:00.000Z",
  updatedAt: "2026-07-16T00:00:00.000Z",
});

const edge = (parentSkillId: string, childSkillId: string): SkillEdge => ({
  id: `${parentSkillId}_${childSkillId}`,
  parentSkillId,
  childSkillId,
});

test("builds stable levels for a directed skill graph", () => {
  const levels = buildSkillGraphLevels(
    [skill("a"), skill("b"), skill("c"), skill("d"), skill("free")],
    [edge("a", "b"), edge("a", "c"), edge("c", "d")],
  );

  assert.deepEqual(levels.map((level) => level.skills.map((item) => item.id)), [
    ["a", "free"],
    ["b", "c"],
    ["d"],
  ]);
});

test("places a multi-parent child after its deepest dependency", () => {
  const levels = buildSkillGraphLevels(
    [skill("a"), skill("b"), skill("c"), skill("d")],
    [edge("a", "b"), edge("b", "c"), edge("a", "d"), edge("c", "d")],
  );

  assert.deepEqual(levels.map((level) => level.skills.map((item) => item.id)), [
    ["a"],
    ["b"],
    ["c"],
    ["d"],
  ]);
});

test("lays out fifty skills exactly once across ten navigable levels", () => {
  const skills = Array.from({ length: 50 }, (_, index) => skill(`skill_${index + 1}`));
  const edges = Array.from({ length: 45 }, (_, index) => edge(`skill_${index + 1}`, `skill_${index + 6}`));
  const levels = buildSkillGraphLevels(skills, edges);
  const renderedIds = levels.flatMap((level) => level.skills.map((item) => item.id));

  assert.equal(levels.length, 10);
  assert.ok(levels.every((level) => level.skills.length === 5));
  assert.equal(renderedIds.length, 50);
  assert.equal(new Set(renderedIds).size, 50);
  assert.deepEqual(renderedIds.slice(0, 5), ["skill_1", "skill_2", "skill_3", "skill_4", "skill_5"]);
  assert.deepEqual(renderedIds.slice(-5), ["skill_46", "skill_47", "skill_48", "skill_49", "skill_50"]);
});
