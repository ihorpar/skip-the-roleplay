# Protocol Lock v1 (Pre-120)

Date: 2026-04-19  
Updated: 2026-07-21 (owner locks)  
Status: Locked for pre-scale stability checks → 40-case rehearsal → full 120

Owner decision log: `RESEARCH/research-prep-analysis-2026-07-21.md` §0.

## Scope

This protocol lock applies to micro-pilot smoke, the **40-case rehearsal**, and the **full 120-task** Track 1 v1 main study.

## Prompt Conditions

- `A1_task` (task scaffold only; no role block)
- `A2_role` (scaffold + role line only)
- `A3_comp` (scaffold + role + **generic** competencies; **no benchmark-specific / workflow coaching**)

Axis A fairness rule: across A1/A2/A3, only the role/competencies block may differ. User prompt, tool schemas, and shared scaffold stay fixed.

### Prompt length policy (owner lock, 2026-07-21)

- Do **not** equalize A2/A3 with neutral filler text.
- Do **not** treat prompt length as an experimental factor or something to measure for causal adjustment.
- If A3 outperforms A2, attribute the difference to **competency content**, not length.
- We evaluate **quality of prompt content**, not length.

## Mode Conditions

- `B1_instant`
- `B2_thinking`

Rules:
- Mode is expressed via provider API settings only (`reasoning.effort`, etc.).
- B1 and B2 must have identical system and user prompt text for the same case and prompt style.

## Model Settings (Track 1 v1)

**Provider scope: OpenAI only.** Gemini / Anthropic are out of the v1 main study (adapters may remain in code unused).

### OpenAI (`gpt-5.6-luna`)

Official GPT-5.6 family (including Luna) supports `reasoning.effort` values:
`none`, `low`, `medium`, `high`, `xhigh`, `max` (default if omitted: `medium`).
Sources: OpenAI Reasoning guide / Model guidance / gpt-5.6-luna model page.

- `B1_instant`: `reasoning.effort = none`, `temperature = 0`
- `B2_thinking`: `reasoning.effort = medium`, `temperature` omitted
- `max_output_tokens = 3000`
- Final answer uses Structured Outputs (`json_schema` + enums); tool args use `strict` schemas with the same unit enums.

## Runtime / Reliability Settings

- request timeout: 45,000 ms
- retry policy: 2 retries on timeout/network/429/5xx
- deterministic evaluator only (no LLM judge for pass/fail)

## Scoring Notes

- **Primary outcome:** binary task success (pass/fail) on `scored` runs.
- Report infrastructure stability separately (`infra_error_runs`, `eval_unscorable_runs`).
- Keep `tool_call_exact_match_rate` and `tool_argument_accuracy` as required diagnostics (secondary).
- Family × prompt-style breakdowns are **exploratory only** (not confirmatory claims).

## Claim language (owner lock, 2026-07-21)

Findings should be stated as: *In this setup — which is often used in real-business agents — role/competencies did / did not help.*

## Decision Gate Before Full 120

Proceed to full 120-task generation/run only after:

1. **40-case rehearsal** completed on OpenAI `gpt-5.6-luna` with A1/A2/A3 × B1/B2.
2. Repeatability check completed (multiple repeats on the locked OpenAI model).
3. A3 text verified generic (no workflow coaching).
4. Infrastructure error rates acceptable for target concurrency settings.
