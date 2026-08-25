# Full 120 Pack v1

Frozen 120-case Track 1 exam pack. Same `benchmark_data_model_v1` schema as micro-pilot / rehearsal_40 so `smoke:eval` can load it.

## Files

- `full_120_bundle_v1.json` — full `task` / `gold` / `fixtures` payloads (120 cases)
- `coverage_manifest_v1.json` — case IDs by family and branch
- `BUILD_NOTES.md` — new-case audit table (branch + pressure tags)
- `_build_full_120.mjs` — regenerator + validator

## Composition

- **40** cases copied from `rehearsal_40/rehearsal_40_bundle_v1.json` (`MP_*` and `R40_*` ids unchanged, byte-identical)
- **80** new cases (`F120_F*_###`)

Family totals: F1=10, F2=10, F3=10, F4=15, F5=35, F6=40.

## How to run smoke against this pack

From the repo root, point the harness at this bundle with `--bundle`:

```powershell
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json
```

Optional filters:

```powershell
# One family
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json --families F5_full_flow

# Specific cases
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json --case-ids F120_F6_001,MP_F5_001

# Cap run size while debugging
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json --limit 5
```

Requires `OPENAI_API_KEY` for the default OpenAI model. Outputs land under `RESEARCH/benchmark_pack_v1/runs/`.

## Quick integrity check (no API)

```powershell
node -e "const b=require('./RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json'); console.log(b.cases.length, b.pack_id)"
```

Or re-run the builder (validates gold/fixture alignment, r40 byte-identity, ToolSimulator gold steps, and evaluator semantic_pass):

```powershell
node RESEARCH/benchmark_pack_v1/full_120/_build_full_120.mjs
```
