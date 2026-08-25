# Smoke Eval Summary

- Started: 2026-07-21T20:44:11.303Z
- Finished: 2026-07-21T20:50:35.729Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.6-luna
- Prompt styles: A1_task, A2_role, A3_comp
- Modes: B1_instant, B2_thinking
- Cases: 40

## Overall

- pass_rate: 88.8%
- json_valid_rate: 100.0%
- schema_valid_rate: 99.6%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 96.6%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 88.8%
- over_action_rate: 10.0%
- under_action_rate: 5.8%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.6-luna: pass 88.8%, exact_tools 88.8%

## By Prompt Style

- A1_task: pass 90.0%, over_action 8.8%
- A2_role: pass 90.0%, over_action 8.8%
- A3_comp: pass 86.3%, over_action 12.5%

## By Mode

- B1_instant: pass 79.2%, under_action 10.0%
- B2_thinking: pass 98.3%, under_action 1.7%

