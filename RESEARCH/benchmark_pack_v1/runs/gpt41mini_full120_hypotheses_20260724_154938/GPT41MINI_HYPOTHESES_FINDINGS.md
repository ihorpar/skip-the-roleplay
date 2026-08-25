# gpt-4.1-mini hypothesis screen — full_120 × A1/A2/A3/S_role_long_pure × B1

**Date:** 2026-07-24  
**Out:** `RESEARCH/benchmark_pack_v1/runs/gpt41mini_full120_hypotheses_20260724_154938`  
**Smoke (Stage A):** `RESEARCH/benchmark_pack_v1/runs/gpt41mini_smoke_20260724_154908` — 5/5 scored, **0 infra**, pass 60%  
**Model:** `openai:gpt-4.1-mini`  
**Design:** full_120 × `A1_task` / `A2_role` / `A3_comp` / `S_role_long_pure` × `B1_instant` × **1 repeat** = **480** scored runs.  
**Claim language:** directional / model-transfer screen only — **not** Luna-claim-ready.

**B2 not run:** `gpt-4.1-mini` has no Responses `reasoning.effort` path in this harness; B2 would be a fake duplicate of B1.

---

## Pass rates (headline)

| Style | Pass | Pass % |
|-------|-----:|-------:|
| **A1_task** | 77/120 | **64.2%** |
| **A2_role** | 81/120 | **67.5%** |
| **A3_comp** | 73/120 | **60.8%** |
| **S_role_long_pure** | 65/120 | **54.2%** |
| Overall | 296/480 | 61.7% |

Infra errors: **0**. Eval unscorable: **0**.

---

## Paired Δ (ticket-level, same case across styles)

Positive = second condition better. One repeat → screen signal only.

| Contrast | Mean Δ | Ticket flips (win / loss / tie) | Net |
|----------|-------:|--------------------------------:|----:|
| **A2 − A1** | **+3.3 pp** | 11 / 7 / 102 | +4 |
| **A3 − A2** | **−6.7 pp** | 6 / 14 / 100 | −8 |
| **A3 − A1** | **−3.3 pp** | 8 / 12 / 100 | −4 |
| **pureLong − A1** | **−10.0 pp** | 6 / 18 / 96 | −12 |

---

## Hypothesis verdicts (1-repeat screen)

| # | Hypothesis | Arms | Verdict | Plain read |
|---|------------|------|---------|------------|
| **H1** | Short role helps/hurts full pass | A2 vs A1 | **lukewarm** | Mild A2 lift (+3.3 pp, net +4). Directional “helps a little,” not hot. |
| **H2** | Soft competencies on top of role help/hurt | A3 vs A2 (and vs A1) | **lukewarm** | A3 looks worse than A2 (−6.7 pp) and A1 (−3.3 pp). Same shape as nano54 screen: role mild up / competencies mild down. |
| **H3** | Pure long persona helps/hurts vs task-only | pureLong vs A1 | **lukewarm** (clearer on the *hurt* side) | Pure long **hurts** (−10.0 pp, net −12). Not a help story; still 1-rep — prefer stop over 3-repeat expansion. |

**Overall temperature:** mid-band model (~62% overall), not floor and not Luna ceiling. A-axis is **not** flat, but gaps are one-repeat noisy. **Prefer stop + report** — do not burn 2–3 repeats unless owner specifically wants a confirmatory CI on H3 hurt / H2 competency drag.

---

## Family pass counts (exploratory)

| Family | A1 | A2 | A3 | pureLong |
|--------|---:|---:|---:|---------:|
| F1_extract | 10/10 | 10/10 | 10/10 | 10/10 |
| F2_partial_flow_a | 7/10 | 8/10 | 7/10 | 5/10 |
| F3_partial_flow_b | 4/10 | 6/10 | 5/10 | 4/10 |
| F4_select | 11/15 | 12/15 | 12/15 | 9/15 |
| F5_full_flow | 22/35 | 20/35 | 19/35 | 17/35 |
| F6_robustness_hard_cases | 23/40 | 25/40 | 20/40 | 20/40 |

A2’s small lift sits mostly in F3/F6; F5 actually slips vs A1. Pure long is soft across F2/F4/F5/F6.

---

## Run hygiene

- Infra / unscorable: **0 / 0**
- JSON-valid: **100%**
- Schema-valid: **88.5%** overall (A1 90.0% / A2 91.7% / A3 91.7% / pureLong 80.8%)
- Tool call exact match: **79.4%**
- Tool trigger precision / recall: **100% / 93.4%**
- Over-action / under-action: **16.5% / 10.8%** (pureLong highest over-action: 23.3%)
- Concurrency: 2; wall ~20.3 min (480 runs)

---

## Stop / next

- Stage A clean → Stage B done.
- **No Stage C (3-repeat)** unless owner requests: H1/H2 lukewarm; H3 hurt is the strongest directional signal but still screen-scale.
- Narrative fit: production-relevant `gpt-4.1-mini` sits between nano54 mid-floor and luna ceiling; short role ≠ magic; pure long persona looks actively worse on this exam.
