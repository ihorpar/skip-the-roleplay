# Smoke Eval Summary

- Started: 2026-04-19T07:31:51.075Z
- Finished: 2026-04-19T07:32:23.014Z
- Bundle: `RESEARCH/benchmark_pack_v1/micro_pilot/micro_pilot_bundle_v1.json`
- Models: openai:gpt-5.4-mini
- Prompt styles: A1_task, A3_comp
- Modes: B1_instant, B2_thinking
- Cases: 15

## Overall

- pass_rate: 70.7%
- json_valid_rate: 100.0%
- schema_valid_rate: 100.0%
- tool_trigger_precision: 99.0%
- tool_trigger_recall: 96.2%
- tool_argument_accuracy: 99.0%
- tool_call_exact_match_rate: 89.7%
- over_action_rate: 1.7%
- under_action_rate: 6.9%
- infra_error_runs: 0, eval_unscorable_runs: 2

## By Model

- openai:gpt-5.4-mini: pass 70.7%, exact_tools 89.7%

## By Prompt Style

- A1_task: pass 72.4%, over_action 3.4%
- A3_comp: pass 69.0%, over_action 0.0%

## By Mode

- B1_instant: pass 76.7%, under_action 0.0%
- B2_thinking: pass 64.3%, under_action 14.3%

