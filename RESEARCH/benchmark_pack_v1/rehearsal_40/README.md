# Rehearsal 40 Pack v1

Runnable 40-case Track 1 rehearsal pack. Same `benchmark_data_model_v1` schema as the micro-pilot bundle so `smoke:eval` can load it.

## Files

- `rehearsal_40_bundle_v1.json` — full `task` / `gold` / `fixtures` payloads (40 cases)
- `coverage_manifest_v1.json` — case IDs by family and branch
- `BUILD_NOTES.md` — new-case audit table (branch + pressure tags)

## Composition

- **15** cases copied from `micro_pilot/micro_pilot_bundle_v1.json` (`MP_*` ids unchanged)
- **25** new cases (`R40_F*_###`)

Family totals: F1=3, F2=3, F3=3, F4=5, F5=12, F6=14.

## How to run smoke against this pack

From the repo root, point the harness at this bundle with `--bundle`:

```powershell
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json
```

Optional filters (same as micro-pilot smoke):

```powershell
# One family
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json --families F4_select

# Specific cases
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json --case-ids R40_F6_001,MP_F5_001

# Cap run size while debugging
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json --limit 5
```

Requires `OPENAI_API_KEY` for the default OpenAI model. Outputs land under `RESEARCH/benchmark_pack_v1/runs/` (`smoke_raw_runs_*.json`, `smoke_summary_*.json`, `smoke_summary_*.md`).

## Quick integrity check (no API)

```powershell
node -e "const b=require('./RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json'); console.log(b.cases.length, b.pack_id)"
```

Or re-run the builder (validates gold/fixture arg alignment):

```powershell
node RESEARCH/benchmark_pack_v1/rehearsal_40/_build_rehearsal_40.mjs
```
