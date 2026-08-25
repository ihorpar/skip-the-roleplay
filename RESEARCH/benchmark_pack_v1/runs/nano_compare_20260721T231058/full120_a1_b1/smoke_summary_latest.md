# Smoke Eval Summary

- Started: 2026-07-22T03:12:55.216Z
- Finished: 2026-07-22T03:15:06.129Z
- Bundle: `RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5-nano
- Prompt styles: A1_task
- Modes: B1_instant
- Cases: 120

## Overall

- pass_rate: 1.7%
- json_valid_rate: 100.0%
- schema_valid_rate: 11.7%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 59.2%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 40.8%
- over_action_rate: 35.8%
- under_action_rate: 40.0%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5-nano: pass 1.7%, exact_tools 40.8%

## By Prompt Style

- A1_task: pass 1.7%, over_action 35.8%

## By Mode

- B1_instant: pass 1.7%, under_action 40.0%

