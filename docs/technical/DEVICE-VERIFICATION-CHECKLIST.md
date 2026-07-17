# Device verification checklist

This checklist covers the remaining manual gates for the personal alpha. Complete the steps on a real simulator or physical device and record the date and outcome in `docs/EXECUTION-PLAN.md`.

## 1. SQLite persistence across restart

Goal: prove that local data survives a full close/reopen cycle.

### Preparation

1. Launch the app and open **Связи**.
2. Confirm the SQLite status card shows the current launch timestamp.
3. Create or update at least one real record:
   - one goal,
   - one skill,
   - one quest.

### Verification

1. Fully close the app:
   - on simulator: stop the app process and relaunch it,
   - on device: swipe it away from the app switcher.
2. Reopen the app.
3. Go back to **Связи**.
4. Confirm:
   - the SQLite status card shows both **Текущий запуск** and **Предыдущий**,
   - the card status changes to **Проверено**,
   - the created goal/skill/quest still exist.

### Pass criteria

- `previousSuccessfulStart` is visible in the UI.
- `persistenceVerified` is effectively true in the UI state.
- No created data is lost.

---

## 2. Skill-tree interaction with 50 skills

Goal: prove the graph remains usable when the fixture-sized data set is present.

### Preparation

1. Load or create a profile with around 50 skills across multiple levels.
2. Open **Навыки**.

### Verification

1. Scroll through the whole graph vertically.
2. Scroll each horizontal level row.
3. Open at least:
   - one root skill,
   - one mid-graph skill,
   - one deep skill.
4. Navigate back each time.
5. Watch for:
   - dropped taps,
   - frozen scrolling,
   - overlapping cards,
   - unreadable labels,
   - status colors that become ambiguous in light or dark mode.

### Pass criteria

- Presses consistently open the expected skill.
- Vertical and horizontal scrolling both remain responsive.
- Node titles, statuses and mastery bars remain readable.
- No visible layout breakage occurs.

---

## 3. Obsidian and external-note opening

Goal: prove external-note links really open on-device.

### Preparation

1. Install Obsidian on the device if available.
2. Create one saved note link for:
   - a skill using a vault path,
   - a quest using an `obsidian://` URI or web URL.

### Verification

1. Open the saved skill note from the skill detail screen.
2. Open the saved quest note from the quest detail screen.
3. If testing a web URL, confirm the system browser opens.
4. Return to the app and confirm the saved links are still present.

### Pass criteria

- Vault-path links resolve into Obsidian via encoded `obsidian://open?path=...`.
- Explicit `obsidian://` URIs open without modification.
- Web URLs open in the system browser.
- No link is lost after returning to the app.

---

## 4. Dark-theme smoke check

Goal: verify the new system-aware tokens are usable on-device.

### Verification

1. Switch device appearance to light mode and inspect:
   - Today,
   - Skills,
   - Progress,
   - Review,
   - Settings,
   - Setup,
   - Skill detail,
   - Quest detail.
2. Switch device appearance to dark mode.
3. Repeat the same screens.
4. Check contrast for:
   - main text,
   - secondary text,
   - status chips,
   - buttons,
   - borders,
   - callout surfaces.

### Pass criteria

- Text remains readable in both modes.
- Buttons and chips remain visually distinct.
- Status bar style matches the active theme.
- No screen uses obviously light-only colors in dark mode.

---

## Reporting format

When a manual run is completed, append a short note to `docs/EXECUTION-PLAN.md` using this format:

- `Verified on <device or simulator>, <date> — result: pass/fail — notes: ...`

If a gate fails, keep the checklist item open and add the concrete failure symptom instead of marking it done.
