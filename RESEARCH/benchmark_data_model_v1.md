# Benchmark Data Model v1
**Track 1 prompting study - task, gold, and tool fixture schemas**

## Status

Draft v1 data model for Track 1 benchmark construction.

This document operationalizes:
- `track1_contract.md`
- `evaluation_spec_v1.md`
- `Overall-Research-Design-v2.md`

It defines the data structures needed to generate benchmark tasks, hidden gold labels, deterministic tool fixtures, and evaluator-ready branch expectations.

---

## 1. Scope

This model covers Track 1 only.

It includes:
- Task Schema
- Gold Schema
- Tool Fixture Schema
- Branch Semantics
- Run Matrix Metadata
- Fixture constraints for deterministic evaluation

It does not define:
- model adapter implementation
- prompt text templates
- provider pricing tables
- final analysis notebooks
- public benchmark release format

---

## 2. Locked Track 1 Decisions

### 2.1 Prompt and mode conditions

Every task instance is run across:
- `A1_task_only`
- `A2_role`
- `A3_role_plus_competencies`

and:
- `B1_instant`
- `B2_thinking`

The tested role / competencies block is canonically inserted into the system prompt.
Provider adapters may map this to an equivalent top-level instruction channel, but the semantic placement must remain equivalent across prompt conditions.

Provider-compatibility note for harness adapters:
- Some GPT-5.x parameters are mode-dependent.
- In the current harness, `gpt-5.4-mini` uses:
  - `B1_instant`: `reasoning.effort = none` and `temperature` allowed
  - `B2_thinking`: `reasoning.effort = medium` and `temperature` omitted
- Adapter configs must be logged with each run so mode comparisons remain reproducible.

### 2.2 Synthetic datetime

All time-sensitive tasks use a synthetic fixed local datetime supplied by the task instance.

Do not use wall-clock runtime.

Required fields:
- `current_local_datetime`: ISO 8601 datetime with offset
- `timezone`: IANA timezone

Example:
```json
{
  "current_local_datetime": "2026-04-16T10:00:00-04:00",
  "timezone": "America/New_York"
}
```

### 2.3 Tool errors out of scope

Track 1 fixtures do not intentionally include:
- slot-fetch tool errors
- booking tool errors
- tool timeouts
- blocked tool calls

Tool error enum values may remain in trace schemas for infrastructure diagnosis, but they are not intentional task outcomes in Track 1.

### 2.4 Missing `booking_name` excluded

Track 1 excludes F5/F6 tasks where booking would otherwise be warranted but `booking_name` is missing.

If a task can reach booking, the gold task must provide a supported `booking_name`.

### 2.5 `other_type` policy

`other_type` is used when the user explicitly names a concrete, understandable unit type that is outside the supported `unit_type` enum.

In Track 1, `other_type` may be passed to `service_check`, but always stops before slot fetch.

Calling `check_slots` with `unit_type = other_type` is incorrect.
This is a hallucination-resistance check: the model must not map an unsupported concrete unit type to the nearest supported type.

Example:
- `wine cooler` -> `other_type`
- not `refrigerator`

### 2.6 `unknown` policy

`unknown` is not automatically a stop.

It may continue only if the task gold definition marks that field as operationally acceptable for the next step.

If the next operation requires a supported concrete value and the field is `unknown`, the expected branch is a missing-info stop.

### 2.7 Canonical customer responses

F2-F6 final outputs must include a `customer_response` field.

`customer_response` is not free-form prose.
It must exactly match one value from the closed canonical response set.

The expected canonical response is stored in gold.
This lets the evaluator score the user-facing result deterministically, without an LLM judge.

F1 remains extraction-only and does not require `customer_response`.

System prompts must include:
- the full closed canonical response set
- instructions that `customer_response` must be copied exactly
- concise descriptions for every tool argument
- the rule that unsupported concrete unit types such as wine coolers should become `other_type`
- the rule that `other_type` may be passed to `service_check` but must not be passed to `check_slots`
- the first-name-only meaning of `booking_name`

Missing required information is not a silent stop.

When a required operational value is missing, the model must return the exact canonical clarification question for that missing field and must not call the dependent tool.

Current Track 1 clarification responses:
- missing `zip_code` before `service_check` or another dependent step -> `What is your zip code?`
- missing `unit_type` before `service_check` or another dependent step -> `What type of unit do you need service for?`

### 2.8 Task allocation

Track 1 uses 120 tasks with this allocation:

- F1 Extract: 10
- F2 Partial Flow A: 10
- F3 Partial Flow B: 10
- F4 Select: 15
- F5 Full Flow: 35
- F6 Robustness / Hard Cases: 40

The benchmark is intentionally weighted toward F5 and F6 because the main research question is about agentic workflow behavior, tool discipline, and prompting effects under decision pressure.

---

## 3. Shared Enums

### 3.1 `task_family`

Allowed values:
- `F1_extract`
- `F2_partial_flow_a`
- `F3_partial_flow_b`
- `F4_select`
- `F5_full_flow`
- `F6_robustness_hard_cases`

### 3.2 `intent`

Allowed values:
- `new_job`
- `reschedule`
- `cancel`
- `status_check`
- `quote_only`
- `general_question`
- `other`
- `unknown`

Only `new_job` may continue into the operational scheduling flow.

### 3.3 `booking_name`

`booking_name` is the first name of the person the appointment should be booked under.

It may differ from the caller's name or account holder name.

Rules:
- Use first name only.
- If the user gives a full name for the booking person, extract only the first name.
- If the user gives caller name and booking name, use the booking name.
- If no booking person is provided, use `unknown`.

### 3.4 `unit_type`

Allowed values:
- `washer`
- `dryer`
- `refrigerator`
- `dishwasher`
- `oven_range`
- `microwave`
- `other_type`
- `unknown`

Normalization:
- `fridge` -> `refrigerator`
- `oven`, `stove`, `range` -> `oven_range`

Boundary:
- unsupported but concrete types -> `other_type`
- vague, absent, unresolved, or unreliable type -> `unknown`

### 3.5 `unit_class`

Allowed values:
- `residential`
- `commercial`
- `unknown`

Boundary:
- absence of commercial context normally maps to `residential` when the task supports that inference
- use `unknown` only when the task intentionally withholds enough evidence

### 3.6 `slot_fetch_result_type`

Allowed values:
- `not_applicable`
- `busy`
- `slots_returned`
- `empty_array`
- `unknown`

Track 1 task fixtures must not intentionally use `tool_error`.

### 3.7 `booking_result_type`

Allowed values:
- `not_applicable`
- `booking_success`
- `booking_failure`
- `unknown`

Track 1 task fixtures must not intentionally use `tool_error`.

### 3.8 `final_status`

Allowed values:
- `ready_for_slot_fetch`
- `stopped_non_new_job`
- `stopped_missing_required_info`
- `stopped_unserviceable`
- `stopped_busy`
- `stopped_no_valid_future_slots`
- `slots_returned`
- `selection_complete`
- `booking_confirmed`
- `booking_failed`
- `unknown`

### 3.9 `customer_response`

Allowed values:
- `not_applicable`
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
- F1 must use `not_applicable` or omit `customer_response`, depending on the family schema.
- F2-F6 must include exactly one canonical response.
- The gold file decides which canonical response is expected for branches where the same `final_status` can have multiple user-facing reasons.
- Example: `final_status = stopped_unserviceable` can map to either `sorry, we can't service this area` or `sorry, we can't service this unit`.
- Example: `final_status = stopped_missing_required_info` maps to the exact missing-field clarification question, not a generic apology.

Typical mapping:
- `stopped_non_new_job` -> `sorry, I can only help with new booking requests`
- `stopped_missing_required_info` + missing `zip_code` -> `What is your zip code?`
- `stopped_missing_required_info` + missing `unit_type` -> `What type of unit do you need service for?`
- `stopped_unserviceable` + `failure_reason = unsupported_area` -> `sorry, we can't service this area`
- `stopped_unserviceable` + `failure_reason = unsupported_unit` or `unsupported_class` -> `sorry, we can't service this unit`
- `stopped_busy` -> `sorry, no booking times are available right now`
- `stopped_no_valid_future_slots` -> `sorry, no valid future booking times are available`
- `ready_for_slot_fetch` -> `we can continue with scheduling`
- `slots_returned` -> `available booking times were found`
- `selection_complete` -> `a valid booking time is available`
- `booking_confirmed` -> `your booking is confirmed`
- `booking_failed` -> `sorry, I couldn't complete the booking`

### 3.10 `pressure_tags`

Allowed values include:
- `user_says_skip_checks`
- `later_correction`
- `historical_value`
- `unsupported_concrete_unit_type`
- `busy_result`
- `empty_result`
- `no_valid_after_filter`
- `similar_slot_ids`
- `unsorted_slots`
- `booking_failure`
- `name_conflict`
- `temporal_boundary`
- `excluded_intent_distraction`
- `unsupported_user_assumption`

Rules:
- `pressure_tags` are analysis metadata, not model-visible labels.
- They do not replace branch IDs.
- They should describe the decision pressure or failure mode being tested.

---

## 4. Branch IDs

Every gold task must include one expected branch ID.

Branch IDs are hidden evaluator labels.
They are not shown to the model, and the model must not output them.

The evaluator derives the actual branch from:
- task gold
- tool trace
- final JSON fields
- deterministic branch rules

Allowed branch IDs:

- `extract_only`
  - F1 extraction-only endpoint
- `non_new_job`
  - intent is not `new_job`; no tools
- `missing_service_inputs`
  - `new_job`, but at least one required serviceability argument is unavailable or unsupported
- `not_serviceable`
  - serviceability was checked and serviceable is false
- `ready_for_slot_fetch`
  - F2 endpoint after a serviceable result
- `missing_slot_inputs`
  - serviceability returned true, but slot fetch cannot proceed because a required operational argument is missing or unsupported
- `slots_busy`
  - `check_slots` returned busy
- `slots_empty`
  - `check_slots` returned an empty array
- `slots_returned`
  - F3 endpoint after slots are returned
- `slot_selected`
  - F4 selected a valid earliest future slot
- `no_valid_slot`
  - F4 found no valid future slot
- `no_valid_after_filter`
  - F5/F6 slots were returned, but none survived future-slot filtering
- `booking_success`
  - F5/F6 booking tool succeeded
- `booking_failure`
  - F5/F6 booking tool was called but did not succeed

Notes:
- `other_type` is a supported extraction value for unsupported concrete unit types.
- In Track 1, `other_type` may be passed to `service_check`, but must never be passed to `check_slots`.
- Fixtures should normally make `service_check` return `serviceable: false` for `other_type`, producing `not_serviceable`.
- Such tasks should carry a pressure tag such as `unsupported_concrete_unit_type`.

---

## 5. Task Schema

Task files define what the model sees and what tools are available.
They do not contain hidden gold answers unless the harness runs in debug mode.

### 5.1 Shape

```json
{
  "schema_version": "benchmark_data_model_v1",
  "task_id": "F3_0001",
  "task_variant_id": "base",
  "task_family": "F3_partial_flow_b",
  "title": "string",

  "input": {
    "user_text": "string",
    "structured_slots": [],
    "current_local_datetime": "2026-04-16T10:00:00-04:00",
    "timezone": "America/New_York"
  },

  "available_tools": [
    "service_check",
    "check_slots"
  ],

  "pressure_tags": [
    "later_correction",
    "unsupported_concrete_unit_type"
  ],

  "task_notes": "optional human-only note for benchmark maintainers"
}
```

### 5.2 Field rules

`task_id`
- stable unique ID
- recommended format: `<family>_<number>`

`task_variant_id`
- stable variant label
- use `base` when there is no variant

`task_family`
- must match one of the locked family enum values

`input.user_text`
- required for F1, F2, F3, F4, F5, F6

`input.structured_slots`
- empty array for all Track 1 families
- slots for F3, F4, F5, and F6 are supplied through `check_slots` fixtures

`input.current_local_datetime`
- required for F4 and any F5/F6 task where slot selection may occur
- `not_applicable` otherwise

`input.timezone`
- required whenever `current_local_datetime` is required
- `not_applicable` otherwise

`available_tools`
- F1: `[]`
- F2: `["service_check"]`
- F3: `["service_check", "check_slots"]`
- F4: `["service_check", "check_slots"]`
- F5: `["service_check", "check_slots", "book_slot"]`
- F6: `["service_check", "check_slots", "book_slot"]`

`pressure_tags`
- descriptive labels for analysis
- not source of truth for scoring

---

## 6. Gold Schema

Gold files define the hidden expected answer and branch.
The evaluator uses gold data as source of truth.

### 6.1 Shape

```json
{
  "schema_version": "benchmark_data_model_v1",
  "task_id": "F3_0001",
  "expected_branch_id": "slots_returned",

  "gold_extraction": {
    "booking_name": "Avery",
    "intent": "new_job",
    "zip_code": "10001",
    "unit_type": "dishwasher",
    "unit_class": "residential"
  },

  "operational_requirements": {
    "service_check": {
      "zip_code": "required_concrete",
      "unit_type": "required_known_unit_type",
      "unit_class": "allow_unknown"
    },
    "slot_fetch": {
      "zip_code": "required_concrete",
      "unit_type": "required_supported_enum",
      "unit_class": "allow_unknown"
    },
    "booking": {
      "booking_name": "required_supported",
      "slot_id": "required_concrete",
      "date_time": "required_concrete"
    }
  },

  "expected_tool_sequence": [
    {
      "tool_name": "service_check",
      "arguments_normalized": {
        "zip_code": "10001",
        "unit_type": "dishwasher",
        "unit_class": "residential"
      }
    },
    {
      "tool_name": "check_slots",
      "arguments_normalized": {
        "zip_code": "10001",
        "unit_type": "dishwasher",
        "unit_class": "residential"
      }
    }
  ],

  "expected_semantic_output": {
    "final_status": "slots_returned",
    "returned_slot_ids": ["slot_001", "slot_002"],
    "customer_response": "available booking times were found"
  }
}
```

### 6.2 Operational requirement values

Allowed values:
- `required_concrete`
- `required_known_unit_type`
- `required_supported_enum`
- `required_supported`
- `allow_unknown`
- `not_required`

Meanings:
- `required_concrete`: must be a concrete non-placeholder value
- `required_known_unit_type`: must be a concrete known unit type, including `other_type`, excluding `unknown`
- `required_supported_enum`: must be one of the supported operational enum values; `other_type` is not supported for slot fetch in Track 1
- `required_supported`: must be available and supported, but not necessarily from a closed enum
- `allow_unknown`: `unknown` is acceptable and may continue
- `not_required`: the field is not required for that operation

### 6.3 Gold extraction rules

All F1-F6 gold files must include:
- `booking_name`
- `intent`
- `zip_code`
- `unit_type`
- `unit_class`

Allowed placeholders:
- `unknown`
- `not_applicable`

Use `unknown` only when the field is genuinely unsupported by the input.
Use `not_applicable` only when the field is outside the family/task scope.

### 6.4 Expected semantic output rules

Gold semantic outputs should include only fields relevant to the simplified family schema.

Allowed final-output fields:
- extraction fields when extraction is in scope
- `final_status` for F2-F6 only
- `customer_response` for F2-F6 only
- `returned_slot_ids` only for F3 `slots_returned`
- `selected_slot_id` only when a slot was selected or booked

Rules:
- F1 expected semantic output should contain extraction fields only
- F2-F6 expected semantic output must include exact `customer_response`
- do not include process fields that are already known from trace, such as `service_checked`, `serviceable`, `slot_fetch_attempted`, `slot_fetch_result_type`, `booking_attempted`, or `booking_result_type`
- do not include slot details derivable from `slot_id`, such as datetime or technician
- `returned_slot_ids` must exactly match fetched slot IDs when required
- `selected_slot_id` must exactly match the chosen slot when required

## 7. Tool Fixture Schema

Tool fixtures define deterministic tool outputs for a task.

### 7.1 Shape

```json
{
  "schema_version": "benchmark_data_model_v1",
  "task_id": "F5_0001",

  "service_check": {
    "expected_calls": [
      {
        "arguments_normalized": {
          "zip_code": "10001",
          "unit_type": "dishwasher",
          "unit_class": "residential"
        },
        "result": {
          "serviceable": true,
          "failure_reason": "not_applicable"
        }
      }
    ]
  },

  "check_slots": {
    "expected_calls": [
      {
        "arguments_normalized": {
          "zip_code": "10001",
          "unit_type": "dishwasher",
          "unit_class": "residential"
        },
        "result_type": "slots_returned",
        "result": {
          "slots": [
            {
              "slot_id": "slot_001",
              "start_time": "2026-04-16T09:00:00-04:00",
              "technician": "Maya"
            },
            {
              "slot_id": "slot_002",
              "start_time": "2026-04-16T13:30:00-04:00",
              "technician": "Noah"
            }
          ]
        }
      }
    ]
  },

  "book_slot": {
    "expected_calls": [
      {
        "arguments_normalized": {
          "booking_name": "Avery",
          "slot_id": "slot_002",
          "date_time": "2026-04-16T13:30:00-04:00"
        },
        "result": {
          "booking_result_type": "booking_success",
          "confirmation_id": "conf_001"
        }
      }
    ]
  }
}
```

### 7.2 Tool rules

`service_check`
- input: `zip_code`, `unit_type`, `unit_class`
- output: `{ "serviceable": true | false, "failure_reason": "not_applicable" | "unsupported_area" | "unsupported_unit" | "unsupported_class" }`
- Track 1 does not use serviceability tool errors
- `other_type` is accepted as an input value for hallucination-resistance cases; fixture output should determine whether the flow may continue
- when `serviceable = false`, `failure_reason` must not be `not_applicable`
- `failure_reason` helps select the correct canonical `customer_response` while preserving the single `final_status = stopped_unserviceable`
- field descriptions:
  - `zip_code`: customer service ZIP code for the requested job
  - `unit_type`: normalized unit type; use `other_type` only for concrete unsupported unit types
  - `unit_class`: residential or commercial classification of the requested job

`check_slots`
- input: `zip_code`, `unit_type`, `unit_class`
- output result types:
  - `busy`
  - `empty_array`
  - `slots_returned`
- Track 1 does not use slot-fetch tool errors
- `other_type` must not be accepted as an operational `unit_type`
- field descriptions:
  - `zip_code`: customer service ZIP code for the requested job
  - `unit_type`: normalized supported unit type used for slot lookup
  - `unit_class`: residential or commercial classification used for slot lookup

`book_slot`
- input: `booking_name`, `slot_id`, `date_time`
- output result types:
  - `booking_success`
  - `booking_failure`
- Track 1 does not use booking tool errors
- Track 1 does not include booking-warranted tasks with missing `booking_name`
- field descriptions:
  - `booking_name`: first name of the person the appointment should be booked under; this may differ from the caller's name
  - `slot_id`: exact ID of the selected valid future slot
  - `date_time`: exact ISO 8601 start time of the selected slot

### 7.3 Slot object schema

```json
{
  "slot_id": "string",
  "start_time": "2026-04-16T13:30:00-04:00",
  "technician": "string"
}
```

Rules:
- `slot_id` must be copied exactly
- `start_time` must include timezone offset
- comparison uses the instant normalized to task timezone
- slots may be unsorted
- similar slot IDs are allowed as traps

---

## 8. Family Requirements

### 8.1 F1 Extract

Task input:
- messy user text

Tools:
- none

Gold requires:
- extraction labels
- `expected_branch_id = extract_only`

### 8.2 F2 Partial Flow A

Task input:
- messy user text

Tools:
- `service_check`

Possible branch IDs:
- `non_new_job`
- `missing_service_inputs`
- `not_serviceable`
- `ready_for_slot_fetch`

### 8.3 F3 Partial Flow B

Task input:
- messy user text

Tools:
- `service_check`
- `check_slots`

Possible branch IDs:
- `non_new_job`
- `missing_service_inputs`
- `not_serviceable`
- `missing_slot_inputs`
- `slots_busy`
- `slots_empty`
- `slots_returned`

### 8.4 F4 Select

Task input:
- messy user text
- synthetic fixed current local datetime
- timezone

Tools:
- `service_check`
- `check_slots`

Possible branch IDs:
- `non_new_job`
- `missing_service_inputs`
- `not_serviceable`
- `missing_slot_inputs`
- `slots_busy`
- `slots_empty`
- `slot_selected`
- `no_valid_slot`

### 8.5 F5 Full Flow

Task input:
- messy user text

Tools:
- `service_check`
- `check_slots`
- `book_slot`

Possible branch IDs:
- `non_new_job`
- `missing_service_inputs`
- `not_serviceable`
- `missing_slot_inputs`
- `slots_busy`
- `slots_empty`
- `no_valid_after_filter`
- `booking_success`
- `booking_failure`

Track 1 excludes booking-warranted F5 tasks with missing `booking_name`.

### 8.6 F6 Robustness / Hard Cases

Same schema and branches as F5.

F6 must include one or more pressure tags.

Typical pressure tags:
- `later_correction`
- `historical_value`
- `irrelevant_chatter`
- `unsupported_concrete_unit_type`
- `similar_slot_ids`
- `unsorted_slots`
- `empty_result`
- `busy_result`
- `excluded_intent_distraction`
- `unsupported_user_assumption`

Track 1 excludes booking-warranted F6 tasks with missing `booking_name`.

---

## 9. Task Allocation and Quotas

### 9.1 Family allocation

Track 1 has 120 tasks:

- F1 Extract: 10
- F2 Partial Flow A: 10
- F3 Partial Flow B: 10
- F4 Select: 15
- F5 Full Flow: 35
- F6 Robustness / Hard Cases: 40

### 9.2 Branch quotas

F1:
- `extract_only`: 10

F2:
- `non_new_job`: 2
- `missing_service_inputs`: 2
- `not_serviceable`: 3
- `ready_for_slot_fetch`: 3

F3:
- `non_new_job`: 1
- `missing_service_inputs`: 1
- `not_serviceable`: 2
- `missing_slot_inputs`: 1
- `slots_busy`: 2
- `slots_empty`: 1
- `slots_returned`: 2

F4:
- `non_new_job`: 1
- `missing_service_inputs`: 1
- `not_serviceable`: 2
- `missing_slot_inputs`: 1
- `slots_busy`: 2
- `slots_empty`: 2
- `slot_selected`: 3
- `no_valid_slot`: 3

F5:
- `non_new_job`: 2
- `missing_service_inputs`: 2
- `not_serviceable`: 4
- `missing_slot_inputs`: 2
- `slots_busy`: 4
- `slots_empty`: 3
- `no_valid_after_filter`: 5
- `booking_success`: 8
- `booking_failure`: 5

F6:
- `non_new_job`: 2
- `missing_service_inputs`: 2
- `not_serviceable`: 5
- `missing_slot_inputs`: 3
- `slots_busy`: 4
- `slots_empty`: 4
- `no_valid_after_filter`: 6
- `booking_success`: 6
- `booking_failure`: 8

### 9.3 Pressure-tag quotas

Pressure tags can overlap.
The following minimum counts should be satisfied across the full 120-task set unless a later amendment changes the design:

- `booking_failure`: at least 13 tasks
- `user_says_skip_checks`: at least 12 tasks
- `unsupported_concrete_unit_type`: at least 10 tasks
- `no_valid_after_filter`: at least 11 tasks
- `similar_slot_ids`: at least 10 tasks
- `name_conflict`: at least 8 tasks
- `temporal_boundary`: at least 10 tasks

F5 and F6 should carry most of the pressure-tag load.
F1-F3 should remain mostly diagnostic.

### 9.4 Derived analysis groups

The dataset must not include a legacy `difficulty` field.

The analysis layer should derive these groupings:
- `core`: F1-F4 tasks without strong pressure tags
- `full_flow`: F5 tasks
- `robust`: F6 tasks
- `pressure_count_0`: tasks with 0 pressure tags
- `pressure_count_1`: tasks with 1 pressure tag
- `pressure_count_2_plus`: tasks with 2 or more pressure tags

Strong pressure tags for the `core` exclusion rule:
- `user_says_skip_checks`
- `unsupported_concrete_unit_type`
- `similar_slot_ids`
- `booking_failure`
- `name_conflict`
- `temporal_boundary`

---

## 10. Run Matrix Metadata

The harness should derive run records from task IDs and experimental conditions.

```json
{
  "task_id": "F5_0001",
  "provider": "openai",
  "model": "gpt-5.4",
  "prompt_condition": "A1_task_only",
  "mode_condition": "B1_instant",
  "repeat_index": 1,
  "reasoning_setting": "none_or_provider_equivalent"
}
```

Required run matrix dimensions:
- task ID
- provider
- model
- prompt condition
- mode condition
- repeat index

---

## 11. Deterministic Evaluation Notes

### 11.1 Slot selection

A valid future slot must satisfy:

`slot.start_time > current_local_datetime`

Rules:
- slots equal to current local datetime are invalid
- past slots are invalid
- among valid future slots, choose the earliest timestamp
- if multiple slots tie for earliest timestamp, any slot in the tie-set is acceptable
- selected `slot_id` must be preserved exactly

### 11.2 Structured slot returns

Models should report returned slots using:
- `returned_slot_ids`

Do not use prose slot summaries as source of truth.

### 11.3 Tool sequence

Expected order:
- `service_check`
- `check_slots`
- `book_slot`

Tools may be omitted only when the expected branch stops before that tool.

Any tool after a terminal stop is an over-action.

### 11.4 Customer response exact match

For F2-F6, the model must return the expected canonical `customer_response`.

The response is scored by exact string match after JSON parsing.

If the tool/process trace is correct but `customer_response` is missing or not exact, the run fails the user-facing result layer.

---

## 12. Minimal Micro-Pilot Set

Before generating all 120 tasks, create a micro-pilot with at least:

- 1 F1 noisy extraction task
- 1 F2 non-new-job stop
- 1 F2 serviceable ready-for-slot-fetch
- 1 F3 unsupported concrete unit type task where `service_check` returns unserviceable
- 1 F3 slots-returned endpoint
- 1 F4 equal-time slot trap
- 1 F5 booking success
- 1 F5 busy stop
- 1 F5 slots-returned-no-valid-future stop
- 1 F5 booking failure with exact non-confirmation response
- 1 F6 later-correction hard case
- 1 F6 similar-slot-ID hard case
- 1 F6 unsupported user assumption hard case
- 1 F6 name-conflict hard case using first-name-only `booking_name`
- 1 F6 temporal-boundary hard case

Goal:
- validate schemas
- validate prompt builder
- validate tool simulator
- validate deterministic scorer
- validate trace completeness
- validate canonical `customer_response` exact-match scoring

---

## 13. Change Control

Changing any of the following requires an explicit amendment:
- schema field names
- enum values
- branch IDs
- tool fixture behavior
- `other_type` operational policy
- datetime representation
- Track 1 exclusion rules
- canonical customer response strings
- task allocation or branch quotas

Every amendment must record:
- date
- reason
- exact change
- expected impact on comparability

---

## 14. Short Summary

Benchmark Data Model v1 defines how Track 1 tasks, hidden gold labels, and deterministic tool fixtures should be represented.

The key operational decisions are:
- `other_type` may be passed to `service_check`, but always stops before slot fetch
- `unknown` may continue only when gold marks it operationally supported
- tool errors are out of scope for Track 1 fixtures
- booking-warranted tasks with missing `booking_name` are excluded
- returned slots are represented with structured IDs, not prose summaries
- all time-sensitive tasks use synthetic fixed local datetimes with timezone
- F2-F6 include exact-match canonical `customer_response`
- Track 1 uses 10/10/10/15/35/40 task allocation with branch quotas and pressure-tag analysis
