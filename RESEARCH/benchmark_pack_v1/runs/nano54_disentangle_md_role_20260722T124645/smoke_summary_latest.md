# Smoke Eval Summary

- Started: 2026-07-22T16:46:58.601Z
- Finished: 2026-07-22T16:57:03.178Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.4-nano
- Prompt styles: A1_task, S_md_only, S_role_long_plain, S_role_rich_md
- Modes: B2_thinking
- Cases: 40

## Overall

- pass_rate: 55.6%
- json_valid_rate: 100.0%
- schema_valid_rate: 66.9%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 94.6%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 85.0%
- over_action_rate: 13.1%
- under_action_rate: 6.9%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.4-nano: pass 55.6%, exact_tools 85.0%

## By Prompt Style

- A1_task: pass 52.5%, over_action 7.5%
- S_md_only: pass 45.0%, over_action 17.5%
- S_role_long_plain: pass 60.0%, over_action 12.5%
- S_role_rich_md: pass 65.0%, over_action 15.0%

## By Mode

- B2_thinking: pass 55.6%, under_action 6.9%

