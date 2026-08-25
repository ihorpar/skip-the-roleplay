# Smoke Eval Summary

- Started: 2026-07-22T05:01:41.992Z
- Finished: 2026-07-22T05:28:49.153Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5-nano
- Prompt styles: A1_task, A2_role
- Modes: B1_instant, B2_thinking
- Cases: 40

## Overall

- pass_rate: 15.6%
- json_valid_rate: 100.0%
- schema_valid_rate: 27.5%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 73.4%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 55.6%
- over_action_rate: 33.8%
- under_action_rate: 27.5%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5-nano: pass 15.6%, exact_tools 55.6%

## By Prompt Style

- A1_task: pass 16.3%, over_action 31.3%
- A2_role: pass 15.0%, over_action 36.3%

## By Mode

- B1_instant: pass 2.5%, under_action 40.0%
- B2_thinking: pass 28.7%, under_action 15.0%

