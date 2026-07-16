import type { CompletedQuestSummary } from "./repository";
import type { Goal, Skill } from "./types";

export interface ProgressWindowSummary {
  key: "today" | "week" | "month";
  label: string;
  completionCount: number;
  xp: number;
}

export interface GoalProgressSummary {
  goalId: string;
  title: string;
  completionCount: number;
  xp: number;
  skillCount: number;
}

export interface SkillProgressSummary {
  skillId: string;
  title: string;
  completionCount: number;
  xp: number;
  masteryScore: number;
}

export function buildProgressSummary(input: {
  history: CompletedQuestSummary[];
  goals: Goal[];
  skills: Skill[];
  now: string;
}) {
  const nowMs = Date.parse(input.now);
  if (!Number.isFinite(nowMs)) throw new Error("Progress summary requires a valid current time");
  const todayKey = input.now.slice(0, 10);
  const dayMs = 86_400_000;

  const windows: ProgressWindowSummary[] = [
    summarizeWindow("today", "Сегодня", input.history.filter((item) => item.completedAt.slice(0, 10) === todayKey)),
    summarizeWindow("week", "7 дней", input.history.filter((item) => Date.parse(item.completedAt) >= nowMs - 7 * dayMs)),
    summarizeWindow("month", "30 дней", input.history.filter((item) => Date.parse(item.completedAt) >= nowMs - 30 * dayMs)),
  ];

  const goalIdBySkill = new Map(input.skills.map((skill) => [skill.id, skill.goalId]));
  const goalRollups: GoalProgressSummary[] = input.goals.map((goal) => {
    const goalHistory = input.history.filter((item) => item.skillIds.some((skillId) => goalIdBySkill.get(skillId) === goal.id));
    return {
      goalId: goal.id,
      title: goal.title,
      completionCount: goalHistory.length,
      xp: goalHistory.reduce((sum, item) => sum + item.xpGranted, 0),
      skillCount: input.skills.filter((skill) => skill.goalId === goal.id).length,
    };
  }).sort(compareProgress);

  const skillRollups: SkillProgressSummary[] = input.skills.map((skill) => {
    const skillHistory = input.history.filter((item) => item.skillIds.includes(skill.id));
    return {
      skillId: skill.id,
      title: skill.title,
      completionCount: skillHistory.length,
      xp: skillHistory.reduce((sum, item) => sum + item.xpGranted, 0),
      masteryScore: skill.masteryScore,
    };
  }).sort(compareProgress);

  return { windows, goalRollups, skillRollups };
}

function summarizeWindow(key: ProgressWindowSummary["key"], label: string, history: CompletedQuestSummary[]): ProgressWindowSummary {
  return {
    key,
    label,
    completionCount: history.length,
    xp: history.reduce((sum, item) => sum + item.xpGranted, 0),
  };
}

function compareProgress(left: { xp: number; completionCount: number }, right: { xp: number; completionCount: number }) {
  return right.xp - left.xp || right.completionCount - left.completionCount;
}
