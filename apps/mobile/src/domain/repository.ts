import type { Goal, Profile, ProgressEvent, Quest, QuestCompletion, QuestSkill, Skill } from "./types";

export interface PersonalRepository {
  ensureProfile(profile: Profile): Promise<void>;
  getGoal(id: string): Promise<Goal | null>;
  saveGoal(goal: Goal): Promise<void>;
  listGoals(profileId: string): Promise<Goal[]>;
  getSkill(id: string): Promise<Skill | null>;
  saveSkill(skill: Skill): Promise<void>;
  listSkills(goalId: string): Promise<Skill[]>;
  getQuest(id: string): Promise<Quest | null>;
  saveQuest(quest: Quest, links: QuestSkill[]): Promise<void>;
  listQuestSkills(questId: string): Promise<QuestSkill[]>;
  listActiveQuests(): Promise<Quest[]>;
  saveCompletionWithEvent(completion: QuestCompletion, event: ProgressEvent, completedQuest: Quest): Promise<void>;
  listCompletions(questId: string): Promise<QuestCompletion[]>;
  listProgressEvents(entityId: string): Promise<ProgressEvent[]>;
}
