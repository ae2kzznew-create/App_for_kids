import type { SQLiteDatabase } from "expo-sqlite";
import type { PersonalRepository } from "../domain/repository";
import type { Goal, Profile, ProgressEvent, Quest, QuestCompletion, QuestSkill, Skill } from "../domain/types";

export class SQLitePersonalRepository implements PersonalRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async ensureProfile(profile: Profile) {
    await this.db.runAsync("INSERT INTO profiles (id, display_name, created_at, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name, updated_at = excluded.updated_at", profile.id, profile.displayName, profile.createdAt, profile.updatedAt);
  }

  async getGoal(id: string) {
    const row = await this.db.getFirstAsync<GoalRow>("SELECT * FROM goals WHERE id = ?", id);
    return row ? mapGoal(row) : null;
  }

  async saveGoal(goal: Goal) {
    await this.db.runAsync("INSERT INTO goals (id, profile_id, title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title = excluded.title, description = excluded.description, status = excluded.status, updated_at = excluded.updated_at", goal.id, goal.profileId, goal.title, goal.description ?? null, goal.status, goal.createdAt, goal.updatedAt);
  }

  async listGoals(profileId: string) {
    const rows = await this.db.getAllAsync<GoalRow>("SELECT * FROM goals WHERE profile_id = ? ORDER BY updated_at DESC", profileId);
    return rows.map(mapGoal);
  }

  async getSkill(id: string) {
    const row = await this.db.getFirstAsync<SkillRow>("SELECT * FROM skills WHERE id = ?", id);
    return row ? mapSkill(row) : null;
  }

  async saveSkill(skill: Skill) {
    await this.db.runAsync("INSERT INTO skills (id, goal_id, title, description, support_level, status, mastery_score, next_review_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title = excluded.title, description = excluded.description, support_level = excluded.support_level, status = excluded.status, mastery_score = excluded.mastery_score, next_review_at = excluded.next_review_at, updated_at = excluded.updated_at", skill.id, skill.goalId, skill.title, skill.description ?? null, skill.supportLevel, skill.status, skill.masteryScore, skill.nextReviewAt ?? null, skill.createdAt, skill.updatedAt);
  }

  async listSkills(goalId: string) {
    const rows = await this.db.getAllAsync<SkillRow>("SELECT * FROM skills WHERE goal_id = ? ORDER BY updated_at DESC", goalId);
    return rows.map(mapSkill);
  }

  async getQuest(id: string) {
    const row = await this.db.getFirstAsync<QuestRow>("SELECT * FROM quests WHERE id = ?", id);
    return row ? mapQuest(row) : null;
  }

  async saveQuest(quest: Quest, links: QuestSkill[]) {
    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync("INSERT INTO quests (id, title, description, support_level, status, xp_reward, scheduled_for, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title = excluded.title, description = excluded.description, support_level = excluded.support_level, status = excluded.status, xp_reward = excluded.xp_reward, scheduled_for = excluded.scheduled_for, updated_at = excluded.updated_at", quest.id, quest.title, quest.description ?? null, quest.supportLevel, quest.status, quest.xpReward, quest.scheduledFor ?? null, quest.createdAt, quest.updatedAt);
      await this.db.runAsync("DELETE FROM quest_skills WHERE quest_id = ?", quest.id);
      for (const link of links) await this.db.runAsync("INSERT INTO quest_skills (quest_id, skill_id, contribution_weight) VALUES (?, ?, ?)", link.questId, link.skillId, link.contributionWeight);
    });
  }

  async listQuestSkills(questId: string) {
    return this.db.getAllAsync<QuestSkill>("SELECT quest_id AS questId, skill_id AS skillId, contribution_weight AS contributionWeight FROM quest_skills WHERE quest_id = ?", questId);
  }

  async listActiveQuests() {
    const rows = await this.db.getAllAsync<QuestRow>("SELECT * FROM quests WHERE status = 'active' ORDER BY scheduled_for IS NULL, scheduled_for, updated_at DESC");
    return rows.map(mapQuest);
  }

  async saveCompletionWithEvent(completion: QuestCompletion, event: ProgressEvent, completedQuest: Quest) {
    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync("INSERT INTO quest_completions (id, quest_id, completed_at, evidence_note, evidence_url, reflection, xp_granted) VALUES (?, ?, ?, ?, ?, ?, ?)", completion.id, completion.questId, completion.completedAt, completion.evidenceNote ?? null, completion.evidenceUrl ?? null, completion.reflection ?? null, completion.xpGranted);
      await this.db.runAsync("INSERT INTO progress_events (id, event_type, entity_id, occurred_at, xp_delta, metadata_json) VALUES (?, ?, ?, ?, ?, ?)", event.id, event.type, event.entityId, event.occurredAt, event.xpDelta, event.metadata ? JSON.stringify(event.metadata) : null);
      await this.db.runAsync("UPDATE quests SET status = ?, updated_at = ? WHERE id = ?", completedQuest.status, completedQuest.updatedAt, completedQuest.id);
    });
  }

  async listCompletions(questId: string) {
    const rows = await this.db.getAllAsync<CompletionRow>("SELECT * FROM quest_completions WHERE quest_id = ? ORDER BY completed_at DESC", questId);
    return rows.map(mapCompletion);
  }

  async listProgressEvents(entityId: string) {
    const rows = await this.db.getAllAsync<EventRow>("SELECT * FROM progress_events WHERE entity_id = ? ORDER BY occurred_at DESC", entityId);
    return rows.map(mapEvent);
  }
}

type GoalRow = { id: string; profile_id: string; title: string; description: string | null; status: Goal["status"]; created_at: string; updated_at: string };
type SkillRow = { id: string; goal_id: string; title: string; description: string | null; support_level: Skill["supportLevel"]; status: Skill["status"]; mastery_score: number; next_review_at: string | null; created_at: string; updated_at: string };
type QuestRow = { id: string; title: string; description: string | null; support_level: Quest["supportLevel"]; status: Quest["status"]; xp_reward: number; scheduled_for: string | null; created_at: string; updated_at: string };
type CompletionRow = { id: string; quest_id: string; completed_at: string; evidence_note: string | null; evidence_url: string | null; reflection: string | null; xp_granted: number };
type EventRow = { id: string; event_type: ProgressEvent["type"]; entity_id: string; occurred_at: string; xp_delta: number; metadata_json: string | null };

const mapGoal = (row: GoalRow): Goal => ({ id: row.id, profileId: row.profile_id, title: row.title, description: row.description ?? undefined, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at });
const mapSkill = (row: SkillRow): Skill => ({ id: row.id, goalId: row.goal_id, title: row.title, description: row.description ?? undefined, supportLevel: row.support_level, status: row.status, masteryScore: row.mastery_score, nextReviewAt: row.next_review_at ?? undefined, createdAt: row.created_at, updatedAt: row.updated_at });
const mapQuest = (row: QuestRow): Quest => ({ id: row.id, title: row.title, description: row.description ?? undefined, supportLevel: row.support_level, status: row.status, xpReward: row.xp_reward, scheduledFor: row.scheduled_for ?? undefined, createdAt: row.created_at, updatedAt: row.updated_at });
const mapCompletion = (row: CompletionRow): QuestCompletion => ({ id: row.id, questId: row.quest_id, completedAt: row.completed_at, evidenceNote: row.evidence_note ?? undefined, evidenceUrl: row.evidence_url ?? undefined, reflection: row.reflection ?? undefined, xpGranted: row.xp_granted });
const mapEvent = (row: EventRow): ProgressEvent => ({ id: row.id, type: row.event_type, entityId: row.entity_id, occurredAt: row.occurred_at, xpDelta: row.xp_delta, metadata: row.metadata_json ? JSON.parse(row.metadata_json) as ProgressEvent["metadata"] : undefined });
