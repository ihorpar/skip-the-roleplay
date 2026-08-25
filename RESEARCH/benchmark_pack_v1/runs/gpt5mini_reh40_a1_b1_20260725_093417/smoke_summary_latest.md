# Smoke Eval Summary

- Started: 2026-07-25T13:34:17.888Z
- Finished: 2026-07-25T13:35:32.867Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5-mini
- Prompt styles: A1_task
- Modes: B1_instant
- Cases: 40

## Overall

- pass_rate: 20.0%
- json_valid_rate: 100.0%
- schema_valid_rate: 32.5%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 83.5%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 75.0%
- over_action_rate: 12.5%
- under_action_rate: 15.0%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5-mini: pass 20.0%, exact_tools 75.0%

## By Prompt Style

- A1_task: pass 20.0%, over_action 12.5%

## By Mode

- B1_instant: pass 20.0%, under_action 15.0%

