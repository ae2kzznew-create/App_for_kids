# AGENTS.md — Levera repository operating guide

This file is the first entry point for any AI agent or contributor working in this repository.

## Required reading order

Before making changes, read:

1. `AGENTS.md` — operating rules and status protocol.
2. `docs/EXECUTION-PLAN.md` — current stage, completed work, next actions and decision gates.
3. `docs/product/PERSONAL-FIRST-DIRECTION.md` — active product direction for the first implementation.
4. `docs/product/Product-Bible.html` — original product principles and family vision.
5. Documents relevant to the task under `docs/`.

Material in `docs/archive/` is historical and is not authoritative.

## Source-of-truth order

When documents conflict, use this priority:

1. Explicit user instruction in the current task.
2. `docs/EXECUTION-PLAN.md` for stage and sequencing.
3. `docs/product/PERSONAL-FIRST-DIRECTION.md` for the current personal MVP.
4. `docs/product/Product-Bible.html` for reusable product principles and the future family vision.
5. Other canonical documents outside `docs/archive/`.
6. Archived and raw research only as supporting context.

The personal-first direction intentionally overrides family-specific assumptions for the current MVP.

## Progress-update protocol

Every agent that completes repository work must update `docs/EXECUTION-PLAN.md` in the same pull request or commit.

- Pending: `- [ ] Task`
- Complete: `- [x] ~~Task~~ — Evidence: ...`
- Mark complete only when acceptance criteria are satisfied.
- For partial work, keep the item unchecked and add a `Progress:` note.
- Update current stage, milestone, blockers, date and changelog.
- Link evidence when possible.
- Deferred work is not completed work and must not be checked off.

## Current product scope

The first application is **Levera Personal**, built for Pavel's own use.

Pavel acts as:

- architect — goals, skills, quests and difficulty;
- performer — execution, evidence and reflection;
- coach — weekly review, repetition and next challenge.

Core loop:

`goal → skill → quest → evidence/reflection → progress update → next challenge → weekly review`

Core capabilities:

- visible personal progress;
- skill tree or graph;
- quests with L3–L0 support levels;
- spaced repetition and maintenance;
- weekly review;
- Markdown-based second-brain integration;
- optional Obsidian adapter later.

Initial application layout:

```text
apps/
  mobile/   React Native / Expo personal application

docs/      Product and company documentation
```

Family accounts, monetisation, AI quest generation and two-way Obsidian sync are deferred.

## Product sequencing rules

- Build the local personal loop before adding cloud services.
- Build Markdown import/export before tool-specific two-way sync.
- Separate activity metrics from demonstrated skill.
- Do not use guilt, lost-streak anxiety or unsupported social comparison.
- Keep domain logic separate from UI.
- Do not add AI until the manual personal workflow is useful.
- Preserve the original family vision as future material, not current MVP requirements.

## Definition of done

A task is done only when:

1. The requested artifact or behavior exists.
2. It has been reviewed or tested at the appropriate level.
3. No known destructive regression remains.
4. Documentation and links are updated.
5. `docs/EXECUTION-PLAN.md` reflects the real status.
