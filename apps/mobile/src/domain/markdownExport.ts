import type { ExternalNoteEntityType, ExternalNoteLink, Goal, Quest, Skill, WeeklyReview } from "./types";

export interface MarkdownDocument { path: string; entityId: string; entityType: "goal" | "skill" | "quest" | "weekly_review"; content: string; }
export interface MarkdownExportInput { goals: Goal[]; skills: Skill[]; quests: Array<{ quest: Quest; skillIds: string[] }>; reviews: WeeklyReview[]; noteLinks?: ExternalNoteLink[]; }

export function buildMarkdownDocuments(input: MarkdownExportInput): MarkdownDocument[] {
  return [
    ...input.goals.map((goal) => exportGoal(goal, findNote(input, "goal", goal.id))),
    ...input.skills.map((skill) => exportSkill(skill, findNote(input, "skill", skill.id))),
    ...input.quests.map(({ quest, skillIds }) => exportQuest(quest, skillIds, findNote(input, "quest", quest.id))),
    ...input.reviews.map((review) => exportReview(review, findNote(input, "review", review.id))),
  ].sort((left, right) => left.path.localeCompare(right.path));
}

export function buildMarkdownBundle(input: MarkdownExportInput) {
  return buildMarkdownDocuments(input).map((document) => `<!-- levera_file: ${document.path} -->\n${document.content}`).join("\n\n");
}

function exportGoal(goal: Goal, note?: ExternalNoteLink): MarkdownDocument {
  return document("goals", goal.id, goal.title, "goal", yaml({ levera_id: goal.id, levera_type: "goal", profile_id: goal.profileId, status: goal.status, updated: goal.updatedAt, ...noteFields(note) }), goal.description);
}
function exportSkill(skill: Skill, note?: ExternalNoteLink): MarkdownDocument {
  return document("skills", skill.id, skill.title, "skill", yaml({ levera_id: skill.id, levera_type: "skill", goal_id: skill.goalId, status: skill.status, support_level: skill.supportLevel, mastery_score: skill.masteryScore, next_review_at: skill.nextReviewAt, updated: skill.updatedAt, ...noteFields(note) }), skill.description);
}
function exportQuest(quest: Quest, skillIds: string[], note?: ExternalNoteLink): MarkdownDocument {
  return document("quests", quest.id, quest.title, "quest", yaml({ levera_id: quest.id, levera_type: "quest", skill_ids: skillIds, status: quest.status, support_level: quest.supportLevel, xp_reward: quest.xpReward, maintenance: quest.xpReward === 0, scheduled_for: quest.scheduledFor, updated: quest.updatedAt, ...noteFields(note) }), quest.description);
}
function exportReview(review: WeeklyReview, note?: ExternalNoteLink): MarkdownDocument {
  const body = [review.achievements ? `## Achievements\n\n${review.achievements}` : "", review.blockers ? `## Blockers\n\n${review.blockers}` : "", `## Decision\n\n${review.decisions}`].filter(Boolean).join("\n\n");
  return document("reviews", review.id, review.weekStart, "weekly_review", yaml({ levera_id: review.id, levera_type: "weekly_review", profile_id: review.profileId, week_start: review.weekStart, completed_at: review.completedAt, ...noteFields(note) }), body, `Weekly review · ${review.weekStart}`);
}
function noteFields(note?: ExternalNoteLink) { return note ? { external_note_provider: note.provider, external_note_path: note.externalPath, external_note_url: note.externalUrl, external_note_updated: note.updatedAt } : {}; }
function findNote(input: MarkdownExportInput, entityType: ExternalNoteEntityType, entityId: string) { return input.noteLinks?.find((link) => link.entityType === entityType && link.entityId === entityId); }
function document(folder: string, id: string, title: string, entityType: MarkdownDocument["entityType"], frontmatter: string, body?: string, heading = title): MarkdownDocument {
  const path = `${folder}/${safeId(id)}-${slug(title)}.md`;
  return { path, entityId: id, entityType, content: `---\n${frontmatter}\n---\n\n# ${heading}\n${body ? `\n${body.trim()}\n` : ""}` };
}
function yaml(values: Record<string, string | number | boolean | string[] | undefined>) {
  return Object.entries(values).filter(([, value]) => value !== undefined).map(([key, value]) => `${key}: ${yamlValue(value as string | number | boolean | string[])}`).join("\n");
}
function yamlValue(value: string | number | boolean | string[]) {
  if (Array.isArray(value)) return `[${value.map((item) => JSON.stringify(item)).join(", ")}]`;
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}
function slug(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9\u0400-\u04ff]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "item"; }
function safeId(value: string) { return value.replace(/[^a-zA-Z0-9_-]/g, "_"); }
