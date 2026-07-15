import type { ProgressEvent, Quest, QuestCompletion, SkillStatus } from "./types";

export interface CompletionInput {
  id: string;
  quest: Quest;
  completedAt: string;
  evidenceNote?: string;
  evidenceUrl?: string;
  reflection?: string;
}

export function completeQuest(input: CompletionInput): { completion: QuestCompletion; event: ProgressEvent } {
  if (input.quest.status === "archived") throw new Error("Archived quests cannot be completed");
  if (input.quest.xpReward < 0) throw new Error("XP reward cannot be negative");

  const completion: QuestCompletion = {
    id: input.id,
    questId: input.quest.id,
    completedAt: input.completedAt,
    evidenceNote: input.evidenceNote?.trim() || undefined,
    evidenceUrl: input.evidenceUrl?.trim() || undefined,
    reflection: input.reflection?.trim() || undefined,
    xpGranted: input.quest.xpReward
  };

  return {
    completion,
    event: {
      id: `event_${input.id}`,
      type: "quest_completed",
      entityId: input.quest.id,
      occurredAt: input.completedAt,
      xpDelta: input.quest.xpReward,
      metadata: {
        supportLevel: input.quest.supportLevel,
        hasEvidence: Boolean(completion.evidenceNote || completion.evidenceUrl),
        hasReflection: Boolean(completion.reflection)
      }
    }
  };
}

export function deriveSkillStatus(params: { paused: boolean; nextReviewAt?: string; lastPracticedAt?: string; now: string; stable: boolean }): SkillStatus {
  if (params.paused) return "paused";
  if (params.nextReviewAt && params.nextReviewAt <= params.now) return "due";
  if (params.lastPracticedAt) {
    const ageDays = (Date.parse(params.now) - Date.parse(params.lastPracticedAt)) / 86_400_000;
    if (ageDays >= 21) return "fading";
  }
  return params.stable ? "stable" : "growing";
}

export function clampMastery(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}
