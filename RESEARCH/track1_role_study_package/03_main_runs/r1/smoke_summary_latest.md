# Smoke Eval Summary

- Started: 2026-07-21T21:24:12.138Z
- Finished: 2026-07-21T21:40:42.852Z
- Bundle: `RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json`
- Harness: multi_turn
- Models: openai:gpt-5.6-luna
- Prompt styles: A1_task, A2_role, A3_comp
- Modes: B1_instant, B2_thinking
- Cases: 120

## Overall

- pass_rate: 92.5%
- json_valid_rate: 100.0%
- schema_valid_rate: 99.4%
- tool_trigger_precision: 100.0%
- tool_trigger_recall: 98.1%
- tool_argument_accuracy: 100.0%
- tool_call_exact_match_rate: 94.3%
- over_action_rate: 5.1%
- under_action_rate: 3.5%
- infra_error_runs: 0, eval_unscorable_runs: 0

## By Model

- openai:gpt-5.6-luna: pass 92.5%, exact_tools 94.3%

## By Prompt Style

- A1_task: pass 92.1%, over_action 5.0%
- A2_role: pass 94.2%, over_action 3.8%
- A3_comp: pass 91.3%, over_action 6.7%

## By Mode

- B1_instant: pass 87.5%, under_action 6.4%
- B2_thinking: pass 97.5%, under_action 0.6%

