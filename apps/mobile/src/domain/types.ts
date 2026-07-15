export type EntityId = string;
export type SupportLevel = 0 | 1 | 2 | 3;
export type SkillStatus = "growing" | "stable" | "due" | "fading" | "paused";
export type GoalStatus = "active" | "completed" | "archived";
export type QuestStatus = "planned" | "active" | "completed" | "archived";

export interface Goal {
  id: EntityId;
  title: string;
  description?: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: EntityId;
  goalId: EntityId;
  title: string;
  description?: string;
  supportLevel: SupportLevel;
  status: SkillStatus;
  masteryScore: number;
  nextReviewAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillEdge {
  id: EntityId;
  parentSkillId: EntityId;
  childSkillId: EntityId;
}

export interface Quest {
  id: EntityId;
  title: string;
  description?: string;
  supportLevel: SupportLevel;
  status: QuestStatus;
  xpReward: number;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestSkill {
  questId: EntityId;
  skillId: EntityId;
  contributionWeight: number;
}

export interface QuestCompletion {
  id: EntityId;
  questId: EntityId;
  completedAt: string;
  evidenceNote?: string;
  evidenceUrl?: string;
  reflection?: string;
  xpGranted: number;
}

export interface ProgressEvent {
  id: EntityId;
  type: "quest_completed" | "skill_reviewed" | "skill_level_changed" | "weekly_review_completed";
  entityId: EntityId;
  occurredAt: string;
  xpDelta: number;
  metadata?: Record<string, string | number | boolean>;
}
