# Levera Personal — product direction

**Decision date:** 2026-07-15  
**Status:** active direction for the first implementation

## Decision

The first working Levera application will be built for the founder's personal use.

The founder is both sides of the original family model:

- **Architect mode** — chooses goals, defines skills, sets quests, adjusts difficulty and reviews progress.
- **Performer mode** — completes quests, records evidence and reflection, earns progress and develops skills.
- **Coach mode** — performs weekly review, notices fading skills and chooses the next challenge.

The original family and child product remains a possible future direction. It is not the current MVP.

## Problem to solve

Personal development information is fragmented across notes, task managers, habit trackers and memory. Existing tools show activity, but rarely show how concrete skills grow over time.

Levera Personal should answer five questions clearly:

1. What am I trying to become better at?
2. Which skills support that direction?
3. What is the next concrete action at my current level?
4. What evidence proves that I am progressing?
5. Which skills are growing, stable or fading?

## Core loop

`goal → skill → quest → completion evidence → reflection → progress update → next challenge → weekly review`

No parent confirmation is required in personal mode. Completion is self-confirmed, but evidence and reflection remain available to keep progress honest.

## Product principles adapted from the family concept

### Honest progress

The application records actions and evidence, not vague motivation. Progress views must distinguish:

- activity;
- consistency;
- demonstrated skill;
- self-assessment;
- scheduled repetition.

### Zone of proximal development

Every quest has a support level:

- **L3 — Guided:** step-by-step instructions.
- **L2 — Checklist:** milestones without detailed explanation.
- **L1 — Outcome:** only the expected result.
- **L0 — Independent:** perform and provide evidence without scaffolding.

The user can change the level manually. Automatic recommendations can be added later.

### Spaced repetition

Skills and practices can schedule reviews at increasing intervals. A skill can be shown as:

- growing;
- stable;
- due for repetition;
- fading;
- paused.

### Motivation that fades

XP, levels and rewards may help establish a routine, but they must not become the only reason to act. The application should allow a quest or skill to transition from rewarded practice to maintenance without rewards.

### Recovery without shame

After a pause, the application asks what to resume today. It does not use threats, lost-streak anxiety or guilt.

## Personal MVP

### Required screens

1. **Today** — current quests, due repetitions and quick completion.
2. **Skill tree** — visual graph of skills and dependencies.
3. **Skill detail** — level, evidence, history, related goals and next quests.
4. **Quest detail** — instructions, support level, completion and reflection.
5. **Progress** — activity, consistency, skill changes and meaningful milestones.
6. **Weekly review** — achievements, stalled skills, observations and next-week decisions.
7. **Second brain settings** — import, export and external links.

### Required capabilities

- Create goals and skills.
- Connect skills into a directed tree or graph.
- Create quests linked to one or more skills.
- Complete a quest with optional note, link, file reference or reflection.
- Update skill progress through explicit rules.
- Schedule repetition and maintenance.
- View progress by day, week, month, goal and skill.
- Run a structured weekly review.
- Export and import Markdown.
- Link a skill, quest or review to an external note.

## Second brain and Obsidian integration

Obsidian is one possible adapter, not a hard dependency. The common format is Markdown.

### Integration sequence

**MVP:**

- Export goals, skills, quests and weekly reviews as Markdown.
- Import selected Markdown files.
- Store external note paths or URLs on Levera entities.
- Include stable IDs in frontmatter so re-import does not create duplicates.

Example frontmatter:

```yaml
---
levera_id: skill_public_speaking
levera_type: skill
status: growing
level: 2
updated: 2026-07-15
---
```

**Later:**

- Open notes through Obsidian URI links.
- Sync a configured vault folder on supported desktop environments.
- Add adapters for other second-brain systems.
- Support conflict detection and two-way sync only after one-way import/export is reliable.

## Initial technical direction

- React Native with Expo and TypeScript.
- Expo Router for navigation.
- Local-first persistence using SQLite.
- Domain logic separated from UI.
- Markdown import/export as the first integration boundary.
- Cloud synchronization is optional and deferred until the local experience is useful.
- No child accounts, billing, family admin panel or public social layer in the first version.

## Initial domain model

- `Profile`
- `Goal`
- `Skill`
- `SkillEdge`
- `Quest`
- `QuestCompletion`
- `Evidence`
- `Reflection`
- `RepetitionSchedule`
- `WeeklyReview`
- `ExternalNoteLink`
- `ProgressEvent`

## First-release acceptance criteria

A personal alpha is usable when the founder can:

1. Create a goal.
2. Build a small skill tree under the goal.
3. Create a quest at a selected support level.
4. Complete it with evidence or reflection.
5. See the result reflected in the skill and progress views.
6. Complete a weekly review and choose the next action.
7. Export the resulting data to readable Markdown and import it without duplication.

## Explicitly deferred

- Parent and child roles.
- Interviews and Wizard-of-Oz family tests.
- Family rewards and parent confirmation.
- Monetisation and subscriptions.
- Marketplace and B2B2C.
- Public rankings or social comparison.
- AI-generated quests.
- Automatic Obsidian two-way sync.

These items are deferred, not rejected. They can be reconsidered after the personal product is genuinely useful through sustained dogfooding.
