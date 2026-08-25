# Stage 1b pilot findings — nano B2, pure long persona

**Date:** 2026-07-22  
**Protocol:** [`../long_persona_extension/PROTOCOL.md`](../long_persona_extension/PROTOCOL.md)  
**Run folder:** `RESEARCH/benchmark_pack_v1/runs/nano54_b2_pure_long_pilot_20260722T153848`  
**Audience:** study owners + third-party auditors  
**Language:** plain English

---

## What we ran

- **Model:** `openai:gpt-5.4-nano`
- **Mode:** B2 only (thinking / medium)
- **Tickets:** `rehearsal_40` (40 cases)
- **Styles (same batch):** `A1_task` (task-only) vs `S_role_long_pure` (pure long persona)
- **Repeats:** 1
- **Scored runs:** **80** (40 × 2)
- **Infra:** 0 infra errors; 0 unscorable; JSON valid 100%

This is a **directional pilot only**. It is not claim language and does not change Track 1’s short-role claim or Luna Stage 1.

---

## Pass rates (same batch)

| Style | Pass | n | Pass % |
|--------|------|---|--------|
| `A1_task` | 19/40 | 40 | **47.5%** |
| `S_role_long_pure` | 21/40 | 40 | **52.5%** |
| **Δ (S − A1)** | — | — | **+5.0 pp** |

Overall batch pass rate: 50.0% (40/80).

---

## Paired ticket view (same `case_id`)

| Outcome | Count |
|---------|-------|
| Both pass (tie) | 13 |
| Both fail (tie) | 13 |
| Pure long wins (S pass, A1 fail) | 8 |
| Task-only wins (A1 pass, S fail) | 6 |
| **Net (S − A1)** | **+2** |

There is a small same-batch edge for pure long (+5.0 pp; net +2), but a large shared-fail block remains (13 tickets fail on both arms). Failures on both sides are dominated by `output.schema_invalid` (A1 16, S 14), not a coherent “long persona fixes X” pattern.

**Tickets that differed**

| Case | Family | Who passed |
|------|--------|------------|
| `MP_F5_002` | F5 | S_role_long_pure |
| `MP_F5_004` | F5 | S_role_long_pure |
| `MP_F6_002` | F6 | S_role_long_pure |
| `R40_F4_003` | F4 | S_role_long_pure |
| `R40_F5_004` | F5 | S_role_long_pure |
| `R40_F5_005` | F5 | S_role_long_pure |
| `R40_F5_007` | F5 | S_role_long_pure |
| `R40_F6_001` | F6 | S_role_long_pure |
| `MP_F6_001` | F6 | A1_task |
| `MP_F6_004` | F6 | A1_task |
| `R40_F2_001` | F2 | A1_task |
| `R40_F5_006` | F5 | A1_task |
| `R40_F5_008` | F5 | A1_task |
| `R40_F6_004` | F6 | A1_task |

---

## Light cross-batch context (label: cross-batch)

Earlier exploratory numbers on the **same model × B2 × reh40** setup, but **different batches** (not same-run comparable):

| Reference (cross-batch) | Pass % | Source |
|-------------------------|--------|--------|
| Pure long alone | **~65%** | `nano54_pure_long_persona_20260722T143752` |
| Factorial A1 (task-only) | **~50%** | `nano54_factorial_role_md_20260722T132411` |

Those earlier figures suggested a large pure-long lift (~+15 pp vs factorial A1). **This same-batch pilot does not reproduce that.** Pure long landed at **52.5%** here — much closer to A1 (**47.5%**) than to the prior solo ~65%. Treat the ~65% number as batch-noisy / cross-batch only.

---

## Expand vs stop / pivot (protocol spirit)

**Decision: Stop / do not expand a larger nano matrix on this evidence.**

Protocol Stage 1b said expand only if pure long **clearly** beats A1 in the same batch. Stage 1’s rough guide was order of ~5+ pp **with a coherent fail pattern**.

What we saw:

- Same-batch gap **+5.0 pp** (right at the noisy threshold), paired net only **+2** (8–6)
- **13** tickets still fail on both arms
- No clear shared failure mode that pure long systematically cleans up
- Earlier **cross-batch** pure-long ~65% **did not hold** in this same-batch check

Plain-language reading: on **gpt-5.4-nano with thinking**, pure long may have a small noisy edge over task-only, but it is **not clear enough** to justify burning a larger nano matrix yet. The earlier cross-batch “~65% vs ~50%” story looks overstated once A1 and pure long share a batch.

---

## Explicit non-actions (this pilot)

- Did **not** run `full_120`
- Did **not** run Luna / Stage 2
- Did **not** mix Markdown into the persona test
- Did **not** re-run short role
- Did **not** edit Track 1 `CLAIM.md`
- Did **not** treat prior cross-batch nano screens as proof

---

## Pointers

| Item | Path |
|------|------|
| Locked protocol | `RESEARCH/benchmark_pack_v1/runs/long_persona_extension/PROTOCOL.md` |
| Raw runs | `smoke_raw_runs_latest.json` (this folder) |
| Machine summary | `smoke_summary_latest.json` / `.md` (this folder) |
| Pure long prompt source | `scripts/harness/screeningPrompts.js` → `ROLE_BLOCK_RICH_PURE` / `S_role_long_pure` |
| Cross-batch pure long ~65% | `RESEARCH/benchmark_pack_v1/runs/nano54_pure_long_persona_20260722T143752/` |
| Cross-batch factorial A1 ~50% | `RESEARCH/benchmark_pack_v1/runs/nano54_factorial_role_md_20260722T132411/` |
