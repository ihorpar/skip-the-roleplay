# Smoke Eval Summary

- Started: 2026-07-22T03:19:06.130Z
- Finished: 2026-07-22T03:19:29.190Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5-nano, openai:gpt-5.6-luna
- Prompt styles: A1_task
- Modes: B1_instant
- Cases: 8

## Overall

- pass_rate: 50.0%
- json_valid_rate: 100.0%
- schema_valid_rate: 68.8%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 61.5%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 68.8%
- over_action_rate: 25.0%
- under_action_rate: 25.0%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5-nano: pass 0.0%, exact_tools 37.5%
- openai:gpt-5.6-luna: pass 100.0%, exact_tools 100.0%

## By Prompt Style

- A1_task: pass 50.0%, over_action 25.0%

## By Mode

- B1_instant: pass 50.0%, under_action 25.0%

