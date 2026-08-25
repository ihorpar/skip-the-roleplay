# Smoke Eval Summary

- Started: 2026-07-24T19:49:38.976Z
- Finished: 2026-07-24T20:09:56.365Z
- Bundle: `RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-4.1-mini
- Prompt styles: A1_task, A2_role, A3_comp, S_role_long_pure
- Modes: B1_instant
- Cases: 120

## Overall

- pass_rate: 61.7%
- json_valid_rate: 100.0%
- schema_valid_rate: 88.5%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 93.4%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 79.4%
- over_action_rate: 16.5%
- under_action_rate: 10.8%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-4.1-mini: pass 61.7%, exact_tools 79.4%

## By Prompt Style

- A1_task: pass 64.2%, over_action 12.5%
- A2_role: pass 67.5%, over_action 13.3%
- A3_comp: pass 60.8%, over_action 16.7%
- S_role_long_pure: pass 54.2%, over_action 23.3%

## By Mode

- B1_instant: pass 61.7%, under_action 10.8%

