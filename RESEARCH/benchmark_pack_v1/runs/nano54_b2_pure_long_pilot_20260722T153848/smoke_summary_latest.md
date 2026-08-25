# Smoke Eval Summary

- Started: 2026-07-22T19:38:48.866Z
- Finished: 2026-07-22T19:43:33.539Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.4-nano
- Prompt styles: A1_task, S_role_long_pure
- Modes: B2_thinking
- Cases: 40

## Overall

- pass_rate: 50.0%
- json_valid_rate: 100.0%
- schema_valid_rate: 62.5%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 91.8%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 85.0%
- over_action_rate: 11.3%
- under_action_rate: 8.8%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.4-nano: pass 50.0%, exact_tools 85.0%

## By Prompt Style

- A1_task: pass 47.5%, over_action 12.5%
- S_role_long_pure: pass 52.5%, over_action 10.0%

## By Mode

- B2_thinking: pass 50.0%, under_action 8.8%

