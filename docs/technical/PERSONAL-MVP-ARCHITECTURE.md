# Levera Personal MVP architecture

**Status:** accepted foundation for the personal alpha  
**Date:** 2026-07-15

## Product boundary

The first application is local-first and single-user. It does not include family accounts, billing, AI quest generation, cloud sync or automatic two-way Obsidian sync.

## Navigation

The initial tab structure is fixed:

1. **Today** — active quests, due repetitions and weekly focus.
2. **Skills** — skill tree and skill health.
3. **Progress** — activity, consistency and reviewed mastery.
4. **Review** — structured weekly review.
5. **Connections** — Markdown import/export and external note links.

## Domain relationships

```text
Profile
  └── Goal
        └── Skill
              ├── SkillEdge → another Skill
              ├── Quest ←→ QuestSkill
              │     └── QuestCompletion
              │            ├── evidence
              │            └── reflection
              └── RepetitionSchedule

WeeklyReview
ExternalNoteLink → Goal | Skill | Quest | WeeklyReview
ProgressEvent → immutable activity history
```

- A goal contains one or more skills.
- A skill can depend on another skill through a directed edge.
- A quest can contribute to multiple skills.
- A completion records what happened; it does not silently prove mastery.
- Weekly review is the authoritative place for manual mastery changes.

## Progress model

Progress is deliberately split into separate signals.

### Activity XP

- Completing a quest grants the quest's fixed XP reward.
- Evidence and reflection are recorded but do not produce bonus XP.
- XP represents completed activity, not competence.
- XP can drive personal levels and milestones without changing skill mastery.

### Mastery score

- Each skill has a reviewed score from 0 to 100.
- The score is changed explicitly during a review or later by a transparent recommendation accepted by the user.
- Quest completion can be shown as supporting evidence but does not automatically move mastery.

### Support level

- `L3 Guided` — detailed instructions.
- `L2 Checklist` — milestones without detailed explanation.
- `L1 Outcome` — expected result only.
- `L0 Independent` — perform and provide evidence without scaffolding.

Support level and mastery are independent. A quest may use extra guidance without lowering the user's skill score.

### Skill health

A skill is one of `growing`, `stable`, `due`, `fading` or `paused`.

Priority: paused → due repetition → fading after 21 days without practice → stable/growing.

## Local persistence

- Database: SQLite through `expo-sqlite`.
- Every entity uses an application-generated stable text ID.
- Timestamps are stored as ISO 8601 UTC strings.
- Database schema changes are applied through numbered migrations.
- Foreign keys are enabled and destructive cascades are explicit.
- Progress events are append-only in normal operation.

## Backup and restore

Personal alpha backup consists of:

1. A complete JSON snapshot for lossless restore.
2. A readable Markdown export for the second brain.
3. Stable IDs in YAML frontmatter to prevent duplicate import.

Restore validates the snapshot version before changing the database. A failed import must not partially overwrite existing data.

## Markdown contract

```yaml
---
levera_id: skill_public_speaking
levera_type: skill
schema_version: 1
status: growing
support_level: 2
mastery_score: 38
updated_at: 2026-07-15T18:00:00Z
---
```

The personal alpha supports plain-text evidence notes, HTTPS links and external Markdown note paths or URIs. Binary attachment copying and automatic vault-folder access are deferred.

## First vertical slice

`create goal → create skill → create quest → complete with evidence/reflection → emit progress event → show history`

Acceptance criteria:

1. Data survives application restart.
2. The user never edits raw SQLite data.
3. Completion grants activity XP but does not silently alter mastery.
4. Archived quests cannot be completed.
5. The completion appears in Today and skill history.
6. Domain behavior is covered by automated tests.

## Engineering conventions

- TypeScript strict mode.
- Domain logic under `src/domain` and independent from React Native.
- Storage adapters under `src/storage`.
- Routes only coordinate UI and application services.
- Design tokens come from `src/theme.ts`; avoid hard-coded colors in screens.
- Add a migration for every schema change.
- Add tests for every state transition and progress rule.
- Keep demo data isolated under `src/data` and remove it from production paths as the vertical slice becomes persistent.
