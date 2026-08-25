# Smoke Eval Summary

- Started: 2026-07-22T16:09:34.213Z
- Finished: 2026-07-22T16:17:00.158Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.4-nano
- Prompt styles: A1_task, A2_role, S_role_rich_md
- Modes: B2_thinking
- Cases: 40

## Overall

- pass_rate: 48.3%
- json_valid_rate: 100.0%
- schema_valid_rate: 60.8%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 94.5%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 87.5%
- over_action_rate: 10.0%
- under_action_rate: 5.8%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.4-nano: pass 48.3%, exact_tools 87.5%

## By Prompt Style

- A1_task: pass 50.0%, over_action 5.0%
- A2_role: pass 37.5%, over_action 17.5%
- S_role_rich_md: pass 57.5%, over_action 7.5%

## By Mode

- B2_thinking: pass 48.3%, under_action 5.8%

