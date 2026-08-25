# Smoke Eval Summary

- Started: 2026-07-22T17:24:33.723Z
- Finished: 2026-07-22T17:38:33.420Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.4-nano
- Prompt styles: A1_task, A2_role, S_role_long_plain, S_md_only, S_md_short, S_role_rich_md
- Modes: B2_thinking
- Cases: 40

## Overall

- pass_rate: 52.5%
- json_valid_rate: 100.0%
- schema_valid_rate: 65.0%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 94.7%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 85.0%
- over_action_rate: 13.3%
- under_action_rate: 7.1%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.4-nano: pass 52.5%, exact_tools 85.0%

## By Prompt Style

- A1_task: pass 50.0%, over_action 12.5%
- A2_role: pass 52.5%, over_action 20.0%
- S_role_long_plain: pass 50.0%, over_action 7.5%
- S_md_only: pass 52.5%, over_action 12.5%
- S_md_short: pass 50.0%, over_action 20.0%
- S_role_rich_md: pass 60.0%, over_action 7.5%

## By Mode

- B2_thinking: pass 52.5%, under_action 7.1%

