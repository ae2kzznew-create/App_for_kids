# Levera execution plan

This is the live operating plan. Every agent must read it before working and update it in the same change set.

## Status

- **Current stage:** P2–P4 device gates, P5 implemented, P6 ready
- **Current milestone:** Begin Markdown export with stable YAML IDs
- **Last updated:** 2026-07-16
- **Application status:** the full P5 review loop works, including explicit mastery, spaced repetition, guilt-free recovery and visible maintenance actions with zero XP
- **Primary user:** Pavel, acting as architect, performer and coach
- **Active direction:** `docs/product/PERSONAL-FIRST-DIRECTION.md`

## Progress overview

- [x] ~~Stage 0 — Repository foundation~~ — Evidence: organized documentation, `AGENTS.md` and live plan.
- [x] ~~Direction decision — Personal-first application~~ — Evidence: personal-first direction.
- [x] ~~P1 — Personal MVP specification and foundation~~ — Evidence: architecture, domain rules, migration and tests.
- [ ] P2 — Local application shell
- [ ] P3 — Goals, skills and quests vertical slice
- [ ] P4 — Skill tree and progress visualization
- [x] ~~P5 — Weekly review and development techniques~~ — Evidence: weekly review, evidence-based mastery, repetition, recovery and maintenance.
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
- [x] ~~Pass clean install, TypeScript, all automated tests and Android Expo bundle~~ — Evidence: Mobile CI.
- [ ] Verify SQLite persistence across restart on simulator or physical device.
  Progress: Settings exposes cross-launch evidence; one full device close/reopen remains.

**Decision gate:** application runs on device and persists a record across restart.

---

## P3 — Goals, skills and quests vertical slice

**Goal:** `goal → skill → quest → completion → reflection → visible progress` without raw database edits.

- [x] ~~Implement goal create/archive/restore lifecycle~~ — Evidence: service, repositories and tests.
- [x] ~~Implement skills linked to non-archived goals~~ — Evidence: service validation.
- [x] ~~Implement quests linked to one or more skills~~ — Evidence: quest-skill persistence.
- [x] ~~Support L3–L0 and validated XP~~ — Evidence: typed service and UI selector.
- [x] ~~Implement completion with evidence and reflection~~ — Evidence: quest completion screen.
- [x] ~~Persist completion, status and progress event atomically~~ — Evidence: SQLite transaction.
- [x] ~~Connect PersonalService and SQLite repository to application context~~ — Evidence: provider.
- [x] ~~Add UI for creating a goal, skill and first quest~~ — Evidence: `/setup`.
- [x] ~~Replace Today demo quests with live SQLite active quests~~ — Evidence: live query.
- [x] ~~Add UI for opening and completing a real quest~~ — Evidence: `/quest/[id]`.
- [x] ~~Show completed work in Today and skill history~~ — Evidence: Progress and `/skill/[id]`.
- [ ] Add SQLite-backed lifecycle and persistence tests.
  Progress: service tests pass against memory repository; automated device SQLite integration remains.

**Decision gate:** complete loop through UI with persistent data and visible history.

---

## P4 — Skill tree and progress visualization

- [x] ~~Add directed skill relationships and cycle protection~~ — Evidence: persistent edges and tests.
- [x] ~~Display interactive skill tree~~ — Evidence: layered pressable graph.
- [x] ~~Show growing, stable, due, fading and paused states~~ — Evidence: semantic graph nodes.
- [x] ~~Show progress by day, week, month, goal and skill~~ — Evidence: period and entity rollups.
- [x] ~~Keep activity separate from demonstrated skill~~ — Evidence: XP versus reviewed mastery.
- [ ] Verify interaction with at least 50 skills.
  Progress: automated fixture verifies 50 skills across ten levels; final device press/scroll check remains.

---

## P5 — Weekly review and development techniques

- [x] ~~Implement structured weekly review~~ — Evidence: persistent review form, history and progress event.
- [x] ~~Surface achievements, stalled skills and repetitions~~ — Evidence: seven-day facts and due/fading callout.
- [x] ~~Allow reviewed mastery/support adjustments~~ — Evidence: evidence-required skill review, atomic event and no XP.
- [x] ~~Implement spaced repetition and recovery without guilt~~ — Evidence: mastery-based intervals, due/fading queue, pause and gentle zero-XP recovery.
- [x] ~~Support maintenance without XP rewards~~ — Evidence: explicit maintenance mode, visible zero-XP labels and completion tests.

**Decision gate:** automated P5 flow complete; device dogfooding remains part of P7.

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

- Device close/reopen remains for SQLite confirmation.
- Dark theme is not implemented.
- Automated device-level SQLite integration tests remain.
- Device press/scroll check remains for the 50-skill P4 gate.
- Mobile file-access strategy is not selected.

## Changelog

### 2026-07-16 — Zero-XP maintenance mode

- Added an explicit maintenance switch when creating a path.
- Displayed maintenance separately from rewarded activity in Today and quest detail.
- Preserved evidence and reflection while completion, progress events and activity totals stay at zero XP.
- Added a domain test proving maintenance does not change mastery automatically.
- Completed the implementation portion of P5.

### 2026-07-16 — Spaced repetition and gentle recovery

- Added mastery-based intervals, derived repetition health, an ordered queue, pause and zero-XP recovery.
- Added deterministic interval, state, queue and recovery tests.

### 2026-07-16 — Reviewed skill adjustments

- Added evidence-required mastery and L3–L0 adjustment with atomic zero-XP events.

### 2026-07-16 — Persistent weekly review

- Added persistent reviews, seven-day facts, due/fading skills and previous decisions.

### 2026-07-16 — Skill graph and progress

- Added a 50-skill fixture, period/entity rollups, cycle-safe edges, interactive rendering and skill health.

### 2026-07-16 — Cross-launch SQLite verification

- Added previous-launch evidence and a visible Settings status.

### 2026-07-15 — Persistent Personal UI and service

- Added SQLite-backed goal, skill, quest, completion, evidence, reflection and history flows.
- Added Android bundle validation and domain tests.

### 2026-07-15 — Personal-first pivot

- Deferred family validation and set Pavel as first user.
