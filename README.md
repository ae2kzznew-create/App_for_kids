# Levera

Levera is being built first as a personal development system for Pavel: visible progress, skill trees, calibrated quests, weekly review and Markdown-based second-brain integration.

The original family and child product remains documented as a future direction.

## 📥 Скачать / Download

[![Скачать APK для Android](https://img.shields.io/badge/📱_Телефон_(Android)-Скачать_Levera.apk-3DDC84?style=for-the-badge)](https://github.com/ae2kzznew-create/App_for_kids/releases/download/latest/Levera.apk)

[![Скачать приложение для Windows](https://img.shields.io/badge/💻_Компьютер_(Windows)-Скачать_ZIP-2783DE?style=for-the-badge)](https://github.com/ae2kzznew-create/App_for_kids/releases/download/latest/Levera-Windows.zip)

| Устройство | Файл | Как запустить |
| --- | --- | --- |
| 📱 Телефон (Android) | [`Levera.apk`](https://github.com/ae2kzznew-create/App_for_kids/releases/download/latest/Levera.apk) | Скачай с телефона и открой файл. Если Android спросит — разреши установку из неизвестных источников для браузера. |
| 💻 Компьютер (Windows) — рекомендуется | [`Levera-Windows.zip`](https://github.com/ae2kzznew-create/App_for_kids/releases/download/latest/Levera-Windows.zip) | Распакуй архив в любое место и запусти `Levera.exe` внутри папки. Антивирусы реагируют на этот формат значительно реже, чем на одиночный exe. Папка vault выбирается один раз и дальше подключается автоматически. |
| 💻 Компьютер (Windows) — один файл | [`Levera.exe`](https://github.com/ae2kzznew-create/App_for_kids/releases/download/latest/Levera.exe) | Тот же вариант одним файлом, без установки. SmartScreen или антивирус может ошибочно ругаться — см. раздел ниже. |
| 🌐 Запасной вариант (любая ОС) | [`Levera-Web.zip`](https://github.com/ae2kzznew-create/App_for_kids/releases/download/latest/Levera-Web.zip) | Распакуй и открой `index.html` в Chrome или Edge. |

Сборки обновляются автоматически при каждом изменении приложения — ссылки всегда ведут на свежую версию. Все релизы: [Releases → latest](https://github.com/ae2kzznew-create/App_for_kids/releases/tag/latest).

### ⚠️ Если Windows пишет «вирус» или удаляет файл

Это ложное срабатывание: `Levera.exe` пока не подписан цифровой подписью, а неподписанные программы, скачанные из интернета, Windows встречает с подозрением — особенно самораспаковывающиеся. Файл безопасен, если скачан со страницы релизов этого репозитория.

1. Лучший вариант — скачай `Levera-Windows.zip`: на обычный архив с папкой антивирус реагирует гораздо реже.
2. Если браузер блокирует загрузку: в списке загрузок «⋯» → «Сохранить» («Keep»).
3. Если появляется синее окно SmartScreen: «Подробнее» → «Выполнить в любом случае».
4. Если Защитник Windows удалил файл: «Безопасность Windows» → «Защита от вирусов и угроз» → «Журнал защиты» → выбери запись про Levera → «Разрешить» / «Восстановить».

Постоянное решение — подпись кода или публикация в Microsoft Store (магазин подписывает приложение сам) — запланировано в `docs/EXECUTION-PLAN.md`.

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
