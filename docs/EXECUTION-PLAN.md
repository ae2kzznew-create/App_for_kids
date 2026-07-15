# Levera execution plan

This is the live operating plan. Every agent must read it before working and update it in the same change set.

## Status

- **Current stage:** P2 + P3 — Runtime shell and first vertical slice
- **Current milestone:** Connect `SQLitePersonalRepository` to real UI forms and replace demo quests
- **Last updated:** 2026-07-15
- **Application status:** Expo bundle passes; goal/skill/quest lifecycle exists in tested service and repository layers; UI still uses demo data
- **Primary user:** Pavel, acting as architect, performer and coach
- **Active direction:** `docs/product/PERSONAL-FIRST-DIRECTION.md`

## Progress overview

- [x] ~~Stage 0 — Repository foundation~~ — Evidence: organized documentation, `AGENTS.md` and live plan.
- [x] ~~Direction decision — Personal-first application~~ — Evidence: personal-first direction.
- [x] ~~P1 — Personal MVP specification and foundation~~ — Evidence: architecture, domain rules, migration and tests.
- [ ] P2 — Local application shell
- [ ] P3 — Goals, skills and quests vertical slice
- [ ] P4 — Skill tree and progress visualization
- [ ] P5 — Weekly review and development techniques
- [ ] P6 — Markdown and second-brain integration
- [ ] P7 — Personal dogfooding and stabilization
- [ ] Future — Family product validation and expansion

---

## P1 — Personal MVP specification and foundation

- [x] ~~Define navigation and personal product boundary~~ — Evidence: architecture and five routes.
- [x] ~~Separate activity XP, reviewed mastery and repetition health~~ — Evidence: domain rules.
- [x] ~~Define L3–L0, goals, skills, quests, completions and Markdown IDs~~ — Evidence: architecture and types.
- [x] ~~Produce SQLite schema, backup contract and engineering conventions~~ — Evidence: storage foundation and technical documentation.

**Decision gate:** complete.

---

## P2 — Local application shell

- [x] ~~Create Expo/React Native/TypeScript application~~ — Evidence: `apps/mobile/`.
- [x] ~~Configure Expo Router and five-tab shell~~ — Evidence: application routes.
- [x] ~~Configure SQLite migrations and root startup initialization~~ — Evidence: storage layer and `DatabaseProvider`.
- [x] ~~Add startup SQLite write/read health check and error UI~~ — Evidence: database startup code.
- [x] ~~Separate domain/storage logic from UI~~ — Evidence: source structure.
- [ ] Add complete light/dark brand tokens.
  Progress: light design exists; dark theme remains.
- [x] ~~Pass clean install, TypeScript, automated tests and Android Expo bundle~~ — Evidence: Mobile CI.
- [ ] Verify SQLite persistence across restart on simulator or physical device.
  Progress: initialization compiles and bundles; device restart remains.

**Decision gate:** application runs on device and persists a record across restart.

---

## P3 — Goals, skills and quests vertical slice

**Goal:** `goal → skill → quest → completion → reflection → visible progress` without raw database edits.

- [x] ~~Implement create, archive and restore goal lifecycle in the service layer~~ — Evidence: `PersonalService` and tests.
- [x] ~~Implement skill creation linked to a non-archived goal~~ — Evidence: service validation and repository contract.
- [x] ~~Implement quest creation linked to one or more skills~~ — Evidence: quest-skill persistence and tests.
- [x] ~~Support quest levels L3–L0 and validated XP~~ — Evidence: typed service inputs and validation.
- [x] ~~Implement completion with optional evidence and reflection~~ — Evidence: `finishQuest`.
- [x] ~~Persist completion, quest status and immutable progress event atomically~~ — Evidence: SQLite transaction and memory test.
- [ ] Connect the service and SQLite repository to UI forms.
- [ ] Replace Today demo quests with live active quests.
- [ ] Show completed work in Today and skill history.
- [ ] Add SQLite-backed lifecycle and persistence tests.
  Progress: 4 new service lifecycle tests pass against the in-memory repository; device SQLite integration remains.

**Decision gate:** Pavel performs the complete loop through UI with persistent data.

---

## P4 — Skill tree and progress visualization

- [ ] Add directed skill relationships and cycle protection.
- [ ] Display interactive skill tree.
- [ ] Show growing, stable, due, fading and paused states.
- [ ] Show progress by day, week, month, goal and skill.
- [ ] Keep activity separate from demonstrated skill.
- [ ] Verify interaction with at least 50 skills.

---

## P5 — Weekly review and development techniques

- [ ] Implement structured weekly review.
- [ ] Surface achievements, stalled skills and repetitions.
- [ ] Allow reviewed mastery/support adjustments.
- [ ] Implement spaced repetition and recovery without guilt.
- [ ] Support maintenance without XP rewards.

---

## P6 — Markdown and second-brain integration

- [ ] Export goals, skills, quests and reviews to Markdown.
- [ ] Include stable IDs in YAML frontmatter.
- [ ] Import without duplicates.
- [ ] Link external notes and Obsidian URIs.
- [ ] Document vault structure and test round trips.

---

## P7 — Personal dogfooding

- [ ] Create Pavel's real goals and skills.
- [ ] Use daily for four weeks and complete four weekly reviews.
- [ ] Track friction and fix data loss/blocking UX first.
- [ ] Decide whether cloud, desktop or AI is next.

---

## Future — Family product

Deferred, not completed:

- [ ] Parent interviews and Wizard-of-Oz pilot.
- [ ] Parent/child accounts, rewards and child-safety review.
- [ ] Monetisation, B2B2C and marketplace.

## Explicitly deferred from personal MVP

- AI-generated quests.
- Cloud and automatic two-way Obsidian sync.
- Payments and public rankings.

## Blockers and decisions needed

- Device restart test remains for SQLite persistence.
- Dark theme is not implemented.
- UI still reads demo data.
- Skill-graph library and mobile file-access strategy are not selected.

## Changelog

### 2026-07-15 — Personal service vertical slice

- Added repository contract plus in-memory and SQLite implementations.
- Added PersonalService for goal lifecycle, skills, linked quests and completion.
- Added atomic completion + progress-event persistence.
- Added 4 lifecycle/validation tests; full Mobile CI succeeds.
- Advanced P3 to the UI integration boundary.

### 2026-07-15 — Runtime and bundle verification

- Wired SQLite into root startup, fixed runtime dependencies and passed Android Expo bundle.

### 2026-07-15 — Personal MVP foundation

- Completed P1 architecture, shell, schema, tests and visual QA.

### 2026-07-15 — Personal-first pivot

- Deferred family validation and set Pavel as first user.
