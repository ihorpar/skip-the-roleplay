# Rehearsal 40 run notes (provisional)

**Date:** 2026-07-21  
**Model:** OpenAI `gpt-5.6-luna`  
**Pack:** `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json` (40 tickets)  
**Matrix:** A1 / A2 / A3 × B1 / B2 × **2 repeats** = 480 scored runs  
**Authority:** provisional only — see `RESEARCH/results-reading-plan-v1.md` (claims need frozen 120)

## Before the full matrix

First probe hit **0% pass**: the model used invented labels like `new_booking` / `existing_job` instead of locked enums (`new_job`, `status_check`).  
Fix: listed exact extraction enums (+ residential default) in `scripts/harness/prompts.js`.  
Re-probe on 3 tickets × 6 cells → **100% pass**, then launched the full matrix.

## Results (both repeats)

| | Repeat 1 | Repeat 2 |
|--|----------:|----------:|
| Overall pass | 88.8% | 88.8% |
| Technical API failures | 0 | 0 |

### By instruction version (pass %, all modes pooled)

| | R1 | R2 |
|--|---:|---:|
| A1 task-only | 90.0 | 91.3 |
| A2 + role | 90.0 | 87.5 |
| A3 + role + competencies | 86.3 | 87.5 |

### By mode (pass %, all A pooled)

| | R1 | R2 |
|--|---:|---:|
| B1 instant | 79.2 | 79.2 |
| B2 thinking | 98.3 | 98.3 |

### Main cells (pass % of 40 tickets)

| Cell | R1 | R2 |
|------|---:|---:|
| A1 × B1 | 82.5 | 82.5 |
| A1 × B2 | 97.5 | 100 |
| A2 × B1 | 80.0 | 80.0 |
| A2 × B2 | 100 | 95.0 |
| A3 × B1 | 75.0 | 75.0 |
| A3 × B2 | 97.5 | 100 |

## Artifacts

- `RESEARCH/benchmark_pack_v1/runs/rehearsal40_r1_20260721T1645/`
- `RESEARCH/benchmark_pack_v1/runs/rehearsal40_r2_20260721T1651/`
- Probe folders: `rehearsal40_probe_*`, `rehearsal40_probe2_*`

## Plain-language takeaway (not a claim)

- Harness + 40-pack + luna are **runnable and stable** (0 infra errors; overall ~89%).
- **Thinking mode (B2) looks much stronger than instant (B1)** on this rehearsal.
- **Role / competencies do not look helpful yet** on this provisional pass rate (A3 ≤ A1/A2); treat as rehearsal signal only until the 120 exam + reading-plan claim rule.

## Likely next work

1. Spot-check recurring fails (unwarranted tools, wrong booking name) and fix tickets/prompts if they are unfair.  
2. Build/freeze the **120** pack.  
3. Main run under `results-reading-plan-v1.md`.
