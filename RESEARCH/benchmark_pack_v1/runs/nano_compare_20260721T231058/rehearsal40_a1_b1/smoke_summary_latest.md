# Smoke Eval Summary

- Started: 2026-07-22T03:11:43.769Z
- Finished: 2026-07-22T03:12:22.798Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5-nano
- Prompt styles: A1_task
- Modes: B1_instant
- Cases: 40

## Overall

- pass_rate: 0.0%
- json_valid_rate: 100.0%
- schema_valid_rate: 10.0%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 39.2%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 27.5%
- over_action_rate: 32.5%
- under_action_rate: 55.0%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5-nano: pass 0.0%, exact_tools 27.5%

## By Prompt Style

- A1_task: pass 0.0%, over_action 32.5%

## By Mode

- B1_instant: pass 0.0%, under_action 55.0%

