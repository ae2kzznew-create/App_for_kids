# Levera execution plan

This is the live operating plan. Every agent must read it before working and update it in the same change set.

## Status

- **Current stage:** P2 + P3 — Runtime shell and persistent personal loop
- **Current milestone:** Add completed-work history and verify SQLite persistence across device restart
- **Last updated:** 2026-07-15
- **Application status:** real SQLite-backed creation and completion UI compiles, tests and Android bundle pass; skill history and device restart test remain
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
  Progress: light design and persistent forms exist; dark theme remains.
- [x] ~~Pass clean install, TypeScript, all automated tests and Android Expo bundle~~ — Evidence: Mobile CI on persistent UI PR.
- [ ] Verify SQLite persistence across restart on simulator or physical device.
  Progress: real setup and completion flows use SQLite and bundle successfully; device restart remains.

**Decision gate:** application runs on device and persists a record across restart.

---

## P3 — Goals, skills and quests vertical slice

**Goal:** `goal → skill → quest → completion → reflection → visible progress` without raw database edits.

- [x] ~~Implement goal create/archive/restore lifecycle in service and repository layers~~ — Evidence: `PersonalService`, repositories and tests.
- [x] ~~Implement skills linked to non-archived goals~~ — Evidence: service validation.
- [x] ~~Implement quests linked to one or more skills~~ — Evidence: quest-skill persistence.
- [x] ~~Support L3–L0 and validated XP~~ — Evidence: typed service and UI selector.
- [x] ~~Implement completion with evidence and reflection~~ — Evidence: quest completion screen.
- [x] ~~Persist completion, status and progress event atomically~~ — Evidence: SQLite transaction.
- [x] ~~Connect PersonalService and SQLite repository to application context~~ — Evidence: `PersonalAppProvider`.
- [x] ~~Add UI for creating a goal, skill and first quest~~ — Evidence: `/setup` route.
- [x] ~~Replace Today demo quests with live SQLite active quests~~ — Evidence: Today focus reload and repository query.
- [x] ~~Add UI for opening and completing a real quest~~ — Evidence: `/quest/[id]` route.
- [ ] Show completed work in Today and skill history.
  Progress: completed quests disappear from active Today after refresh; dedicated history remains.
- [ ] Add SQLite-backed lifecycle and persistence tests.
  Progress: service tests pass against memory repository; device SQLite integration remains.

**Decision gate:** Pavel performs the complete loop through UI with persistent data and visible history.

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
- Dedicated completed-work and skill-history UI remains.
- Skill-graph library and mobile file-access strategy are not selected.

## Changelog

### 2026-07-15 — Persistent Personal UI

- Added application context for SQLite repository and PersonalService.
- Replaced demo Today data with live active quests.
- Added first-path setup form for goal, skill, quest and L3–L0.
- Added evidence/reflection completion screen.
- Added focus/revision refresh after writes.
- Completed visual QA of the setup form with no overflow or overlap.
- Full Mobile CI and Android Expo bundle pass.

### 2026-07-15 — Personal service vertical slice

- Added repository implementations, PersonalService and atomic completion events.
- Added 4 lifecycle/validation tests.

### 2026-07-15 — Runtime and foundation

- Added SQLite startup health checks, Expo bundle validation and Personal MVP shell.

### 2026-07-15 — Personal-first pivot

- Deferred family validation and set Pavel as first user.
