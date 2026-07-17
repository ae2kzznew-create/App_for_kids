# Personal dogfooding protocol

This protocol covers **P7 — Personal dogfooding and stabilization** for Levera Personal. It is for Pavel's own four-week alpha usage, not for family validation.

## Goals

1. Prove that the current product loop is useful in real life.
2. Find blocking UX, data-loss risks and friction before adding cloud, desktop or AI.
3. Collect concrete evidence for the next product decision.

## Before week 1

### 1. Create the real starter set

Create at least:

- **2–3 real goals**
- **5–12 skills** across those goals
- **1–3 active quests per goal**
- **at least 1 weekly review slot** for the current week

Prefer real ongoing work over aspirational someday projects.

### 2. Verify baseline setup

Before starting the four-week run, complete these checks:

- SQLite restart verification from `docs/technical/DEVICE-VERIFICATION-CHECKLIST.md`
- skill-tree interaction check
- dark-theme smoke check if dark mode is used regularly
- external-note opening check if Obsidian links are part of the workflow

### 3. Choose the daily review moment

Pick one consistent daily window, for example:

- morning planning,
- end-of-workday shutdown,
- evening reflection.

The time matters less than consistency.

---

## Daily protocol

Time budget: **5–10 minutes**.

### Every day

1. Open **Сегодня**.
2. Complete at least one real quest when possible.
3. Add evidence or reflection for anything meaningful.
4. Open **Навыки** and confirm the next visible step still feels correct.
5. If something feels wrong, log the friction immediately.

### Friction log format

Record friction in a simple note using this structure:

- `date:`
- `screen:`
- `task attempted:`
- `what slowed me down:`
- `severity:` low / medium / high / blocker
- `workaround:`
- `suggested fix:`

### What counts as a blocker

Treat these as top-priority failures:

- lost or corrupted data
- inability to create or finish a quest
- navigation dead ends
- misleading progress state
- confusing review flow
- external-note links that break expected work

---

## Weekly protocol

Time budget: **10–20 minutes**.

At the end of each week:

1. Complete one real weekly review in the app.
2. Export the current state to Markdown if the week involved heavy note usage.
3. Review the friction log and group items into:
   - data loss / integrity,
   - blocking UX,
   - moderate friction,
   - nice-to-have requests.
4. Add a short summary to `docs/EXECUTION-PLAN.md` or the current working branch notes.

### Weekly summary format

- `Week:`
- `Used on:` how many days
- `Weekly review completed:` yes/no
- `Top blockers:`
- `Top friction themes:`
- `What felt genuinely useful:`
- `What still feels manual or fragile:`
- `Next fix to prioritize:`

---

## Success criteria for P7

P7 is meaningfully complete when all of the following are true:

1. Pavel used the app across **4 real weeks**.
2. At least **4 weekly reviews** were completed.
3. No unresolved data-loss issue remains.
4. The main loop feels reliable enough to use without workaround-heavy behavior.
5. The next strategic step can be chosen from evidence, not guesswork.

---

## Decision after the four-week run

At the end of P7, choose one primary next direction:

### Option A — Cloud sync

Choose this if:

- local-only friction is the main pain,
- backup/import/export is not enough,
- data portability or multi-device access becomes the biggest blocker.

### Option B — Desktop support

Choose this if:

- the app is useful but note-heavy workflows are awkward on mobile,
- Obsidian and Markdown remain central,
- larger-screen usage would reduce friction more than sync alone.

### Option C — AI assistance

Choose this if:

- the manual workflow already works,
- the biggest remaining pain is planning, review synthesis or next-step suggestion,
- AI would reduce cognitive overhead rather than mask product weakness.

Do **not** choose AI if the core manual loop still feels unreliable.

---

## Non-goals during P7

While dogfooding is active, avoid expanding scope into:

- family roles,
- monetization,
- public rankings,
- automatic two-way sync,
- AI-generated quests.

The point of P7 is to stabilize the personal loop first.
