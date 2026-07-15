# Levera execution plan

This is the live operating plan. Every agent must read it before working and update it in the same change set.

## Status

- **Current stage:** P2 — Local application shell
- **Current milestone:** Run on a simulator/device, verify SQLite persistence across restart and finish dark theme
- **Last updated:** 2026-07-15
- **Application status:** clean CI install, TypeScript, tests and Android Expo bundle pass; SQLite startup is wired, device persistence remains
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

- [x] ~~Organize all documents under `docs/`~~ — Evidence: repository structure.
- [x] ~~Reserve `apps/` for source code~~ — Evidence: `apps/README.md`.
- [x] ~~Add agent entry point and progress protocol~~ — Evidence: `AGENTS.md`.
- [x] ~~Set Pavel as first product user and defer family validation~~ — Evidence: personal-first direction.

---

## P1 — Personal MVP specification and foundation

- [x] ~~Confirm Today, Skill Tree, Progress, Weekly Review and Connections navigation~~ — Evidence: five Expo Router tabs.
- [x] ~~Separate activity XP, reviewed mastery and repetition health~~ — Evidence: architecture and domain rules.
- [x] ~~Define L3–L0 support levels~~ — Evidence: architecture contract.
- [x] ~~Define goals, skills, edges, quests, completions, evidence and reviews~~ — Evidence: domain types and SQLite schema.
- [x] ~~Define Markdown IDs, attachments, backup and restore contract~~ — Evidence: architecture document.
- [x] ~~Produce migration runner and first vertical-slice acceptance criteria~~ — Evidence: `apps/mobile/src/storage/` and architecture.

**Decision gate:** complete.

---

## P2 — Local application shell

**Goal:** a reliable local-first application that opens, navigates and persists data.

- [x] ~~Create `apps/mobile/` with Expo, React Native and TypeScript~~ — Evidence: package and app configuration.
- [x] ~~Configure Expo Router~~ — Evidence: root redirect and five-tab shell.
- [x] ~~Configure SQLite and migrations~~ — Evidence: migration runner and initial schema.
- [x] ~~Connect SQLite initialization to application startup~~ — Evidence: `DatabaseProvider`, migrations and startup write/read health check.
- [x] ~~Separate domain and storage logic from UI~~ — Evidence: `src/domain` and `src/storage`.
- [ ] Add complete light/dark brand tokens.
  Progress: light Levera tokens and five visual shell screens exist; dark theme remains.
- [x] ~~Complete clean dependency installation, TypeScript and automated domain tests~~ — Evidence: Mobile CI succeeds; 4 tests pass.
- [x] ~~Verify Expo can produce the Android JavaScript bundle~~ — Evidence: Mobile CI `expo export --platform android` succeeds after adding required Expo runtime dependencies.
- [x] ~~Add local development instructions~~ — Evidence: `apps/mobile/README.md`.
- [ ] Verify application start and SQLite persistence across restart on a simulator or physical device.
  Progress: startup migration and health-check code compile and bundle successfully; device restart test remains.

**Decision gate:** application runs on a device and persists a test record across restart.

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
- [ ] Add recovery after inactivity without guilt.
- [ ] Support maintenance without XP rewards.

---

## P6 — Markdown and second-brain integration

- [ ] Export goals, skills, quests and reviews to Markdown.
- [ ] Include stable IDs in YAML frontmatter.
- [ ] Import without duplicates.
- [ ] Link entities to external notes and Obsidian URIs.
- [ ] Document vault structure and add round-trip tests.
- [ ] Keep automatic two-way sync deferred.

---

## P7 — Personal dogfooding and stabilization

- [ ] Create Pavel's real initial goals and skills.
- [ ] Use the application daily for four weeks.
- [ ] Complete four weekly reviews.
- [ ] Track friction and abandoned workflows.
- [ ] Fix data loss and blocking UX first.
- [ ] Decide whether cloud, desktop or AI is next.

---

## Future — Family product

Deferred, not completed:

- [ ] Parent interviews and Wizard-of-Oz pilot.
- [ ] Parent/child accounts and family rewards.
- [ ] Child-safety and store compliance.
- [ ] Monetisation, B2B2C and marketplace.

## Explicitly deferred from personal MVP

- AI-generated quests.
- Cloud synchronization.
- Automatic two-way Obsidian sync.
- Payments, subscriptions and public rankings.

## Blockers and decisions needed

- Simulator or physical-device restart test is still required for SQLite persistence.
- Dark theme is not implemented.
- Skill-graph visualization library is not selected.
- Mobile file-access differences remain before Markdown import/export.

## Changelog

### 2026-07-15 — Runtime and bundle verification

- Wired database migrations into root application startup.
- Added a real SQLite startup write/read health check.
- Added loading and failure UI for local database initialization.
- Expanded CI from typecheck/tests to Android Expo bundle validation.
- Captured and fixed the missing `expo-asset` runtime dependency plus required Expo Router support packages.
- Mobile CI now completes successfully.

### 2026-07-15 — Personal MVP foundation

- Completed P1 architecture and domain decisions.
- Added Expo Router screens and local-first SQLite foundation.
- Added 4 passing domain tests and visual QA.

### 2026-07-15 — Personal-first pivot

- Deferred family validation and set Pavel as the first user.

### 2026-07-15 — Repository plan created

- Added live execution plan and agent progress rules.
