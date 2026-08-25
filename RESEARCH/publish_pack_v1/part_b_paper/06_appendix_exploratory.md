# Appendix: exploratory checks

This appendix is exploratory. It does not change the Luna confirmatory short-role result.

---

## Purpose of this appendix

After the Luna short-role null, we ran cheaper pilots and checks to ask whether a **longer pure persona**, or a **weaker / mid-band model**, might show a different pattern. Those materials motivate follow-ups. They are not pooled into the primary prompt-style claim.

---

## Long pure persona pilots

Protocol: `RESEARCH/benchmark_pack_v1/runs/long_persona_extension/PROTOCOL.md`.  
Longer pure persona arm = identity / experience / qualities only (`S_role_long_pure`); no exam-specific coaching in the persona block.

### Stage 1: Luna, instant, 40-case rehearsal, 1 repeat

| Condition | Pass |
|-----------|------|
| A1_task | 92.5% (37/40) |
| S_role_long_pure | 92.5% (37/40) |

Paired net **0**. We did not run a larger Luna B1 matrix.  
Findings: `…/luna_b1_pure_long_pilot_20260722T152315/STAGE1_PILOT_FINDINGS.md`

### Stage 1b: `gpt-5.4-nano`, thinking, same 40 cases, 1 repeat

| Condition | Pass |
|-----------|------|
| A1_task | 47.5% (19/40) |
| S_role_long_pure | 52.5% (21/40) |

Δ **+5.0 pp**; paired net **+2**. Noisy, no clear fail pattern, so we did not expand this into a larger nano matrix.  
Earlier **cross-batch** nano longer-persona ~65% vs factorial A1 ~50% **did not hold** same-batch; treat that older comparison as cautionary only.  
Findings: `…/nano54_b2_pure_long_pilot_20260722T153848/STAGE1B_PILOT_FINDINGS.md`

---

## Nano and mini floors

Same exam can be near-impossible for weak models under A1×B1. Supporting probes on the **40-case Task-only Instant** screen:

| Model | Pass % |
|-------|-------:|
| `gpt-4.1-nano` | ~0% |
| `gpt-5-nano` | ~0% (thinking ~30% on a separate check) |
| `gpt-5-mini` | **20%** |
| `gpt-5.4-nano` | ~40% |
| `gpt-5.4-mini` | **75%** |

Findings: `RESEARCH/benchmark_pack_v1/runs/mini_ladder_screens/MINI_LADDER_FINDINGS.md`  
Also: `06_supporting_nano_probe/` · `NANO_COMPARE_FINDINGS.md` under `benchmark_pack_v1/runs/`.

**Takeaway.** The Luna role null is *not* “the exam is trivial for every model.” It is a prompt-style null on a strong model near ceiling. Mini/nano bars are reference screens, not role claims; `gpt-4.1-mini` ~63% is a different protocol (120×3).

Mid-band role checks on `gpt-5.4-nano` and related factorials live in the same supporting folder. They are not part of the confirmatory claim.

---

## A separate claim on `gpt-4.1-mini`

Protocol: `RESEARCH/benchmark_pack_v1/runs/gpt41mini_extension/PROTOCOL.md`  
Claim findings: `…/gpt41mini_extension/GPT41MINI_CLAIM_FINDINGS.md`  
Analysis: `…/gpt41mini_extension/gpt41mini_claim_analysis_v1.json`  
Claim card: `track1_role_study_package/06_supporting_nano_probe/GPT41MINI_CLAIM.md`  

This does not rewrite the Luna confirmatory claim.

**Design:** `openai:gpt-4.1-mini` · 120 exam cases · A1 / A2 / A3 / longer pure persona (`S_role_long_pure`) · **B1 only** · **3 repeats** · **1440** graded attempts · 0 technical failures.

### Pooled pass rates

Each style pools 360 graded attempts.

| Style | Pass % |
|-------|-------:|
| A1_task (task only) | **63.1%** |
| A2_role (+ short role) | **66.9%** |
| A3_comp (+ soft competencies) | **62.8%** |
| S_role_long_pure (longer pure persona) | **54.4%** |

### Contrasts

Case-level paired bootstrap, 10,000 resamples.

| Contrast | Mean Δ | 95% CI | Meets threshold? |
|----------|-------:|--------|:----------------:|
| A2−A1 | +3.9 pp | −1.7 … +9.4 | **no** |
| A3−A2 | −4.2 pp | −9.4 … +0.8 | **no** |
| A3−A1 | −0.3 pp | −5.0 … +4.4 | **no** |
| longer persona − A1 | −8.6 pp | −14.7 … −2.8 | **yes (hurt)** |

![gpt-4.1-mini contrasts with 95% CIs](figures/fig4_mini_contrasts.svg)

*Figure 4. Contrasts on `gpt-4.1-mini`. Only the longer pure persona vs task-only interval stays fully below zero.*

**Claim-ready finding:** on this mid-band production stack, a longer pure persona **clearly hurt** end-to-end success vs task-only. Short role and soft competencies did **not** meet the threshold (same analysis rule as the Luna confirmatory study).

*An earlier one-repeat check was directional only; numbers above are the pooled confirmatory matrix.*

---

## Exploratory screen on `gemini-3.5-flash-lite`

Protocol: `RESEARCH/benchmark_pack_v1/runs/gemini35flashlite_free_tier_v2/PROTOCOL.md`  
Findings: `…/exploratory_r1_glued/GEMINI_FLASHLITE_EXPLORATORY_FINDINGS.md`  
Summary JSON: `…/exploratory_r1_glued/glued_summary.json`

One repeat, exploratory only. It does not rewrite the Luna or `gpt-4.1-mini` claims. No paired-bootstrap claim bar (single repeat).

**Design:** `gemini:gemini-3.5-flash-lite` · `full_120` · A1 / A2 / A3 / `S_role_long_pure` · **B1 only** · **1** repeat · **480** graded attempts · 0 technical failures in the glued set. Family batches were glued after gap-fills on the Gemini structured-output harness.

### Pass rates

One repeat; 120 graded attempts per style.

| Style | Pass % |
|-------|-------:|
| A1_task | **80.0%** |
| A2_role | **77.5%** |
| A3_comp | **76.7%** |
| S_role_long_pure | **75.8%** |

Point-estimate deltas vs A1: A2 **−2.5** pp · A3 **−3.3** pp · pureLong **−4.2** pp. Directionally flat-to-slightly-down. This is not a confirmatory null or a “hurt” claim.

**Takeaway.** A mid-band capability screen (~76–80% overall). Short role does not look helpful here either; longer persona is not the clear hurt seen on `gpt-4.1-mini`’s 3-rep claim.
