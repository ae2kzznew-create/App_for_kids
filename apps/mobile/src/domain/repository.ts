import type { Goal, Profile, ProgressEvent, Quest, QuestCompletion, QuestSkill, Skill, SkillEdge, WeeklyReview } from "./types";
export interface CompletedQuestSummary { questId: string; title: string; completedAt: string; xpGranted: number; evidenceNote?: string; reflection?: string; skillIds: string[]; }
export interface PersonalRepository {
  ensureProfile(profile: Profile): Promise<void>;
  getGoal(id: string): Promise<Goal | null>; saveGoal(goal: Goal): Promise<void>; listGoals(profileId: string): Promise<Goal[]>;
  getSkill(id: string): Promise<Skill | null>; saveSkill(skill: Skill): Promise<void>; saveReviewedSkillWithEvent(skill: Skill, event: ProgressEvent): Promise<void>; listSkills(goalId: string): Promise<Skill[]>; listSkillsForProfile(profileId: string): Promise<Skill[]>;
  saveSkillEdge(edge: SkillEdge): Promise<void>; deleteSkillEdge(id: string): Promise<void>; listSkillEdges(): Promise<SkillEdge[]>;
  getQuest(id: string): Promise<Quest | null>; saveQuest(quest: Quest, links: QuestSkill[]): Promise<void>; listQuests(): Promise<Quest[]>; listQuestSkills(questId: string): Promise<QuestSkill[]>; listActiveQuests(): Promise<Quest[]>;
  saveCompletionWithEvent(completion: QuestCompletion, event: ProgressEvent, completedQuest: Quest): Promise<void>; listCompletions(questId: string): Promise<QuestCompletion[]>; listCompletedQuests(limit?: number): Promise<CompletedQuestSummary[]>; listSkillHistory(skillId: string, limit?: number): Promise<CompletedQuestSummary[]>;
  getWeeklyReview(id: string): Promise<WeeklyReview | null>; saveImportedWeeklyReview(review: WeeklyReview): Promise<void>; saveWeeklyReviewWithEvent(review: WeeklyReview, event: ProgressEvent): Promise<void>; listWeeklyReviews(profileId: string, limit?: number): Promise<WeeklyReview[]>; listProgressEvents(entityId: string): Promise<ProgressEvent[]>;
}
