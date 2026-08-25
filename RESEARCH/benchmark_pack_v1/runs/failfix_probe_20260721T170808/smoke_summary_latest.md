# Smoke Eval Summary

- Started: 2026-07-21T21:08:09.170Z
- Finished: 2026-07-21T21:08:44.744Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.6-luna
- Prompt styles: A1_task, A2_role, A3_comp
- Modes: B1_instant
- Cases: 5

## Overall

- pass_rate: 80.0%
- json_valid_rate: 100.0%
- schema_valid_rate: 100.0%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 100.0%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 80.0%
- over_action_rate: 20.0%
- under_action_rate: 0.0%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.6-luna: pass 80.0%, exact_tools 80.0%

## By Prompt Style

- A1_task: pass 80.0%, over_action 20.0%
- A2_role: pass 80.0%, over_action 20.0%
- A3_comp: pass 80.0%, over_action 20.0%

## By Mode

- B1_instant: pass 80.0%, under_action 0.0%

