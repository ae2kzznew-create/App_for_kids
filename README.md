# Levera

Levera is being built first as a personal development system for Pavel: visible progress, skill trees, calibrated quests, weekly review and Markdown-based second-brain integration.

The original family and child product remains documented as a future direction.

## 📥 Скачать / Download

[![Скачать APK для Android](https://img.shields.io/badge/📱_Телефон_(Android)-Скачать_Levera.apk-3DDC84?style=for-the-badge)](https://github.com/ae2kzznew-create/App_for_kids/releases/download/latest/Levera.apk)

[![Скачать приложение для Windows](https://img.shields.io/badge/💻_Компьютер_(Windows)-Скачать_Levera.exe-2783DE?style=for-the-badge)](https://github.com/ae2kzznew-create/App_for_kids/releases/download/latest/Levera.exe)

| Устройство | Файл | Как запустить |
| --- | --- | --- |
| 📱 Телефон (Android) | [`Levera.apk`](https://github.com/ae2kzznew-create/App_for_kids/releases/download/latest/Levera.apk) | Скачай с телефона и открой файл. Если Android спросит — разреши установку из неизвестных источников для браузера. |
| 💻 Компьютер (Windows) | [`Levera.exe`](https://github.com/ae2kzznew-create/App_for_kids/releases/download/latest/Levera.exe) | Один файл, без установки: скачай и запусти. При первом запуске SmartScreen может предупредить — «Подробнее» → «Выполнить в любом случае». Папка vault выбирается один раз и дальше подключается автоматически. |
| 🌐 Запасной вариант (любая ОС) | [`Levera-Web.zip`](https://github.com/ae2kzznew-create/App_for_kids/releases/download/latest/Levera-Web.zip) | Распакуй и открой `index.html` в Chrome или Edge. |

Сборки обновляются автоматически при каждом изменении приложения — ссылки всегда ведут на свежую версию. Все релизы: [Releases → latest](https://github.com/ae2kzznew-create/App_for_kids/releases/tag/latest).

## Agent and contributor entry point

Before making repository changes, read:

1. [`AGENTS.md`](AGENTS.md) — operating rules for agents and contributors.
2. [`docs/EXECUTION-PLAN.md`](docs/EXECUTION-PLAN.md) — current stage, progress, blockers and next actions.
3. [`docs/product/PERSONAL-FIRST-DIRECTION.md`](docs/product/PERSONAL-FIRST-DIRECTION.md) — active product direction.

## Repository layout

- [`apps/mobile/`](apps/mobile/) — Expo/React Native personal application for Android.
- [`apps/web/`](apps/web/) — single-file web companion that works with the Markdown vault folder.
- [`apps/desktop/`](apps/desktop/) — Electron shell that turns the web companion into a Windows application with a remembered vault folder.
- [`docs/`](docs/) — product, research, validation, technical, brand, marketing, business and legal documents.

## Current status

- Active direction: **Levera Personal**.
- Current stage: **device-gate stabilization after P6 completion**.
- Application source: Expo/React Native/TypeScript with Expo Router and local SQLite; installable Android APK, the Windows executable and the web bundle are published automatically to the rolling [`latest` release](https://github.com/ae2kzznew-create/App_for_kids/releases/tag/latest).
- Working flow: create goal, skill and quest; complete with evidence/reflection; inspect completed-work and skill history.
- Markdown status: goals, skills, quests, reviews and external-note links now round-trip through deterministic Markdown with stable IDs, directly through a chosen sync folder on Android.
- Desktop status: `Levera.exe` (Electron) and `apps/web/index.html` (Chrome/Edge) read and write the same vault folder on the computer; the desktop app remembers the folder between launches.
- Theme status: the app now applies brand tokens for both light and dark system appearance.
- Current verification: TypeScript, automated domain tests and Android bundle pass; remaining gates are device restart confirmation, device interaction with 50 skills, Obsidian opening on a device with the app installed, and device-level SQLite integration coverage.
- Family interviews and Wizard-of-Oz validation: deferred.

## Original product documentation

- [`docs/product/Product-Bible.html`](docs/product/Product-Bible.html) — original family product vision and reusable principles.
- [`docs/research/README.md`](docs/research/README.md) — research index.
- [`docs/technical/MVP-Technical-Brief.html`](docs/technical/MVP-Technical-Brief.html) — original technical brief; family-specific sections are not binding for the personal MVP.
