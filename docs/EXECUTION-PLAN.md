# Levera execution plan

This is the live operating plan for the project. Any agent working in the repository must read it before acting and update it after completing work.

## Status

- **Current stage:** P1 — Personal MVP specification and foundation
- **Current milestone:** Finalize the personal domain model, application architecture and first vertical slice
- **Last updated:** 2026-07-15
- **Application status:** Personal-first direction fixed; application source code not started
- **Primary user:** Pavel, using Levera as both architect and performer
- **Active product direction:** `docs/product/PERSONAL-FIRST-DIRECTION.md`

## Progress overview

- [x] ~~Stage 0 — Repository foundation~~ — Evidence: documentation grouped under `docs/`; agent operating guide and execution plan added.
- [x] ~~Direction decision — Personal-first application~~ — Evidence: `docs/product/PERSONAL-FIRST-DIRECTION.md`.
- [ ] P1 — Personal MVP specification and foundation
- [ ] P2 — Local application shell
- [ ] P3 — Goals, skills and quests vertical slice
- [ ] P4 — Skill tree and progress visualization
- [ ] P5 — Weekly review and development techniques
- [ ] P6 — Markdown and second-brain integration
- [ ] P7 — Personal dogfooding and stabilization
- [ ] Future — Family product validation and expansion

---

## Stage 0 — Repository foundation

- [x] ~~Organize all documents under `docs/`~~ — Evidence: current repository structure.
- [x] ~~Create repository navigation and reserve `apps/` for source code~~ — Evidence: `README.md` and `apps/README.md`.
- [x] ~~Add agent entry point and live progress protocol~~ — Evidence: `AGENTS.md` and this plan.

**Decision gate:** complete.

---

## Direction decision — Personal-first application

**Goal:** fix the first implementation around a real personal user instead of waiting for family-market validation.

- [x] ~~Define Pavel as the first and primary user~~ — Evidence: `docs/product/PERSONAL-FIRST-DIRECTION.md`.
- [x] ~~Adapt the parent/child model into architect, performer and coach modes~~ — Evidence: personal product direction.
- [x] ~~Define visible progress, skill tree and second-brain integration as core capabilities~~ — Evidence: personal MVP requirements.
- [x] ~~Defer interviews and Wizard-of-Oz testing without deleting the family vision~~ — Evidence: deferred-work section below.

**Decision gate:** complete. Implementation may proceed without Stage 1 family interviews.

---

## P1 — Personal MVP specification and foundation

**Goal:** produce one internally consistent specification and create the development foundation.

- [ ] Confirm the initial navigation: Today, Skill Tree, Progress, Weekly Review and Settings.
- [ ] Define the exact progress model: activity, XP, demonstrated skill, consistency and repetition health.
- [ ] Define skill levels and the rules for moving between L3, L2, L1 and L0.
- [ ] Define the relationship between goals, skills, quests and evidence.
- [ ] Define Markdown frontmatter and stable IDs for import/export.
- [ ] Decide which attachment types are supported in the personal alpha.
- [ ] Produce the SQLite schema and migrations.
- [ ] Define local backup and restore behavior.
- [ ] Define acceptance criteria for the first vertical slice.
- [ ] Create the app workspace and engineering conventions.

**Decision gate:** the domain model, storage model and first vertical slice agree with the personal direction.

---

## P2 — Local application shell

**Goal:** a reliable local-first application that opens, navigates and persists data.

- [ ] Create `apps/mobile/` with Expo, React Native and TypeScript.
- [ ] Configure Expo Router.
- [ ] Configure SQLite and migrations.
- [ ] Add domain and validation layers separated from UI.
- [ ] Add light/dark design tokens based on the Levera brand.
- [ ] Add type checking, linting and automated tests.
- [ ] Add local development and build instructions.
- [ ] Verify a clean install, application start and database initialization.

**Decision gate:** the application runs locally and can persist a test record across restarts.

---

## P3 — Goals, skills and quests vertical slice

**Goal:** complete the first real end-to-end personal development loop.

- [ ] Create, edit, archive and restore a goal.
- [ ] Create a skill linked to a goal.
- [ ] Create a quest linked to one or more skills.
- [ ] Select quest support level L3–L0.
- [ ] Complete a quest with optional evidence and reflection.
- [ ] Emit a progress event after completion.
- [ ] Show completed work in Today and skill history.
- [ ] Add tests for entity lifecycle and progress-event creation.

**Decision gate:** Pavel can perform the full loop `goal → skill → quest → completion → reflection → visible progress` without editing raw data.

---

## P4 — Skill tree and progress visualization

**Goal:** make growth understandable at a glance.

- [ ] Create directed skill relationships and prevent invalid cycles where required.
- [ ] Display a visual skill tree or graph.
- [ ] Show skill status: growing, stable, due, fading or paused.
- [ ] Show progress by day, week, month, goal and skill.
- [ ] Distinguish activity from demonstrated skill.
- [ ] Add meaningful milestone history without unsupported social comparison.
- [ ] Verify rendering and interaction with at least 50 skills.

**Decision gate:** the user can identify what is growing, what is blocked and what to do next in under one minute.

---

## P5 — Weekly review and development techniques

**Goal:** make the techniques from the original documents usable for self-development.

- [ ] Implement a structured weekly review.
- [ ] Surface achievements, stalled skills, due repetitions and next challenges.
- [ ] Allow manual adjustment of skill level and support level.
- [ ] Implement spaced-repetition scheduling.
- [ ] Add a recovery flow after inactivity without guilt or lost-streak pressure.
- [ ] Support moving stable behaviors into maintenance without XP rewards.
- [ ] Store weekly decisions as review records.

**Decision gate:** the weekly review results in a concrete next-week plan and updates the skill system.

---

## P6 — Markdown and second-brain integration

**Goal:** connect Levera to external knowledge without making one tool mandatory.

- [ ] Export goals, skills, quests and reviews to readable Markdown.
- [ ] Include stable IDs and metadata in YAML frontmatter.
- [ ] Import Markdown without creating duplicate entities.
- [ ] Link Levera entities to external note paths or URLs.
- [ ] Add an Obsidian URI action where supported.
- [ ] Document the recommended Obsidian vault structure.
- [ ] Add backup/restore tests for Markdown round trips.
- [ ] Defer two-way synchronization until one-way import/export is reliable.

**Decision gate:** a user can export, edit or store Levera information in a second brain and safely import it again.

---

## P7 — Personal dogfooding and stabilization

**Goal:** prove usefulness through sustained personal use.

- [ ] Import or create Pavel's real initial goals and skills.
- [ ] Use the application daily for at least four weeks.
- [ ] Complete at least four weekly reviews.
- [ ] Track friction, missing information and abandoned workflows.
- [ ] Fix data loss, blocking UX and incorrect progress behavior first.
- [ ] Remove features that do not help real weekly decisions.
- [ ] Decide whether cloud sync, desktop access or AI is the next highest-value addition.

**Decision gate:** Pavel voluntarily returns to the application and relies on it to decide what to do next.

---

## Future — Family product validation and expansion

The following work is intentionally parked while the personal product is built:

- [ ] Mom Test interviews with parents.
- [ ] Wizard-of-Oz family pilot.
- [ ] Parent/child accounts and confirmation loop.
- [ ] Family wish wheel and reward fulfillment.
- [ ] Child privacy and store compliance review.
- [ ] Monetisation validation.
- [ ] B2B2C and marketplace.

These tasks are **deferred, not completed**. Do not check or strike them through until they are actually performed.

---

## Explicitly deferred from the personal MVP

- AI-generated quests.
- Cloud synchronization.
- Automatic two-way Obsidian sync.
- Payments and subscriptions.
- Admin panel for families.
- Public social features and rankings.
- Marketplace and partner rewards.

## Blockers and decisions needed

- Exact personal progress formula is not yet defined.
- Skill graph interaction and visualization library are not yet selected.
- Markdown attachment and file-access behavior differs across mobile platforms and must be scoped.
- Two-way sync is intentionally deferred because conflict resolution is not designed.

## Changelog

### 2026-07-15 — Personal-first pivot

- Deferred family interviews and Wizard-of-Oz work.
- Set Pavel as the first product user.
- Added the personal product direction.
- Replaced the active plan with a direct path to implementation.
- Set P1 specification and foundation as the current stage.

### 2026-07-15 — Repository plan created

- Created the live execution plan.
- Marked repository foundation complete.
- Added progress-update rules for future agents.
