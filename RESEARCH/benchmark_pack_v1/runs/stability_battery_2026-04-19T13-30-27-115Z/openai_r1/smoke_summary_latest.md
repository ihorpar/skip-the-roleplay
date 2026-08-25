# Smoke Eval Summary

- Started: 2026-04-19T13:30:27.198Z
- Finished: 2026-04-19T13:31:37.425Z
- Bundle: `RESEARCH/benchmark_pack_v1/micro_pilot/micro_pilot_bundle_v1.json`
- Models: openai:gpt-5.4-mini
- Prompt styles: A1_task, A3_comp
- Modes: B1_instant, B2_thinking
- Cases: 15

## Overall

- pass_rate: 73.3%
- json_valid_rate: 100.0%
- schema_valid_rate: 100.0%
- tool_trigger_precision: 99.1%
- tool_trigger_recall: 97.3%
- tool_argument_accuracy: 99.1%
- tool_call_exact_match_rate: 91.7%
- over_action_rate: 1.7%
- under_action_rate: 5.0%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.4-mini: pass 73.3%, exact_tools 91.7%

## By Prompt Style

- A1_task: pass 73.3%, over_action 3.3%
- A3_comp: pass 73.3%, over_action 0.0%

## By Mode

- B1_instant: pass 70.0%, under_action 3.3%
- B2_thinking: pass 76.7%, under_action 6.7%

