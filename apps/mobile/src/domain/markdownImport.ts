import { createExternalNoteLink } from "./externalNotes";
import type { PersonalRepository } from "./repository";
import type { ExternalNoteEntityType, Goal, GoalStatus, Quest, QuestStatus, Skill, SkillStatus, SupportLevel, WeeklyReview } from "./types";

type ParsedDocument = { id: string; type: "goal" | "skill" | "quest" | "weekly_review"; title: string; body: string; fields: Record<string, unknown> };
export interface MarkdownImportResult { total: number; created: number; updated: number; byType: Record<ParsedDocument["type"], number>; }

export function parseMarkdownBundle(markdown: string): ParsedDocument[] {
  const chunks = markdown.includes("<!-- levera_file:") ? markdown.split(/(?=<!-- levera_file:)/) : [markdown];
  const documents = chunks.map((chunk) => chunk.replace(/^<!-- levera_file:[^\n]+-->\s*/, "").trim()).filter(Boolean).map(parseDocument);
  const seen = new Set<string>();
  for (const document of documents) { const key = `${document.type}:${document.id}`; if (seen.has(key)) throw new Error(`Duplicate Markdown identity in import: ${key}`); seen.add(key); }
  return documents;
}

export async function importMarkdownBundle(repository: PersonalRepository, markdown: string, options: { defaultProfileId: string; displayName: string; importedAt: string }): Promise<MarkdownImportResult> {
  const documents = parseMarkdownBundle(markdown); if (documents.length === 0) throw new Error("No Levera Markdown documents found");
  const result: MarkdownImportResult = { total: documents.length, created: 0, updated: 0, byType: { goal: 0, skill: 0, quest: 0, weekly_review: 0 } };
  const profileIds = new Set([options.defaultProfileId]); for (const document of documents) if (document.type === "goal" || document.type === "weekly_review") profileIds.add(stringField(document, "profile_id", options.defaultProfileId));
  for (const profileId of profileIds) await repository.ensureProfile({ id: profileId, displayName: options.displayName, createdAt: options.importedAt, updatedAt: options.importedAt });

  for (const document of documents.filter((item) => item.type === "goal")) {
    const existing = await repository.getGoal(document.id); count(result, document.type, Boolean(existing)); const updatedAt = stringField(document, "updated", options.importedAt);
    await repository.saveGoal({ id: document.id, profileId: stringField(document, "profile_id", options.defaultProfileId), title: document.title, description: descriptionBody(document.body), status: enumField(document, "status", ["active", "completed", "archived"] as GoalStatus[], "active"), createdAt: existing?.createdAt ?? updatedAt, updatedAt });
  }
  for (const document of documents.filter((item) => item.type === "skill")) {
    const goalId = stringField(document, "goal_id"); if (!(await repository.getGoal(goalId))) throw new Error(`Imported skill ${document.id} references missing goal ${goalId}`);
    const existing = await repository.getSkill(document.id); count(result, document.type, Boolean(existing)); const updatedAt = stringField(document, "updated", options.importedAt);
    await repository.saveSkill({ id: document.id, goalId, title: document.title, description: descriptionBody(document.body), supportLevel: numberField(document, "support_level", 0, 3, 2) as SupportLevel, status: enumField(document, "status", ["growing", "stable", "due", "fading", "paused"] as SkillStatus[], "growing"), masteryScore: numberField(document, "mastery_score", 0, 100, 0), nextReviewAt: optionalString(document, "next_review_at"), createdAt: existing?.createdAt ?? updatedAt, updatedAt });
  }
  for (const document of documents.filter((item) => item.type === "quest")) {
    const skillIds = stringArrayField(document, "skill_ids"); if (skillIds.length === 0) throw new Error(`Imported quest ${document.id} has no skills`); for (const skillId of skillIds) if (!(await repository.getSkill(skillId))) throw new Error(`Imported quest ${document.id} references missing skill ${skillId}`);
    const existing = await repository.getQuest(document.id); count(result, document.type, Boolean(existing)); const updatedAt = stringField(document, "updated", options.importedAt);
    const quest: Quest = { id: document.id, title: document.title, description: descriptionBody(document.body), supportLevel: numberField(document, "support_level", 0, 3, 2) as SupportLevel, status: enumField(document, "status", ["planned", "active", "completed", "archived"] as QuestStatus[], "active"), xpReward: numberField(document, "xp_reward", 0, 100000, 0), scheduledFor: optionalString(document, "scheduled_for"), createdAt: existing?.createdAt ?? updatedAt, updatedAt };
    await repository.saveQuest(quest, skillIds.map((skillId) => ({ questId: quest.id, skillId, contributionWeight: 1 })));
  }
  for (const document of documents.filter((item) => item.type === "weekly_review")) {
    const existing = await repository.getWeeklyReview(document.id); count(result, document.type, Boolean(existing));
    const review: WeeklyReview = { id: document.id, profileId: stringField(document, "profile_id", options.defaultProfileId), weekStart: stringField(document, "week_start"), achievements: section(document.body, "Achievements"), blockers: section(document.body, "Blockers"), decisions: section(document.body, "Decision") ?? "Imported review", completedAt: stringField(document, "completed_at", options.importedAt) };
    await repository.saveImportedWeeklyReview(review);
  }
  for (const document of documents) await importExternalNote(repository, document, options.importedAt);
  return result;
}

async function importExternalNote(repository: PersonalRepository, document: ParsedDocument, importedAt: string) {
  const value = optionalString(document, "external_note_url") ?? optionalString(document, "external_note_path"); if (!value) return;
  const entityType: ExternalNoteEntityType = document.type === "weekly_review" ? "review" : document.type;
  const link = createExternalNoteLink(entityType, document.id, value, optionalString(document, "external_note_updated") ?? importedAt);
  const declaredProvider = optionalString(document, "external_note_provider"); if (declaredProvider && declaredProvider !== link.provider) throw new Error(`${document.type} ${document.id} has inconsistent external_note_provider`);
  await repository.saveExternalNoteLink(link);
}
function parseDocument(markdown: string): ParsedDocument { const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/); if (!match) throw new Error("Markdown document must start with YAML frontmatter"); const fields = parseFrontmatter(match[1] ?? ""); const body = (match[2] ?? "").trim(); const id = asString(fields.levera_id); const type = asString(fields.levera_type); if (!id) throw new Error("Markdown document is missing levera_id"); if (!isType(type)) throw new Error(`Unsupported levera_type: ${type || "missing"}`); return { id, type, title: body.match(/^#\s+(.+)$/m)?.[1]?.trim() || id, body, fields }; }
function parseFrontmatter(value: string) { const fields: Record<string, unknown> = {}; for (const line of value.split(/\r?\n/)) { if (!line.trim()) continue; const separator = line.indexOf(":"); if (separator < 1) throw new Error(`Invalid YAML line: ${line}`); const key = line.slice(0, separator).trim(); const raw = line.slice(separator + 1).trim(); fields[key] = parseValue(raw); } return fields; }
function parseValue(raw: string): unknown { if (raw.startsWith('"') || raw.startsWith("[") || raw.startsWith("{")) { try { return JSON.parse(raw); } catch { throw new Error(`Invalid YAML value: ${raw}`); } } if (raw === "true") return true; if (raw === "false") return false; if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw); return raw; }
function descriptionBody(body: string) { const value = body.replace(/^#\s+.+\r?\n?/, "").trim(); return value || undefined; }
function section(body: string, heading: string) { const match = body.match(new RegExp(`^## ${heading}\\r?\\n\\r?\\n([\\s\\S]*?)(?=\\r?\\n\\r?\\n## |$)`, "m")); return match?.[1]?.trim() || undefined; }
function count(result: MarkdownImportResult, type: ParsedDocument["type"], exists: boolean) { result.byType[type] += 1; if (exists) result.updated += 1; else result.created += 1; }
function stringField(document: ParsedDocument, key: string, fallback?: string) { const value = asString(document.fields[key]) || fallback; if (!value) throw new Error(`${document.type} ${document.id} is missing ${key}`); return value; }
function optionalString(document: ParsedDocument, key: string) { return asString(document.fields[key]) || undefined; }
function numberField(document: ParsedDocument, key: string, min: number, max: number, fallback: number) { const value = document.fields[key] ?? fallback; if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) throw new Error(`${document.type} ${document.id} has invalid ${key}`); return value; }
function stringArrayField(document: ParsedDocument, key: string) { const value = document.fields[key]; if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) throw new Error(`${document.type} ${document.id} has invalid ${key}`); return [...new Set(value)]; }
function enumField<T extends string>(document: ParsedDocument, key: string, allowed: T[], fallback: T): T { const value = asString(document.fields[key]) || fallback; if (!allowed.includes(value as T)) throw new Error(`${document.type} ${document.id} has invalid ${key}`); return value as T; }
function asString(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function isType(value: string): value is ParsedDocument["type"] { return value === "goal" || value === "skill" || value === "quest" || value === "weekly_review"; }
