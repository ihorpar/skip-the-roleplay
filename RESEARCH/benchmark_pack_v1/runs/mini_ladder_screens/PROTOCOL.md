# Protocol: gpt-5-mini + gpt-5.4-mini difficulty ladder screens

**Date locked:** 2026-07-25  
**Status:** Complete  
**Purpose:** Fill missing **mini** tier on the Part A / appendix model ladder (same protocol as nano 40-case screens).  
**Not claim-ready.** Does not rewrite Luna or `gpt-4.1-mini` claims.

---

## Design (locked)

| Item | Value |
|------|--------|
| Pack | `rehearsal_40` (`RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`) |
| Styles | `A1_task` only |
| Mode | `B1_instant` (primary). If B1 smoke is clean and model accepts `reasoning.effort`, optionally also run `B2_thinking` once for the same 40 — **secondary**, report separately |
| Repeats | 1 |
| Models | `openai:gpt-5-mini`, `openai:gpt-5.4-mini` |
| Runs (B1 only) | **80** (40 × 2) |

**Caption rule:** These are 40-case task-only Instant screens — comparable to nano rows, **not** to the `gpt-4.1-mini` 120×3 claim matrix.

---

## Stages

### Stage A — smoke (per model, before paying for 40)

```powershell
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json --models openai:gpt-5-mini --styles A1_task --modes B1_instant --limit 3 --concurrency 2 --out RESEARCH/benchmark_pack_v1/runs/gpt5mini_smoke_<timestamp>
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json --models openai:gpt-5.4-mini --styles A1_task --modes B1_instant --limit 3 --concurrency 2 --out RESEARCH/benchmark_pack_v1/runs/gpt54mini_smoke_<timestamp>
```

If API 400s (reasoning/temperature), fix harness minimally and document. Do not start Stage B for a model until its smoke has **0 infra** on those 3.

### Stage B — full 40 (per model, if smoke clean)

```powershell
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json --models openai:gpt-5-mini --styles A1_task --modes B1_instant --concurrency 2 --out RESEARCH/benchmark_pack_v1/runs/gpt5mini_reh40_a1_b1_<timestamp>
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json --models openai:gpt-5.4-mini --styles A1_task --modes B1_instant --concurrency 2 --out RESEARCH/benchmark_pack_v1/runs/gpt54mini_reh40_a1_b1_<timestamp>
```

### After Stage B

Write `RESEARCH/benchmark_pack_v1/runs/mini_ladder_screens/MINI_LADDER_FINDINGS.md`:

- Pass % for each model (A1 × B1 × 40)
- Infra counts
- Note: reference screen only; not role claim
- Optional one-line compare to existing nano / 4.1-mini / Luna bars (with protocol mismatch called out for 4.1-mini 120×3)
- Update this PROTOCOL.md status to Complete

No git commit unless owner asks.

---

## Artifacts

| Item | Path |
|------|------|
| This protocol | `RESEARCH/benchmark_pack_v1/runs/mini_ladder_screens/PROTOCOL.md` |
| Findings | `RESEARCH/benchmark_pack_v1/runs/mini_ladder_screens/MINI_LADDER_FINDINGS.md` |
| Smoke gpt-5-mini (clean) | `RESEARCH/benchmark_pack_v1/runs/gpt5mini_smoke_20260725_093255` |
| Smoke gpt-5.4-mini | `RESEARCH/benchmark_pack_v1/runs/gpt54mini_smoke_20260725_093022` |
| B1 gpt-5-mini (20.0%) | `RESEARCH/benchmark_pack_v1/runs/gpt5mini_reh40_a1_b1_20260725_093417` |
| B1 gpt-5.4-mini (75.0%) | `RESEARCH/benchmark_pack_v1/runs/gpt54mini_reh40_a1_b1_20260725_093046` |

**Harness note:** `scripts/harness/providers/openai.js` — `gpt-5-mini` B1 uses `reasoning.effort: minimal` and omits `temperature` (same constraints as `gpt-5-nano`; not `gpt-5.4-mini`).
