# Gemini 3.5 Flash-Lite — exploratory full_120 screen (glued r1)

**Status:** Exploratory / directional — **not** a claim  
**Does not rewrite** Luna `CLAIM.md` or the `gpt-4.1-mini` claim card  
**Date assembled:** 2026-08-05  
**Model:** `gemini:gemini-3.5-flash-lite` · `B1_instant` (`thinkingLevel: minimal`)  
**Pack:** `full_120` · 120 cases × 4 styles × **1** repeat = **480** graded · **0** infra in glued set  

## What this is

A **one-repeat** cross-family screen on Google’s free-tier Flash-Lite, after harness fixes for Gemini structured outputs. Batches were run family-by-family (free-tier RPD), then **glued** into one matrix. This is **not** three-repeat confirmatory science under the Track-1 reading plan.

## Harness (final)

- Tools: `parametersJsonSchema` + `toolConfig.functionCallingConfig.mode = VALIDATED`
- Finals: `responseJsonSchema` with `returned_slot_ids` / `selected_slot_id` **optional** (not required)
- Prompt: explicit omit rules for those fields unless the matching `final_status` requires them

Older F6 A1/A2 batches (pre-fix / pre-omit) are **excluded** from this glue.

## Source batches

| Slice | Batch ids |
|-------|-----------|
| F6 A1 / A2 | `batch15_f6_a1_gap`, `batch16_f6_a2_gap` |
| F6 A3 / pureLong | `batch03_f6_a3`, `batch04_f6_pure` |
| F5 all styles | `batch05`–`batch08` |
| F4 all styles | `batch09`–`batch12` |
| F1–F3 A1 / A2 | `batch13`, `batch14` |
| F1–F3 A3 / pureLong | `batch17_f123_a3_gap`, `batch18_f123_pure_gap` |

Artifacts: `exploratory_r1_glued/glued_summary.json`, `glued_raw_runs.json`

## Overall pass % (120 graded / style)

| Style | Pass | Schema valid |
|-------|-----:|-------------:|
| A1_task | **80.0%** (96/120) | 95.8% |
| A2_role | **77.5%** (93/120) | 98.3% |
| A3_comp | **76.7%** (92/120) | 96.7% |
| S_role_long_pure | **75.8%** (91/120) | 94.2% |

### Point estimates only (no claim CI)

| Contrast | Δ (pp) |
|----------|-------:|
| A2 − A1 | −2.5 |
| A3 − A2 | −0.8 |
| A3 − A1 | −3.3 |
| pureLong − A1 | −4.2 |

**Read:** short role / soft competencies / longer persona do **not** look helpful on this one-rep screen; deltas are small and **unconfirmed**. Do **not** treat as a mini-style “hurt” claim without r2/r3 + paired bootstrap.

## Family sketch (pass %)

| Family | A1 | A2 | A3 | pureLong |
|--------|---:|---:|---:|---------:|
| F6 (40) | 80.0 | 72.5 | 75.0 | 72.5 |
| F5 (35) | 80.0 | 80.0 | 82.9 | 85.7 |
| F4 (15) | 80.0 | 80.0 | 66.7 | 66.7 |
| F1–F3 (30) | 80.0 | 80.0 | 76.7 | 73.3 |

## Placement

| Material | Paper |
|----------|--------|
| This glued 1-rep screen | Appendix exploratory only |
| Upgrade path | Optional later: r2+r3 + bootstrap → separate model claim (not done) |

## Protocol

Campaign log: `../PROTOCOL.md`
