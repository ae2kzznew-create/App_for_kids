# Levera

Levera is being built first as a personal development system for Pavel: visible progress, skill trees, calibrated quests, weekly review and Markdown-based second-brain integration.

The original family and child product remains documented as a future direction.

## Agent and contributor entry point

Before making repository changes, read:

1. [`AGENTS.md`](AGENTS.md) — operating rules for agents and contributors.
2. [`docs/EXECUTION-PLAN.md`](docs/EXECUTION-PLAN.md) — current stage, progress, blockers and next actions.
3. [`docs/product/PERSONAL-FIRST-DIRECTION.md`](docs/product/PERSONAL-FIRST-DIRECTION.md) — active product direction.

## Repository layout

- [`apps/mobile/`](apps/mobile/) — Expo/React Native personal application for Android.
- [`apps/web/`](apps/web/) — single-file desktop web companion that works with the Markdown vault folder.
- [`docs/`](docs/) — product, research, validation, technical, brand, marketing, business and legal documents.

## Current status

- Active direction: **Levera Personal**.
- Current stage: **device-gate stabilization after P6 completion**.
- Application source: Expo/React Native/TypeScript with Expo Router and local SQLite; installable Android builds via EAS profiles in `apps/mobile/eas.json`.
- Working flow: create goal, skill and quest; complete with evidence/reflection; inspect completed-work and skill history.
- Markdown status: goals, skills, quests, reviews and external-note links now round-trip through deterministic Markdown with stable IDs, directly through a chosen sync folder on Android.
- Desktop status: `apps/web/index.html` reads and writes the same vault folder on the computer (Chrome/Edge), deployable as static hosting.
- Theme status: the app now applies brand tokens for both light and dark system appearance.
- Current verification: TypeScript, automated domain tests and Android bundle pass; remaining gates are device restart confirmation, device interaction with 50 skills, Obsidian opening on a device with the app installed, and device-level SQLite integration coverage.
- Family interviews and Wizard-of-Oz validation: deferred.

## Original product documentation

- [`docs/product/Product-Bible.html`](docs/product/Product-Bible.html) — original family product vision and reusable principles.
- [`docs/research/README.md`](docs/research/README.md) — research index.
- [`docs/technical/MVP-Technical-Brief.html`](docs/technical/MVP-Technical-Brief.html) — original technical brief; family-specific sections are not binding for the personal MVP.
