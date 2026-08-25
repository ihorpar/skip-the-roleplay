# Overall Research Design v2
**LLM Prompting Study - updated project context and design brief**

## Status

This document is the updated high-level design brief for the project.

It reflects the current locked decisions from:
- the Track 1 research contract
- the Evaluation Spec v1

Use this file as the main orientation document for:
- project context inside ChatGPT
- architecture decisions
- harness implementation
- task generation
- evaluator implementation
- pilot planning
- analysis planning

Use the locked contract and evaluation spec as the source of truth when there is any ambiguity.

---

## Working title

**Role Prompting vs Task-Defined Prompting in Thinking and Non-Thinking Frontier Models**

---

## Core question

This project studies whether classic role-based prompting still provides measurable value in modern frontier LLMs, especially reasoning-capable models.

The central comparison is between three prompt styles:

### A1. Task only
The prompt defines the job, the rules, and what counts as success.
It does not give the model a role.

Example:
- "Your task is to determine whether the request should continue, validate serviceability, fetch slots when appropriate, choose the earliest valid future slot, and book it when warranted."

### A2. Role
The same task prompt, plus a role.

Example:
- "You are a scheduling agent for an appliance repair company."

### A3. Role + competencies
The same task prompt, plus a role and a short list of relevant competencies.

Example:
- "You are a scheduling agent for an appliance repair company with strong professional competencies in careful listening, clear judgment, accurate follow-through, and disciplined adherence to procedures."

Competencies must stay generic folklore (no benchmark-/workflow-specific coaching). See `protocol_lock_v1.md`.

### Important comparison note
This design lets us compare:
- A2 vs A1 - the effect of adding a role
- A3 vs A2 - the effect of adding competencies on top of a role
- A3 vs A1 - the effect of adding the full role + competencies bundle

This design does **not** isolate the effect of competencies without a role.

---

## Why this matters

A huge amount of practical prompting advice still repeats the old pattern:
- tell the AI it is an expert
- describe its experience
- list its competencies
- then give the task

But modern reasoning models are different in at least two important ways:
1. they can allocate more computation to multi-step problems
2. they may care more about instruction structure, constraints, and output requirements than about decorative role framing

If that is true, then many builders may be wasting prompt budget on role framing that adds little value, or sometimes even hurts performance by distracting the model from the actual task.

This matters most for:
- agentic systems
- tool-using workflows
- noisy real-world inputs
- cost-sensitive deployments
- systems where latency and tool correctness matter

---

## Main hypotheses

### Primary hypothesis
Prompt style affects thinking and non-thinking models differently.

### More specific hypotheses

#### H1
Task-defined prompting may perform as well as or better than role-based prompting for many reasoning-enabled tasks.

#### H2
Role + competencies may help in some cases, but the effect may be smaller or less consistent in thinking models than in non-thinking models.

#### H3
In realistic tool-using workflows, explicit task definition, constraints, and success criteria may matter more than role or persona framing.

#### H4
The value of role prompting may depend on task family.

#### H5
Reasoning mode may improve quality on some tasks, but the gain may not justify the extra cost and latency in all settings.

---

## Main experimental axes

## Axis A - Prompting style
Three locked prompt conditions:

1. **A1_task_only**
2. **A2_role**
3. **A3_role_plus_competencies**

### Core fairness rule
Across A1, A2, and A3, the **only intended prompt difference** is the role / competencies block under test.

### Canonical prompt placement
The tested role / competencies block must be inserted in the system prompt.

All non-tested scaffold content must stay fixed across A1, A2, and A3.

The following must stay fixed:
- task instances
- tool schemas
- tool descriptions
- output rules
- evaluation logic
- scaffolding outside the tested role block
- decoding settings where applicable
- maximum output settings
- aggregation rules
- repeat policy
- current datetime injection rule
- logging fields

---

## Axis B - Mode condition
Two locked mode conditions:

1. **B1_instant**
   - no reasoning tokens or the closest provider-equivalent setting

2. **B2_thinking**
   - reasoning enabled at medium effort or provider-equivalent

### Provider rule
Different providers expose reasoning differently.
The exact settings used for each provider must be documented explicitly.

---

## Axis C - Model family
Planned families:
- OpenAI GPT-5.4
- Anthropic Claude family with and without extended thinking
- Google Gemini family with and without thinking enabled, where supported

The strongest version of the study compares within the same family across thinking modes, not only across unrelated models.

---

## Axis D - Task family
The study does not rely on one single task.
It uses multiple task families based on one realistic workflow.

---

## Benchmark choice

The central benchmark comes from a realistic **Appliance Repair scheduling workflow**.

This workflow was chosen because it combines:
- extraction from messy user input
- gating
- conditional continuation
- tool routing
- tool sequencing
- reasoning over returned slot data
- exact ID grounding
- booking only when warranted
- final user-facing response generation

This is a strong benchmark because the model can fail in many realistic ways:
- extracting the wrong zip or intent
- ignoring a later correction
- calling a tool when it should stop
- failing to call a required tool
- using tools in the wrong order
- passing wrong arguments
- choosing the wrong slot
- mutating the slot ID
- hallucinating serviceability or booking success
- getting distracted by irrelevant chatter

---

## Locked workflow fields and rules

### Extracted fields
The workflow may require:
- `booking_name`
- `intent`
- `zip_code`
- `unit_type`
- `unit_class`

`booking_name` is the first name of the person the appointment should be booked under.
It may differ from the caller's name or account holder name.

Allowed `unit_class` values are:
- `residential`
- `commercial`
- `unknown`

Allowed `unit_type` values are:
- `washer`
- `dryer`
- `refrigerator`
- `dishwasher`
- `oven_range`
- `microwave`
- `other_type`
- `unknown`

### Intent rule
Only `new_job` may continue into the operational flow.

All other intents must **not** trigger:
- `service_check`
- `check_slots`
- `book_slot`

### Locked tools
The workflow uses these tools:

- `service_check(zip_code, unit_type, unit_class)` -> returns serviceable true or false plus failure reason when not serviceable
- `check_slots(zip_code, unit_type, unit_class)` -> returns either busy or an array of slots
- `book_slot(booking_name, slot_id, date_time)` -> attempts booking

Every tool argument must include a concise schema description.
For `booking_name`, the description must specify first-name-only booking target semantics.

### Customer response rule
F2-F6 require a canonical `customer_response`.

This field is scored by exact match against gold.
It is intentionally closed-set to avoid LLM-judge evaluation for user-facing prose.

The fixed scaffold in the system prompt must include:
- the canonical response set
- exact-copy instruction for `customer_response`
- first-name-only definition of `booking_name`
- concise descriptions for all tool arguments

### Selection rule
For slot selection:
- past slots must be excluded
- a slot equal to current local datetime is also invalid
- among valid future slots, the earliest valid future slot must be chosen
- the exact `slot_id` must be preserved

The current local datetime must be a synthetic fixed value supplied by the task instance.
It must not be derived from wall-clock time at run execution.

### Recency rule
If the input contains conflicting details, the latest explicit correction wins, unless the task says otherwise.

### Unsupported-info rule
If a required value is not supported by the task input, the model must not invent it.
Allowed placeholders are controlled by schema and family rules, typically:
- `unknown`
- `not_applicable`

---

## Locked task families

Track 1 uses six locked task families.

## F1 - Extract
Input:
- messy user text

Goal:
- extract the required structured fields from noisy input

Required fields:
- `booking_name`
- `intent`
- `zip_code`
- `unit_type`
- `unit_class`

Tools:
- none

What it tests:
- extraction quality
- correction handling
- resistance to noisy or historical distractions

---

## F2 - Partial Flow A
**Extract + Gate + Service Check**

Input:
- messy user text

Goal:
- extract fields
- decide whether the request should continue
- call `service_check` only if allowed
- stop correctly at the family boundary

Tools:
- `service_check` only

What it tests:
- extraction + gating
- whether the model avoids unwarranted continuation
- whether it performs `service_check` only when appropriate

---

## F3 - Partial Flow B
**Extract + Gate + Service Check + Slot Fetch**

Input:
- messy user text

Goal:
- extract fields
- gate correctly
- call `service_check` when warranted
- call `check_slots` only if serviceability succeeds
- stop correctly at the slot-fetch boundary

Tools:
- `service_check`
- `check_slots`

What it tests:
- conditional branching
- correct tool triggering
- correct sequencing
- correct handling of busy vs slot array vs empty array

---

## F4 - Select
Input:
- messy user text
- synthetic fixed current local datetime

Goal:
- extract fields
- gate correctly
- call `service_check` when warranted
- call `check_slots` only if serviceability succeeds
- exclude all past slots
- exclude slots equal to current local datetime
- choose the earliest valid future slot
- preserve exact `slot_id`
- correctly report when no valid future slot exists

Tools:
- `service_check`
- `check_slots`

What it tests:
- extraction + gating + serviceability + slot-fetch sequencing
- correct time filtering
- exact ID grounding
- selection correctness under traps like similar IDs and unsorted slots

---

## F5 - Full Flow
Input:
- messy user text

Goal:
- complete the whole chain:
  - extract
  - gate
  - service check
  - slot fetch
  - select
  - book when warranted

Tools:
- `service_check`
- `check_slots`
- `book_slot`

What it tests:
- end-to-end workflow correctness
- grounded final claims
- correct tool ordering
- correct tool arguments
- correct booking behavior
- side-effect discipline: do not book unless every prior condition is satisfied
- failure grounding: do not claim confirmation when `book_slot` fails

---

## F6 - Robustness / Hard Cases Flow
Input:
- messy user text with stronger traps

Goal:
- satisfy the full-flow requirements under deliberately harder conditions

Tools:
- `service_check`
- `check_slots`
- `book_slot`

Typical hard conditions:
- conflicting details
- later corrections
- irrelevant chatter
- excluded-intent distractions
- similar IDs
- messy slot outputs
- unsorted and randomized slots
- partial tool outputs
- unsupported user assumptions

What it tests:
- robustness under realistic failure pressure

---

## Robustness scope

Families 1 to 5 are the standard benchmark families.
Family 6 is the dedicated robustness / hard-cases family.

This keeps standard workflow coverage separate from deliberate hard-case pressure.

---

## Building the benchmark

The Appliance Repair workflow can support a full study.

The key is not to create 120 random rewrites of the same scenario.
The key is to create a **structured task matrix**.

### Current benchmark target
**120 total task instances**

### Current family split
- 10 F1 Extract
- 10 F2 Partial Flow A
- 10 F3 Partial Flow B
- 15 F4 Select
- 35 F5 Full Flow
- 40 F6 Robustness / Hard Cases

Total:
**120 tasks**

This allocation intentionally shifts weight toward F5/F6 because the benchmark is primarily measuring agentic workflow behavior, tool discipline, and prompt/mode interaction under decision pressure.

---

## Task-generation factors

Each task should vary across controlled factors.

### Candidate factors
- input format
- required tools
- serviceability result
- slot-fetch result
- booking result
- later correction present or absent
- unsupported assumption present or absent
- similar IDs present or absent
- empty or partial tool output
- irrelevant chatter
- excluded-intent distraction
- task-specific pressure tags
- canonical customer response expected

### Example task fields
- `task_family`
- `task_id`
- `task_variant_id`
- `input_style`
- `tools_required`
- `pressure_tags`
- `expected_branch_id`
- `expected_customer_response`
- `ground_truth`

There is no legacy `difficulty` field.
Challenge is represented by branch coverage and `pressure_tags`.

---

## Hard-case types

The benchmark should include deliberate hard tests, not just normal scenarios.

### 1. Irrelevant overload
A lot of extra information is present but irrelevant.

### 2. Contradictory historical data
Older details are mixed with current ones.

### 3. Temptation to skip validation
The user implies that validation is unnecessary.

### 4. Similar IDs
Slot IDs are deliberately confusable.

### 5. Empty or partial tool results
The tool returns busy, empty, partial, or error-like states.

### 6. Policy or process trap
The model should stop rather than continue.

### 7. Long nested constraints
The model must preserve multiple rules at once.

### 8. Later correction
A field is corrected later and must override the earlier one.

### 9. Booking failure
The selected slot is valid, but `book_slot` fails and the model must not confirm.

### 10. Name conflict
Caller name, account holder name, and booking name differ.
The model must use first-name-only `booking_name`.

### 11. Temporal boundary
The user uses relative time language and synthetic local datetime creates a boundary case.

---

## Experimental comparison design

This is a **within-task paired design**.

The same task instance must be run under all six condition combinations:
- A1 + B1
- A2 + B1
- A3 + B1
- A1 + B2
- A2 + B2
- A3 + B2

This keeps task variation from distorting the comparison.

---

## Repeats and stability

One run per condition is not enough because outputs can vary.

Recommended:
- pilot: 2 to 3 repeats per condition
- larger study: 3 to 5 repeats per condition

This supports:
- average success measurement
- variance measurement
- stability analysis
- majority-pass behavior

---

## Output and evaluation design

The final output is **JSON only** and is enforced through structured outputs.

### Global scoring order
Each run is judged in this order:
1. trace completeness check
2. final output JSON parse check
3. final output JSON schema check
4. family-specific rubric check
5. failure subcode assignment
6. metric extraction from the run trace

### Important scoring rule
Evaluation is:
- deterministic
- rule-based
- not delegated to a judge model for family pass/fail

### Scoped-tool rule
To keep partial families diagnostic:
- F1 - no tools
- F2 - only `service_check`
- F3 - only `service_check`, `check_slots`
- F4 - only `service_check`, `check_slots`
- F5 - `service_check`, `check_slots`, `book_slot`
- F6 - `service_check`, `check_slots`, `book_slot`

Downstream tools that are out of scope for a partial family are not provided.

---

## Primary outcome

### Task Success Rate
This is the main metric.

A run counts as a pass only if it fully satisfies the rubric for that task family.

That means the run must get all required:
- decisions
- actions
- tool use
- ordering
- argument correctness
- selection correctness
- final grounded claims

If any required part is wrong, the run is a fail.

---

## Secondary metrics

The locked secondary metric set stays intentionally small:

1. Extraction Accuracy
2. Tool-Call Correctness
3. Sequence Correctness
4. Selection Correctness
5. Hallucinated Success Rate
6. Cost per Run
7. Latency per Run

The evaluator may also emit diagnostic component metrics.
These are not separate top-level outcome metrics.
They explain why the locked metrics moved.

Diagnostic components include:
- `json_valid_rate`
- `schema_valid_rate`
- `extraction_field_accuracy`
- `all_fields_correct_rate`
- `tool_trigger_precision`
- `tool_trigger_recall`
- `tool_argument_accuracy`
- `tool_call_exact_match_rate`
- `customer_response_exact_match_rate`
- `over_action_rate`
- `under_action_rate`

Mapping:
- Extraction Accuracy is explained by `extraction_field_accuracy` and `all_fields_correct_rate`
- Tool-Call Correctness is explained by trigger, argument, and exact-match components
- Reliability analysis is supported by hallucination, over-action, under-action, and customer-response components

### Interaction analysis

The main analysis should not rely only on aggregate pass rate.

Required interaction cuts:
- prompt condition x mode condition
- prompt condition x task family
- prompt condition x pressure tags
- mode condition x pressure tags
- model family x prompt condition
- model family x mode condition

Derived task groupings:
- `core`: F1-F4 without strong pressure tags
- `full_flow`: F5
- `robust`: F6
- `pressure_count_0`: no pressure tags
- `pressure_count_1`: one pressure tag
- `pressure_count_2_plus`: two or more pressure tags

---

## Failure taxonomy

Top-level failure buckets:
- extraction failure
- gating failure
- tool-trigger failure
- tool-argument failure
- sequencing failure
- selection failure
- hallucination failure
- customer-response failure
- robustness failure

Failure analysis should use detailed subcodes defined in the evaluation spec, such as:
- `extraction.zip_wrong`
- `extraction.later_correction_ignored`
- `gating.false_continue`
- `tool_trigger.check_slots_missing`
- `tool_argument.slot_id_mismatch`
- `sequencing.book_before_selection`
- `selection.past_slot_chosen`
- `hallucination.booking_claimed_without_success`
- `robustness.user_assumption_accepted_without_validation`

### Primary failure rule
When a run fails, the evaluator should assign the **earliest causal error** as the primary failure.
This keeps root-cause analysis cleaner.

---

## Trace and logging requirements

Every run must log enough structured data to reconstruct:
- prompt condition
- mode condition
- provider and model
- reasoning setting
- task ID and family
- current local datetime when applicable
- full prompt and prompt components
- tool schemas
- raw model turns
- tool call sequence
- normalized tool arguments
- tool outputs
- final output JSON
- parsed semantic fields
- token usage
- latency
- cost
- evaluator result

This trace is required for:
- deterministic scoring
- debugging
- failure analysis
- cost and latency analysis
- reproducibility

---

## Missing-data policy

The evaluator must distinguish:

### Model failure
The model omitted a required field or action.
This counts as incorrect.

### Trace failure
The harness failed to capture data needed to score.
This becomes `eval_unscorable`.

### Infrastructure failure
The run failed because of tooling or infrastructure outside the benchmarked model behavior.
This becomes `infra_error`.

Runs marked `eval_unscorable` are excluded from main semantic denominators and reported separately.

---

## Cost and latency design

This study explicitly measures both quality and efficiency.

### Cost
Per-run cost should include:
- input token cost
- output token cost
- reasoning token cost where applicable
- tracked tool cost if any

Aggregate summaries should report:
- mean
- median
- p90

### Latency
Per-run latency should include:
- end-to-end latency
- first-token latency where available
- tool time where available
- final-answer latency where available

Aggregate summaries should report:
- mean
- median
- p90

### Performance-cost trade-off
The study should not report quality alone.
It should also compare:
- quality gain versus cost increase
- quality gain versus latency increase
- whether thinking mode gives enough improvement to justify the added expense and delay

---

## Sample-size guidance

A single full-flow task is not enough.

For a serious first study, a practical starting point is:
- **120 total task instances**
- all task instances run through all six prompt/mode conditions
- repeated runs per condition

### Pilot recommendation
- 24 to 40 task instances
- 6 conditions
- 2 to 3 repeats
- 1 or 2 model families

### Main study recommendation
- 120 to 160 task instances
- 6 conditions
- 3 repeats minimum
- multiple model families

---

## Operational project phases

## Phase 1 - Contract and evaluation lock
Deliverables:
- locked research contract
- locked evaluation spec
- fixed comparison design
- fixed task-family boundaries

## Phase 2 - Task schema and benchmark data
Deliverables:
- task schema
- hidden ground-truth schema
- branch definitions
- task templates
- initial task instances
- trap-tag design

## Phase 3 - Evaluator implementation
Deliverables:
- deterministic family scorer
- normalization logic
- failure subcode assignment
- metric component extraction

## Phase 4 - Thin harness
Deliverables:
- prompt builder
- model adapter layer
- tool simulator
- trace logger
- run executor

## Phase 5 - Micro-pilot
Deliverables:
- 6 to 12 tasks across families
- end-to-end scoring test
- first debugging pass on harness and evaluator

## Phase 6 - Pilot
Deliverables:
- 24 to 40 tasks
- 6 conditions
- repeated runs
- first quality, cost, and latency signals
- first stable failure patterns

## Phase 7 - Main benchmark
Deliverables:
- full benchmark run
- paired comparisons
- per-family breakdowns
- per-mode breakdowns
- failure analysis
- cost-quality analysis

## Phase 8 - Publication or public writeup
Deliverables:
- benchmark description
- methodology
- findings
- limitations
- optional release of templates, schemas, or benchmark assets

---

## Risks and limitations

The study must acknowledge the main risks:

### 1. Workflow specificity
The benchmark is grounded in one realistic workflow family.
That improves realism but reduces breadth.

### 2. Provider differences
Reasoning settings are not identical across vendors.

### 3. Benchmark construction bias
Poorly designed tasks can unfairly favor one condition.

### 4. Tool-environment simplification
Synthetic tool environments are still simpler than real production systems.

### 5. Prompt-isolation drift
It is easy to accidentally change more than the tested role block.

### 6. Output variation
Repeated runs are needed because outputs can vary.

These limitations do not invalidate the study, but they must be controlled and stated clearly.

---

## Guiding principle

This project should stay grounded in one simple rule:

**Do not test prompting folklore in the abstract. Test it inside realistic, measurable workflows where success and failure can be checked deterministically.**

That is the main strength of the design.

---

## Short summary

This project investigates whether role-based prompting still helps modern frontier LLMs, especially reasoning-capable models, or whether explicit task definition and constraints now matter more.

The study compares:
- task only
- role
- role + competencies

across:
- instant mode
- thinking mode

using a benchmark built from a realistic appliance-repair scheduling workflow.

The benchmark is decomposed into six locked task families:
- F1 Extract
- F2 Partial Flow A
- F3 Partial Flow B
- F4 Select
- F5 Full Flow
- F6 Robustness / Hard Cases

It uses deterministic rule-based evaluation, JSON-only final outputs, scoped tool availability by family, a locked failure taxonomy, and full trace logging.

The goal is to produce a practical and evidence-based answer to whether role prompting still matters, where it matters, and how that answer changes in thinking vs non-thinking settings.
