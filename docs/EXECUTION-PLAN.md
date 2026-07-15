# Levera execution plan

This is the live operating plan for the project. Any agent working in the repository must read it before acting and update it after completing work.

## Status

- **Current stage:** Stage 1 — Problem validation
- **Current milestone:** Prepare and run 15–20 Mom Test interviews
- **Last updated:** 2026-07-15
- **Application status:** No application source code yet
- **Primary target:** Russian-speaking families with children aged 8–12

## Progress overview

- [x] ~~Stage 0 — Repository foundation~~ — Evidence: documentation grouped under `docs/`; agent operating guide and execution plan added.
- [ ] Stage 1 — Problem validation
- [ ] Stage 2 — Wizard-of-Oz core-loop validation
- [ ] Stage 3 — MVP specification hardening
- [ ] Stage 4 — MVP implementation
- [ ] Stage 5 — Closed beta and W4 product test
- [ ] Stage 6 — Monetisation validation
- [ ] Stage 7 — AI quest generation
- [ ] Stage 8 — Repeatable growth and PMF

---

## Stage 0 — Repository foundation

**Goal:** make the repository understandable and safe for future agents and development.

- [x] ~~Move all project documents under `docs/`~~ — Evidence: merged repository reorganisation.
- [x] ~~Separate product, research, validation, technical, brand, marketing, business, legal and archive materials~~ — Evidence: directory structure under `docs/`.
- [x] ~~Remove exact duplicate exports and obvious test junk~~ — Evidence: duplicates and test files removed during reorganisation.
- [x] ~~Add root repository navigation~~ — Evidence: `README.md`.
- [x] ~~Reserve `apps/` for application source code~~ — Evidence: `apps/README.md`.
- [x] ~~Add an agent entry point and live progress plan~~ — Evidence: `AGENTS.md` and this document.

**Decision gate:** complete. Repository is ready for structured validation work.

---

## Stage 1 — Problem validation

**Goal:** establish that the target parents experience a strong, repeated problem before building the full product.

### Preparation

- [ ] Create an interview tracking table with respondent profile, exact quotes, existing solutions, pain score and referrals.
- [ ] Define recruitment criteria: parent of a child aged 8–12, has attempted to develop independence or routines, uses a smartphone.
- [ ] Prepare consent language for recording and storing interview notes.
- [ ] Recruit at least 15 qualified parents; at least 30% should not be close friends or highly supportive acquaintances.

### Interviews

- [ ] Conduct 15–20 Mom Test interviews using `validation/Mom-Test-Interview-Script.html`.
- [ ] Record exact language about current behavior, previous attempts, spending and reasons for stopping.
- [ ] Do not pitch Levera until the problem section of each interview is complete.
- [ ] Identify recurring segments rather than averaging all parents together.

### Synthesis

- [ ] Create an evidence table: `Hypothesis | Evidence | Source quality | Confidence | Open question | Next experiment`.
- [ ] Summarize the five strongest recurring pains and five strongest objections.
- [ ] Select the narrowest initial parent segment.
- [ ] Define the first skill category to test; do not test all categories at once.

**Decision gate:** proceed only if a clear segment repeatedly reports meaningful pain, has tried existing solutions, and accepts a four-week test. If the signal is weak, revise the segment or problem before Stage 2.

---

## Stage 2 — Wizard-of-Oz core-loop validation

**Goal:** test whether the core behavior loop retains families without building AI or the full application.

### Pilot setup

- [ ] Recruit 10–15 qualified families from the validated segment.
- [ ] Set up the operating system described in `validation/Wizard-of-Oz-Guide.html`.
- [ ] Create a family-level tracking sheet and a consistent event dictionary.
- [ ] Define reward-budget rules so parents do not promise rewards they cannot fulfill.
- [ ] Establish a child-safety review process for every quest.

### Four-week operation

- [ ] Run onboarding with the parent and child together.
- [ ] Deliver calibrated quests manually.
- [ ] Track completion claims, parent confirmations, XP/keys, wheel spins and reward fulfillment.
- [ ] Send one weekly report per active family.
- [ ] Conduct W2 check-ins without changing the experiment for only selected families.
- [ ] Conduct W4 interviews and calculate metrics.

### Required metrics

- [ ] Calculate W4 family retention.
- [ ] Calculate quest completion rate.
- [ ] Calculate manual parent confirmation rate.
- [ ] Calculate wheel-spin rate.
- [ ] Calculate reward-fulfillment rate and time to fulfillment.
- [ ] Measure how often the child initiates usage without a parent reminder.
- [ ] Test reduction of external rewards for at least one stable behavior where ethically appropriate.

**Decision gate:**

- W4 ≥25% with healthy fulfillment and qualitative demand: proceed to Stage 3.
- W4 15–24%: diagnose one failing part of the loop and repeat the pilot.
- W4 <15%: stop full-product development and revisit the product mechanism.

A 10–15-family cohort is directional, not statistically conclusive. A larger follow-up cohort will still be required.

---

## Stage 3 — MVP specification hardening

**Goal:** turn the validated loop into an internally consistent, safe and buildable specification.

- [ ] Resolve the canonical reward model: XP, level thresholds, keys and first-wheel timing.
- [ ] Replace category-only skill scores with explicit child skills and observations.
- [ ] Correct the wheel algorithm so rarity probabilities are selected before individual rewards.
- [ ] Define the state machine for quest assignment, completion claim, confirmation, rejection and expiration.
- [ ] Decide how pending confirmations affect XP and streaks; do not silently grant verified progress.
- [ ] Define a normalized database schema and Row Level Security rules.
- [ ] Reconcile server synchronization with all privacy statements.
- [ ] Decide hosting and Russian personal-data localization strategy with legal review.
- [ ] Define AI safety boundaries even though AI is not in the initial MVP.
- [ ] Reduce onboarding to the shortest path to the first real quest.
- [ ] Define analytics events and acceptance criteria for every MVP screen.
- [ ] Produce wireframes for parent, child and internal admin experiences.

**Decision gate:** technical, product, privacy and UX documents agree on one MVP. No unresolved critical data-safety conflict remains.

---

## Stage 4 — MVP implementation

**Goal:** build the smallest reliable product that automates the validated loop.

### Foundation

- [ ] Create `apps/mobile/` with React Native and Expo.
- [ ] Create `apps/admin/` for internal operations.
- [ ] Add shared validation schemas and domain logic.
- [ ] Set up development, staging and production environments.
- [ ] Add CI for type checking, linting and tests.

### Parent experience

- [ ] Parent authentication and consent.
- [ ] Family and child profile creation.
- [ ] Wish-list setup with budget/availability controls.
- [ ] Quest review and manual assignment.
- [ ] Completion confirmation or clarification.
- [ ] Weekly report.

### Child experience

- [ ] Child-safe profile access without payment controls.
- [ ] Today’s quest list.
- [ ] Quest detail with calibrated support.
- [ ] Completion claim.
- [ ] Triumph feedback without unsupported social comparisons.
- [ ] XP, keys and wish wheel.
- [ ] Reward status and gentle reminder.

### Operations and quality

- [ ] Admin family and quest management.
- [ ] Notification delivery and retry handling.
- [ ] Account deletion and data export.
- [ ] Unit tests for XP, quest states, streaks and wheel probabilities.
- [ ] Access-control tests for every family-owned table.
- [ ] Error monitoring and analytics.
- [ ] Internal QA with test families and no production child data.

**Decision gate:** the core loop works end-to-end without manual database edits, critical access-control failures or known data-loss issues.

---

## Stage 5 — Closed beta and W4 product test

**Goal:** verify that the implemented product preserves or improves the manual pilot result.

- [ ] Run closed beta with 30–60 families.
- [ ] Monitor onboarding completion and time to first quest.
- [ ] Compare digital quest completion with the manual pilot.
- [ ] Track W1, W2 and W4 retention by acquisition cohort.
- [ ] Interview retained and churned families separately.
- [ ] Fix the largest measured bottleneck, then rerun the cohort.
- [ ] Obtain professional review of privacy, child safety and store requirements.

**Decision gate:** proceed to monetisation only when retention, reward fulfillment and parent trust are strong enough that payment will not mask a broken loop.

---

## Stage 6 — Monetisation validation

**Goal:** prove that parents pay for demonstrated value.

- [ ] Launch one parent-paid Family subscription; no child purchases.
- [ ] Show value before the paywall.
- [ ] Test willingness to pay through real transactions, not hypothetical answers.
- [ ] Track paid conversion, refund rate and month-one churn.
- [ ] Add annual billing only after monthly purchase flow is stable.
- [ ] Delay influence cards, paid key acceleration, marketplace and Family+.
- [ ] Run price A/B testing only after the required sample size is realistic.

**Decision gate:** at least 10 genuine paying families, acceptable early churn, and no evidence that payment mechanics harm the child experience.

---

## Stage 7 — AI quest generation

**Goal:** automate the founder’s manual quest work without reducing safety or completion quality.

- [ ] Build a reviewed quest taxonomy and safe template library.
- [ ] Define a strict structured output schema.
- [ ] Include age, explicit skill, current support level, history and family constraints.
- [ ] Add prohibited-task and safety filtering.
- [ ] Require parent approval before assignment.
- [ ] Log prompt/version/output for quality investigation without exposing unnecessary child data.
- [ ] Compare AI quests with manual quests on completion rate and parent edits.

**Decision gate:** AI-generated quests are no worse than manual quests on safety, completion and parent acceptance.

---

## Stage 8 — Repeatable growth and PMF

**Goal:** find repeatable acquisition without scaling a leaky product.

- [ ] Establish one organic channel with measurable conversion.
- [ ] Launch referral flow only after families naturally recommend the product.
- [ ] Pilot one B2B2C partnership with a school or club.
- [ ] Measure CAC by channel and cohort retention.
- [ ] Run the Sean Ellis PMF survey with retained users.
- [ ] Start paid acquisition only when LTV assumptions are supported by actual cohorts.
- [ ] Prepare investor materials only with verified metrics and primary-source claims.

**Decision gate:** repeatable acquisition, sustainable retention, controlled churn and at least 40% of qualified retained respondents saying they would be very disappointed if Levera disappeared.

---

## Explicitly deferred

Do not build these before their earlier decision gates:

- Marketplace recommendations.
- Public child leaderboards or percentile rankings.
- Paid key acceleration.
- Paid reward-delay mechanics.
- Family+ plan.
- External contests, grants and partner reward pools.
- Adult version of the product.
- Large paid advertising campaigns.

## Blockers and decisions needed

- No validated interview dataset exists yet.
- No real W4 pilot results exist yet.
- Server-vs-device data architecture is unresolved.
- Russian personal-data localization needs professional legal review.
- Wheel, streak and auto-confirmation rules require correction before implementation.
- Public scientific, market and competitor claims require primary-source verification.

## Changelog

### 2026-07-15

- Created the live execution plan.
- Marked repository foundation complete.
- Set Stage 1 problem validation as the current stage.
- Added progress-update rules for future agents.
