# gpt-5.4-nano role study — r2 summary (provisional)

**Date:** 2026-07-22  
**Out:** `RESEARCH/benchmark_pack_v1/runs/nano54_role_full120_r2_20260722T002151`  
**Design:** full_120 × A1/A2/A3 × B1 × **1 repeat** = **360** scored runs. Confirmatory only. Critic `CRITIC_r1.md` → owner **GO_WITH_CHANGES**.  
**Reading rule:** ticket-level paired bootstrap 95% CI must exclude 0 to say helped/hurt. Language is **provisional** (2 repeats; no r3 yet).

---

## Pass rates (r2)

| Style | Pass | Pass % | Schema % |
|-------|-----:|-------:|---------:|
| **A1_task** | 54/120 | **45.0%** | 59.2% |
| **A2_role** | 58/120 | **48.3%** | 61.7% |
| **A3_comp** | 54/120 | **45.0%** | 57.5% |
| Overall | 166/360 | 46.1% | 59.4% |

Hygiene: infra **0**, unscorable **0**, JSON-valid **100%**. Wall ~11.7 min @ concurrency 2.

---

## Paired Δ (ticket-level, r2)

| Contrast | Mean Δ | Flips (win / loss / tie) | ~95% CI (pp) | Excludes 0? |
|----------|-------:|--------------------------|-------------:|:-----------:|
| **A2 − A1** | **+3.3 pp** | 11 / 7 / 102 | [−3.3, +10.0] | **No** |
| **A3 − A2** | **−3.3 pp** | 7 / 11 / 102 | [−10.0, +3.3] | **No** |
| **A3 − A1** | **0.0 pp** | 9 / 9 / 102 | [−6.7, +6.7] | **No** |

**Do not claim “role helps.”** A2−A1 CI includes 0 on r2 (same as r1).

---

## vs r1

| | A1 | A2 | A3 | A2−A1 | A3−A2 |
|--|---:|---:|---:|------:|------:|
| **r1** | 42.5% | 47.5% | 36.7% | +5.0 pp (CI incl. 0) | **−10.8 pp (CI excl. 0)** |
| **r2** | 45.0% | 48.3% | 45.0% | +3.3 pp (CI incl. 0) | −3.3 pp (CI incl. 0) |

- A2−A1: same direction, smaller; still noise-compatible.
- A3−A2: **attenuated** — r1 cleared the Track-1 bar; r2 alone does **not**.
- A3 rose ~+8 pp vs r1 (bounce / regression to mean); A1/A2 moved little.

---

## Schema-conditional paired Δ (both styles schema-valid)

| Contrast | n (tickets) | Mean Δ | Flips |
|----------|------------:|-------:|-------|
| **A2 − A1** | 60 | **0.0 pp** | 2 / 2 / 56 |
| **A3 − A2** | 60 | **0.0 pp** | 2 / 2 / 56 |
| **A3 − A1** | 60 | +1.7 pp | 2 / 1 / 57 |

Same pattern as r1 for A2−A1 (r1: **0.0 pp**, n=61). On r2, A3−A2 residual also collapses to **0** once both are schema-valid (r1 had −5.1 pp on n=59). Overall pass moves remain mostly **schema-attainment** flips: 9/11 A2>A1 wins are schema-gain; 9/11 A3<A2 losses are schema-loss.

---

## Reh40 overlap (exploratory)

| | A1 | A2 | A3 |
|--|---:|---:|---:|
| r1 reh40 | 47.5% (19/40) | 42.5% (17/40) | 32.5% (13/40) |
| **r2 reh40** | **42.5% (17/40)** | **45.0% (18/40)** | **37.5% (15/40)** |

r2 reh40 no longer reverses A2 vs A1 (mild A2>A1), but subset is small and not claim material. A3 still lowest on the overlap.

---

## Family pass (exploratory only — not proof)

| Family | A1 | A2 | A3 |
|--------|---:|---:|---:|
| F1_extract | 9/10 | 10/10 | 9/10 |
| F2_partial_flow_a | 1/10 | 0/10 | 1/10 |
| F3_partial_flow_b | 7/10 | 7/10 | 7/10 |
| F4_select | 0/15 | 1/15 | 1/15 |
| F5_full_flow | 15/35 | **20/35** | 18/35 |
| F6_robustness | 22/40 | 20/40 | 18/40 |

Net A2−A1 still concentrates in F5 (+5 tickets); non-F5 nets −1. Do not treat F5 as a role mechanism story.

---

## Alive signals? (provisional)

| Arm | r2 alone | Still look alive? |
|-----|----------|-------------------|
| **A2-help** | CI includes 0; schema-cond **0 pp** | **No** for claim language. Directional screen only; weaker than r1. |
| **A3-hurt (vs A2)** | CI includes 0; schema-cond **0 pp** | **Attenuated** on r2. Pooled r1+r2 still has CI excl. 0 (see `POOL_r1_r2_NOTE.md`) — mid-critic decides; **do not start r3 here**. |

---

## Bottom line

r2 confirms a mid-band floor (~45–48%) and a small A2>A1 point estimate that **still fails** the helped/hurt rule. Competencies-hurt vs role **did not replicate** at claim strength on this repeat. Schema mediation remains the honest frame. **No r3 in this stage.**
