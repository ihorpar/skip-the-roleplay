---
name: Multi Turn Harness
overview: "Rebuild the research harness around a CLI-first multi-turn execution core: native model tool calls, fixture-backed tool execution, spec-aligned trace logs, and updated scoring from executed traces instead of predicted tool-call JSON."
todos:
  - id: extract-core
    content: Extract reusable normalization, prompt, evaluator, reporting, and provider modules from `scripts/smoke-eval.js`.
    status: completed
  - id: tool-simulator
    content: Implement fixture-backed tool simulator and scoped tool schema builder.
    status: completed
  - id: provider-adapters
    content: Add provider-neutral multi-turn adapters for OpenAI and Gemini native tool calling.
    status: completed
  - id: executor-loop
    content: Implement `runMultiTurnInference` with max-turn handling, tool result injection, timing, and usage capture.
    status: completed
  - id: trace-evaluator
    content: Emit spec-aligned traces and update evaluator logic to score executed tool sequences.
    status: completed
  - id: smoke-validation
    content: Run focused simulator/evaluator checks and a small live micro-pilot smoke run.
    status: completed
isProject: false
---

# Rebuild Multi-Turn Tool Harness

## Milestone Tracker

| Milestone | Status | Notes |
|-----------|--------|-------|
| extract-core | completed | `scripts/harness/*` modules extracted; `smoke-eval.js` is thin CLI |
| tool-simulator | completed | `tools/simulator.js`, `schemas.js`; no fixture leakage in prompts |
| provider-adapters | completed | `providers/openai.js`, `providers/gemini.js` |
| executor-loop | completed | `executor.js` with `runMultiTurnInference` |
| trace-evaluator | completed | Trace-compatible rows + `evaluateRunFromTrace` |
| smoke-validation | completed | `npm run harness:self-test`; live OpenAI smoke verified |
| m2-condition-isolation | completed | A1/A2/A3 role-only deltas; B1/B2 API-only; A2 in defaults |

## M2: Condition Isolation

Ensure experimental validity: A1/A2/A3 differ only by the tested role/competencies block; B1/B2 differ only via provider API settings.

### Acceptance criteria

- [x] A1 has no role/competency text; A2 and A3 use locked role lines from `prompts.js`
- [x] `harness:self-test` asserts A2−A1 and A3−A2 deltas are role-only
- [x] User prompt invariant across styles and modes
- [x] `DEFAULT_PROMPT_STYLES` includes `A2_role`
- [x] `--legacy-single-shot` warns and tags runs as non-experimental
- [x] `protocol_lock_v1.md` documents API-only B-mode isolation

### Validation

```powershell
npm run harness:self-test
npm run smoke:eval -- --case-ids MP_F2_001,MP_F4_001 --styles A1_task,A2_role,A3_comp --modes B1_instant,B2_thinking --models openai:gpt-5.4-mini --concurrency 1
```

## Direction

CLI-first multi-turn harness. Browser UI remains read-only artifact viewer. Default path is `runMultiTurnInference`; `--legacy-single-shot` preserves old one-shot JSON behavior.

## Usage

```powershell
# Default multi-turn harness
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/micro_pilot/micro_pilot_bundle_v1.json

# Targeted cases
npm run smoke:eval -- --case-ids MP_F4_001,MP_F5_001 --families F4_select,F5_full_flow

# Legacy comparison
npm run smoke:eval -- --legacy-single-shot

# No-network checks
npm run harness:self-test
```

## Outcomes

- Multi-turn tool loop works with OpenAI Responses API (verified on `MP_F2_001`).
- Fixture results are hidden from model-visible prompts.
- Runs emit `raw_model_turns`, `tool_call_sequence`, prompts, and evaluator fields (`eval_spec_version: v1_partial`).
- Evaluator scores executed tool events; blocked/unwarranted attempts count toward `over_action`.
- Summary metrics shape preserved in `smoke_summary_latest.json`.

## Residual Risks / Follow-ups

- Full `evaluation_spec_v1` trace completeness (cost, `first_token_ms`, tool-result turns in `raw_model_turns`) deferred.
- Gemini multi-turn live path not exercised in this session.
- Model quality on micro-pilot still low; harness correctness is separate from benchmark scores.
- Full 120-case runnable bundle generation still outstanding.

## Acceptance Criteria

- [x] `smoke:eval` runs micro-pilot through real provider tool-calling (default)
- [x] Fixture results never in model-visible user prompt
- [x] Reconstructable turn trace and `tool_call_sequence`
- [x] Evaluator scores executed tool events, not predicted `tool_calls[]`
- [x] Summary metrics preserved
- [x] `--case-ids` and `--legacy-single-shot` supported
- [x] `harness:self-test` no-network validation
