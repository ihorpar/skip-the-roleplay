# Evaluation Spec v1
**Track 1 prompting study - locked evaluation specification**

## Status
Locked for Track 1 after agreement in chat on:
- scoped tool availability for partial families
- JSON-only final output enforced via structured outputs
- deterministic rule-based evaluation
- enum dictionary with descriptions
- full trace schema

This spec defines how **one run** is judged.

It operationalizes the locked Track 1 contract and turns it into concrete evaluation logic for engineering, harness logging, and analysis.

---

## 1. Purpose

The contract says **what** Track 1 studies.  
This Evaluation Spec says **how** each run is scored.

A run is judged in this order:

1. trace completeness check
2. final output JSON parse check
3. final output JSON schema check
4. family-specific rubric check
5. failure subcode assignment
6. metric extraction from the run trace

Important rule:
- Evaluation is **deterministic and rule-based**
- Family pass/fail is **not** delegated to a judge model

---

## 2. What this spec covers

This spec locks:

- family-by-family pass/fail rules
- tool availability by family
- expected and forbidden actions
- edge-case handling
- metric formulas and denominators
- missing-data handling
- failure buckets and subcodes
- enum dictionaries
- run trace schema
- model output rules for structured JSON

---

## 3. Global evaluation rules

### 3.1 Normalization rules

The evaluator must normalize values before semantic comparison.

#### zip_code
- normalize to 5-digit string
- ignore surrounding spaces
- if input contains a ZIP+4, keep the first 5 digits only

#### booking_name
- trim outer whitespace
- collapse repeated spaces to one space
- extract and compare first name only
- comparison is case-insensitive unless the task explicitly says otherwise

#### enum fields
The following fields must be compared after enum normalization:
- `intent`
- `unit_type`
- `unit_class`
- `final_status`
- `slot_fetch_result_type`
- `booking_result_type`

#### datetime
- normalize all datetimes to the task's local timezone
- compare the underlying instant, not the surface formatting
- user-facing render format is checked separately where required

---

### 3.2 Recency and correction rule

If the input contains conflicting details, the **latest explicit correction** wins, unless the task explicitly says otherwise.

Examples:
- old zip first, corrected zip later -> use corrected zip
- old appliance mention in history, current appliance later -> use current appliance

If the model uses an outdated value after a later correction exists, that is an error.

---

### 3.3 Unsupported-info rule

If a required value is not supported by the task input, the model must not invent it.

Allowed machine-readable placeholders:
- `unknown`
- `not_applicable`

The exact allowed placeholder depends on the field definition below.

Missing-info stops are not blanket catch-all branches.
They apply only when the task gold label says the next required operational step cannot be performed from available data.

If the task gold label defines `unknown` as a supported operational value for a field, the model may continue with `unknown` where the schema and tool contract allow it.

Task gold definitions must explicitly encode which values are operationally acceptable for the next step.
For Track 1, `other_type` is never operationally acceptable for slot fetch.
It may be passed to `service_check`, but must stop before `check_slots` because the user named a concrete but unsupported unit type.

---

### 3.4 Future-slot rule

A slot counts as a valid future slot only if:

`slot_start_time > current_local_datetime`

So:
- equal to current local datetime -> **not valid**
- earlier than current local datetime -> **not valid**

The `current_local_datetime` value must be a synthetic, fixed datetime supplied by the task instance.
It must not be derived from the wall-clock time at run execution.

This keeps every prompt condition, repeat, provider, and rerun on the same time baseline.

Datetime fixtures must include:
- an ISO 8601 datetime with offset, for example `2026-04-16T10:00:00-04:00`
- an IANA timezone, for example `America/New_York`

---

### 3.5 Tool-event correctness rule

A tool event is counted as fully correct only if all of the following are true:
- correct tool name
- correct position in the flow
- correct normalized arguments

A tool call with the right tool name but wrong arguments is **not** fully correct.

---

### 3.6 Primary failure assignment rule

Each failed run must store:
- `primary_failure_bucket`
- `primary_failure_subcode`
- `all_failure_subcodes[]`

Primary failure rule:
- assign the **earliest causal error** in the chain as primary

Example:
- wrong zip extracted
- wrong serviceability arguments passed into `service_check`
- wrong serviceability result claimed

Primary failure should be:
- `extraction.zip_wrong`

not:
- `tool_argument.zip_mismatch`

This keeps root-cause analysis clean.

---

### 3.7 Scoped-tool rule for partial families

To keep families diagnostic and clean:

- **F1 Extract** - no tools provided
- **F2 Partial Flow A** - only `service_check`
- **F3 Partial Flow B** - only `service_check`, `check_slots`
- **F4 Select** - only `service_check`, `check_slots`
- **F5 Full Flow** - `service_check`, `check_slots`, `book_slot`
- **F6 Robustness / Hard Cases Flow** - `service_check`, `check_slots`, `book_slot`

Important design rule:
- downstream tools that are out of scope for a partial family are **not provided**
- the model is judged only on the family boundary it is supposed to complete

This prevents partial families from being polluted by proactive continuation beyond scope.

---

## 4. Structured output rule

### 4.1 Final output requirement

The model must return a final **JSON object** that conforms to the family's provided JSON schema.

The harness will provide the JSON schema in prompt configuration.

### 4.2 Scoring order

Scoring order is fixed:

1. output is valid JSON
2. output conforms to schema
3. output is semantically correct under the family rubric

Important:
- schema-valid JSON is **necessary**
- schema-valid JSON is **not sufficient**

A run can be:
- valid JSON
- schema-valid
- but still fail semantically

### 4.3 Placeholder rule

Use these placeholders only where the schema allows them:
- `unknown`
- `not_applicable`

Do not overload omission to mean:
- missing because forgotten
- missing because unknown
- missing because not applicable

Those cases must stay distinct.

---

## 5. Enum dictionary

Every enum below is part of the locked evaluation interface.

Each enum value includes:
- meaning
- boundary
- notes where needed

---

### 5.1 `task_family`

Used in:
- task definition
- trace logging
- evaluator routing

Allowed values:

- `F1_extract`
  - Extraction only from messy input
  - No tools
- `F2_partial_flow_a`
  - Extract + gate + service check
  - Stops after gate or serviceability outcome
- `F3_partial_flow_b`
  - Extract + gate + service check + slot fetch
  - Stops after slot-fetch outcome
- `F4_select`
  - Extract, check serviceability, fetch slots, and select earliest valid future slot
  - No booking
- `F5_full_flow`
  - Full chain through booking when warranted
- `F6_robustness_hard_cases`
  - Full chain with deliberate traps and hard cases

---

### 5.2 `prompt_condition`

Used in:
- trace logging
- aggregation

Allowed values:

- `A1_task_only`
  - Task instructions only
  - No role framing
- `A2_role`
  - Same task prompt plus role framing
- `A3_role_plus_competencies`
  - Same task prompt plus role framing and competency block

Canonical prompt placement:
- the tested role / competencies block must be inserted in the system prompt
- all non-tested scaffold content must stay fixed across A1, A2, and A3
- provider adapters may map this canonical system prompt to the provider's equivalent top-level instruction channel, but the semantic placement must remain equivalent across A1, A2, and A3

---

### 5.3 `mode_condition`

Used in:
- trace logging
- aggregation

Allowed values:

- `B1_instant`
  - No reasoning tokens or closest provider-equivalent
- `B2_thinking`
  - Reasoning enabled at medium effort or provider-equivalent

---

### 5.4 `intent`

Used in:
- model output
- gating
- evaluator logic

Allowed values:

- `new_job`
  - The user is asking to schedule a new repair visit
  - This is the **only** intent that may continue into operational flow
- `reschedule`
  - The user wants to move an already existing appointment
  - Does not continue into the new-job operational flow
- `cancel`
  - The user wants to cancel an already existing appointment
  - Does not continue into the new-job operational flow
- `status_check`
  - The user is asking about the status of an existing appointment or job
  - Does not continue into the new-job operational flow
- `quote_only`
  - The user wants a price, estimate, or general cost information without scheduling a visit
  - Does not continue into the new-job operational flow
- `general_question`
  - The user asks a general informational question
  - Does not continue into the new-job operational flow
- `other`
  - The message does not fit the operational scheduling intents above
  - Does not continue into the new-job operational flow
- `unknown`
  - The intent cannot be determined from the input with enough support
  - Does not continue into the new-job operational flow

Boundary rule:
- only `new_job` may trigger `service_check`, `check_slots`, or `book_slot`

---

### 5.5 `booking_name`

Used in:
- model output
- extraction scoring
- `book_slot` arguments

Definition:
- first name of the person the appointment should be booked under

Rules:
- use first name only
- if the user gives a full name, extract only the first name
- if caller name and booking name differ, use the booking name
- if no booking person is provided, use `unknown`

Boundary note:
- `booking_name` may differ from caller name or account holder name

---

### 5.6 `unit_type`

Used in:
- model output
- `service_check` arguments
- `check_slots` arguments
- evaluator logic

Allowed values:

- `washer`
  - Clothes washer
- `dryer`
  - Clothes dryer
- `refrigerator`
  - Refrigerator or fridge
- `dishwasher`
  - Dishwasher
- `oven_range`
  - Oven, stove, or range
- `microwave`
  - Microwave
- `other_type`
  - A concrete appliance or unit type is explicitly named and understandable, but is outside the supported `unit_type` enum
- `unknown`
  - Unit type cannot be determined from the input

Boundary notes:
- `oven`, `stove`, and `range` normalize to `oven_range`
- `fridge` normalizes to `refrigerator`
- use `unknown` when no unit type is stated, the stated type is too vague, the type cannot be reliably inferred, or conflicts cannot be resolved under task rules
- use `other_type` only when the user explicitly names a concrete, understandable type that is not in the supported enum
- do not map an unsupported but concrete type to the nearest supported type
- example: `wine cooler` must be `other_type`, not `refrigerator`, unless a task explicitly defines wine coolers as refrigerators
- in Track 1, `other_type` may be passed to `service_check`, but must stop before `check_slots`; calling `check_slots` with `other_type` is an unwarranted tool call and a hallucination-resistance failure

---

### 5.7 `unit_class`

Used in:
- model output
- `service_check` arguments
- `check_slots` arguments
- evaluator logic

Allowed values:

- `residential`
  - Residential household unit
- `commercial`
  - Commercial-grade or business-location unit
- `unknown`
  - Unit class cannot be determined from the input

Boundary notes:
- absence of commercial context should normally map to `residential` when the task gold label supports that inference
- `unknown` is a supported value when the task intentionally does not provide enough evidence for residential vs commercial
- a supported `unknown` value is not automatically a missing-info stop
- missing-info stop is used only when the task gold label says the next required operational step cannot be performed from available data

---

### 5.8 `slot_fetch_result_type`

Used in:
- tool fixture results
- evaluator logic

Allowed values:

- `not_applicable`
  - Slot fetch was not supposed to happen in this run
- `busy`
  - The slot tool explicitly returned busy / no availability in the tool's busy mode
- `slots_returned`
  - The slot tool returned an array of slots
- `empty_array`
  - The slot tool returned an empty array result
- `tool_error`
  - The slot tool returned an error state
- `unknown`
  - The result type cannot be determined from the trace

Boundary note:
- `busy` and `empty_array` are distinct because the tool may signal them differently
- Track 1 fixtures do not intentionally include `tool_error` slot-fetch outcomes

---

### 5.9 `service_failure_reason`

Used in:
- `service_check` tool output
- canonical customer response selection

Allowed values:
- `not_applicable`
- `unsupported_area`
- `unsupported_unit`
- `unsupported_class`
- `unknown`

Rules:
- if `serviceable = true`, use `not_applicable`
- if `serviceable = false`, use a concrete non-`not_applicable` reason
- this field does not change `final_status`; unserviceable cases still use `stopped_unserviceable`

---

### 5.10 `booking_result_type`

Used in:
- tool fixture results
- evaluator logic

Allowed values:

- `not_applicable`
  - Booking was not supposed to happen in this run
- `booking_success`
  - `book_slot` completed successfully
- `booking_failure`
  - `book_slot` was called but did not succeed
- `tool_error`
  - The booking tool returned an error state
- `unknown`
  - Booking result cannot be determined from the trace

Boundary note:
- Track 1 fixtures do not intentionally include `tool_error` booking outcomes

---

### 5.11 `final_status`

Used in:
- model output
- evaluator logic
- aggregation

Allowed values:

- `ready_for_slot_fetch`
  - F2 only: serviceability was checked, serviceable is true, and the run stops at the scoped F2 family boundary before slot fetch
- `stopped_non_new_job`
  - Stopped because intent is not `new_job`
- `stopped_missing_required_info`
  - Stopped because a required operational value was unavailable
- `stopped_unserviceable`
  - Stopped because `service_check` returned serviceable false
  - The tool's `failure_reason` and gold response determine whether the user-facing response is area-specific or unit-specific
- `stopped_busy`
  - Stopped because slot fetch produced a busy result
- `stopped_no_valid_future_slots`
  - Stopped because there were no valid future slots after selection filtering
- `slots_returned`
  - F3 only: slots were fetched and returned as the family endpoint
- `selection_complete`
  - F4 only: a valid slot was correctly selected
- `booking_confirmed`
  - Booking succeeded and was grounded in a successful tool result
- `booking_failed`
  - Booking was attempted and did not succeed
- `unknown`
  - Final run state cannot be determined from the trace

Boundary note:
- `booking_confirmed` must never be used without a successful `book_slot` result

---

### 5.12 `customer_response`

Used in:
- model output
- deterministic user-facing result scoring

Allowed canonical values:
- `sorry, I can only help with new booking requests`
- `What is your zip code?`
- `What type of unit do you need service for?`
- `sorry, we can't service this area`
- `sorry, we can't service this unit`
- `sorry, no booking times are available right now`
- `sorry, no valid future booking times are available`
- `we can continue with scheduling`
- `available booking times were found`
- `a valid booking time is available`
- `your booking is confirmed`
- `sorry, I couldn't complete the booking`

Rules:
- F2-F6 outputs must include `customer_response`.
- The value must exactly match the expected canonical response in gold.
- F1 is extraction-only and does not require `customer_response`.
- Paraphrases are not accepted in Track 1.
- For `stopped_unserviceable`, the same `final_status` may map to area-specific or unit-specific canonical responses; use gold as source of truth.
- For `stopped_missing_required_info`, the model must ask the exact missing-field clarification question from gold. It must not use a generic missing-info apology.
- Missing `zip_code` maps to `What is your zip code?`.
- Missing `unit_type` maps to `What type of unit do you need service for?`.

---

### 5.13 `tool_call_status`

Used in:
- trace logging

Allowed values:

- `success`
  - Tool executed and returned a usable result
- `error`
  - Tool returned an error result
- `timeout`
  - Tool did not complete within the allowed time
- `blocked`
  - Tool call was blocked by harness or policy
- `unknown`
  - Tool status could not be determined

Boundary note:
- Track 1 fixtures are expected to produce successful simulated tool calls only
- `error`, `timeout`, and `blocked` remain available for trace integrity and infrastructure diagnosis, but are not intentional task outcomes in Track 1

---

### 5.14 `eval_status`

Used in:
- evaluator result

Allowed values:

- `scored`
  - Run had enough data to score
- `eval_unscorable`
  - Run could not be scored due to incomplete or corrupted trace
- `infra_error`
  - Run failed due to infrastructure rather than model behavior

Boundary note:
- `eval_unscorable` runs are excluded from main semantic metric denominators and reported separately

---

## 6. Canonical machine-readable output by family

The exact JSON schema is provided in prompt configuration.
This section locks the **semantic fields** that each family must expose.

Design rule:
- final model output must contain only fields that cannot be reliably reconstructed from the tool trace, task gold, or tool fixtures
- extraction fields are required only when extraction is in scope
- `final_status` is required for F2-F6
- F1 is extraction-only and does not use `final_status`
- `returned_slot_ids` is required only for the F3 `slots_returned` endpoint
- `selected_slot_id` is required only when a slot was selected or booked
- `customer_response` is required for F2-F6 and must exactly match the gold canonical response
- do not ask the model to report process state already known from trace, such as whether a tool was called or what a tool returned

---

### 6.1 F1 output fields

Required semantic fields:
- `booking_name`
- `intent`
- `zip_code`
- `unit_type`
- `unit_class`

Rules:
- no tool-related fields should appear

---

### 6.2 F2 output fields

Required semantic fields:
- `booking_name`
- `intent`
- `zip_code`
- `unit_type`
- `unit_class`
- `final_status`
- `customer_response`

Rules:
- no slot-fetch or booking fields should appear
- `customer_response` must exactly match the expected canonical response

---

### 6.3 F3 output fields

Required semantic fields:
- `booking_name`
- `intent`
- `zip_code`
- `unit_type`
- `unit_class`
- `final_status`
- `customer_response`
- `returned_slot_ids` only when `final_status = slots_returned`

Rules:
- when `final_status = slots_returned`, `returned_slot_ids` must exactly match the fetched slot IDs
- when `final_status` is anything other than `slots_returned`, `returned_slot_ids` must not appear
- `customer_response` must exactly match the expected canonical response
- booking fields must not appear

---

### 6.4 F4 output fields

Required semantic fields:
- `booking_name`
- `intent`
- `zip_code`
- `unit_type`
- `unit_class`
- `final_status`
- `customer_response`
- `selected_slot_id` only when `final_status = selection_complete`

Rules:
- `final_status` must reflect the correct F4 branch endpoint
- when `final_status = selection_complete`, `selected_slot_id` must be present
- when `final_status` is anything other than `selection_complete`, `selected_slot_id` must not appear
- `customer_response` must exactly match the expected canonical response
- booking fields must not appear

---

### 6.5 F5 output fields

Required semantic fields:
- `booking_name`
- `intent`
- `zip_code`
- `unit_type`
- `unit_class`
- `final_status`
- `customer_response`
- `selected_slot_id` only when a slot was selected or booked

Rules:
- when `final_status = booking_confirmed` or `booking_failed`, `selected_slot_id` must be present
- when `final_status = stopped_no_valid_future_slots` because slots were returned but none were valid, `selected_slot_id` must not appear
- `customer_response` must exactly match the expected canonical response
- process fields such as `booking_attempted`, `booking_result_type`, `serviceable`, and `slot_fetch_result_type` must not appear

---

### 6.6 F6 output fields

Same semantic fields as F5.

Pressure tags and hard-case labels live in task/gold metadata, not model output.

---

## 7. Family-by-family rubric

Branch labels in this section are evaluator labels only.
They are not part of the model output schema.
The evaluator determines the branch from hidden gold labels, tool trace, and final JSON fields.

For F2-F6, every branch pass condition also requires the exact expected canonical `customer_response`.

---

### 7.1 F1 Extract

#### Required inputs
- messy user text
- gold labels for:
  - `booking_name`
  - `intent`
  - `zip_code`
  - `unit_type`
  - `unit_class`

#### Tool availability
- no tools

#### Expected actions
- extract the required fields
- resolve corrections and conflicts correctly
- return valid JSON that matches the F1 schema

#### Forbidden actions
- any tool call
- any invented unsupported value
- use of an outdated value when a later correction exists

#### Pass conditions
A run passes F1 only if all are true:
1. valid JSON
2. schema-valid F1 output
3. all required fields match gold after normalization
4. no tool calls occurred

#### Fail conditions
Any of the following fails the run:
- any required field wrong
- any required field missing when gold value exists
- unsupported guess
- any tool call

#### Edge-case handling
- later correction wins
- historical detail loses to current detail
- if gold is `unknown`, model must not guess a concrete value

---

### 7.2 F2 Partial Flow A - Extract + Gate + Service Check

#### Required inputs
- messy user text
- gold extraction labels
- gold branch outcome
- `service_check(zip_code, unit_type, unit_class)` tool schema and tool result

#### Tool availability
- only `service_check`

#### Expected actions
- extract required fields
- determine whether intent may continue
- call `service_check` only when intent is `new_job` and required serviceability arguments are available
- stop at the family boundary after gate or serviceability outcome
- return valid JSON that matches the F2 schema

#### Forbidden actions
- any tool other than `service_check`
- `service_check` when intent is not `new_job`
- any slot-fetch claim
- any booking claim

#### Pass conditions
A run passes F2 only if the correct branch is followed.

##### Branch A - non-`new_job`
Pass only if:
- no tool calls occur
- `final_status = stopped_non_new_job`

##### Branch B - `new_job`, missing required serviceability info
Pass only if:
- no tool calls occur
- `final_status = stopped_missing_required_info`
- `customer_response` asks the exact missing-field clarification question from gold

##### Branch C - `new_job`, service check returns unserviceable
Pass only if:
- exactly one `service_check` occurs
- the `service_check` arguments match the correct normalized `zip_code`, `unit_type`, and `unit_class`
- no extra tool calls occur
- `final_status = stopped_unserviceable`

##### Branch D - `new_job`, service check returns serviceable
Pass only if:
- exactly one `service_check` occurs
- the `service_check` arguments match the correct normalized `zip_code`, `unit_type`, and `unit_class`
- no extra tool calls occur
- `final_status` indicates the correct scoped family endpoint without implying slot fetch or booking

Allowed scoped family endpoint for Branch D:
- `final_status = ready_for_slot_fetch`

Note:
- F2 stops after proving the request may continue
- it does **not** fetch slots

#### Fail conditions
Any of the following fails the run:
- false continue
- false stop
- missing-info stop ignored
- missing required `service_check`
- unwarranted `service_check`
- wrong serviceability argument passed to tool
- any extra tool
- any slot or booking claim
- wrong final status

#### Edge-case handling
- user claims such as "you serviced me before" do not remove the need for `service_check`
- corrected zip later in text must be used
- `other_type` may be passed to `service_check` when the user named a concrete unsupported type; the tool result determines whether the flow can continue

---

### 7.3 F3 Partial Flow B - Extract + Gate + Service Check + Slot Fetch

#### Required inputs
- messy user text
- gold extraction labels
- gold branch outcome
- `service_check(zip_code, unit_type, unit_class)` tool schema and result
- `check_slots(zip_code, unit_type, unit_class)` tool schema and result

#### Tool availability
- `service_check`
- `check_slots`

#### Expected actions
- extract required fields
- gate correctly
- call `service_check` only if intent is `new_job` and required serviceability arguments are available
- call `check_slots` only if `service_check` returns serviceable and the required slot-fetch arguments are available and operationally supported by the task gold labels
- stop at the family boundary after slot-fetch outcome
- return valid JSON that matches the F3 schema

#### Forbidden actions
- any tool other than `service_check` and `check_slots`
- `check_slots` before successful `service_check`
- any booking tool call
- any booking claim

#### Pass conditions
A run passes F3 only if the correct branch is followed.

##### Branch A - non-`new_job`
Pass only if:
- no tool calls occur
- `final_status = stopped_non_new_job`

##### Branch B - `new_job`, missing required info before service check
Pass only if:
- no tool calls occur
- `final_status = stopped_missing_required_info`
- `customer_response` asks the exact missing-field clarification question from gold

##### Branch C - `new_job`, service check returns unserviceable
Pass only if:
- exactly one correct `service_check` occurs
- no `check_slots` occurs
- `final_status = stopped_unserviceable`

##### Branch D - `new_job`, service check returns serviceable, missing or unsupported required info before slot fetch
Pass only if:
- exactly one correct `service_check` occurs
- no `check_slots` occurs
- `final_status = stopped_missing_required_info`
- `customer_response` asks the exact missing-field clarification question from gold

##### Branch E - `new_job`, service check returns serviceable, slot fetch returns busy
Pass only if:
- exactly one correct `service_check` occurs
- exactly one correct `check_slots` occurs
- `final_status = stopped_busy`
- no booking implication appears

##### Branch F - `new_job`, service check returns serviceable, slot fetch returns slot array
Pass only if:
- exactly one correct `service_check` occurs
- exactly one correct `check_slots` occurs
- `returned_slot_ids` exactly match the fetched slot IDs
- `final_status = slots_returned`
- no booking implication appears

##### Branch G - `new_job`, service check returns serviceable, slot fetch returns empty array
Pass only if:
- exactly one correct `service_check` occurs
- exactly one correct `check_slots` occurs
- `final_status = stopped_no_valid_future_slots`
- no booking implication appears

#### Fail conditions
Any of the following fails the run:
- wrong gate
- missing-info stop ignored
- wrong tool ordering
- missing required tool
- unwarranted tool
- wrong tool arguments
- busy mishandled
- empty-array mishandled
- slot-fetch result misrepresented
- returned slot IDs misrepresented
- any booking call or booking claim
- wrong final status

#### Edge-case handling
- unsorted returned slots do not matter in F3 unless the task explicitly asks for a normalized slot summary
- `busy` and `empty_array` must not be collapsed into one value
- `unknown` values may be passed to `check_slots` only when the task gold label defines them as supported operational values
- `other_type` may be passed to `service_check`, but must never be passed to `check_slots` in Track 1

---

### 7.4 F4 Select

F4 is cumulative through selection:
Extract + gate + service check + slot fetch + slot selection.

It does not book.

#### Required inputs
- messy user text
- gold extraction labels
- `service_check(zip_code, unit_type, unit_class)` tool schema and result
- `check_slots(zip_code, unit_type, unit_class)` tool schema and result
- synthetic fixed `current_local_datetime`
- gold branch outcome

#### Tool availability
- `service_check`
- `check_slots`

#### Expected actions
- extract required fields
- gate correctly
- call `service_check` only if warranted
- call `check_slots` only if serviceability succeeds and slot-fetch arguments are operationally supported
- exclude all past slots
- exclude slots equal to current local datetime
- choose the earliest valid future slot
- preserve exact `slot_id`
- return valid JSON that matches the F4 schema

#### Forbidden actions
- any tool other than `service_check` and `check_slots`
- `check_slots` before successful `service_check`
- any booking tool call
- choosing a past slot
- choosing a slot equal to current local datetime
- choosing a later future slot when an earlier one exists
- mutating `slot_id`
- inventing availability when none remains

#### Pass conditions
A run passes F4 only if the correct branch is followed.

##### Branch A - non-`new_job`
Pass only if:
- no tool calls occur
- `final_status = stopped_non_new_job`

##### Branch B - `new_job`, missing required info before service check
Pass only if:
- no tool calls occur
- `final_status = stopped_missing_required_info`
- `customer_response` asks the exact missing-field clarification question from gold

##### Branch C - `new_job`, service check returns unserviceable
Pass only if:
- exactly one correct `service_check` occurs
- no `check_slots` occurs
- `final_status = stopped_unserviceable`

##### Branch D - `new_job`, service check returns serviceable, missing or unsupported required info before slot fetch
Pass only if:
- exactly one correct `service_check` occurs
- no `check_slots` occurs
- `final_status = stopped_missing_required_info`
- `customer_response` asks the exact missing-field clarification question from gold

##### Branch E1 - `new_job`, service check returns serviceable, slot fetch returns busy
Pass only if:
- exactly one correct `service_check` occurs
- exactly one correct `check_slots` occurs
- `final_status = stopped_busy`

##### Branch E2 - `new_job`, service check returns serviceable, slot fetch returns empty array
Pass only if:
- exactly one correct `service_check` occurs
- exactly one correct `check_slots` occurs
- `selected_slot_id` does not appear
- `final_status = stopped_no_valid_future_slots`

##### Branch E3 - `new_job`, service check returns serviceable, slots returned but no valid future slot remains after filtering
Pass only if:
- exactly one correct `service_check` occurs
- exactly one correct `check_slots` occurs
- `selected_slot_id` does not appear
- `final_status = stopped_no_valid_future_slots`

##### Branch F - `new_job`, service check returns serviceable, valid future slot exists
Pass only if:
- exactly one correct `service_check` occurs
- exactly one correct `check_slots` occurs
- chosen slot is a member of the earliest valid timestamp tie-set
- exact `selected_slot_id` from the chosen slot is preserved
- `final_status = selection_complete`

Tie rule:
- if multiple slots share the same earliest valid future timestamp, any slot in that earliest tie-set is acceptable

#### Fail conditions
Any of the following fails the run:
- wrong gate
- missing-info stop ignored
- wrong tool ordering
- missing required tool
- unwarranted tool
- wrong tool arguments
- busy mishandled
- empty-array mishandled
- past slot chosen
- equal-time slot chosen
- not earliest valid future slot
- `slot_id` not preserved
- no-valid-slot outcome ignored
- any booking call or booking claim

#### Edge-case handling
- slot list may be unsorted
- similar IDs are deliberate traps and must not be confused
- `other_type` may be passed to `service_check`, but must never be passed to `check_slots` in Track 1

---

### 7.5 F5 Full Flow

#### Required inputs
- messy user text
- gold extraction labels
- all tool schemas and tool results
- synthetic fixed current local datetime where needed
- gold branch outcome

Track 1 excludes F5/F6 cases where booking would otherwise be warranted but `booking_name` is missing.
If a task reaches booking, the gold task must provide a supported `booking_name`.

#### Tool availability
- `service_check`
- `check_slots`
- `book_slot`

#### Expected actions
- extract correctly
- gate correctly
- call `service_check` if and only if warranted
- call `check_slots` if and only if warranted
- select correctly if slots are returned
- call `book_slot` if and only if warranted
- ground the final user-visible claim in actual tool results
- return valid JSON that matches the F5 schema

#### Forbidden actions
- skipping required tool steps
- calling tools out of order
- booking when not warranted
- claiming success not supported by tool results
- using stale corrected-away values

#### Pass conditions
A run passes F5 only if the correct end-to-end branch is followed.

##### Branch A - non-`new_job`
- no tools
- `final_status = stopped_non_new_job`

##### Branch B - `new_job`, missing required info before service check
- no tools
- `final_status = stopped_missing_required_info`
- `customer_response` asks the exact missing-field clarification question from gold

##### Branch C - `new_job`, service check returns unserviceable
- one correct `service_check`
- no later tools
- `final_status = stopped_unserviceable`

##### Branch D - `new_job`, service check returns serviceable, missing or unsupported required info before slot fetch
- correct `service_check`
- no `check_slots`
- `final_status = stopped_missing_required_info`
- `customer_response` asks the exact missing-field clarification question from gold

##### Branch E1 - `new_job`, service check returns serviceable, slot fetch returns busy
- correct `service_check`
- correct `check_slots`
- no `book_slot`
- `final_status = stopped_busy`

##### Branch E2 - `new_job`, service check returns serviceable, slot fetch returns empty array
- correct `service_check`
- correct `check_slots`
- no `book_slot`
- `final_status = stopped_no_valid_future_slots`

##### Branch E3 - `new_job`, service check returns serviceable, slots returned but no valid future slot remains after filtering
- correct `service_check`
- correct `check_slots`
- correct selection filtering
- `selected_slot_id` does not appear
- no `book_slot`
- `final_status = stopped_no_valid_future_slots`

##### Branch F - `new_job`, service check returns serviceable, valid future slot, booking succeeds
- correct `service_check`
- correct `check_slots`
- correct slot selected
- `selected_slot_id` matches the chosen slot
- correct `book_slot(booking_name, slot_id, date_time)` arguments
- booking tool succeeds
- `final_status = booking_confirmed`
- no hallucinated booking detail

##### Branch G - `new_job`, service check returns serviceable, valid future slot, booking fails
- correct `service_check`
- correct `check_slots`
- correct slot selected
- `selected_slot_id` matches the chosen slot
- correct `book_slot` arguments
- booking tool does not succeed
- `final_status = booking_failed`
- no fake confirmation

#### Fail conditions
Any wrong required decision, action, argument, sequence step, selection step, or grounded final claim fails the run.

#### Edge-case handling
- corrected values later in text must override stale earlier values
- slot IDs must be copied exactly
- booking success must be grounded in a successful booking tool result
- `unknown` values are allowed only when the task gold label treats them as supported operational values rather than missing required info
- `other_type` may be passed to `service_check`, but must stop before slot fetch in Track 1

---

### 7.6 F6 Robustness / Hard Cases Flow

#### Required inputs
- same as F5
- one or more pressure tags

#### Tool availability
- `service_check`
- `check_slots`
- `book_slot`

#### Expected actions
- satisfy the full F5 rubric
- correctly resist the task's deliberate trap conditions

#### Forbidden actions
- following irrelevant chatter
- using outdated or conflicting detail
- accepting unsupported user assumptions
- confusing similar IDs
- mishandling messy or partial tool outputs

#### Pass conditions
A run passes F6 only if:
1. it passes the relevant F5 full-flow branch
2. no robustness-specific failure subcode is triggered

#### Fail conditions
A run fails F6 if:
- it fails any F5 requirement
- or it triggers any robustness-specific failure subcode

#### Edge-case handling
Typical hard cases include:
- later corrections
- conflicting details
- irrelevant chatter
- excluded-intent distractions
- similar IDs
- unsorted slots
- partial tool outputs
- user claims that should not be trusted without validation

---

## 8. Metric calculation rules

This section defines exact formulas, denominators, applicability, and missing-data handling.

Metric tiers:
- `task_success_rate` is the primary outcome.
- The locked secondary metrics are Extraction Accuracy, Tool-Call Correctness, Sequence Correctness, Selection Correctness, Hallucinated Success Rate, Cost per Run, and Latency per Run.
- The additional rate formulas in this section are diagnostic components. They are retained to explain failures and compute/debug the locked secondary metrics, but they are not separate top-level outcome metrics.

---

### 8.1 `task_success_rate`

#### Meaning
Binary run pass rate under the family rubric.
The family rubric includes process correctness, required final fields, and exact canonical `customer_response` when applicable.

#### Applicable runs
- all runs with `eval_status = scored`

#### Run-level value
- `1` if family rubric passes
- `0` otherwise

#### Formula
`task_success_rate = sum(run_pass) / count(scored_runs)`

#### Denominator
- all runs with `eval_status = scored`

#### Missing data handling
- runs with `eval_status = eval_unscorable` are excluded from denominator
- report `eval_unscorable_count` separately

---

### 8.2 `json_valid_rate`

#### Meaning
How often the final output parses as valid JSON.

#### Applicable runs
- all executed runs

#### Run-level value
- `1` if final output parses as valid JSON
- `0` otherwise

#### Formula
`json_valid_rate = sum(json_valid) / count(executed_runs)`

#### Missing data handling
- if final output missing entirely, count as `0`

---

### 8.3 `schema_valid_rate`

#### Meaning
How often the final output conforms to the provided family JSON schema.

#### Applicable runs
- runs with valid JSON output

#### Run-level value
- `1` if schema-valid
- `0` otherwise

#### Formula
`schema_valid_rate = sum(schema_valid) / count(json_valid_runs)`

#### Missing data handling
- invalid JSON is excluded from denominator here and already counted in `json_valid_rate`

---

### 8.4 `extraction_field_accuracy`

#### Meaning
Field-level extraction correctness.

#### Applicable runs
- F1, F2, F3, F4, F5, F6

#### Required fields counted
- `booking_name`
- `intent`
- `zip_code`
- `unit_type`
- `unit_class`

#### Run-level rule
For each applicable field:
- correct after normalization -> `1`
- incorrect, missing, or unsupported guessed value -> `0`

#### Formula
`extraction_field_accuracy = total_correct_extraction_fields / total_applicable_extraction_fields`

#### Denominator
- number of applicable extraction fields across all applicable scored runs

#### Missing data handling
- unparseable or missing field in model JSON counts as incorrect
- runs that are `eval_unscorable` are excluded

---

### 8.5 `all_fields_correct_rate`

#### Meaning
How often all required extraction fields are correct within a run.

#### Applicable runs
- F1, F2, F3, F4, F5, F6

#### Run-level value
- `1` if all required extraction fields are correct
- `0` otherwise

#### Formula
`all_fields_correct_rate = runs_with_all_required_extraction_fields_correct / applicable_scored_runs`

#### Missing data handling
- any missing required extraction field counts as incorrect

---

### 8.6 `tool_trigger_precision`

#### Meaning
How often actual tool calls were warranted and correct at the trigger level.

#### Applicable runs
- F2, F3, F4, F5, F6 where at least one actual tool call occurred

#### Correct actual tool call
An actual tool call counts as correct for this metric only if:
- tool name is correct
- the call is warranted by the branch
- the call occurs at an allowed point in the sequence

Argument correctness is measured separately.

#### Formula
`tool_trigger_precision = correct_actual_tool_calls / total_actual_tool_calls`

#### Denominator
- total actual tool calls in applicable scored runs

#### Missing data handling
- if tool trace missing on a run with visible tool-dependent claims, mark tool calls as unverified and set run `eval_status = eval_unscorable`

---

### 8.7 `tool_trigger_recall`

#### Meaning
How often required tool calls were actually made.

#### Applicable runs
- F2, F3, F4, F5, F6 where at least one tool call is expected

#### Formula
`tool_trigger_recall = correct_required_tool_calls_made / total_required_tool_calls`

#### Denominator
- total required tool calls across applicable scored runs

#### Missing data handling
- missing required tool call counts as missed
- `eval_unscorable` runs excluded

---

### 8.8 `tool_argument_accuracy`

#### Meaning
How often required tool arguments are correct.

#### Applicable runs
- F2, F3, F4, F5, F6 where at least one required tool call is made

#### Argument correctness rule
Each required argument is scored:
- `1` if correct after normalization
- `0` otherwise

Expected arguments by tool:
- `service_check` -> `zip_code`, `unit_type`, `unit_class`
- `check_slots` -> `zip_code`, `unit_type`, `unit_class`
- `book_slot` -> `booking_name`, `slot_id`, `date_time`

#### Formula
`tool_argument_accuracy = correct_required_tool_arguments / total_required_tool_arguments`

#### Denominator
- all required arguments across required tool calls in applicable scored runs

#### Missing data handling
- missing argument counts as incorrect
- extra unexpected arguments do not affect this metric directly but are logged

---

### 8.9 `tool_call_exact_match_rate`

#### Meaning
How often each required tool event is fully correct.

#### Applicable runs
- F2, F3, F4, F5, F6 where at least one tool event is expected

#### Fully correct required tool event
A required tool event is fully correct only if:
- correct tool name
- correct sequence position
- all required arguments correct

#### Formula
`tool_call_exact_match_rate = fully_correct_required_tool_events / total_required_tool_events`

#### Denominator
- all required tool events across applicable scored runs

#### Missing data handling
- missing or wrong event counts as incorrect

---

### 8.10 `sequence_correctness`

#### Meaning
Whether required tool order was correct.

#### Applicable runs
- runs where expected tool sequence length is 2 or more

#### Run-level value
- `1` if required tools occur in exact expected order with no forbidden interleaving
- `0` otherwise

#### Formula
`sequence_correctness = sum(sequence_correct_run) / count(applicable_scored_runs)`

#### Missing data handling
- if tool trace incomplete, set `eval_status = eval_unscorable`

---

### 8.11 `selection_correctness`

#### Meaning
Whether slot selection was correct.

#### Applicable runs
- F4, F5, and F6 when slot selection is required or when correct no-valid-slot behavior is required after filtering

#### Run-level value
- `1` only if:
  - chosen slot is valid and earliest, or correct no-valid-slot outcome is returned
  - `slot_id` preserved exactly when applicable
- otherwise `0`

#### Formula
`selection_correctness = sum(selection_correct_run) / count(applicable_scored_runs)`

#### Missing data handling
- missing `selected_slot_id` on applicable selection/booking runs counts as incorrect
- no-valid-slot branches pass only when `selected_slot_id` is absent

---

### 8.12 `hallucinated_success_rate`

#### Meaning
How often the model claims success not supported by tool results or trace.

#### Applicable runs
- all scored runs

#### Run-level value
- `1` if the run contains any unsupported success claim
- `0` otherwise

Examples:
- claims serviceable without supporting tool result
- claims slots available when the tool returned busy
- claims booking success without successful `book_slot`
- invents confirmation details

#### Formula
`hallucinated_success_rate = runs_with_any_hallucinated_success / count(scored_runs)`

#### Missing data handling
- if success is claimed and the trace does not support it, count as hallucinated success
- do not give the benefit of the doubt

---

### 8.13 `cost_per_run_usd`

#### Meaning
Run cost in USD.

#### Applicable runs
- all executed runs where billing data is available

#### Formula
`cost_per_run_usd = input_cost_usd + output_cost_usd + reasoning_cost_usd + tool_cost_usd`

Where:
- `input_cost_usd = input_tokens * provider_input_rate`
- `output_cost_usd = output_tokens * provider_output_rate`
- `reasoning_cost_usd = reasoning_tokens * provider_reasoning_rate`
- `tool_cost_usd` = tracked external tool cost, if any

#### Denominator
- not a rate metric
- aggregate summaries should report:
  - mean
  - median
  - p90

#### Missing data handling
- if cost data missing for a run, exclude from aggregate cost summaries and report missing count

---

### 8.14 `latency_per_run_ms`

#### Meaning
End-to-end wall-clock latency.

#### Applicable runs
- all executed runs with timestamps

#### Formula
`latency_per_run_ms = run_end_timestamp - run_start_timestamp`

Recommended additional latency slices:
- `first_token_ms`
- `tool_time_ms`
- `final_answer_ms`

#### Denominator
- not a rate metric
- aggregate summaries should report:
  - mean
  - median
  - p90

#### Missing data handling
- if timestamps incomplete, exclude from aggregate latency summaries and report missing count

---

### 8.15 `over_action_rate`

#### Meaning
How often the model performs an unnecessary action beyond what the branch requires.

#### Applicable runs
- F2, F3, F4, F5, F6

#### Run-level value
- `1` if any unwarranted tool call occurs
- `0` otherwise

#### Formula
`over_action_rate = runs_with_any_unwarranted_tool_call / count(applicable_scored_runs)`

#### Missing data handling
- incomplete tool trace -> `eval_unscorable`

---

### 8.16 `under_action_rate`

#### Meaning
How often the model fails to perform a required action.

#### Applicable runs
- F2, F3, F4, F5, F6 where at least one action is required

#### Run-level value
- `1` if any required tool call or required step is missing
- `0` otherwise

#### Formula
`under_action_rate = runs_with_any_missing_required_action / count(applicable_scored_runs)`

#### Missing data handling
- incomplete trace -> `eval_unscorable`

---

### 8.17 `customer_response_exact_match_rate`

#### Meaning
How often the user-facing response exactly matches the expected canonical response.

#### Applicable runs
- F2, F3, F4, F5, F6

#### Run-level value
- `1` if `customer_response` exactly matches gold after JSON parsing
- `0` otherwise

#### Formula
`customer_response_exact_match_rate = runs_with_exact_customer_response / applicable_scored_runs`

#### Missing data handling
- missing `customer_response` counts as incorrect
- free-form paraphrases count as incorrect
- F1 is excluded

---

## 9. Failure buckets and subcodes

The top-level failure buckets are locked by the contract.
This section defines subcodes and trigger meanings.

---

### 9.1 `extraction.*`

- `extraction.booking_name_wrong`
  - extracted `booking_name` does not match gold after normalization
- `extraction.intent_wrong`
  - extracted `intent` does not match gold
- `extraction.zip_wrong`
  - extracted `zip_code` does not match gold
- `extraction.unit_type_wrong`
  - extracted `unit_type` does not match gold
- `extraction.unsupported_unit_type_mapped_to_supported`
  - gold `unit_type` is `other_type`, but the model mapped the unsupported concrete unit type to a supported enum value
- `extraction.unit_class_wrong`
  - extracted `unit_class` does not match gold
- `extraction.later_correction_ignored`
  - a later explicit correction existed but the model used the earlier value
- `extraction.historical_value_used`
  - the model used stale historical detail instead of current detail
- `extraction.unsupported_guess`
  - the model invented a concrete value where the supported answer was `unknown`
- `extraction.required_field_missing`
  - a required extraction field is missing from the final JSON

---

### 9.2 `gating.*`

- `gating.false_continue`
  - the model proceeded when it should have stopped
- `gating.false_stop`
  - the model stopped when it should have proceeded
- `gating.non_new_job_not_stopped`
  - a non-`new_job` intent was not stopped
- `gating.new_job_blocked_incorrectly`
  - a valid `new_job` flow was blocked before the next required step
- `gating.missing_required_info_not_respected`
  - the run should have stopped for missing required info but did not
- `gating.unserviceable_not_respected`
  - the run should have stopped after an unserviceable `service_check` result but did not

---

### 9.3 `tool_trigger.*`

- `tool_trigger.service_check_missing`
  - `service_check` was required but not called
- `tool_trigger.service_check_unwarranted`
  - `service_check` was called when not allowed or not needed
- `tool_trigger.check_slots_missing`
  - `check_slots` was required but not called
- `tool_trigger.check_slots_unwarranted`
  - `check_slots` was called when not allowed or not needed
- `tool_trigger.book_slot_missing`
  - `book_slot` was required but not called
- `tool_trigger.book_slot_unwarranted`
  - `book_slot` was called when not allowed or not needed
- `tool_trigger.duplicate_tool_call`
  - a tool was called more times than the branch allowed

---

### 9.4 `tool_argument.*`

- `tool_argument.zip_mismatch`
  - `service_check` or `check_slots` received the wrong normalized zip
- `tool_argument.unit_type_mismatch`
  - `service_check` or `check_slots` received the wrong `unit_type`
- `tool_argument.unit_class_mismatch`
  - `service_check` or `check_slots` received the wrong `unit_class`
- `tool_argument.booking_name_mismatch`
  - `book_slot` received the wrong `booking_name`
- `tool_argument.slot_id_mismatch`
  - `book_slot` received the wrong `slot_id`
- `tool_argument.datetime_mismatch`
  - `book_slot` received the wrong `date_time`
- `tool_argument.stale_value_used`
  - a tool call used a stale value after correction
- `tool_argument.required_argument_missing`
  - a required tool argument was missing

---

### 9.5 `sequencing.*`

- `sequencing.check_slots_before_service_check`
  - `check_slots` happened before successful `service_check`
- `sequencing.book_before_service_check`
  - `book_slot` happened before successful `service_check`
- `sequencing.book_before_slot_fetch`
  - `book_slot` happened before slot fetch
- `sequencing.book_before_selection`
  - `book_slot` happened before valid slot selection
- `sequencing.extra_tool_after_terminal_stop`
  - a tool call occurred after the run should already have stopped
- `sequencing.forbidden_interleaving`
  - tools were called in an order not allowed by the branch

---

### 9.6 `selection.*`

- `selection.past_slot_chosen`
  - selected slot was earlier than current local datetime
- `selection.equal_time_slot_chosen`
  - selected slot was exactly equal to current local datetime
- `selection.not_earliest_future`
  - a later future slot was chosen even though an earlier valid future slot existed
- `selection.slot_id_not_preserved`
  - selected `slot_id` does not exactly match the chosen tool output slot
- `selection.no_valid_future_not_respected`
  - a slot was claimed even though no valid future slot remained
- `selection.similar_id_confusion`
  - a similar but incorrect slot ID was used

---

### 9.7 `hallucination.*`

- `hallucination.serviceable_claim_without_support`
  - serviceable was claimed without supporting tool output
- `hallucination.unserviceable_claim_without_support`
  - unserviceable was claimed without supporting tool output
- `hallucination.slot_availability_claim_without_support`
  - slot availability was claimed without supporting tool output
- `hallucination.booking_claimed_without_success`
  - booking success was claimed without successful booking tool result
- `hallucination.invented_slot_id`
  - slot ID not present in tool output was claimed
- `hallucination.invented_confirmation`
  - confirmation or success detail was invented
- `hallucination.invented_tool_result`
  - the model described a tool result that never occurred
- `hallucination.unsupported_unit_type_treated_as_supported`
  - the model treated an unsupported concrete unit type such as `wine cooler` as if it were a supported operational type

---

### 9.8 `customer_response.*`

- `customer_response.missing`
  - F2-F6 output did not include `customer_response`
- `customer_response.not_canonical`
  - output response is not one of the closed canonical responses
- `customer_response.wrong_canonical_response`
  - output response is canonical but does not match the expected gold response
- `customer_response.paraphrased`
  - output response is semantically close but not exact

---

### 9.9 `robustness.*`

- `robustness.conflicting_detail_not_resolved`
  - conflicting details existed and the model did not resolve them correctly
- `robustness.irrelevant_chatter_followed`
  - irrelevant content influenced the operational decision
- `robustness.user_assumption_accepted_without_validation`
  - user claim was accepted instead of validated through required process
- `robustness.partial_tool_output_mishandled`
  - partial tool output was handled incorrectly
- `robustness.busy_mishandled`
  - busy outcome was misinterpreted or overstated
- `robustness.similar_id_confusion`
  - similar IDs in hard-case tasks caused confusion
- `robustness.later_correction_ignored`
  - later correction was present and ignored
- `robustness.unsorted_slots_mishandled`
  - unsorted slot list caused incorrect selection
- `robustness.empty_or_missing_value_overclaimed`
  - missing value was overclaimed as known
- `robustness.unsupported_concrete_unit_type_mishandled`
  - an unsupported concrete unit type should have been classified as `other_type` and stopped before slot fetch after serviceability handling, but the model continued to slot fetch or remapped it

---

## 10. Trace schema

Every run must log enough data to reconstruct:
- what prompt condition was used
- what tools were available
- what the model did
- what the tools returned
- what final JSON the model produced
- how the evaluator scored the run

The trace must be logged as structured JSON.

---

### 10.1 Required trace fields

```json
{
  "run_id": "string",
  "eval_spec_version": "v1",
  "contract_version": "track1_locked",
  "timestamp_utc": "string",

  "provider": "string",
  "model": "string",
  "prompt_condition": "A1_task_only | A2_role | A3_role_plus_competencies",
  "mode_condition": "B1_instant | B2_thinking",
  "reasoning_setting": "string",
  "repeat_index": 1,

  "task_id": "string",
  "task_family": "F1_extract | F2_partial_flow_a | F3_partial_flow_b | F4_select | F5_full_flow | F6_robustness_hard_cases",
  "task_variant_id": "string",
  "pressure_tags": ["string"],
  "current_local_datetime": "ISO 8601 datetime with offset | not_applicable",
  "timezone": "IANA timezone | not_applicable",

  "full_prompt": "string",
  "system_prompt": "string | not_applicable",
  "developer_prompt": "string | not_applicable",
  "user_prompt": "string",
  "tool_schemas": [
    {
      "tool_name": "string",
      "tool_schema": {}
    }
  ],

  "raw_model_turns": [
    {
      "step_index": 1,
      "role": "assistant | tool | user",
      "content_raw": "string",
      "timestamp_start_utc": "string",
      "timestamp_end_utc": "string"
    }
  ],

  "tool_call_sequence": [
    {
      "step_index": 1,
      "tool_name": "string",
      "arguments_raw": {},
      "arguments_normalized": {},
      "tool_output_raw": {},
      "tool_output_normalized": {},
      "tool_call_status": "success | error | timeout | blocked | unknown",
      "call_started_at_utc": "string",
      "call_finished_at_utc": "string"
    }
  ],

  "final_output_raw": "string",
  "final_output_json": {},
  "final_output_json_valid": true,
  "final_output_schema_valid": true,

  "parsed_semantic_fields": {
    "booking_name": "string | unknown | not_applicable",
    "intent": "string | unknown | not_applicable",
    "zip_code": "string | unknown | not_applicable",
    "unit_type": "washer | dryer | refrigerator | dishwasher | oven_range | microwave | other_type | unknown | not_applicable",
    "unit_class": "residential | commercial | unknown | not_applicable",
    "returned_slot_ids": "string[] | not_applicable",
    "selected_slot_id": "string | not_applicable",
    "final_status": "string | unknown | not_applicable",
    "customer_response": "canonical string | not_applicable"
  },

  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "reasoning_tokens": 0,
    "total_tokens": 0
  },

  "latency": {
    "run_start_timestamp_ms": 0,
    "first_token_ms": 0,
    "tool_time_ms": 0,
    "run_end_timestamp_ms": 0,
    "end_to_end_ms": 0
  },

  "cost": {
    "input_cost_usd": 0.0,
    "output_cost_usd": 0.0,
    "reasoning_cost_usd": 0.0,
    "tool_cost_usd": 0.0,
    "total_cost_usd": 0.0
  },

  "evaluator_result": {
    "eval_status": "scored | eval_unscorable | infra_error",
    "pass": true,
    "primary_failure_bucket": "string | not_applicable",
    "primary_failure_subcode": "string | not_applicable",
    "all_failure_subcodes": ["string"],
    "metric_components": {
      "task_success": 1,
      "json_valid": 1,
      "schema_valid": 1,
      "extraction_fields_correct": 0,
      "extraction_fields_total": 0,
      "all_fields_correct": "1 | 0 | not_applicable",
      "tool_trigger_correct_actual_calls": 0,
      "tool_trigger_actual_calls": 0,
      "required_tool_calls_made": 0,
      "required_tool_calls_total": 0,
      "tool_arguments_correct": 0,
      "tool_arguments_total": 0,
      "tool_events_exact_match": 0,
      "tool_events_total": 0,
      "selection_correct": "1 | 0 | not_applicable",
      "sequence_correct": "1 | 0 | not_applicable",
      "customer_response_exact_match": "1 | 0 | not_applicable",
      "hallucinated_success": 0,
      "over_action": "1 | 0 | not_applicable",
      "under_action": "1 | 0 | not_applicable"
    }
  }
}
```

---

### 10.2 Minimum evaluator requirements

The evaluator must be able to determine from the trace:
- whether JSON was valid
- whether schema was valid
- what branch the task expected
- which tools were available
- which tools were actually called
- with what normalized arguments
- what the tools returned
- what final semantic values were claimed
- whether `customer_response` exactly matched the expected canonical response
- whether the final claims were grounded

If any of these are impossible to reconstruct because the trace is incomplete or corrupted:
- set `eval_status = eval_unscorable`

---

## 11. Scoring procedure

The scoring procedure for a single run is fixed.

### Step 1
Check trace completeness.

### Step 2
Parse final output as JSON.
- if invalid, mark `json_valid = 0`
- if family scoring cannot continue, set semantic fields to `unknown` where needed and proceed to failure assignment

### Step 3
Validate final JSON against family schema.
- if invalid, mark `schema_valid = 0`

### Step 4
Normalize semantic values.

### Step 5
Determine expected branch from gold task definition.

### Step 6
Compare actual behavior against family rubric.

### Step 7
Assign:
- pass or fail
- primary failure bucket
- primary failure subcode
- all failure subcodes

### Step 8
Emit metric components for aggregation.

---

## 12. What counts as missing data

The evaluator should distinguish:

- **model failure**
  - the model omitted a required field or action
- **trace failure**
  - the harness failed to capture data needed to score
- **infra failure**
  - the run failed due to tool or infrastructure issue outside the benchmarked model behavior

Rules:
- model omission -> score as incorrect
- trace corruption or incompleteness -> `eval_unscorable`
- infra failure -> `infra_error`

---

## 13. Reporting guidance

For each experiment slice, report at minimum:
- number of executed runs
- number of scored runs
- number of `eval_unscorable` runs
- number of `infra_error` runs
- `task_success_rate`

Locked secondary metrics:
- `extraction_field_accuracy`
- `all_fields_correct_rate`
- `tool_call_exact_match_rate`
- `sequence_correctness`
- `selection_correctness`
- `hallucinated_success_rate`
- mean, median, p90 cost
- mean, median, p90 latency

Diagnostic component metrics:
- `json_valid_rate`
- `schema_valid_rate`
- `tool_trigger_precision`
- `tool_trigger_recall`
- `tool_argument_accuracy`
- `customer_response_exact_match_rate`
- `over_action_rate`
- `under_action_rate`

Failure analysis should include:
- top failure buckets
- top failure subcodes
- primary failure distribution by family, prompt condition, and mode condition

Interaction analysis should include:
- prompt condition x mode condition
- prompt condition x task family
- prompt condition x pressure tags
- mode condition x pressure tags
- model family x prompt condition
- model family x mode condition
- derived groups: `core`, `full_flow`, `robust`, `pressure_count_0`, `pressure_count_1`, `pressure_count_2_plus`

---

## 14. Change control

This Evaluation Spec is locked for Track 1.

Any change to the following requires an explicit amendment:
- family pass/fail rules
- tool availability by family
- enum values
- output semantic fields
- metric formulas
- missing-data policy
- failure subcodes
- trace schema

Every amendment must record:
- date
- reason
- exact change
- impact on comparability with earlier runs

---

## 15. Short summary

This spec makes each run judgeable in a strict, reproducible way.

It locks:
- scoped tool access for partial families
- JSON-only final output
- schema validation before semantic scoring
- family-by-family deterministic rubrics
- exact formulas for all main submetrics
- explicit failure subcodes
- a full trace schema with enough detail for debugging and analysis

**Status: locked as Evaluation Spec v1 for Track 1.**
