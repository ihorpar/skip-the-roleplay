# Smoke Eval Summary

- Started: 2026-07-22T03:27:43.990Z
- Finished: 2026-07-22T03:29:09.983Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.4-nano
- Prompt styles: A1_task
- Modes: B1_instant
- Cases: 40

## Overall

- pass_rate: 40.0%
- json_valid_rate: 100.0%
- schema_valid_rate: 60.0%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 94.9%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 90.0%
- over_action_rate: 5.0%
- under_action_rate: 10.0%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.4-nano: pass 40.0%, exact_tools 90.0%

## By Prompt Style

- A1_task: pass 40.0%, over_action 5.0%

## By Mode

- B1_instant: pass 40.0%, under_action 10.0%

