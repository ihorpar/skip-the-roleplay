# Smoke Eval Summary

- Started: 2026-07-21T21:56:30.157Z
- Finished: 2026-07-21T22:11:42.980Z
- Bundle: `RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.6-luna
- Prompt styles: A1_task, A2_role, A3_comp
- Modes: B1_instant, B2_thinking
- Cases: 120

## Overall

- pass_rate: 92.6%
- json_valid_rate: 100.0%
- schema_valid_rate: 99.4%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 98.2%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 94.6%
- over_action_rate: 4.7%
- under_action_rate: 3.2%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.6-luna: pass 92.6%, exact_tools 94.6%

## By Prompt Style

- A1_task: pass 93.3%, over_action 3.8%
- A2_role: pass 92.9%, over_action 4.2%
- A3_comp: pass 91.7%, over_action 6.3%

## By Mode

- B1_instant: pass 88.6%, under_action 5.3%
- B2_thinking: pass 96.7%, under_action 1.1%

