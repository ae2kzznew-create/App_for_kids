# Levera execution plan

This is the live operating plan. Every agent must read it before working and update it in the same change set.

## Status

- **Current stage:** P2–P4 device gates, P6 complete, P7 pending
- **Current milestone:** Close remaining device-only gates for the personal alpha
- **Last updated:** 2026-07-17
- **Application status:** goals, skills, quests, reviews and external-note links can round-trip through Markdown, explicit Obsidian URIs and web notes can open from skill and quest screens, and the app now follows light/dark brand tokens
- **Primary user:** Pavel, acting as architect, performer and coach
- **Active direction:** `docs/product/PERSONAL-FIRST-DIRECTION.md`

## Operating mode

- Work autonomously from this plan: implement, test, update the plan, open a PR, repair CI and merge successful work.
- Ask Pavel only for a real blocker, irreversible action, security/privacy concern or product decision that materially changes direction.
- Never mark device-only verification complete without performing it.

## Progress overview

- [x] ~~Stage 0 — Repository foundation~~ — Evidence: organized documentation, `AGENTS.md` and live plan.
- [x] ~~Direction decision — Personal-first application~~ — Evidence: personal-first direction.
- [x] ~~P1 — Personal MVP specification and foundation~~ — Evidence: architecture, domain rules, migration and tests.
- [ ] P2 — Local application shell
- [ ] P3 — Goals, skills and quests vertical slice
- [ ] P4 — Skill tree and progress visualization
- [x] ~~P5 — Weekly review and development techniques~~ — Evidence: weekly review, evidence-based mastery, repetition, recovery and maintenance.
- [x] ~~P6 — Markdown and second-brain integration~~ — Evidence: deterministic export/import, duplicate-safe round trips, external-note frontmatter, and `docs/technical/OBSIDIAN-VAULT.md`.
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
- [x] ~~Add complete light/dark brand tokens~~ — Evidence: system-aware palettes in `apps/mobile/src/theme.ts` and matching status-bar selection in `apps/mobile/app/_layout.tsx`.
- [x] ~~Pass clean install, TypeScript, all automated tests and Android Expo bundle~~ — Evidence: Mobile CI.
- [ ] Verify SQLite persistence across restart on simulator or physical device.
  Progress: Settings exposes cross-launch evidence; one full device close/reopen remains. Manual steps are documented in `docs/technical/DEVICE-VERIFICATION-CHECKLIST.md`.

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
  Progress: service tests pass against memory repository; startup-marker coverage now exists, additional service edge-case coverage exists, but automated device SQLite integration remains.

**Decision gate:** complete loop through UI with persistent data and visible history.

---

## P4 — Skill tree and progress visualization

- [x] ~~Add directed skill relationships and cycle protection~~ — Evidence: persistent edges and tests.
- [x] ~~Display interactive skill tree~~ — Evidence: layered pressable graph.
- [x] ~~Show growing, stable, due, fading and paused states~~ — Evidence: semantic graph nodes.
- [x] ~~Show progress by day, week, month, goal and skill~~ — Evidence: period and entity rollups.
- [x] ~~Keep activity separate from demonstrated skill~~ — Evidence: XP versus reviewed mastery.
- [ ] Verify interaction with at least 50 skills.
  Progress: automated fixture verifies 50 skills across ten levels; final device press/scroll check remains. Manual steps are documented in `docs/technical/DEVICE-VERIFICATION-CHECKLIST.md`.

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

- [x] ~~Export goals, skills, quests and reviews to Markdown~~ — Evidence: deterministic document builder, Settings preview and native share sheet.
- [x] ~~Include stable IDs in YAML frontmatter~~ — Evidence: every document starts with `levera_id` and `levera_type`; tests verify stable paths and output.
- [x] ~~Import without duplicates~~ — Evidence: parser validates stable identities and relations, repositories upsert all four entity types, repeated round-trip test creates no copies, and Settings accepts pasted documents or bundles.
- [x] ~~Link external notes and Obsidian URIs~~ — Evidence: persistent external-note repository, validated vault paths/Obsidian URI/web URL helpers, and open/save/remove controls on skill and quest screens.
- [x] ~~Document vault structure and test round trips~~ — Evidence: `docs/technical/OBSIDIAN-VAULT.md`, external-note frontmatter round trips in export/import, and duplicate-safe tests for repeated imports.

**Decision gate:** repository-side second-brain integration is complete; device opening verification remains part of the manual gates below.

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
- Automated device-level SQLite integration tests remain.
- Device press/scroll check remains for the 50-skill P4 gate.
- Direct file picker and vault access strategy remain to be selected; import currently uses explicit paste and validation in Settings.
- External note opening still needs device verification with Obsidian installed.

## Changelog

### 2026-07-17 — Service edge-case coverage

- Added tests for idempotent skill disconnection and quest skill-ID deduplication.
- Added validation coverage for negative XP rewards and recovery attempts on skills that are not waiting for recovery.
- Reduced the chance of regressions around vertical-slice edge cases while manual device gates remain open.

### 2026-07-17 — Manual device verification checklist

- Added `docs/technical/DEVICE-VERIFICATION-CHECKLIST.md` for the remaining on-device gates.
- Documented repeatable pass criteria for SQLite restart, 50-skill interaction, external-note opening and dark-theme smoke checks.
- Linked the checklist from the live plan so future manual verification can be recorded consistently.

### 2026-07-16 — SQLite health-marker coverage

- Extracted startup-marker persistence logic into a pure storage helper.
- Added automated coverage for first-launch and second-launch marker behavior without needing a device runtime.
- Reduced the remaining SQLite-testing gap to device-level integration rather than untested health-marker logic.

### 2026-07-16 — Export-input regression coverage

- Extracted Markdown export-input assembly into a reusable helper used by Settings.
- Added automated coverage that proves saved external-note links are included for goals, skills, quests and weekly reviews before bundling.
- Reduced the chance of future UI-side regressions when export assembly changes.

### 2026-07-16 — Dark theme token pass

- Added system-aware brand palettes in `apps/mobile/src/theme.ts`.
- Switched the root status bar style to follow the active light/dark palette.
- Marked the shell-token milestone complete and narrowed the remaining work to device verification gates.

### 2026-07-16 — Export linked external notes from Settings

- Wired Settings export to load saved external-note links for goals, skills, quests and weekly reviews.
- Ensured the shared Markdown bundle now carries the external-note frontmatter already covered by import/export tests.
- Kept the documented P6 round-trip flow aligned with the actual application behavior.

### 2026-07-16 — P6 plan alignment after latest Markdown commits

- Confirmed the latest repository changes already include external-note frontmatter in Markdown export/import.
- Confirmed duplicate-safe tests cover repeated external-note round trips without creating extra links.
- Recorded `docs/technical/OBSIDIAN-VAULT.md` as the canonical vault contract.
- Marked P6 complete and shifted the active milestone to the remaining device/stabilization gates.

### 2026-07-16 — External notes and Obsidian URI

- Activated the existing local `external_note_links` storage contract in both repositories.
- Added safe classification for vault paths, explicit Obsidian URIs and http(s) links.
- Added encoded Obsidian URI generation and tests that reject unsupported schemes.
- Added reusable save/open/remove controls to skill and quest screens without touching the external note itself.
- Recorded autonomous execution as the default project operating mode.

### 2026-07-16 — Duplicate-safe Markdown import

- Added parsing for individual Levera Markdown documents and exported bundles.
- Added strict stable identity, type, range and relation validation before persistence.
- Added repository upserts for weekly reviews alongside existing goal, skill and quest identities.
- Added Settings paste import with created/updated counts and explicit local-only behavior.
- Added export/import/re-import tests proving that the same stable IDs do not create duplicates.

### 2026-07-16 — Stable Markdown export

- Added one Markdown document per goal, skill, quest and weekly review.
- Added stable paths and YAML frontmatter with `levera_id` and `levera_type`.
- Preserved relations, support, mastery, repetition, status, maintenance and review decisions.
- Added an in-app preview and explicit native share action without automatic cloud transfer.
- Added deterministic export tests and an all-quest repository query.

### 2026-07-16 — P5 completion

- Added weekly reviews, evidence-based mastery, spaced repetition, guilt-free recovery and zero-XP maintenance.

### 2026-07-16 — Skill graph and progress

- Added a 50-skill fixture, period/entity rollups, cycle-safe edges, interactive rendering and skill health.

### 2026-07-16 — Cross-launch SQLite verification

- Added previous-launch evidence and a visible Settings status.

### 2026-07-15 — Persistent Personal UI and service

- Added SQLite-backed goal, skill, quest, completion, evidence, reflection and history flows.
- Added Android bundle validation and domain tests.

### 2026-07-15 — Personal-first pivot

- Deferred family validation and set Pavel as first user.
