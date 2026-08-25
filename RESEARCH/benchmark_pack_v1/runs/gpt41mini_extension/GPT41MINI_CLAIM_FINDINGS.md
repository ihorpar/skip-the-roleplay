# gpt-4.1-mini claim findings — full_120 × 3 repeats (B1 only)

**Date:** 2026-07-25  
**Model:** `openai:gpt-4.1-mini`  
**Claim authority:** Track-1 reading rule — ticket-level paired bootstrap 95% CI must exclude 0 (`RESEARCH/track1_role_study_package/00_protocol/results-reading-plan-v1.md`).  
**Luna `CLAIM.md`:** unchanged. This is a **separate** model-transfer claim pack.

## Matrix

| Item | Value |
|------|--------|
| Pack | `full_120` |
| Styles | `A1_task`, `A2_role`, `A3_comp`, `S_role_long_pure` |
| Mode | `B1_instant` only (no `reasoning.effort` on gpt-4.1-*) |
| Repeats | 3 |
| Pooled scored | **1440** (480 × 3) |
| Infra / unscorable | **0 / 0** |

### Repeat folders

| Rep | Path | Pass % | Infra |
|-----|------|-------:|------:|
| r1 | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_full120_hypotheses_20260724_154938` | 61.7 | 0 |
| r2 | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_full120_r2_20260724_234548` | 62.5 | 0 |
| r3 | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_full120_r3_20260725_000049` | 61.3 | 0 |

Analysis JSON: `RESEARCH/benchmark_pack_v1/runs/gpt41mini_extension/gpt41mini_claim_analysis_v1.json`  
Bootstrap: B=10000, seed=20260724, unit=ticket (mean pass over 3 repeats), 95% percentile CI.

---

## Pooled pass rates (360 runs / style)

| Style | Pass | Pass % |
|-------|-----:|-------:|
| **A1_task** | 227/360 | **63.1%** |
| **A2_role** | 241/360 | **66.9%** |
| **A3_comp** | 226/360 | **62.8%** |
| **S_role_long_pure** | 196/360 | **54.4%** |
| Overall | 890/1440 | 61.8% |

---

## Paired Δ + bootstrap 95% CI (claim rule)

Positive = second arm better when named as `hi−lo` below. Mean Δ = mean of per-ticket (mean_pass_hi − mean_pass_lo) over 120 tickets, in percentage points.

| Contrast | Mean Δ (pp) | 95% CI | Clears bar (CI excludes 0)? | Ticket flips (win/loss/tie) |
|----------|------------:|--------|----------------------------:|----------------------------:|
| **A2−A1** | +3.9 | [-1.7, +9.4] | **no** | 19 / 13 / 88 |
| **A3−A2** | -4.2 | [-9.4, +0.8] | **no** | 8 / 16 / 96 |
| **A3−A1** | -0.3 | [-5.0, +4.4] | **no** | 13 / 13 / 94 |
| **pureLong−A1** | -8.6 | [-14.7, -2.8] | **yes** | 10 / 25 / 85 |

---

## Hypothesis verdicts (claim language)

| # | Hypothesis | Arms | Clears bar? | Plain read |
|---|------------|------|-------------|------------|
| **H1** | Short role helps/hurts full pass | A2 vs A1 | **no** | Mild positive mean (+3.9 pp) but CI includes 0 → **no clear help/hurt**. |
| **H2** | Soft competencies on top of role help/hurt | A3 vs A2 (and vs A1) | **no** / **no** | A3−A2 mean negative (-4.2 pp) and A3−A1 near flat (-0.3 pp); both CIs include 0 → **no clear effect**. |
| **H3** | Pure long persona helps/hurts vs task-only | pureLong vs A1 | **yes (hurt)** | Mean -8.6 pp; 95% CI entirely below 0 → under the locked rule we may say pure long persona **hurt** full pass vs task-only on this exam. |

**Claim-ready finding (only H3):** In this `gpt-4.1-mini` / full_120 / B1 setup, replacing task-only with a pure long persona (`S_role_long_pure`) **clearly hurt** full ticket success. Short role and soft competencies do **not** clear the bar.

---

## Family pass counts (exploratory; not claim-grade)

Pooled runs per family×style (3 repeats).

| Family | A1 | A2 | A3 | pureLong |
|--------|---:|---:|---:|---------:|
| F1_extract | 30/30 | 30/30 | 29/30 | 30/30 |
| F2_partial_flow_a | 21/30 | 24/30 | 21/30 | 15/30 |
| F3_partial_flow_b | 14/30 | 19/30 | 17/30 | 12/30 |
| F4_select | 34/45 | 37/45 | 37/45 | 28/45 |
| F5_full_flow | 62/105 | 58/105 | 56/105 | 50/105 |
| F6_robustness_hard_cases | 66/120 | 73/120 | 66/120 | 61/120 |

Pure-long soft spots sit in F2/F4/F5/F6; A2’s mild lift (non-claim) sits mostly outside F5.

---

## Run hygiene

- Infra / unscorable across r1+r2+r3: **0 / 0**
- Concurrency: 2
- Temperature: 0
- Does **not** rewrite Luna `CLAIM.md`

## Artifacts

| Item | Path |
|------|------|
| This findings | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_extension/GPT41MINI_CLAIM_FINDINGS.md` |
| Analysis JSON | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_extension/gpt41mini_claim_analysis_v1.json` |
| Short claim card | `RESEARCH/track1_role_study_package/06_supporting_nano_probe/GPT41MINI_CLAIM.md` |
| Protocol | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_extension/PROTOCOL.md` |
