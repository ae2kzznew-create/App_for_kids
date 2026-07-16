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
