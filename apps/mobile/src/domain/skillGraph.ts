import type { Skill, SkillEdge } from "./types";

export interface SkillGraphLevel {
  depth: number;
  skills: Skill[];
}

export function wouldCreateSkillCycle(
  edges: SkillEdge[],
  parentSkillId: string,
  childSkillId: string,
) {
  if (parentSkillId === childSkillId) return true;

  const childrenByParent = new Map<string, string[]>();
  for (const edge of edges) {
    const children = childrenByParent.get(edge.parentSkillId) ?? [];
    children.push(edge.childSkillId);
    childrenByParent.set(edge.parentSkillId, children);
  }

  const pending = [childSkillId];
  const visited = new Set<string>();
  while (pending.length > 0) {
    const current = pending.pop();
    if (!current || visited.has(current)) continue;
    if (current === parentSkillId) return true;
    visited.add(current);
    pending.push(...(childrenByParent.get(current) ?? []));
  }

  return false;
}

export function buildSkillGraphLevels(skills: Skill[], edges: SkillEdge[]): SkillGraphLevel[] {
  const skillIds = new Set(skills.map((skill) => skill.id));
  const relevantEdges = edges.filter(
    (edge) => skillIds.has(edge.parentSkillId) && skillIds.has(edge.childSkillId),
  );
  const childrenByParent = new Map<string, string[]>();
  const indegree = new Map(skills.map((skill) => [skill.id, 0]));
  const depth = new Map(skills.map((skill) => [skill.id, 0]));

  for (const edge of relevantEdges) {
    const children = childrenByParent.get(edge.parentSkillId) ?? [];
    children.push(edge.childSkillId);
    childrenByParent.set(edge.parentSkillId, children);
    indegree.set(edge.childSkillId, (indegree.get(edge.childSkillId) ?? 0) + 1);
  }

  const pending = skills.filter((skill) => indegree.get(skill.id) === 0).map((skill) => skill.id);
  for (let index = 0; index < pending.length; index += 1) {
    const parentId = pending[index];
    if (!parentId) continue;
    const parentDepth = depth.get(parentId) ?? 0;
    for (const childId of childrenByParent.get(parentId) ?? []) {
      depth.set(childId, Math.max(depth.get(childId) ?? 0, parentDepth + 1));
      const remaining = (indegree.get(childId) ?? 1) - 1;
      indegree.set(childId, remaining);
      if (remaining === 0) pending.push(childId);
    }
  }

  const levels = new Map<number, Skill[]>();
  for (const skill of skills) {
    const skillDepth = depth.get(skill.id) ?? 0;
    const level = levels.get(skillDepth) ?? [];
    level.push(skill);
    levels.set(skillDepth, level);
  }

  return [...levels.entries()]
    .sort(([left], [right]) => left - right)
    .map(([levelDepth, levelSkills]) => ({ depth: levelDepth, skills: levelSkills }));
}
