# Research Prep Analysis — 2026-07-21

Orchestrator synthesis of a four-agent review (code inventory, design critique, code verification, gap verification) of Track 1 in this repo.

**Verdict:** Micro-pilot exploratory runs are ready. The full 120-case “big exam” is not runnable yet. Owner decisions below are locked (2026-07-21); remaining work is execution against those locks.

---

## 0. Locked owner decisions (2026-07-21)

| # | Decision |
|---|----------|
| 1 | Goal = proper AI research (confirmatory / claim-ready), not a casual bake-off. |
| 2 | **A3 = generic competencies only, no task coaching.** Done in `prompts.js`. |
| 3 | **v1 providers = OpenAI only.** Model: **`gpt-5.6-luna`** (owner confirmed live). |
| 4 | **No length-matched control / no length measurement.** If A3 > A2, attribute to competency *content*. Prompt length is not treated as an auxiliary factor or something to equalize; we measure quality of content, not length. |
| 5 | **40-case rehearsal (Phase 6)** before full 120. |
| 6 | **Primary metric = binary task pass/fail (TSR).** Process metrics stay secondary / diagnostic. |
| 7 | **Family × prompt-style cuts = exploratory only** (understanding, not confirmatory claims). |
| 8 | **Claim scope:** *In this setup — which is often used in real-business agents — role/competencies did / did not help.* |

**Still to confirm operationally (not a design debate):** the exact OpenAI API model string for `gpt-5.6-luna` in the Responses API (must work with the harness adapter before paid matrices).

---

## 1. What the research stack consists of

| Piece | Role | Where |
|-------|------|--------|
| Research design & contracts | Defines Track 1 comparisons (A1/A2/A3 × B1/B2), scope, risks | `Overall-Research-Design-v2.md`, `track1_contract.md`, `protocol_lock_v1.md` |
| Evaluation & data model | Scoring rules, traces, task/gold/fixture schemas | `evaluation_spec_v1.md`, `benchmark_data_model_v1.md` |
| Micro-pilot pack | **Only runnable exam today:** 15 cases with task + gold + fixtures | `benchmark_pack_v1/micro_pilot/` |
| Full-set plan | 120-task **metadata** (composition, quotas) — not executable cases | `benchmark_pack_v1/full_set/` |
| Harness (CLI) | Multi-turn tool loop: prompt → provider → simulator → score → report | `scripts/smoke-eval.js`, `scripts/harness/*` |
| Providers | OpenAI Responses + Gemini `generateContent` (Gemini unused in v1 main) | `scripts/harness/providers/` |
| Evaluator | Deterministic rubrics (not LLM-as-judge); tagged `v1_partial` | `scripts/harness/evaluator.js`, `normalization.js` |
| Stability / plan tools | Repeat batteries; generate/validate 120 plan | `run-stability-battery.js`, `generate-full-benchmark-plan.js`, `validate-full-benchmark-plan.js` |
| Research browser UI | Read-only plan browsers at `/#harness`; experiment runner is mock/orphan | `src/harness/` |
| Run artifacts | Past smoke/stability outputs | `benchmark_pack_v1/runs/` |

**Data flow:** case bundle → matrix (case × model × style × mode) → multi-turn inference with fixture-backed tools → trace + deterministic score → `smoke_raw_runs_*` / `smoke_summary_*`.

---

## 2. Current state

| Component | State | Notes |
|-----------|--------|--------|
| Specs / contracts | Done (docs) | Must sync with §0 locks (model, OpenAI-only, length policy, A3 rewrite) |
| Micro-pilot (15) | Done | Live OpenAI matrices succeeded (~68–74% overall) |
| Multi-turn harness | Done | Self-test passes |
| OpenAI path | Proven on older model id | Needs re-lock on `gpt-5.6-luna` |
| Gemini path | Unused for v1 main | Keep code; do not require for gate |
| Evaluator | Partial (`v1_partial`) | Primary TSR usable; cost/first-token deferred |
| Full 120 **plan** | Done | Soft pressure-tag target warnings |
| 40-case rehearsal pack | **Done** | `RESEARCH/benchmark_pack_v1/rehearsal_40/` (15 MP + 25 new; orchestrator audit pass) |
| Full 120 **runnable bundle** | Missing | No materializer yet for full 120 |
| Stats / results-reading plan | **Done** | `RESEARCH/results-reading-plan-v1.md` (locked) |
| Experiment UI | Stub | Not required — CLI launch path |

Folders named `gpt54mini_c120_*` are **misleading**: they still ran the 15-case micro-pilot.

---

## 3. Design gaps — status after owner lock

| Gap | Status |
|-----|--------|
| A3 coaching vs “generic competencies” | **Done** — rewritten to generic competencies (2026-07-21) |
| No SAP | **Open work** — write before confirmatory 40 |
| Cross-provider Axis B fairness | **Closed for v1** — OpenAI only |
| Prompt-length confound / matched control | **Closed by owner** — do not equalize or analyze length; attribute A3−A2 to content |
| Claim overgeneralization | **Closed** — use decision #8 wording |
| Family×prompt power | **Closed** — exploratory only |
| Primary metric ambiguity | **Closed** — binary TSR |
| Phase 6 skip risk | **Closed** — do 40 first |
| Earliest-slot only in F4 family rules | **Done** — moved to shared scaffold (2026-07-21) |
| `selected_slot_id` omitted for `booking_failed` in scaffold | **Done** — included in shared output requirements |

Remaining engineering risks: gold quality on generated packs; heavy shared scaffold may shrink role effects (limitation to report, not a redesign unless owner asks).

---

## 4. Brief plan → big-exam-ready (updated)

### Milestone 1 — Sync locks into protocol & prompts *(mostly done)*

1. ~~Update `protocol_lock_v1.md`: OpenAI-only, `gpt-5.6-luna`, no length equalization, 40-then-120 gate.~~
2. ~~Rewrite `ROLE_LINE_A3` to generic competencies.~~
3. Point defaults at OpenAI `gpt-5.6-luna`; **still verify one live smoke call**.
4. Write short SAP: primary contrasts on binary TSR; exploratory family cuts; infra exclusion; repeats.
5. ~~Shared scaffold: earliest-slot policy + `selected_slot_id` for `booking_failed`; thinned family rules.~~

### Milestone 2 — 40-case rehearsal *(pack built; API runs pending)*

1. ~~Implement / assemble 40 full tickets (task + gold + fixtures).~~ → `rehearsal_40/`
2. ~~Emit frozen 40-case bundle; spot-audit gold.~~ (orchestrator audit + one residential-cue fix)
3. Run rehearsal matrix on OpenAI × A1/A2/A3 × B1/B2 per results-reading plan (needs API key).
4. Fix generator/gold/harness issues found in rehearsal.

### Milestone 3 — Full 120

1. Materialize and freeze `full_bundle_v1` (120) + hash; gold audit sample.
2. Re-pass infra gate on locked model (A1+A2+A3).
3. Freeze prompts/eval (anti-peeking); launch confirmatory matrix.
4. Analyze per SAP; write claims using decision #8 language.

**Out of scope for v1 big-exam-ready:** Gemini/Anthropic main runs, length-matched arms, ExperimentRunner UI, second domain, competencies-without-role arm.

---

## 5. Open questions

None remaining on research *design* intent.

**Operational only:** confirm `gpt-5.6-luna` is the correct OpenAI Responses API model id for this harness before large spends.

---

## 6. Agent trail

| Role | Agent |
|------|--------|
| Code exploration | [0d98bfad-2e6f-46e1-a0eb-f277f663e411](0d98bfad-2e6f-46e1-a0eb-f277f663e411) |
| Design gaps | [80c7dbe5-5d83-4abd-ac20-b213d23a4e9c](80c7dbe5-5d83-4abd-ac20-b213d23a4e9c) |
| Code verification | [55a22678-cdb0-4bce-9adb-76494caa5f3a](55a22678-cdb0-4bce-9adb-76494caa5f3a) |
| Gap verification | [0183fe61-5080-468b-bf15-982eddb3b8c2](0183fe61-5080-468b-bf15-982eddb3b8c2) |
