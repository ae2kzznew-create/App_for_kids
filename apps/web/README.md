# Levera Web — desktop companion

A small static web application (`index.html` plus the `levera-*.js` modules next to it) that works directly with the Levera Markdown vault folder. No server, no accounts, no build step — the files can be opened from disk or hosted on any static hosting.

## What it does

- Opens the local vault folder through the browser folder picker (File System Access API).
- Reads all Levera Markdown documents (goals, skills, quests, weekly reviews) with `levera_id` frontmatter, including files in subfolders; other Markdown files (regular Obsidian notes) are ignored and never modified.
- Shows a dashboard: today's stats, active quests, skills that need repetition, goals with their skills and quests, a skills table with mastery bars, and weekly review history.
- Writes changes back as Levera Markdown: create goals/skills/quests, complete or reopen quests, and record weekly reviews.
- Keeps the vault as a tidy tree inside the chosen folder, exactly as documented in `docs/technical/OBSIDIAN-VAULT.md`:

  ```text
  <vault folder>/
    Levera/
      goals/<levera_id>-<slug>.md
      skills/<levera_id>-<slug>.md
      quests/<levera_id>-<slug>.md
      reviews/<levera_id>-<week>.md
  ```

  Legacy flat files from older exports (`goals__<id>-<slug>.md` in the folder root) are migrated into the tree automatically on load; the mobile app reads the tree and updates any remaining legacy files in place.
- Includes an Obsidian-inspired dark theme with a theme switch in the header (auto / light / dark, remembered between sessions).
- Includes an optional AI assistant («✨ План с ИИ» on the Goals tab): describe what you want to learn and it drafts a goal with skills and starter quests. By default it uses the free GLM-4.5-Flash model from Zhipu AI (get an API key at bigmodel.cn and paste it into the ⚙️ settings dialog); any OpenAI-compatible API (DeepSeek, OpenRouter) works too. The key is stored locally in the browser and requests go directly to the provider (in the Windows app — through the app itself, avoiding CORS limits).
- Remembers the chosen folder between sessions (permission re-confirmation may be required by the browser).

## How it fits the sync loop

```text
phone (Levera mobile) ─ export/import ─► sync folder ◄─ Autosync ─► Google Drive
                                             ▲
computer: Google Drive for Desktop ─► local Drive folder ◄─ Levera Web + Obsidian
```

Open the Drive-synced folder in Levera Web on the computer; the phone picks the same folder content up through Autosync and the in-app folder import.

## Requirements

- Chrome or Edge on desktop (the File System Access API is required for writing).
- In other browsers the app opens in read-only demo mode only.

## Deployment

Any static option works:

- open `index.html` straight from disk (keep the `levera-*.js` files next to it; `start-levera.bat` from the release ZIP does this);
- upload the folder to any static hosting (GitHub Pages, Netlify, Cloudflare Pages, a plain web server);
- no configuration or environment variables are needed.
