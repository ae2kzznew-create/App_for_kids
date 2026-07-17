# Levera Web — desktop companion

A single-file web application (`index.html`) that works directly with the Levera Markdown vault folder. No server, no accounts, no build step — the file can be opened from disk or hosted on any static hosting.

## What it does

- Opens the local vault folder through the browser folder picker (File System Access API).
- Reads all Levera Markdown documents (goals, skills, quests, weekly reviews) with `levera_id` frontmatter; other Markdown files (regular Obsidian notes) are ignored and never modified.
- Shows a dashboard: today's stats, active quests, skills that need repetition, goals with their skills and quests, a skills table with mastery bars, and weekly review history.
- Writes changes back as Levera Markdown: create goals/skills/quests, complete or reopen quests, and record weekly reviews.
- Uses the same file-naming scheme as the mobile folder export (`goals__<id>-<slug>.md`), so the mobile app updates the same files instead of creating duplicates.
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

- open `index.html` straight from disk;
- upload it to any static hosting (GitHub Pages, Netlify, Cloudflare Pages, a plain web server);
- no configuration or environment variables are needed.
