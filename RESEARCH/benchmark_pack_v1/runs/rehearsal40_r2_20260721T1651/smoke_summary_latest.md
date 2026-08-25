# Smoke Eval Summary

- Started: 2026-07-21T20:50:47.072Z
- Finished: 2026-07-21T20:56:36.025Z
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
- tool_trigger_recall: 96.2%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 88.8%
- over_action_rate: 9.6%
- under_action_rate: 6.3%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.6-luna: pass 88.8%, exact_tools 88.8%

## By Prompt Style

- A1_task: pass 91.3%, over_action 7.5%
- A2_role: pass 87.5%, over_action 11.3%
- A3_comp: pass 87.5%, over_action 10.0%

## By Mode

- B1_instant: pass 79.2%, under_action 10.8%
- B2_thinking: pass 98.3%, under_action 1.7%

