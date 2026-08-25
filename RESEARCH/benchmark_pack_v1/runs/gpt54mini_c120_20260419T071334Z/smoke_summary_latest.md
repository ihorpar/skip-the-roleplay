# Smoke Eval Summary

- Started: 2026-04-19T07:13:34.980Z
- Finished: 2026-04-19T07:14:24.694Z
- Bundle: `RESEARCH/benchmark_pack_v1/micro_pilot/micro_pilot_bundle_v1.json`
- Models: openai:gpt-5.4-mini
- Prompt styles: A1_task, A3_comp
- Modes: B1_instant, B2_thinking
- Cases: 15

## Overall

- pass_rate: 74.1%
- json_valid_rate: 100.0%
- schema_valid_rate: 100.0%
- tool_trigger_precision: 98.1%
- tool_trigger_recall: 99.1%
- tool_argument_accuracy: 99.0%
- tool_call_exact_match_rate: 93.1%
- over_action_rate: 3.4%
- under_action_rate: 1.7%
- infra_error_runs: 0, eval_unscorable_runs: 2

## By Model

- openai:gpt-5.4-mini: pass 74.1%, exact_tools 93.1%

## By Prompt Style

- A1_task: pass 67.9%, over_action 3.6%
- A3_comp: pass 80.0%, over_action 3.3%

## By Mode

- B1_instant: pass 73.3%, under_action 0.0%
- B2_thinking: pass 75.0%, under_action 3.6%

