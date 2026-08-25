# Nano vs Luna — Track 1 directional model gap probe

**Date:** 2026-07-21  
**Question:** Does weaker/older-tier `gpt-5-nano` handle the Track 1 scheduling agent benchmark worse than `gpt-5.6-luna`?  
**Design:** Basic model comparison only — `A1_task` × `B1_instant` × 1 repeat. Not a full A×B×3 role matrix. Not a confirmatory Track claim.

---

## Verdict

**Yes — nano is clearly worse.** On the same tickets/conditions, luna sits in the mid-to-high 80s–90s% ticket pass; nano is near floor (~0–2%). The rehearsal_40 gap was already decisive; full_120 confirmed it is not a small-N fluke.

### Cross-check (owner challenge) — see `NANO_CROSSCHECK.md`

**Verdict: Mixed (format-fragile), not a harness/API bug.** Infra 0 errors; tools and Structured Outputs work on nano when attached; side-by-side F1+F5 probe = luna 8/8, nano 0/8. Under locked Track 1 protocol, 0–2% is a real relative floor. Nuance: early tool turns omit SO for *both* models; nano free-forms incomplete finals, luna does not.

**Why full_120 after 0/40?** Directional answer was already clear from 40. 120 was confirmatory scale only (job said “if rehearsal succeeds cleanly, also run full_120”) — useful, not necessary for the yes/no.

---

## Pass rates (A1_task × B1_instant)

| Bundle | Model | Pass | n | Pass % |
|--------|--------|------|---|--------|
| rehearsal_40 | **gpt-5-nano** (this run) | 0/40 | 40 | **0.0%** |
| rehearsal_40 | gpt-5.6-luna screen (`screen_hypotheses_20260721T192721`) | 37/40 | 40 | 92.5% |
| rehearsal_40 | gpt-5.6-luna reh r1 (`rehearsal40_r1_20260721T1645`) | 33/40 | 40 | 82.5% |
| full_120 | **gpt-5-nano** (this run) | 2/120 | 120 | **1.7%** |
| full_120 | gpt-5.6-luna main r1 | 104/120 | 120 | 86.7% |
| full_120 | gpt-5.6-luna main r2 | 108/120 | 120 | 90.0% |
| full_120 | gpt-5.6-luna main r3 | 109/120 | 120 | 90.8% |
| full_120 | gpt-5.6-luna mean ticket pass across 3 repeats | — | 120 | **89.2%** |

### Deltas (nano − luna)

| Comparison | Δ pp |
|------------|------|
| rehearsal_40 vs screen luna | **−92.5 pp** |
| rehearsal_40 vs reh r1 luna | **−82.5 pp** |
| full_120 vs luna mean (3 repeats) | **−87.5 pp** |
| full_120 vs luna r1 | **−85.0 pp** |

### Paired case-level (same `case_id`)

| Pairing | nano win | nano lose | tie |
|---------|----------|-----------|-----|
| reh40 nano vs screen luna | 0 | 37 | 3 |
| reh40 nano vs reh r1 luna | 0 | 33 | 7 |
| full120 nano vs main r1 luna | 0 | 102 | 18 |
| full120 nano vs main r2 luna | 0 | 106 | 14 |
| full120 nano vs main r3 luna | 0 | 107 | 13 |

Nano never beat luna on a ticket luna passed in these pairings. Ties are almost entirely cases both failed (or the rare nano pass where luna also failed that ticket in that repeat).

**Nano passes on full_120 (2):** `MP_F3_002` (F3), `F120_F1_007` (F1).

---

## Was rehearsal_40 enough? What did 120 add?

- **40 was enough for the directional answer.** Floor-level pass (0%) vs luna 82–92% is not ambiguous.
- **120 added confirmation + scale:** pass rose only to 1.7% (still near floor); Δ vs luna stayed ~−85 to −88 pp; failure mix stayed dominated by the same pattern (missing `final_status` / `customer_response` → schema invalid on F2–F6).
- No evidence that nano “just needed more tickets” — the larger set did not close the gap.

Optional `B2_thinking` on nano was **skipped** — gap already decisive; no API pain remaining to debug for B1.

---

## How nano fails (qualitative)

Infra was clean: **0 infra errors**, **100% JSON-parseable** final blobs on both runs.

Dominant failure: **`output.schema_invalid`** (36/40 on rehearsal; 106/120 on full). Typical pattern: nano returns **extraction fields only** on F2–F6 tickets that require `final_status` + `customer_response` (and often tools). Secondary: wrong extraction enums on F1, under-action / missing tools, over-action on tool-heavy families.

| Family (full_120) | n | nano pass | schema_valid |
|-------------------|---|-----------|--------------|
| F1_extract | 10 | 1 | 10 |
| F2_partial_flow_a | 10 | 0 | 1 |
| F3_partial_flow_b | 10 | 1 | 1 |
| F4_select | 15 | 0 | 1 |
| F5_full_flow | 35 | 0 | 0 |
| F6_robustness_hard_cases | 40 | 0 | 1 |

Luna baseline on the same A1×B1 condition is high; this is a **model capability / instruction-following gap**, not harness infra.

---

## API / harness notes

### Alias
- CLI accepts `openai:gpt-5-nano` (also aliases `nano`, `5-nano`) via `OPENAI_MODEL_ALIASES` in `scripts/harness/constants.js`.
- Luna defaults unchanged (`gpt-5.6-luna`).

### Nano reasoning quirks (minimal fix in `scripts/harness/providers/openai.js`)
1. **`reasoning.effort: "none"` is rejected by nano** (supported efforts: `minimal` | `low` | `medium` | `high`). For B1_instant on nano only, harness now sends **`minimal`** instead of `none`. Luna still gets `none`.
2. **Temperature omitted for nano.** Reasoning-family models often 400 on `temperature`; B1 still sets `temperature: 0` for luna only.
3. B2 would still map to `medium` for both; not exercised in this probe.

Probe + both main runs completed with **0 infra / rate-limit aborts** at concurrency 3.

---

## Artifacts

| Path | Contents |
|------|----------|
| `RESEARCH/benchmark_pack_v1/runs/nano_compare_20260721T231058/` | Out root |
| `.../rehearsal40_a1_b1/` | 40-run raw + summary (JSON/MD) |
| `.../full120_a1_b1/` | 120-run raw + summary (JSON/MD) |
| `.../_probe/` | 2-case API smoke before main runs |
| `.../NANO_COMPARE_FINDINGS.md` | This file |

**Luna baselines used:**  
- Screen: `runs/screen_hypotheses_20260721T192721` (A1×B1 on rehearsal_40)  
- Rehearsal main: `runs/rehearsal40_r1_20260721T1645`  
- Full: `runs/main120_r{1,2,3}_*` A1×B1 slices

---

## Scope / non-claims

- Directional **model gap probe** only.
- Does **not** re-open Track 1 role conclusions.
- Did **not** run full A1/A2/A3 × B1/B2 × 3 on nano.
- Did **not** start Track 2 density confirmatory runs.
- No git commit.
