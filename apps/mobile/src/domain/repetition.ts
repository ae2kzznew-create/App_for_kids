import type { Skill, SkillStatus } from "./types";

const DAY_MS = 86_400_000;

export function repetitionIntervalDays(masteryScore: number) {
  if (masteryScore < 20) return 1;
  if (masteryScore < 40) return 3;
  if (masteryScore < 60) return 7;
  if (masteryScore < 80) return 14;
  return 30;
}

export function scheduleSkillAfterReview(skill: Skill, reviewedAt: string): Skill {
  const reviewedAtMs = Date.parse(reviewedAt);
  if (!Number.isFinite(reviewedAtMs)) throw new Error("Review time must be valid");
  const nextReviewAt = new Date(reviewedAtMs + repetitionIntervalDays(skill.masteryScore) * DAY_MS).toISOString();
  return { ...skill, status: skill.masteryScore >= 60 ? "stable" : "growing", nextReviewAt };
}

export function repetitionStatus(skill: Skill, now: string): SkillStatus {
  if (skill.status === "paused") return "paused";
  if (!skill.nextReviewAt) return skill.status;
  const nowMs = Date.parse(now);
  const nextMs = Date.parse(skill.nextReviewAt);
  if (!Number.isFinite(nowMs) || !Number.isFinite(nextMs)) return skill.status;
  if (nowMs < nextMs) return skill.masteryScore >= 60 ? "stable" : "growing";
  return nowMs - nextMs <= 7 * DAY_MS ? "due" : "fading";
}

export function withRepetitionStatus(skill: Skill, now: string): Skill {
  return { ...skill, status: repetitionStatus(skill, now) };
}

export function buildRepetitionQueue(skills: Skill[], now: string) {
  return skills
    .map((skill) => withRepetitionStatus(skill, now))
    .filter((skill) => skill.status === "due" || skill.status === "fading")
    .sort((left, right) => {
      if (left.status !== right.status) return left.status === "fading" ? -1 : 1;
      return (left.nextReviewAt ?? "").localeCompare(right.nextReviewAt ?? "");
    });
}

export function tomorrowFrom(value: string) {
  const valueMs = Date.parse(value);
  if (!Number.isFinite(valueMs)) throw new Error("Recovery time must be valid");
  return new Date(valueMs + DAY_MS).toISOString();
}
