# Smoke Eval Summary

- Started: 2026-07-22T03:44:12.120Z
- Finished: 2026-07-22T03:55:27.784Z
- Bundle: `RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.4-nano
- Prompt styles: A1_task, A2_role, A3_comp
- Modes: B1_instant
- Cases: 120

## Overall

- pass_rate: 42.2%
- json_valid_rate: 100.0%
- schema_valid_rate: 57.2%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 96.7%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 90.8%
- over_action_rate: 5.3%
- under_action_rate: 6.1%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.4-nano: pass 42.2%, exact_tools 90.8%

## By Prompt Style

- A1_task: pass 42.5%, over_action 5.0%
- A2_role: pass 47.5%, over_action 5.8%
- A3_comp: pass 36.7%, over_action 5.0%

## By Mode

- B1_instant: pass 42.2%, under_action 6.1%

