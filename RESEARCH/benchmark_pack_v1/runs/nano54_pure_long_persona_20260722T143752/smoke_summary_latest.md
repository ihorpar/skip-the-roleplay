# Smoke Eval Summary

- Started: 2026-07-22T18:38:02.376Z
- Finished: 2026-07-22T18:40:40.022Z
- Bundle: `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.4-nano
- Prompt styles: S_role_long_pure
- Modes: B2_thinking
- Cases: 40

## Overall

- pass_rate: 65.0%
- json_valid_rate: 100.0%
- schema_valid_rate: 75.0%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 97.5%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 87.5%
- over_action_rate: 12.5%
- under_action_rate: 5.0%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.4-nano: pass 65.0%, exact_tools 87.5%

## By Prompt Style

- S_role_long_pure: pass 65.0%, over_action 12.5%

## By Mode

- B2_thinking: pass 65.0%, under_action 5.0%

