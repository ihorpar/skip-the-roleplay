# Smoke Eval Summary

- Started: 2026-07-21T23:28:02.233Z
- Finished: 2026-07-21T23:36:01.224Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.6-luna
- Prompt styles: A1_task, S_pos, S_neg, S_min, S_max, S_outcome, S_proc, S_schema_thin, S_schema_dup, S_anti
- Modes: B1_instant
- Cases: 40

## Overall

- pass_rate: 74.0%
- json_valid_rate: 100.0%
- schema_valid_rate: 98.8%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 98.0%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 92.3%
- over_action_rate: 7.2%
- under_action_rate: 3.8%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.6-luna: pass 74.0%, exact_tools 92.3%

## By Prompt Style

- A1_task: pass 92.5%, over_action 7.5%
- S_pos: pass 95.0%, over_action 5.0%
- S_neg: pass 92.5%, over_action 2.5%
- S_min: pass 12.5%, over_action 7.5%
- S_max: pass 100.0%, over_action 0.0%
- S_outcome: pass 75.0%, over_action 17.5%
- S_proc: pass 85.0%, over_action 15.0%
- S_schema_thin: pass 7.5%, over_action 2.5%
- S_schema_dup: pass 90.0%, over_action 10.0%
- S_anti: pass 90.0%, over_action 5.0%

## By Mode

- B1_instant: pass 74.0%, under_action 3.8%

