import { completeQuest } from "./progress";
import type { PersonalRepository } from "./repository";
import { wouldCreateSkillCycle } from "./skillGraph";
import type { Goal, GoalStatus, Profile, Quest, Skill, SkillEdge, SupportLevel } from "./types";

export interface PersonalServiceOptions {
  now?: () => string;
  createId?: (prefix: string) => string;
}

export class PersonalService {
  private readonly now: () => string;
  private readonly createId: (prefix: string) => string;

  constructor(private readonly repository: PersonalRepository, options: PersonalServiceOptions = {}) {
    this.now = options.now ?? (() => new Date().toISOString());
    this.createId = options.createId ?? ((prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  }

  async createGoal(input: { profileId: string; displayName: string; title: string; description?: string }): Promise<Goal> {
    const title = requiredTitle(input.title, "Goal title");
    const timestamp = this.now();
    const profile: Profile = { id: input.profileId, displayName: requiredTitle(input.displayName, "Display name"), createdAt: timestamp, updatedAt: timestamp };
    await this.repository.ensureProfile(profile);

    const goal: Goal = {
      id: this.createId("goal"),
      profileId: input.profileId,
      title,
      description: cleanOptional(input.description),
      status: "active",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await this.repository.saveGoal(goal);
    return goal;
  }

  async setGoalStatus(goalId: string, status: GoalStatus): Promise<Goal> {
    const goal = await this.requireGoal(goalId);
    const updated = { ...goal, status, updatedAt: this.now() };
    await this.repository.saveGoal(updated);
    return updated;
  }

  async createSkill(input: { goalId: string; title: string; description?: string; supportLevel: SupportLevel }): Promise<Skill> {
    const goal = await this.requireGoal(input.goalId);
    if (goal.status === "archived") throw new Error("Cannot add a skill to an archived goal");
    const timestamp = this.now();
    const skill: Skill = {
      id: this.createId("skill"),
      goalId: input.goalId,
      title: requiredTitle(input.title, "Skill title"),
      description: cleanOptional(input.description),
      supportLevel: input.supportLevel,
      status: "growing",
      masteryScore: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await this.repository.saveSkill(skill);
    return skill;
  }

  async connectSkills(input: { parentSkillId: string; childSkillId: string }): Promise<SkillEdge> {
    if (input.parentSkillId === input.childSkillId) throw new Error("A skill cannot depend on itself");
    const [parent, child] = await Promise.all([
      this.requireSkill(input.parentSkillId),
      this.requireSkill(input.childSkillId),
    ]);
    if (parent.goalId !== child.goalId) throw new Error("Connected skills must belong to the same goal");

    const edges = await this.repository.listSkillEdges();
    const existing = edges.find((edge) => edge.parentSkillId === parent.id && edge.childSkillId === child.id);
    if (existing) return existing;
    if (wouldCreateSkillCycle(edges, parent.id, child.id)) throw new Error("Skill relationship would create a cycle");

    const edge: SkillEdge = {
      id: this.createId("skill_edge"),
      parentSkillId: parent.id,
      childSkillId: child.id,
    };
    await this.repository.saveSkillEdge(edge);
    return edge;
  }

  async disconnectSkills(input: { parentSkillId: string; childSkillId: string }) {
    const edge = (await this.repository.listSkillEdges()).find(
      (candidate) => candidate.parentSkillId === input.parentSkillId && candidate.childSkillId === input.childSkillId,
    );
    if (!edge) return false;
    await this.repository.deleteSkillEdge(edge.id);
    return true;
  }

  async createQuest(input: { title: string; description?: string; skillIds: string[]; supportLevel: SupportLevel; xpReward?: number; scheduledFor?: string }): Promise<Quest> {
    const skillIds = [...new Set(input.skillIds)];
    if (skillIds.length === 0) throw new Error("A quest must be connected to at least one skill");
    for (const skillId of skillIds) {
      if (!(await this.repository.getSkill(skillId))) throw new Error(`Skill not found: ${skillId}`);
    }
    const xpReward = input.xpReward ?? 10;
    if (!Number.isInteger(xpReward) || xpReward < 0) throw new Error("XP reward must be a non-negative integer");
    const timestamp = this.now();
    const quest: Quest = {
      id: this.createId("quest"),
      title: requiredTitle(input.title, "Quest title"),
      description: cleanOptional(input.description),
      supportLevel: input.supportLevel,
      status: "active",
      xpReward,
      scheduledFor: cleanOptional(input.scheduledFor),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await this.repository.saveQuest(quest, skillIds.map((skillId) => ({ questId: quest.id, skillId, contributionWeight: 1 })));
    return quest;
  }

  async finishQuest(input: { questId: string; evidenceNote?: string; evidenceUrl?: string; reflection?: string }) {
    const quest = await this.repository.getQuest(input.questId);
    if (!quest) throw new Error(`Quest not found: ${input.questId}`);
    const timestamp = this.now();
    const result = completeQuest({
      id: this.createId("completion"),
      quest,
      completedAt: timestamp,
      evidenceNote: input.evidenceNote,
      evidenceUrl: input.evidenceUrl,
      reflection: input.reflection,
    });
    const completedQuest: Quest = { ...quest, status: "completed", updatedAt: timestamp };
    await this.repository.saveCompletionWithEvent(result.completion, result.event, completedQuest);
    return result;
  }

  private async requireGoal(goalId: string) {
    const goal = await this.repository.getGoal(goalId);
    if (!goal) throw new Error(`Goal not found: ${goalId}`);
    return goal;
  }

  private async requireSkill(skillId: string) {
    const skill = await this.repository.getSkill(skillId);
    if (!skill) throw new Error(`Skill not found: ${skillId}`);
    return skill;
  }
}

function requiredTitle(value: string, label: string) {
  const cleaned = value.trim();
  if (!cleaned) throw new Error(`${label} is required`);
  if (cleaned.length > 120) throw new Error(`${label} must be 120 characters or fewer`);
  return cleaned;
}

function cleanOptional(value?: string) {
  const cleaned = value?.trim();
  return cleaned || undefined;
}
