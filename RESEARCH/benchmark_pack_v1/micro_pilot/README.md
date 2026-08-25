# Micro Pilot Runnable Pack v1

This pack contains a runnable micro-pilot for Track 1 using the `benchmark_data_model_v1` contract.

## Files

- `micro_pilot_bundle_v1.json`: machine-readable bundle with full `task`, `gold`, and `fixtures` payloads per case
- `coverage_manifest_v1.json`: explicit mapping of required minimum coverage -> case IDs

## Coverage intent

The bundle includes one case for each required minimum micro-pilot category:

- F1 noisy extraction
- F2 non-new-job stop
- F2 serviceable ready-for-slot-fetch
- F3 unsupported concrete unit type -> unserviceable
- F3 slots-returned endpoint
- F4 equal-time slot trap
- F5 booking success
- F5 busy stop
- F5 slots-returned-no-valid-future stop
- F5 booking failure with exact non-confirmation response
- F6 later-correction hard case
- F6 similar-slot-ID hard case
- F6 unsupported user assumption hard case
- F6 name-conflict hard case
- F6 temporal-boundary hard case

## Notes

- Time-sensitive tasks include both `current_local_datetime` and `timezone`.
- All tool fixtures are fully machine-readable (no prose placeholders).
- `booking_name` is first-name-only in every case.
- Name-conflict pressure is intentionally limited to one dedicated F6 case.
- Semi-relevant fluff is used across cases to increase decision pressure without ambiguity.

## Smoke Eval

Run the smoke matrix (default: 2 models x 2 prompt styles x 2 modes):

```bash
npm run smoke:eval
```

Outputs are written to:

- `RESEARCH/benchmark_pack_v1/runs/smoke_raw_runs_*.json`
- `RESEARCH/benchmark_pack_v1/runs/smoke_summary_*.json`
- `RESEARCH/benchmark_pack_v1/runs/smoke_summary_*.md`

Adapter note:

- For `gpt-5.4-mini` in Responses API, keep `temperature` only in `B1_instant` (`reasoning.effort = none`), and omit it in `B2_thinking` (`reasoning.effort = medium`) to avoid request validation errors.
