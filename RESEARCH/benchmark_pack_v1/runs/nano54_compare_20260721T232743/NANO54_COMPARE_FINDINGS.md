# gpt-5.4-nano vs floors — rehearsal_40 directional probe

**Date:** 2026-07-21  
**Out:** `RESEARCH/benchmark_pack_v1/runs/nano54_compare_20260721T232743`  
**Question:** Is `gpt-5.4-nano` another dead floor like `gpt-5-nano`, or is it alive on the Track 1 scheduling agent exam?  
**Design:** Basic model probe only — rehearsal_40 × `A1_task` × `B1_instant` × 1 repeat = **40 scored runs**. Not a full A×B×3 role matrix. No full_120 (40 is enough for directional). Not Track 2.

---

## Verdict

**Alive, not a dead floor — but clearly weaker than luna.**

| Model | Bundle | Pass | Pass % |
|-------|--------|------|--------|
| **gpt-5.4-nano** (this run) | rehearsal_40 | **16/40** | **40.0%** |
| gpt-5-nano (`nano_compare_20260721T231058`) | rehearsal_40 | 0/40 | 0.0% |
| gpt-5.6-luna screen (`screen_hypotheses_20260721T192721`) | rehearsal_40 | 37/40 | 92.5% |
| gpt-5.6-luna reh r1 (`rehearsal40_r1_20260721T1645`) | rehearsal_40 | 33/40 | 82.5% |

### Deltas (5.4-nano − comparator)

| Comparison | Δ pp |
|------------|------|
| vs gpt-5-nano (0%) | **+40.0 pp** |
| vs luna screen (92.5%) | **−52.5 pp** |
| vs luna reh r1 (82.5%) | **−42.5 pp** |

**Read:** Owner doubt on the `gpt-5-nano` floor stands — that model was near-dead. `gpt-5.4-nano` is a different id and a different capability band: mid-tier on this exam (tools largely work; many tickets still fail on schema shape / semantics). Still far below luna.

---

## Run hygiene

- Infra errors: **0**
- Eval unscorable: **0**
- JSON-valid finals: **100%**
- Schema-valid: **60%**
- Tool call exact match: **90%**
- Tool trigger precision / recall: **100% / 94.9%**
- Over-action / under-action: **5% / 10%**
- Concurrency: 2; wall ~86s

---

## Fail-mode spot-check

Failures are **not** infra. Mix of schema-shape mistakes and semantic / flow mistakes.

| Family | n | Pass | Schema OK | Tools exact |
|--------|---|------|-----------|-------------|
| F1_extract | 3 | 2 | 3 | 3 |
| F2_partial_flow_a | 3 | 0 | 0 | 3 |
| F3_partial_flow_b | 3 | 2 | 3 | 3 |
| F4_select | 5 | 0 | 1 | 5 |
| F5_full_flow | 12 | 5 | 6 | 11 |
| F6_robustness_hard_cases | 14 | 7 | 11 | 11 |

**Dominant patterns among fails (24):**

1. **`schema_invalid` (16/24)** — often wrong final JSON shape:
   - Nested wrappers like `{ "F1_extract": {...}, "F2-F6": {...} }` instead of flat Track 1 fields
   - Extra / wrong-typed `slots_returned` / `selected_slot_id` when not allowed
   - Missing flat `final_status` / `customer_response` when nested incorrectly
2. **Semantic / flow fails with valid schema (8/24)** — wrong status/response, under-book (stop at `slots_returned`), zip/`unknown`, etc.
3. **Tools:** mostly fine (90% exact). Not the nano-style “can’t use tools” story.

Contrast with `gpt-5-nano` reh40: **36/40 schema_invalid**, near-total inability to emit F2–F6 finals. 5.4-nano is in a different failure regime.

---

## API / harness notes

### Alias
CLI accepts `openai:gpt-5.4-nano` (also `5.4-nano`) via `OPENAI_MODEL_ALIASES` in `scripts/harness/constants.js`.

### Reasoning effort — **luna-like, not gpt-5-nano**
API probe on `gpt-5.4-nano`:

| `reasoning.effort` | Result |
|--------------------|--------|
| `none` (+/− temperature 0) | **200 OK** |
| `minimal` | **400** — unsupported; allowed: `none`, `low`, `medium`, `high`, `xhigh` |

Harness already maps B1 → `none` for anything that is not exact `gpt-5-nano`; **no extra effort remap needed** for 5.4-nano. Comment updated in `scripts/harness/providers/openai.js` so future nano-family edits do not accidentally apply `minimal` to 5.4.

Temperature 0 on B1 is accepted (unlike classic `gpt-5-nano`).

---

## Artifacts

| Path | Contents |
|------|----------|
| `.../nano54_compare_20260721T232743/` | Out root |
| `smoke_raw_runs_*.json` / `*_latest.json` | 40 raw runs |
| `smoke_summary_*.json` / `.md` | Aggregates |
| `NANO54_COMPARE_FINDINGS.md` | This file |

**Comparators:**  
- gpt-5-nano: `runs/nano_compare_20260721T231058/rehearsal40_a1_b1`  
- luna: screen + reh r1 A1×B1 on same rehearsal_40 bundle

---

## Scope / non-claims

- Not a Track 1 role claim. Not Track 2 density confirmatory.
- No full_120 run (directional answer clear at n=40).
- No commit.
