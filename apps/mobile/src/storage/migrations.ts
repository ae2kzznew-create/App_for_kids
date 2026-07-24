export const migrations = [
  {
    version: 1,
    name: "personal_mvp_foundation",
    sql: `
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS profiles (id TEXT PRIMARY KEY NOT NULL, display_name TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS goals (id TEXT PRIMARY KEY NOT NULL, profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT, status TEXT NOT NULL CHECK (status IN ('active','completed','archived')), created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS skills (id TEXT PRIMARY KEY NOT NULL, goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT, support_level INTEGER NOT NULL CHECK (support_level BETWEEN 0 AND 3), status TEXT NOT NULL CHECK (status IN ('growing','stable','due','fading','paused')), mastery_score INTEGER NOT NULL DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 100), next_review_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS skill_edges (id TEXT PRIMARY KEY NOT NULL, parent_skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE, child_skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE, UNIQUE(parent_skill_id, child_skill_id), CHECK(parent_skill_id <> child_skill_id));
CREATE TABLE IF NOT EXISTS quests (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT, support_level INTEGER NOT NULL CHECK (support_level BETWEEN 0 AND 3), status TEXT NOT NULL CHECK (status IN ('planned','active','completed','archived')), xp_reward INTEGER NOT NULL DEFAULT 10 CHECK (xp_reward >= 0), scheduled_for TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS quest_skills (quest_id TEXT NOT NULL REFERENCES quests(id) ON DELETE CASCADE, skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE, contribution_weight REAL NOT NULL DEFAULT 1 CHECK (contribution_weight > 0), PRIMARY KEY (quest_id, skill_id));
CREATE TABLE IF NOT EXISTS quest_completions (id TEXT PRIMARY KEY NOT NULL, quest_id TEXT NOT NULL REFERENCES quests(id) ON DELETE CASCADE, completed_at TEXT NOT NULL, evidence_note TEXT, evidence_url TEXT, reflection TEXT, xp_granted INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS repetition_schedules (id TEXT PRIMARY KEY NOT NULL, skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE, interval_days INTEGER NOT NULL CHECK (interval_days > 0), due_at TEXT NOT NULL, completed_at TEXT);
CREATE TABLE IF NOT EXISTS weekly_reviews (id TEXT PRIMARY KEY NOT NULL, profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, week_start TEXT NOT NULL, achievements TEXT, blockers TEXT, decisions TEXT, completed_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS external_note_links (id TEXT PRIMARY KEY NOT NULL, entity_type TEXT NOT NULL CHECK (entity_type IN ('goal','skill','quest','review')), entity_id TEXT NOT NULL, provider TEXT NOT NULL DEFAULT 'markdown', external_path TEXT, external_url TEXT, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS progress_events (id TEXT PRIMARY KEY NOT NULL, event_type TEXT NOT NULL, entity_id TEXT NOT NULL, occurred_at TEXT NOT NULL, xp_delta INTEGER NOT NULL DEFAULT 0, metadata_json TEXT);
CREATE INDEX IF NOT EXISTS idx_skills_goal ON skills(goal_id);
CREATE INDEX IF NOT EXISTS idx_quests_scheduled ON quests(scheduled_for, status);
CREATE INDEX IF NOT EXISTS idx_completions_quest ON quest_completions(quest_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_repetitions_due ON repetition_schedules(due_at, completed_at);
CREATE INDEX IF NOT EXISTS idx_progress_occurred ON progress_events(occurred_at);
`,
  },
  {
    version: 2,
    name: "unique_weekly_review_per_week",
    sql: `
DELETE FROM weekly_reviews WHERE id NOT IN (SELECT id FROM (SELECT id, MAX(completed_at) AS latest_completed_at FROM weekly_reviews GROUP BY profile_id, week_start));
CREATE UNIQUE INDEX IF NOT EXISTS idx_weekly_reviews_profile_week ON weekly_reviews(profile_id, week_start);
`,
  }
] as const;
