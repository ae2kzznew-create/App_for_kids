# Levera execution plan

This is the live operating plan. Every agent must read it before working and update it in the same change set.

## Status

- **Current stage:** P2 — Local application shell
- **Current milestone:** Install dependencies, launch Expo and connect the first SQLite-backed vertical slice
- **Last updated:** 2026-07-15
- **Application status:** Expo shell, domain rules and SQLite schema added; dependency installation and runtime launch remain
- **Primary user:** Pavel, acting as architect, performer and coach
- **Active direction:** `docs/product/PERSONAL-FIRST-DIRECTION.md`

## Progress overview

- [x] ~~Stage 0 — Repository foundation~~ — Evidence: organized documentation, `AGENTS.md` and live plan.
- [x] ~~Direction decision — Personal-first application~~ — Evidence: `docs/product/PERSONAL-FIRST-DIRECTION.md`.
- [x] ~~P1 — Personal MVP specification and foundation~~ — Evidence: `docs/technical/PERSONAL-MVP-ARCHITECTURE.md`, domain rules, SQLite migration and tests.
- [ ] P2 — Local application shell
- [ ] P3 — Goals, skills and quests vertical slice
- [ ] P4 — Skill tree and progress visualization
- [ ] P5 — Weekly review and development techniques
- [ ] P6 — Markdown and second-brain integration
- [ ] P7 — Personal dogfooding and stabilization
- [ ] Future — Family product validation and expansion

---

## Completed foundation

- [x] ~~Organize all documents under `docs/`~~ — Evidence: current repository structure.
- [x] ~~Reserve `apps/` for source code~~ — Evidence: `apps/README.md`.
- [x] ~~Add an agent entry point and progress protocol~~ — Evidence: `AGENTS.md`.
- [x] ~~Set Pavel as the first product user~~ — Evidence: personal-first direction.
- [x] ~~Defer family interviews without deleting the family vision~~ — Evidence: future section below.

---

## P1 — Personal MVP specification and foundation

- [x] ~~Confirm Today, Skill Tree, Progress, Weekly Review and Connections navigation~~ — Evidence: accepted architecture and five Expo Router tabs.
- [x] ~~Separate activity XP, reviewed mastery and repetition health~~ — Evidence: architecture document and `src/domain/progress.ts`.
- [x] ~~Define L3, L2, L1 and L0 support levels~~ — Evidence: architecture contract.
- [x] ~~Define goals, skills, edges, quests, completions, evidence and reviews~~ — Evidence: domain types and SQLite schema.
- [x] ~~Define Markdown frontmatter and stable IDs~~ — Evidence: architecture document.
- [x] ~~Scope alpha evidence to text, HTTPS links and external note paths~~ — Evidence: architecture document.
- [x] ~~Produce the SQLite schema and migration runner~~ — Evidence: `apps/mobile/src/storage/`.
- [x] ~~Define versioned JSON backup and readable Markdown export~~ — Evidence: architecture document.
- [x] ~~Define the first vertical-slice acceptance criteria~~ — Evidence: architecture document.
- [x] ~~Create engineering conventions and the app workspace~~ — Evidence: strict TypeScript, domain/storage separation and scripts.

**Decision gate:** complete.

---

## P2 — Local application shell

**Goal:** a reliable local-first application that opens, navigates and persists data.

- [x] ~~Create `apps/mobile/` with Expo, React Native and TypeScript~~ — Evidence: package and app configuration.
- [x] ~~Configure Expo Router~~ — Evidence: root redirect and five-tab shell.
- [x] ~~Configure SQLite and migrations~~ — Evidence: migration runner and initial schema.
- [x] ~~Separate domain and storage logic from UI~~ — Evidence: `src/domain` and `src/storage`.
- [ ] Add complete light/dark brand tokens.
  Progress: light Levera tokens and five visual shell screens added; dark theme remains.
- [ ] Complete type checking, linting and automated tests.
  Progress: scripts added and 4 pure domain tests pass locally; dependency install, full typecheck and lint remain.
- [x] ~~Add local development instructions~~ — Evidence: `apps/mobile/README.md`.
- [ ] Verify clean dependency install, Expo launch and database initialization.

**Decision gate:** the application runs locally and persists a test record across restarts.

---

## P3 — Goals, skills and quests vertical slice

**Goal:** `goal → skill → quest → completion → reflection → visible progress` without raw database edits.

- [ ] Create, edit, archive and restore a goal.
- [ ] Create a skill linked to a goal.
- [ ] Create a quest linked to one or more skills.
- [ ] Select support level L3–L0.
- [ ] Complete a quest with optional evidence and reflection.
- [ ] Emit an immutable progress event.
- [ ] Show completion in Today and skill history.
- [ ] Add lifecycle and persistence tests.

---

## P4 — Skill tree and progress visualization

- [ ] Create directed skill relationships and cycle protection.
- [ ] Display an interactive skill tree.
- [ ] Show growing, stable, due, fading and paused states.
- [ ] Show progress by day, week, month, goal and skill.
- [ ] Keep activity separate from demonstrated skill.
- [ ] Verify interaction with at least 50 skills.

---

## P5 — Weekly review and development techniques

- [ ] Implement structured weekly review.
- [ ] Surface achievements, stalled skills and due repetitions.
- [ ] Allow reviewed mastery and support-level adjustments.
- [ ] Implement spaced-repetition scheduling.
- [ ] Add recovery after inactivity without guilt or lost-streak pressure.
- [ ] Support maintenance without XP rewards.

---

## P6 — Markdown and second-brain integration

- [ ] Export goals, skills, quests and reviews to Markdown.
- [ ] Include stable IDs in YAML frontmatter.
- [ ] Import without duplicate entities.
- [ ] Link entities to external notes and Obsidian URIs.
- [ ] Document the recommended vault structure.
- [ ] Add round-trip backup and restore tests.
- [ ] Keep automatic two-way sync deferred.

---

## P7 — Personal dogfooding and stabilization

- [ ] Create Pavel's real initial goals and skills.
- [ ] Use the application daily for four weeks.
- [ ] Complete four weekly reviews.
- [ ] Track friction and abandoned workflows.
- [ ] Fix data loss and blocking UX first.
- [ ] Decide whether cloud, desktop or AI is the next addition.

---

## Future — Family product

Deferred, not completed:

- [ ] Parent interviews and Wizard-of-Oz pilot.
- [ ] Parent/child accounts and confirmation loop.
- [ ] Family rewards and child-safety review.
- [ ] Monetisation, B2B2C and marketplace.

## Explicitly deferred from personal MVP

- AI-generated quests.
- Cloud synchronization.
- Automatic two-way Obsidian sync.
- Payments, subscriptions and public rankings.

## Blockers and decisions needed

- Expo dependencies have not yet been installed in a clean environment.
- Full typecheck, lint and application runtime launch remain.
- Skill-graph visualization library is not selected.
- Mobile file-access differences must be resolved before Markdown import/export.

## Changelog

### 2026-07-15 — Personal MVP foundation

- Completed P1 architecture and domain decisions.
- Added Expo Router screens for Today, Skills, Progress, Review and Connections.
- Added local-first SQLite schema and migration runner.
- Added pure domain completion and skill-health rules; 4 tests pass.
- Completed visual QA of the Today direction with no overlap or overflow.
- Advanced the active stage to P2.

### 2026-07-15 — Personal-first pivot

- Deferred family validation and set Pavel as the first user.
- Added personal product direction and direct implementation path.

### 2026-07-15 — Repository plan created

- Added live execution plan and agent progress rules.
