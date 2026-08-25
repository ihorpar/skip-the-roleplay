# gpt-4.1-mini — Track-1 style claim card (separate from Luna)

**Status:** Confirmatory 3-repeat complete (2026-07-25)  
**Does NOT rewrite** Luna `CLAIM.md` — model-transfer pack only.  
**Reading rule:** ticket-level paired bootstrap 95% CI must exclude 0.

## Claim (plain language)

**On `gpt-4.1-mini` / full_120 / B1_instant, a pure long persona hurt full ticket success vs task-only.** Short role and soft competencies did **not** clear the claim bar (CI includes 0).

| Contrast | Mean Δ (pp) | 95% CI | Clears bar? |
|----------|------------:|--------|:-----------:|
| A2−A1 | +3.9 | [-1.7, +9.4] | no |
| A3−A2 | -4.2 | [-9.4, +0.8] | no |
| A3−A1 | -0.3 | [-5.0, +4.4] | no |
| pureLong−A1 | -8.6 | [-14.7, -2.8] | **yes (hurt)** |

## Pooled pass % (360 runs/style)

A1 63.1 · A2 66.9 · A3 62.8 · pureLong 54.4

## Matrix

| Item | Value |
|------|--------|
| Model | `openai:gpt-4.1-mini` |
| Tickets | 120 |
| Styles | A1 / A2 / A3 / S_role_long_pure |
| Mode | B1 only |
| Repeats | 3 |
| Scored | **1440** (0 infra) |

Details: `../../benchmark_pack_v1/runs/gpt41mini_extension/GPT41MINI_CLAIM_FINDINGS.md`  
JSON: `../../benchmark_pack_v1/runs/gpt41mini_extension/gpt41mini_claim_analysis_v1.json`  
Protocol: `../../benchmark_pack_v1/runs/gpt41mini_extension/PROTOCOL.md`
