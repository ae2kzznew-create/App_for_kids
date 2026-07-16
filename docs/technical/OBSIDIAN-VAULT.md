# Obsidian vault contract

## Recommended layout

```text
Levera/
├── goals/
├── skills/
├── quests/
├── reviews/
└── attachments/
```

Levera's generated paths are relative to the vault root and deterministic:

- `goals/{levera_id}-{slug}.md`
- `skills/{levera_id}-{slug}.md`
- `quests/{levera_id}-{slug}.md`
- `reviews/{levera_id}-{week_start}.md`

The stable identity is the YAML `levera_id`, not the filename. A title or filename may change without creating a new Levera entity.

## YAML contract

Every managed document starts with:

```yaml
---
levera_id: "skill_rn"
levera_type: "skill"
---
```

Optional external-note fields are:

```yaml
external_note_provider: "obsidian"
external_note_path: "Levera/skills/skill_rn-react-native.md"
external_note_updated: "2026-07-16T18:00:00.000Z"
```

For a direct URI or web note, use `external_note_url` instead of `external_note_path`. Only `obsidian://`, `http://` and `https://` URLs are accepted by the app.

## Ownership and conflicts

- SQLite remains the operational source for Levera state.
- Markdown is an explicit backup/interchange format, not automatic two-way sync.
- Import matches by `levera_id` and updates the same entity; it does not match by title.
- Goals import before skills, and skills before quests, so broken relations fail before dependent data is saved.
- Omitting external-note fields does not delete an existing link. Delete a link explicitly in the app.
- Removing a link in Levera never deletes the external note.

## Round-trip procedure

1. In Settings, build and share the Markdown bundle.
2. Store each section at the path shown by its `levera_file` marker, or keep the bundle as a backup.
3. Edit supported body/frontmatter fields in Obsidian.
4. Paste one document or the full bundle into Settings import.
5. Confirm the created/updated counts.
6. Import the same content again: all entities must be reported as updated, with no duplicate IDs or external-note links.

## Obsidian opening

A saved vault path is opened as:

```text
obsidian://open?path=Levera%2Fskills%2Fskill_rn-react-native.md
```

An explicit `obsidian://` URI is used unchanged. Opening requires Obsidian on the device and remains a manual device verification gate.

## Deliberate non-goals

- No background file watcher.
- No automatic overwrite of vault files.
- No cloud transfer.
- No conflict-free two-way sync yet.
