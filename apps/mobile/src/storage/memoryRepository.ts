import type { PersonalRepository } from "../domain/repository";
import type { Goal, Profile, ProgressEvent, Quest, QuestCompletion, QuestSkill, Skill } from "../domain/types";

export class MemoryPersonalRepository implements PersonalRepository {
  readonly profiles = new Map<string, Profile>();
  readonly goals = new Map<string, Goal>();
  readonly skills = new Map<string, Skill>();
  readonly quests = new Map<string, Quest>();
  readonly questLinks: QuestSkill[] = [];
  readonly completions: QuestCompletion[] = [];
  readonly events: ProgressEvent[] = [];

  async ensureProfile(profile: Profile) { this.profiles.set(profile.id, this.profiles.get(profile.id) ?? profile); }
  async getGoal(id: string) { return this.goals.get(id) ?? null; }
  async saveGoal(goal: Goal) { this.goals.set(goal.id, goal); }
  async listGoals(profileId: string) { return [...this.goals.values()].filter((goal) => goal.profileId === profileId); }
  async getSkill(id: string) { return this.skills.get(id) ?? null; }
  async saveSkill(skill: Skill) { this.skills.set(skill.id, skill); }
  async listSkills(goalId: string) { return [...this.skills.values()].filter((skill) => skill.goalId === goalId); }
  async getQuest(id: string) { return this.quests.get(id) ?? null; }
  async saveQuest(quest: Quest, links: QuestSkill[]) {
    this.quests.set(quest.id, quest);
    this.questLinks.splice(0, this.questLinks.length, ...this.questLinks.filter((link) => link.questId !== quest.id), ...links);
  }
  async listQuestSkills(questId: string) { return this.questLinks.filter((link) => link.questId === questId); }
  async listActiveQuests() { return [...this.quests.values()].filter((quest) => quest.status === "active"); }
  async saveCompletionWithEvent(completion: QuestCompletion, event: ProgressEvent, completedQuest: Quest) {
    this.completions.push(completion);
    this.events.push(event);
    this.quests.set(completedQuest.id, completedQuest);
  }
  async listCompletions(questId: string) { return this.completions.filter((completion) => completion.questId === questId); }
  async listProgressEvents(entityId: string) { return this.events.filter((event) => event.entityId === entityId); }
}
