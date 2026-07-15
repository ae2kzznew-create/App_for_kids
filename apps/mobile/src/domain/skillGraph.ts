import type { SkillEdge } from "./types";

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
