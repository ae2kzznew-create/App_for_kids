# AGENTS.md — Levera repository operating guide

This file is the first entry point for any AI agent or contributor working in this repository.

## Required reading order

Before making changes, read:

1. `AGENTS.md` — operating rules and status protocol.
2. `docs/EXECUTION-PLAN.md` — current stage, completed work, next actions and decision gates.
3. `docs/product/Product-Bible.html` — canonical product vision and principles.
4. The documents relevant to the task:
   - research: `docs/research/README.md`
   - validation: `docs/validation/`
   - technical work: `docs/technical/`
   - UX/product work: `docs/product/`
   - marketing: `docs/marketing/`
   - business: `docs/business/`
   - legal/privacy: `docs/legal/`

Material in `docs/archive/` is historical and is not authoritative.

## Source-of-truth order

When documents conflict, use this priority:

1. Explicit user instruction in the current task.
2. `docs/EXECUTION-PLAN.md` for stage and sequencing.
3. `docs/product/Product-Bible.html` for product principles.
4. Current canonical documents outside `docs/archive/`.
5. Archived and raw research only as supporting context.

Do not silently resolve a material product, legal, privacy or safety conflict. Record it under **Blockers and decisions needed** in the execution plan.

## Progress-update protocol

Every agent that completes repository work must update `docs/EXECUTION-PLAN.md` in the same pull request or commit.

Rules:

- A pending task uses `- [ ] Task`.
- A completed task uses `- [x] ~~Task~~ — Evidence: ...`.
- Mark a task complete only when its acceptance criteria are satisfied.
- Do not mark an entire stage complete until every required task and its decision gate are complete.
- For partial work, leave the item unchecked and add an indented `Progress:` note.
- Add blockers to the dedicated blockers section.
- Update `Last updated`, `Current stage`, `Current milestone` and the changelog.
- Link evidence when possible: pull request, commit, report, dataset or test result.
- Never rewrite historical metrics to make results look better.

## Product sequencing rules

- Validate the problem before building the full application.
- Validate the core family loop before adding AI.
- Do not scale paid acquisition before retention and willingness to pay are demonstrated.
- Do not add marketplace, public child rankings, paid key acceleration or other post-PMF mechanics to the MVP.
- Parent approval is required for AI-generated child quests.
- Do not make public legal, privacy, scientific or market claims without verified evidence.

## Current product scope

Initial audience: Russian-speaking families with children aged 8–12.

Core loop:

`quest → child claims completion → parent confirmation → XP/key → wish wheel → reward fulfillment → weekly report`

Initial application layout:

```text
apps/
  mobile/   React Native / Expo family application
  admin/    Internal operations panel

docs/      Product and company documentation
```

## Definition of done

A task is done only when:

1. The requested artifact or behavior exists.
2. It has been reviewed or tested at the level appropriate to the task.
3. No known destructive regression remains.
4. Documentation and links are updated.
5. `docs/EXECUTION-PLAN.md` reflects the real status.
