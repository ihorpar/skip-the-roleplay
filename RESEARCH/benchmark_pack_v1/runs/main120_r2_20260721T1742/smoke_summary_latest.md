# Smoke Eval Summary

- Started: 2026-07-21T21:40:47.026Z
- Finished: 2026-07-21T21:56:26.026Z
- Bundle: `RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.6-luna
- Prompt styles: A1_task, A2_role, A3_comp
- Modes: B1_instant, B2_thinking
- Cases: 120

## Overall

- pass_rate: 93.1%
- json_valid_rate: 100.0%
- schema_valid_rate: 99.3%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 98.1%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 95.0%
- over_action_rate: 4.4%
- under_action_rate: 3.3%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.6-luna: pass 93.1%, exact_tools 95.0%

## By Prompt Style

- A1_task: pass 93.3%, over_action 4.2%
- A2_role: pass 92.9%, over_action 3.8%
- A3_comp: pass 92.9%, over_action 5.4%

## By Mode

- B1_instant: pass 89.4%, under_action 5.3%
- B2_thinking: pass 96.7%, under_action 1.4%

