# gpt-4.1-nano headroom probe — rehearsal_40

**Date:** 2026-07-22  
**Out:** `RESEARCH/benchmark_pack_v1/runs/nano41_probe_20260722T000450`  
**Question:** Is older/weaker `gpt-4.1-nano` in a usable mid-band (~20–70%) on Track 1 A1×B1 before any role matrix?  
**Design:** Cheap headroom probe only — rehearsal_40 × `A1_task` × `B1_instant` × 1 repeat = **40 scored runs**. No A2/A3, no B2, no full_120, no role matrix.

---

## Verdict

**Floor — not usable for role screen.**

| Model | Bundle | Pass | Pass % |
|-------|--------|------|--------|
| **gpt-4.1-nano** (this run) | rehearsal_40 | **0/40** | **0.0%** |
| gpt-5-nano (`nano_compare_20260721T231058`) | rehearsal_40 | 0/40 | 0.0% |
| gpt-5.4-nano (`nano54_compare_20260721T232743`) | rehearsal_40 | 16/40 | ~40.0% |
| gpt-5.6-luna screen (`screen_hypotheses_20260721T192721`) | rehearsal_40 | 37/40 | ~92.5% |
| gpt-5.6-luna reh r1 (`rehearsal40_r1_20260721T1645`) | rehearsal_40 | 33/40 | ~82.5% |

**Read:** Same absolute floor as `gpt-5-nano`. Far below `gpt-5.4-nano` mid-band and luna high band. Owner should **not** run a role matrix on 4.1-nano unless the goal is a known-dead negative control.

---

## API / harness wiring

| Item | Result |
|------|--------|
| Requested CLI id | `openai:gpt-4.1-nano` |
| Working model id | **`gpt-4.1-nano`** (API accepts; response `model` resolves to `gpt-4.1-nano-2025-04-14`) |
| Dated alternate needed? | **No** — bare id works |
| `reasoning.effort` | **Rejected** (`unsupported_parameter`) |
| Fix | Omit `reasoning` block for `/^gpt-4\.1-nano($|-)/` only; keep `temperature: 0` on B1 |
| Luna / gpt-5.4-nano / gpt-5-nano paths | Unchanged |
| CLI alias added | `4.1-nano` → `gpt-4.1-nano` in `constants.js` |

Files touched: `scripts/harness/providers/openai.js`, `scripts/harness/constants.js`.

---

## Run hygiene

- Infra errors: **0**
- Eval unscorable: **0**
- JSON-valid finals: **100%**
- Schema-valid: **7.5%** (3/40 — all F1)
- Tool call exact match: **15.0%**
- Tool trigger precision / recall: **100% / 58.2%**
- Over-action / under-action: **85% / 50%**
- Concurrency: 2; wall ~57s

---

## Fail-mode spot-check

Failures are **not** infra. Model returns parseable JSON but wrong shape / wrong semantics.

| Family | n | Pass | Schema OK | Tools exact |
|--------|---|------|-----------|-------------|
| F1_extract | 3 | 0 | 3 | 3 |
| F2_partial_flow_a | 3 | 0 | 0 | 2 |
| F3_partial_flow_b | 3 | 0 | 0 | 1 |
| F4_select | 5 | 0 | 0 | 0 |
| F5_full_flow | 12 | 0 | 0 | 0 |
| F6_robustness_hard_cases | 14 | 0 | 0 | 0 |

**Primary failure subcodes (40):**

| Subcode | n |
|---------|---|
| `output.schema_invalid` | 37 |
| `extraction.zip_code_wrong` | 2 |
| `extraction.intent_wrong` | 1 |

**Dominant patterns:**

1. **Wrong final JSON shape (F2–F6):** nests under family keys (`F1_extract`, `F2`, …) instead of flat Track 1 fields → schema invalid + null extractions semantics.
2. **Heavy over-action:** unwarranted / premature tool calls (often same-turn sequencing breaks).
3. **F1 only:** schema-valid flat extraction, but still semantic miss (e.g. zip → `unknown`).

---

## Comparison (same A1×B1 rehearsal_40)

| Tier | Model | Pass % | Band |
|------|--------|--------|------|
| Dead floor | gpt-5-nano | 0% | floor |
| Dead floor | **gpt-4.1-nano** | **0%** | **floor** |
| Mid headroom | gpt-5.4-nano | ~40% | usable mid-band |
| Strong | gpt-5.6-luna | ~82–92% | ceiling-ish for this exam |

---

## Owner decision note

**No role matrix recommended.** Pass is not mid-band. Stop after this 40.
