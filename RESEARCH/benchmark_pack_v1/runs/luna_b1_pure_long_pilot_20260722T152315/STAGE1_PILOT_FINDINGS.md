# Stage 1 pilot findings — Luna B1, pure long persona

**Date:** 2026-07-22  
**Protocol:** [`../long_persona_extension/PROTOCOL.md`](../long_persona_extension/PROTOCOL.md)  
**Run folder:** `RESEARCH/benchmark_pack_v1/runs/luna_b1_pure_long_pilot_20260722T152315`  
**Audience:** study owners + third-party auditors  
**Language:** plain English

---

## What we ran

- **Model:** `openai:gpt-5.6-luna`
- **Mode:** B1 only (instant / no thinking)
- **Tickets:** `rehearsal_40` (40 cases)
- **Styles (same batch):** `A1_task` (task-only) vs `S_role_long_pure` (pure long persona)
- **Repeats:** 1
- **Scored runs:** **80** (40 × 2)
- **Infra:** 0 infra errors; 0 unscorable; JSON/schema valid 100%

This is a **directional pilot only**. It is not claim language and does not change Track 1’s short-role claim.

---

## Pass rates

| Style | Pass | n | Pass % |
|--------|------|---|--------|
| `A1_task` | 37/40 | 40 | **92.5%** |
| `S_role_long_pure` | 37/40 | 40 | **92.5%** |
| **Δ (S − A1)** | — | — | **0.0 pp** |

Overall batch pass rate was also 92.5% (same number because the two arms matched).

---

## Paired ticket view (same `case_id`)

| Outcome | Count |
|---------|-------|
| Both pass (tie) | 34 |
| Both fail (tie) | 0 |
| Pure long wins (S pass, A1 fail) | 3 |
| Task-only wins (A1 pass, S fail) | 3 |
| **Net** | **0** |

The three tickets where pure long uniquely passed were offset by three where task-only uniquely passed. Failures were mostly over-action / tool-mismatch style misses, not a coherent “long persona fixes X” pattern favoring one arm.

**Tickets that differed**

| Case | Family | Who passed |
|------|--------|------------|
| `MP_F3_001` | F3 | S_role_long_pure |
| `R40_F4_002` | F4 | S_role_long_pure |
| `R40_F5_007` | F5 | S_role_long_pure |
| `MP_F5_003` | F5 | A1_task |
| `R40_F5_008` | F5 | A1_task |
| `R40_F6_007` | F6 | A1_task |

---

## Expand vs stop / pivot (PROTOCOL §8)

**Decision: Stop / pivot — do not schedule Stage 2 (full_120) on this evidence.**

Protocol §8 said expand only if pure long looked **clearly better** than task-only on this 40-ticket pilot (rough guide: gap well above a few noisy points, e.g. order of ~5+ pp with a coherent fail pattern).

What we saw instead:

- Pass % identical (92.5% vs 92.5%; **0.0 pp**)
- Paired net **0** (3–3 win/lose)
- No shared “both fail” cluster that long persona systematically cleaned up

Plain-language reading: **on Luna without thinking, a pure long persona did not show a meaningful lift over task-only on this pilot.** That matches the stop/pivot branch: either long persona does not help this strong model even with thinking off, or the next useful paid step is the weaker-model arm — **not** burning a 120 × multi-repeat matrix yet.

---

## Explicit non-actions (this pilot)

- Did **not** run Stage 2 / `full_120`
- Did **not** run B2 (thinking)
- Did **not** re-run short role
- Did **not** run nano / weaker-model confirmatory matrix
- Did **not** edit Track 1 `CLAIM.md`

---

## Pointers

| Item | Path |
|------|------|
| Locked protocol | `RESEARCH/benchmark_pack_v1/runs/long_persona_extension/PROTOCOL.md` |
| Raw runs | `smoke_raw_runs_latest.json` (this folder) |
| Machine summary | `smoke_summary_latest.json` / `.md` (this folder) |
| Pure long prompt source | `scripts/harness/screeningPrompts.js` → `ROLE_BLOCK_RICH_PURE` / `S_role_long_pure` |
