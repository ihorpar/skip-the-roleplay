# Smoke Eval Summary

- Started: 2026-07-25T13:30:47.380Z
- Finished: 2026-07-25T13:31:55.326Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.4-mini
- Prompt styles: A1_task
- Modes: B1_instant
- Cases: 40

## Overall

- pass_rate: 75.0%
- json_valid_rate: 100.0%
- schema_valid_rate: 90.0%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 91.1%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 82.5%
- over_action_rate: 10.0%
- under_action_rate: 15.0%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.4-mini: pass 75.0%, exact_tools 82.5%

## By Prompt Style

- A1_task: pass 75.0%, over_action 10.0%

## By Mode

- B1_instant: pass 75.0%, under_action 15.0%

