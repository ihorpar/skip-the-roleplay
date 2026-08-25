# Full Set Task Architecture v1

This document defines how the 120-task Track 1 benchmark should be generated at scale.

## Design Goal

Use a small number of fixed family blueprints plus modular challenge injectors so we can:

- scale to 120 tasks reliably
- steer difficulty through composable pressure modules
- preserve deterministic evaluation
- avoid invalid or noisy case combinations

## Architecture Layers

### 1. Family Blueprint

Each family defines the fixed operational boundary:

- required tools
- allowed branch endpoints
- required output scope
- allowed module count range

Families remain the primary unit of task semantics.

### 2. Base Scenario

Every task begins as a clean scenario with:

- one family
- one target branch
- one canonical operational truth state

This base scenario is intentionally simple and internally consistent before any challenge is injected.

### 3. Challenge Modules

Challenge modules are deterministic transforms that add pressure without changing the scoring contract.

Each module specifies:

- which families it can appear in
- which target branches it supports
- which pressure tags it contributes
- which other modules it excludes

Examples:

- `later_correction`
- `unsupported_concrete_unit_type`
- `similar_slot_ids`
- `unsorted_slots`
- `temporal_boundary`
- `user_says_skip_checks`
- `booking_failure_fixture`

### 4. Compatibility Matrix

Modules must not combine arbitrarily.

The compatibility layer prevents:

- logically impossible tasks
- false negatives caused by conflicting pressure injections
- branch/module combinations that cannot be evaluated deterministically

### 5. Quota Planner

The planner enforces:

- family allocation
- branch quotas within family
- pressure-tag coverage targets

This is the main lever for difficulty shaping at scale.

### 6. Deterministic Builders

After planning, a later payload builder will generate:

- user text
- task JSON
- gold JSON
- tool fixtures

All of them must derive from the same canonical truth packet.

## Why This Shape

This gives us strong control over benchmark composition without hand-authoring 120 unrelated tasks.

It also keeps the benchmark explainable:

- family says what stage of work is being tested
- branch says what endpoint is correct
- modules say what pressure was injected

## Current Deliverables

This architecture is implemented today as:

- config: [generator_config_v1.json](/mnt/c/Projects/landings/tark-ai/RESEARCH/benchmark_pack_v1/full_set/generator_config_v1.json)
- base scenario and module patterns: [base_scenarios_and_module_patterns_v1.md](/mnt/c/Projects/landings/tark-ai/RESEARCH/benchmark_pack_v1/full_set/base_scenarios_and_module_patterns_v1.md)
- draft family-module matrix: [family_module_matrix_draft_v1.md](/mnt/c/Projects/landings/tark-ai/RESEARCH/benchmark_pack_v1/full_set/family_module_matrix_draft_v1.md)
- planner: [generate-full-benchmark-plan.js](/mnt/c/Projects/landings/tark-ai/scripts/generate-full-benchmark-plan.js)
- validator: [validate-full-benchmark-plan.js](/mnt/c/Projects/landings/tark-ai/scripts/validate-full-benchmark-plan.js)

The planner currently outputs a full 120-case plan, not yet the final task/gold/fixture payloads.

That is deliberate:

- first lock composition
- then generate payload content
- then run validation and eval at scale
