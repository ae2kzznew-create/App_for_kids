# Levera execution plan

This is the live operating plan. Every agent must read it before working and update it in the same change set.

## Status

- **Current stage:** P2–P4 device gates, P6 complete, P7 pending
- **Current milestone:** Close remaining device-only gates for the personal alpha and prepare the four-week dogfooding run
- **Last updated:** 2026-07-17
- **Application status:** goals, skills, quests, reviews and external-note links round-trip through Markdown, Settings can bind an Android sync folder and export/import Markdown files directly through it (unchanged files are skipped on export), the web companion and the new Windows application (`Levera.exe`, Electron shell over the shared UI) read and write the same vault folder on desktop with a remembered folder, and every `main` update publishes the APK, the Windows executable and the web bundle to an immutable versioned release (`v0.1.0-build.N`) and to the rolling `latest` GitHub release (updated in place) linked from the README
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
- [x] ~~Add startup SQLite write/read health check, retry action and error UI~~ — Evidence: database startup code and recoverable initialization screen.
- [x] ~~Separate domain/storage logic from UI~~ — Evidence: source structure.
- [x] ~~Add complete light/dark brand tokens~~ — Evidence: system-aware palettes in `apps/mobile/src/theme.ts` and matching status-bar selection in `apps/mobile/app/_layout.tsx`.
- [x] ~~Pass clean install, TypeScript, all automated tests and Android Expo bundle~~ — Evidence: Mobile CI.
- [ ] Verify SQLite persistence across restart on simulator or physical device.
  Progress: Settings exposes cross-launch evidence, a manual status refresh, and one full device close/reopen still remains. Manual steps are documented in `docs/technical/DEVICE-VERIFICATION-CHECKLIST.md`.

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
  Progress: service tests pass against memory repository; startup-marker coverage and additional service edge-case coverage exist, but automated device SQLite integration remains.

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
- [x] ~~Use live repetition status during weekly reviews~~ — Evidence: review attention state now recalculates from current time instead of stale stored values.

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
  Progress: the setup protocol is documented in `docs/technical/PERSONAL-DOGFOODING-PROTOCOL.md`, and the setup flow can now add new skills and quests into existing goals, while Today now links directly into the weekly review loop.
- [ ] Keep the Markdown vault folder synchronized with Google Drive during the run.
  Progress: Settings can bind a sync folder through the Android folder picker, export one Markdown file per entity into it with duplicate-free updates that skip unchanged files, and import the whole folder back; the desktop web companion and the Windows application work with the same folder on the computer, and the Windows application remembers the folder between launches. Pairing the folder with Autosync for Google Drive and on-device verification remain.
- [ ] Use daily for four weeks and complete four weekly reviews.
  Progress: the weekly logging and review format are documented in `docs/technical/PERSONAL-DOGFOODING-PROTOCOL.md`.
- [ ] Track friction and fix data loss/blocking UX first.
  Progress: blocker and friction logging format is documented in `docs/technical/PERSONAL-DOGFOODING-PROTOCOL.md`.
- [ ] Decide whether cloud, desktop or AI is next.
  Progress: end-of-run decision criteria are documented in `docs/technical/PERSONAL-DOGFOODING-PROTOCOL.md`.

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
- Vault access strategy selected: a user-chosen local sync folder (Android Storage Access Framework) mirrored to Google Drive by an external tool such as Autosync; on-device verification of folder pick, file export, Autosync round trip and duplicate-free import remains. Paste import in Settings stays as the fallback path.
- External note opening still needs device verification with Obsidian installed.
- The rolling `latest` release (`Levera.apk` + `Levera.exe` + `Levera-Web.zip`) still needs one manual install verification on the phone and computer, including the remembered-folder behavior of the Windows application.
- The APK is still signed with the debug keystore; a permanent release keystore in GitHub Secrets is needed before dogfooding installs so later updates install over existing builds without data loss.

## Changelog

### 2026-07-17 — P0 hardening: idempotent vault export and versioned releases

- Fixed the desktop `vault:list` handler (`apps/desktop/main.js`) to return an empty list instead of throwing an unhandled error when no vault folder is selected yet on first launch.
- Made mobile vault export idempotent (`apps/mobile/src/domain/vaultSync.ts`): files whose content is unchanged are skipped instead of rewritten, so an external sync tool such as Autosync no longer re-uploads the whole vault after every export; export results now report `unchanged`, with test coverage for full-skip and partial-update cases.
- Reworked the release workflow (`.github/workflows/release-build.yml`): the Android `versionCode` is stamped from the CI run number before prebuild, every build publishes an immutable versioned release (`v0.1.0-build.N`), and the rolling `latest` release is updated in place with `--clobber` instead of being deleted and recreated — no more dead-link window and rollback history is preserved.
- Recorded the missing release keystore as an explicit blocker before dogfooding installs.

### 2026-07-17 — Desktop/web UI design pass

- Redesigned the shared desktop/web UI (`apps/web/index.html`, used by `Levera.exe` and the browser version): brand header, pill navigation with icons, a dated «Сегодня» hero, iconized stat cards, an attention callout for due skills, per-goal progress bars, status-colored mastery bars, redesigned review cards, friendly empty states and refined dark/mobile layouts.
- Fixed a real defect found during visual QA: modal dialogs lost browser auto-centering because of the CSS reset; dialogs are centered again.
- Verified with Node assertions on the parser/serializer core and headless visual QA of every tab, the quest dialog, forced dark mode and a 390px mobile viewport; Markdown format and file naming are unchanged.

### 2026-07-17 — Windows desktop application

- Added `apps/desktop/`, an Electron shell around the shared web UI that runs as a normal Windows application (`Levera.exe`, portable single file).
- The vault folder is picked once through the native dialog, stored in the user profile and reconnected automatically on every start; file access goes through the main process and touches only `.md` files in the chosen folder.
- Extended the release workflow with a Windows build job and published `Levera.exe` to the rolling `latest` release; updated the README download section to point Windows users at the executable with the web bundle as fallback.

### 2026-07-17 — README download section

- Added a prominent download section to the top of the README with badge links to `Levera.apk` (Android) and `Levera-Web.zip` (desktop) from the rolling `latest` release, including short install instructions.
- Pointed the top-level status line at the automated release distribution instead of the manual EAS step.

### 2026-07-17 — One-click downloadable builds

- Added `.github/workflows/release-build.yml`: every `main` change to the apps builds an installable `Levera.apk` (Expo prebuild + Gradle release signed with the debug keystore) and packages `Levera-Web.zip` with a desktop launcher.
- Published both artifacts to the rolling `latest` GitHub release so the download links stay stable.
- Replaced the account-bound one-time EAS step with the automated CI build; EAS profiles remain for store-grade builds later.

### 2026-07-17 — Levera Web companion and APK build profiles

- Added `apps/web/index.html`, a single-file desktop web companion: it opens the local vault folder through the browser, shows goals, skills, quests and weekly reviews, and writes new entities, quest completions and weekly reviews back as Levera Markdown.
- Matched the mobile folder-export file naming so web-created files update in place instead of duplicating, preserved unknown frontmatter fields, and ignored non-Levera Markdown notes.
- Added a read-only demo mode, light/dark theme and `apps/web/README.md` with static-hosting deployment notes.
- Added `apps/mobile/eas.json` build profiles and the Android package identifier so an installable APK can be produced with EAS.

### 2026-07-17 — Google Drive vault folder sync

- Added an Android folder picker in Settings so the Markdown sync folder that Autosync for Google Drive mirrors to Drive can be selected once and remembered in local app metadata.
- Added direct export of one Markdown file per entity into the chosen folder with stable flattened names and duplicate-free updates, plus import of all Levera documents found in the folder through the existing duplicate-safe bundle pipeline.
- Recorded the selected vault access strategy: local sync folder via Storage Access Framework plus an external sync tool, keeping the application itself cloud-free.

### 2026-07-17 — Today review shortcut

- Turned the Today review card into a direct shortcut to the weekly review screen.
- Reduced friction for moving from daily execution into the weekly reflection loop during dogfooding.
- Kept the live plan aligned with the tighter P7 usage flow.

### 2026-07-17 — Live review attention state

- Updated the weekly review screen to derive due/fading skills from current time instead of stale persisted status values.
- Improved the honesty of the review attention summary during dogfooding.
- Kept the live plan aligned with the corrected repetition behavior.

### 2026-07-17 — Reuse existing goals in setup

- Updated `/setup` so the next skill and quest can be added to an existing goal instead of always creating a new one.
- Reduced friction for preparing Pavel's real starter set before the four-week dogfooding run.
- Kept the live plan aligned with the improved P7 setup workflow.

### 2026-07-17 — Manual SQLite-health refresh

- Added a manual refresh action to the Settings health card.
- Made it easier to re-check cross-launch persistence evidence during device verification.
- Kept the live plan aligned with the improved verification workflow.

### 2026-07-17 — Retry on database startup failure

- Added a retry action to the database initialization error screen instead of forcing a full app restart.
- Improved recoverability for transient startup issues during personal-alpha dogfooding.
- Kept the P2 shell status aligned with the new error-handling behavior.

### 2026-07-17 — Personal dogfooding protocol

- Added `docs/technical/PERSONAL-DOGFOODING-PROTOCOL.md` for the four-week personal alpha run.
- Documented the starter-set expectation, daily usage loop, weekly review summary and friction logging format.
- Added explicit end-of-run decision criteria for choosing cloud, desktop or AI next.

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
