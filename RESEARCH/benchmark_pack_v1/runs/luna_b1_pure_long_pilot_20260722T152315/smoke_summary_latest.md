# Smoke Eval Summary

- Started: 2026-07-22T19:23:38.617Z
- Finished: 2026-07-22T19:26:39.346Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.6-luna
- Prompt styles: A1_task, S_role_long_pure
- Modes: B1_instant
- Cases: 40

## Overall

- pass_rate: 92.5%
- json_valid_rate: 100.0%
- schema_valid_rate: 100.0%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 98.7%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 92.5%
- over_action_rate: 7.5%
- under_action_rate: 2.5%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.6-luna: pass 92.5%, exact_tools 92.5%

## By Prompt Style

- A1_task: pass 92.5%, over_action 7.5%
- S_role_long_pure: pass 92.5%, over_action 7.5%

## By Mode

- B1_instant: pass 92.5%, under_action 2.5%

