# Smoke Eval Summary

- Started: 2026-07-25T03:45:49.113Z
- Finished: 2026-07-25T04:00:32.180Z
- Bundle: `RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-4.1-mini
- Prompt styles: A1_task, A2_role, A3_comp, S_role_long_pure
- Modes: B1_instant
- Cases: 120

## Overall

- pass_rate: 62.5%
- json_valid_rate: 100.0%
- schema_valid_rate: 87.9%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 93.9%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 79.8%
- over_action_rate: 15.2%
- under_action_rate: 11.0%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-4.1-mini: pass 62.5%, exact_tools 79.8%

## By Prompt Style

- A1_task: pass 63.3%, over_action 11.7%
- A2_role: pass 65.8%, over_action 12.5%
- A3_comp: pass 62.5%, over_action 19.2%
- S_role_long_pure: pass 58.3%, over_action 17.5%

## By Mode

- B1_instant: pass 62.5%, under_action 11.0%

