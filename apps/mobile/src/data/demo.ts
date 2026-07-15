import type { Quest, Skill } from "../domain/types";

export const demoSkills: Skill[] = [
  { id: "skill_product", goalId: "goal_builder", title: "Продуктовое мышление", supportLevel: 1, status: "growing", masteryScore: 62, nextReviewAt: "2026-07-18", createdAt: "2026-07-01", updatedAt: "2026-07-15" },
  { id: "skill_react_native", goalId: "goal_builder", title: "React Native", supportLevel: 2, status: "growing", masteryScore: 38, nextReviewAt: "2026-07-16", createdAt: "2026-07-01", updatedAt: "2026-07-15" },
  { id: "skill_systems", goalId: "goal_builder", title: "Системное мышление", supportLevel: 1, status: "stable", masteryScore: 74, nextReviewAt: "2026-07-29", createdAt: "2026-07-01", updatedAt: "2026-07-15" },
  { id: "skill_markdown", goalId: "goal_builder", title: "Markdown и второй мозг", supportLevel: 0, status: "due", masteryScore: 81, nextReviewAt: "2026-07-15", createdAt: "2026-07-01", updatedAt: "2026-07-15" }
];

export const demoQuests: Quest[] = [
  { id: "quest_domain", title: "Зафиксировать модель прогресса", description: "Разделить активность, мастерство и повторение.", supportLevel: 1, status: "active", xpReward: 20, scheduledFor: "2026-07-15", createdAt: "2026-07-15", updatedAt: "2026-07-15" },
  { id: "quest_markdown", title: "Проверить Markdown-экспорт", description: "Собрать одну заметку с YAML frontmatter.", supportLevel: 2, status: "active", xpReward: 10, scheduledFor: "2026-07-15", createdAt: "2026-07-15", updatedAt: "2026-07-15" }
];
