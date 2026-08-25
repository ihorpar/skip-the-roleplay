# Gemini 3.5 Flash-Lite — free-tier campaign (strict schema v2)

**Started:** 2026-07-31  
**Model:** `gemini:gemini-3.5-flash-lite` · `B1_instant` · `thinkingLevel: minimal`  
**Bundle:** `full_120/full_120_bundle_v1.json`  
**Status:** **Exploratory glued r1 complete** (2026-08-05) — **not** a mini-style 3-rep claim; r2/r3 deferred  
**Harness:** `parametersJsonSchema` + `VALIDATED` tools + `responseJsonSchema` finals (optional slot fields) + explicit omit rules in prompt  
**Throttle:** `GEMINI_MIN_INTERVAL_MS=4500` (~13 RPM) · `concurrency=1`  
**Exploratory pack:** `exploratory_r1_glued/` (`GEMINI_FLASHLITE_EXPLORATORY_FINDINGS.md`, `glued_summary.json`)
## Ordering (hardest families first)

| Priority | Family | Cases | Why |
|---------|--------|------:|-----|
| 1 | `F6_robustness_hard_cases` | 40 | Full tool chains + temporal/policy edge cases |
| 2 | `F5_full_flow` | 35 | End-to-end booking flows |
| 3 | `F4_select` | 15 | Slot selection without full booking |
| 4 | `F1`–`F3` | 30 | Extraction / partial flows (easier) |

Prompt styles per family batch: `A1_task` → `A2_role` → `A3_comp` → `S_role_long_pure`.

## Capacity budget

| Unit | Est. API calls | Wall @ 4.5s spacing |
|------|---------------:|--------------------:|
| 1 case × 1 style | ~2.9 | ~13s |
| 40 cases × 1 style (F6) | ~116 | ~15–25 min |
| 40 × 4 styles (F6 complete) | ~464 | ~60–90 min |
| **Safe free-day target** | **≤230 API** | **≤2 family-style batches** |

Inter-batch cooldown: **3 minutes** (RPM recovery).

## Batch schedule

### Day 1 (2026-07-31) — F6 hardest

| Batch | Family | Style | Runs | Est. API | Status |
|-------|--------|-------|-----:|---------:|--------|
| `batch01_f6_a1` | F6 | A1_task | 40 | ~116 | **done** — pass 12.5%, schema 25%, infra 0% |
| `batch02_f6_a2` | F6 | A2_role | 40 | ~116 | **done** — pass 15.0%, schema 27.5%, infra 0% |

### Day 2 — F6 persona completion

| Batch | Family | Style | Runs | Est. API | Status |
|-------|--------|-------|-----:|---------:|--------|
| `batch03_f6_a3` | F6 | A3_comp | 40 | ~116 | **done** — pass 75.0%, schema 95%, infra 0% |
| `batch04_f6_pure` | F6 | S_role_long_pure | 40 | ~116 | **done** — pass 72.5%, schema 87.5%, infra 0% |

### Day 3 — F5 full flow

| Batch | Family | Style | Runs | Est. API | Status |
|-------|--------|-------|-----:|---------:|--------|
| `batch05_f5_a1` | F5 | A1_task | 35 | ~102 | **done** — pass 80.0%, schema 100%, infra 0% |
| `batch06_f5_a2` | F5 | A2_role | 35 | ~102 | **done** (rerun) — pass 80.0%, schema 100%, infra 0% |

### Day 4 — F5 persona + start F4

| Batch | Family | Style | Runs | Est. API | Status |
|-------|--------|-------|-----:|---------:|--------|
| `batch07_f5_a3` | F5 | A3_comp | 35 | ~102 | **done** — pass 82.9%, schema 100%, infra 0% |
| `batch08_f5_pure` | F5 | S_role_long_pure | 35 | ~102 | **done** — pass 85.7%, schema 94.3%, infra 0% |

### Day 5+ — F4 then F1–F3 (if continuing free tier)

| Batch | Family | Style | Runs | Est. API | Status |
|-------|--------|-------|-----:|---------:|--------|
| `batch09_f4_a1` | F4 | A1_task | 15 | ~44 | **done** — pass 80.0%, schema 86.7%, infra 0% |
| `batch10_f4_a2` | F4 | A2_role | 15 | ~44 | **done** — pass 80.0%, schema 100%, infra 0% |
| `batch11_f4_a3` | F4 | A3_comp | 15 | ~44 | **done** (rerun) — pass 66.7%, schema 100%, infra 0% |
| `batch12_f4_pure` | F4 | S_role_long_pure | 15 | ~44 | **done** — pass 66.7%, schema 100%, infra 0% |
| `batch13_f123_a1` | F1–F3 | A1_task | 30 | ~87 | **done** — pass 80.0%, schema 93.3%, infra 0% |
| `batch14_f123_a2` | F1–F3 | A2_role | 30 | ~87 | **done** — pass 80.0%, schema 96.7%, infra 0% |

### Day 8 — claim r1 gap-fill (final harness)

Keep existing clean fixed-harness batches; only re-run holes so r1 can be glued:

| Keep as r1 | Source |
|------------|--------|
| F6 A3 / pureLong | `batch03`, `batch04` |
| F5 all 4 styles | `batch05`–`batch08` |
| F4 all 4 styles | `batch09`–`batch12` |
| F1–F3 A1 / A2 | `batch13`, `batch14` |

| Batch | Family | Style | Runs | Est. API | Status |
|-------|--------|-------|-----:|---------:|--------|
| `batch15_f6_a1_gap` | F6 | A1_task | 40 | ~116 | **done** — pass 80.0%, schema 97.5%, infra 0% |
| `batch16_f6_a2_gap` | F6 | A2_role | 40 | ~116 | **done** — pass 72.5%, schema 97.5%, infra 0% |
| `batch17_f123_a3_gap` | F1–F3 | A3_comp | 30 | ~87 | **done** (rerun) — pass 76.7%, schema 93.3%, infra 0% |
| `batch18_f123_pure_gap` | F1–F3 | S_role_long_pure | 30 | ~87 | **done** — pass 73.3%, schema 100%, infra 0% |

**Claim r1 gaps closed** (2026-08-04). **Glued exploratory r1 assembled** (2026-08-05): 480 graded, overall A1 80.0% / A2 77.5% / A3 76.7% / pureLong 75.8%. Stage C (r2+r3) **deferred** — keep appendix-only unless upgraded later.

## Resume

```powershell
node RESEARCH/benchmark_pack_v1/runs/gemini35flashlite_free_tier_v2/run_batches.js
node RESEARCH/benchmark_pack_v1/runs/gemini35flashlite_free_tier_v2/run_batches.js --only batch03_f6_a3,batch04_f6_pure
node RESEARCH/benchmark_pack_v1/runs/gemini35flashlite_free_tier_v2/run_batches.js --day 2
```

## Abort rules

- Stop the campaign for the day if a batch finishes with **>10% infra_error_runs** (429/RPD).
- Do not read persona contrasts until F6 has all 4 styles with **<5% infra**.
