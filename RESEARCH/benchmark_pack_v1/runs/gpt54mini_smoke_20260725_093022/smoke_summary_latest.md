# Smoke Eval Summary

- Started: 2026-07-25T13:30:22.666Z
- Finished: 2026-07-25T13:30:27.618Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.4-mini
- Prompt styles: A1_task
- Modes: B1_instant
- Cases: 3

## Overall

- pass_rate: 66.7%
- json_valid_rate: 100.0%
- schema_valid_rate: 66.7%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 100.0%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 100.0%
- over_action_rate: 0.0%
- under_action_rate: 0.0%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.4-mini: pass 66.7%, exact_tools 100.0%

## By Prompt Style

- A1_task: pass 66.7%, over_action 0.0%

## By Mode

- B1_instant: pass 66.7%, under_action 0.0%

