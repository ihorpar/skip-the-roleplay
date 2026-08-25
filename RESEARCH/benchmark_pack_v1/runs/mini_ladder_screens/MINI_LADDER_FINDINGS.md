# Mini ladder screens — findings (reference only)

**Date:** 2026-07-25  
**Protocol:** `RESEARCH/benchmark_pack_v1/runs/mini_ladder_screens/PROTOCOL.md`  
**Label:** Reference difficulty screen — **not** a role claim; does not rewrite Luna or `gpt-4.1-mini` claims.

## Design

| Item | Value |
|------|--------|
| Pack | `rehearsal_40` × A1_task × B1_instant × 1 repeat |
| Models | `openai:gpt-5-mini`, `openai:gpt-5.4-mini` |
| Caption | 40-case task-only Instant screens (nano-comparable), **not** the `gpt-4.1-mini` 120×3 claim matrix |

## B1 results (A1 × B1 × 40)

| Model | Pass % | Infra | Unscorable | Exact tool | Out path |
|-------|--------|-------|------------|------------|----------|
| `openai:gpt-5-mini` | **20.0%** | 0 | 0 | 75.0% | `RESEARCH/benchmark_pack_v1/runs/gpt5mini_reh40_a1_b1_20260725_093417` |
| `openai:gpt-5.4-mini` | **75.0%** | 0 | 0 | 82.5% | `RESEARCH/benchmark_pack_v1/runs/gpt54mini_reh40_a1_b1_20260725_093046` |

Smoke (limit 3, 0 infra before Stage B):

- `gpt5mini_smoke_20260725_093255` (after harness fix; earlier `gpt5mini_smoke_20260725_093021` / `_093236` were 3/3 infra)
- `gpt54mini_smoke_20260725_093022`

## Harness fix (gpt-5-mini 400s)

`scripts/harness/providers/openai.js`:

1. **`reasoning.effort`:** `gpt-5-mini` rejects `"none"` (same as `gpt-5-nano`). Added `rejectsNoneReasoningEffort()` matching `/^gpt-5-(nano|mini)($|-)/i`; B1 maps those to `"minimal"`. `gpt-5.4-mini` still uses `"none"`.
2. **`temperature`:** `gpt-5-mini` also rejects `temperature`; omit on B1 for the same nano/mini (non-5.4) set.

## Orientation (one line)

Between ~0% nanos and ~40% `gpt-5.4-nano` on the same 40 A1×B1 screen, **`gpt-5-mini` (~20%) sits mid-low**; **`gpt-5.4-mini` (~75%)** sits above that nano bar and above the ~63% `gpt-4.1-mini` 120×3 claim (different protocol), still below ~92% Luna — reference ladder fill only.
