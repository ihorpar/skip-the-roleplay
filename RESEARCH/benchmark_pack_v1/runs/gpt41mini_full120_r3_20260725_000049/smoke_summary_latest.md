# Smoke Eval Summary

- Started: 2026-07-25T04:00:49.959Z
- Finished: 2026-07-25T04:16:08.251Z
- Bundle: `RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-4.1-mini
- Prompt styles: A1_task, A2_role, A3_comp, S_role_long_pure
- Modes: B1_instant
- Cases: 120

## Overall

- pass_rate: 61.3%
- json_valid_rate: 100.0%
- schema_valid_rate: 88.1%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 94.1%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 78.3%
- over_action_rate: 16.3%
- under_action_rate: 10.6%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-4.1-mini: pass 61.3%, exact_tools 78.3%

## By Prompt Style

- A1_task: pass 61.7%, over_action 15.0%
- A2_role: pass 67.5%, over_action 13.3%
- A3_comp: pass 65.0%, over_action 12.5%
- S_role_long_pure: pass 50.8%, over_action 24.2%

## By Mode

- B1_instant: pass 61.3%, under_action 10.6%

