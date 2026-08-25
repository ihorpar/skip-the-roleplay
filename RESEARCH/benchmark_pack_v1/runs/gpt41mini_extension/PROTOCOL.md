# Protocol: `gpt-4.1-mini` full hypothesis batch

**Date locked:** 2026-07-24  
**Status:** **Complete** — Stage C claim expansion finished (2026-07-25)  
**Why this model:** Owner used `gpt-4.1-mini` in production call-center style agents (Apr 2025 → Jul 2026) under low-latency constraints.  
**Screen findings (1-rep):** `RESEARCH/benchmark_pack_v1/runs/gpt41mini_full120_hypotheses_20260724_154938/GPT41MINI_HYPOTHESES_FINDINGS.md`  
**Claim findings (3-rep):** `RESEARCH/benchmark_pack_v1/runs/gpt41mini_extension/GPT41MINI_CLAIM_FINDINGS.md`  
**Claim authority:** same reading rule as Track 1 — ticket-level paired bootstrap 95% CI must exclude 0 (`RESEARCH/track1_role_study_package/00_protocol/results-reading-plan-v1.md`). Luna `CLAIM.md` stays unchanged; this is a **separate** model-transfer claim pack.

---

## 1. Hypotheses under test

| # | Hypothesis | Arms |
|---|------------|------|
| H1 | Short role helps/hurts full pass | `A1_task` vs `A2_role` |
| H2 | Soft competencies on top of role help/hurt | `A2_role` vs `A3_comp` (and vs A1) |
| H3 | Pure long persona helps/hurts vs task-only | `A1_task` vs `S_role_long_pure` |

**Not in this batch:** Markdown factorial. Luna re-runs. B2 (no `reasoning.effort` on `gpt-4.1-*`).

---

## 2. Mode note

`gpt-4.1-mini` **does not support** Responses `reasoning.effort` in this harness → **`B1_instant` only**. Temperature `0`.

---

## 3. Stages

### Stage A — smoke — **DONE (clean)**

- Out: `gpt41mini_smoke_20260724_154908` — 5 scored, 0 infra

### Stage B — 1-rep screen — **DONE** (= claim repeat 1)

| Item | Value |
|------|--------|
| Out | `gpt41mini_full120_hypotheses_20260724_154938` |
| Runs | 480 (120 × 4 × 1) |
| Pass% | A1 64.2 / A2 67.5 / A3 60.8 / pureLong 54.2 |
| Infra | 0 |

### Stage C — claim expansion — **COMPLETE**

| Item | Value |
|------|--------|
| Model | `openai:gpt-4.1-mini` |
| Pack | `full_120` |
| Styles | `A1_task`, `A2_role`, `A3_comp`, `S_role_long_pure` |
| Mode | `B1_instant` only |
| Repeats | **3** (r1=Stage B; r2+r3 new) |
| Pooled scored | **1440** |
| Infra total | **0** |

**Out folders:**

| Rep | Path | Pass % | Infra |
|-----|------|-------:|------:|
| r1 | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_full120_hypotheses_20260724_154938` | 61.7 | 0 |
| r2 | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_full120_r2_20260724_234548` | 62.5 | 0 |
| r3 | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_full120_r3_20260725_000049` | 61.3 | 0 |

**Pooled pass % (360/style):** A1 63.1 · A2 66.9 · A3 62.8 · pureLong 54.4

**Ticket-level paired bootstrap 95% CI (B=10000) — clears bar?**

| Contrast | Mean Δ (pp) | 95% CI | Clears bar? |
|----------|------------:|--------|:-----------:|
| A2−A1 | +3.9 | [-1.7, +9.4] | **no** |
| A3−A2 | -4.2 | [-9.4, +0.8] | **no** |
| A3−A1 | -0.3 | [-5.0, +4.4] | **no** |
| pureLong−A1 | -8.6 | [-14.7, -2.8] | **yes (hurt)** |

Claim artifacts:

- `RESEARCH/benchmark_pack_v1/runs/gpt41mini_extension/GPT41MINI_CLAIM_FINDINGS.md`
- `RESEARCH/benchmark_pack_v1/runs/gpt41mini_extension/gpt41mini_claim_analysis_v1.json`
- `RESEARCH/track1_role_study_package/06_supporting_nano_probe/GPT41MINI_CLAIM.md` (does **not** rewrite Luna `CLAIM.md`)

---

## 4. Stop / hygiene

- r2 and r3: 0 infra — claim analysis proceeded.
- Concurrency: 2.
- No commit unless owner asks.

---

## 5. Artifacts

| Item | Path |
|------|------|
| This protocol | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_extension/PROTOCOL.md` |
| r1 (Stage B) | `gpt41mini_full120_hypotheses_20260724_154938` |
| r2 | `gpt41mini_full120_r2_20260724_234548` |
| r3 | `gpt41mini_full120_r3_20260725_000049` |
| Claim findings | `GPT41MINI_CLAIM_FINDINGS.md` (this folder) |
| Claim analysis JSON | `gpt41mini_claim_analysis_v1.json` (this folder) |
| Claim card | `RESEARCH/track1_role_study_package/06_supporting_nano_probe/GPT41MINI_CLAIM.md` |
| Luna claim (unchanged) | `RESEARCH/track1_role_study_package/CLAIM.md` |
