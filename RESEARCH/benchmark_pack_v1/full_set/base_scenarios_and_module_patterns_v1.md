# Base Scenarios and Module Patterns v1

This document bridges the current 120-case composition plan and the future payload builder.

Its job is to define:

- what each branch means as a clean base scenario
- what each challenge module does
- what parts of the truth packet each module mutates
- where each module can be safely used

The goal is to make task generation mass-producible without losing deterministic evaluation.

## 1. Base Scenario Library

Each base scenario is a clean operational truth state before any pressure module is injected.

### `extract_only`

- Used in: `F1`
- Goal: extract normalized entities only
- Base truth:
  - intent = `new_job`
  - booking_name is present
  - zip_code is present
  - unit_type is present
  - unit_class is inferable or explicit
- Tools: none
- Correct endpoint:
  - extraction only

### `non_new_job`

- Used in: `F2`
- Goal: detect that the request is outside Track 1 new-job flow
- Base truth:
  - intent != `new_job`
  - no serviceability call is allowed
- Tools: none
- Correct endpoint:
  - stop with the canonical non-new-job customer response

### `missing_service_inputs`

- Used in: `F2`, `F6`
- Goal: stop before `service_check` because required serviceability input is missing and ask the exact missing-field clarification question
- Base truth:
  - intent = `new_job`
  - at least one required serviceability field is missing
  - serviceability cannot be checked deterministically
- Tools: none
- Correct endpoint:
  - stop with the canonical missing-field clarification question
  - missing `zip_code` -> `What is your zip code?`
  - missing `unit_type` -> `What type of unit do you need service for?`

### `not_serviceable`

- Used in: `F2`, `F3`, `F6`
- Goal: run `service_check`, get a not-serviceable result, then stop
- Base truth:
  - intent = `new_job`
  - service inputs are sufficient
  - `service_check(...) -> serviceable = false`
- Tools:
  - `service_check`
- Correct endpoint:
  - stop with the canonical unserviceable customer response

### `ready_for_slot_fetch`

- Used in: `F2`
- Goal: correctly extract and normalize inputs, then pass serviceability and stop at the serviceability endpoint
- Base truth:
  - intent = `new_job`
  - service inputs are sufficient
  - `service_check(...) -> serviceable = true`
- Tools:
  - `service_check`
- Correct endpoint:
  - proceed-ready state for downstream slot fetch, but no slot fetch in this family

### `missing_slot_inputs`

- Used in: `F3`
- Goal: stop after serviceability passes because slot-fetch-required data is still missing and ask the exact missing-field clarification question
- Base truth:
  - intent = `new_job`
  - serviceability is checkable and passes
  - one or more required slot-fetch inputs are missing
- Tools:
  - `service_check`
- Correct endpoint:
  - stop before `check_slots`
  - return the canonical missing-field clarification question from gold

### `slots_busy`

- Used in: `F3`, `F5`, `F6`
- Goal: run slot fetch and stop on busy result
- Base truth:
  - intent = `new_job`
  - serviceability passes
  - slot-fetch inputs are sufficient
  - `check_slots(...) -> busy`
- Tools:
  - `service_check`
  - `check_slots`
- Correct endpoint:
  - stop with the canonical busy customer response

### `slots_empty`

- Used in: `F3`
- Goal: run slot fetch and stop on empty-array result
- Base truth:
  - intent = `new_job`
  - serviceability passes
  - slot-fetch inputs are sufficient
  - `check_slots(...) -> []`
- Tools:
  - `service_check`
  - `check_slots`
- Correct endpoint:
  - stop with the canonical no-slots customer response

### `slots_returned`

- Used in: `F3`
- Goal: run slot fetch correctly and stop at the slot-fetch endpoint
- Base truth:
  - intent = `new_job`
  - serviceability passes
  - slot-fetch inputs are sufficient
  - `check_slots(...) -> slots returned`
- Tools:
  - `service_check`
  - `check_slots`
- Correct endpoint:
  - slot list has been fetched correctly, but no selection/booking yet

### `slot_selected`

- Used in: `F4`
- Goal: select the correct earliest valid future slot from a returned list
- Base truth:
  - serviceability passes
  - slots are returned
  - at least one valid future slot exists
  - correct selected slot is uniquely determinable by policy
- Tools:
  - `service_check`
  - `check_slots`
- Correct endpoint:
  - selected slot only, no booking call

### `no_valid_slot`

- Used in: `F4`
- Goal: apply temporal filtering and determine that no valid future slot remains
- Base truth:
  - serviceability passes
  - slots are returned
  - after filtering by policy, zero valid future slots remain
- Tools:
  - `service_check`
  - `check_slots`
- Correct endpoint:
  - stop with the canonical no-valid-slot customer response

### `no_valid_after_filter`

- Used in: `F5`, `F6`
- Goal: reach the selection stage, apply filtering, and stop because nothing valid remains
- Base truth:
  - serviceability passes
  - slots are returned
  - no valid future slot remains after filtering
- Tools:
  - `service_check`
  - `check_slots`
- Correct endpoint:
  - stop before `book_slot`

### `booking_success`

- Used in: `F5`, `F6`
- Goal: execute the full correct flow and book the correct slot successfully
- Base truth:
  - serviceability passes
  - slots are returned
  - at least one valid future slot exists
  - correct slot is selected
  - `book_slot(...) -> success`
- Tools:
  - `service_check`
  - `check_slots`
  - `book_slot`
- Correct endpoint:
  - booking confirmed with the selected slot

### `booking_failure`

- Used in: `F5`, `F6`
- Goal: execute the full correct flow but stop on booking-tool failure
- Base truth:
  - serviceability passes
  - slots are returned
  - at least one valid future slot exists
  - correct slot is selected
  - `book_slot(...) -> failure`
- Tools:
  - `service_check`
  - `check_slots`
  - `book_slot`
- Correct endpoint:
  - booking failed with the canonical failure customer response

## 2. Challenge Module Library

Each module is a deterministic pressure injector, not a free-form creative idea.

## `baseline_clean`

- One-sentence meaning: leaves the scenario clean and adds no extra pressure.
- Mutates `user_text`: no
- Mutates truth packet: no
- Safe use: any family, any branch
- Excludes: none

## `later_correction`

- One-sentence meaning: the user first gives one value, then later explicitly corrects it, and the model must follow the later value.
- Mutates `user_text`: yes, by adding an explicit correction to zip, unit, or other extractable entity
- Mutates truth packet: yes, final canonical entity values
- Safe use: `F1`, `F3`, `F5`, `F6`
- Branches: `extract_only`, `slots_returned`, `booking_success`, `booking_failure`, `no_valid_after_filter`
- Excludes: `historical_value`

## `historical_value`

- One-sentence meaning: the text mentions an old or irrelevant past value that should not override the current active value.
- Mutates `user_text`: yes, by adding stale historical context
- Mutates truth packet: usually no primary final value, but it adds distractor evidence
- Safe use: `F1`, `F3`, `F6`
- Branches: `extract_only`, `slots_returned`, `booking_success`, `not_serviceable`
- Excludes: `later_correction`

## `unsupported_concrete_unit_type`

- One-sentence meaning: the user names a concrete appliance/service type that is real and clear but unsupported, so it must map to `other_type`.
- Mutates `user_text`: yes, by using a concrete unsupported unit mention
- Mutates truth packet: yes, normalized `unit_type = other_type`
- Safe use: `F2`, `F3`, `F6`
- Branches: `not_serviceable`
- Excludes: `missing_zip`, `missing_unit_type`

## `missing_zip`

- One-sentence meaning: the request lacks a usable zip code, so `service_check` cannot be run.
- Mutates `user_text`: yes, by omitting or obscuring zip
- Mutates truth packet: yes, zip becomes unavailable and `customer_response = What is your zip code?`
- Safe use: `F2`, `F3`, `F6`
- Branches: `missing_service_inputs`
- Excludes: `unsupported_concrete_unit_type`, `non_new_job_distraction`

## `missing_unit_type`

- One-sentence meaning: the request lacks a usable unit type, so the workflow must stop before the next dependent step.
- Mutates `user_text`: yes, by omitting or blurring the unit type
- Mutates truth packet: yes, unit type becomes unavailable and `customer_response = What type of unit do you need service for?`
- Safe use: `F2`, `F3`, `F6`
- Branches: `missing_service_inputs`, `missing_slot_inputs`
- Excludes: `unsupported_concrete_unit_type`, `non_new_job_distraction`

## `non_new_job_distraction`

- One-sentence meaning: the user sounds service-related, but the actual request is outside the new-job benchmark scope.
- Mutates `user_text`: yes, by making the excluded intent sound superficially close to a new booking
- Mutates truth packet: yes, intent becomes non-new-job
- Safe use: `F2`
- Branches: `non_new_job`
- Excludes: `missing_zip`, `missing_unit_type`, `unsupported_concrete_unit_type`

## `service_busy_result`

- One-sentence meaning: slot lookup is valid, but the slots tool returns a busy result rather than concrete slots.
- Mutates `user_text`: no
- Mutates truth packet: yes, `check_slots` fixture result becomes `busy`
- Safe use: `F3`, `F5`, `F6`
- Branches: `slots_busy`
- Excludes: `empty_slot_result`, `no_valid_after_filter_slots`

## `empty_slot_result`

- One-sentence meaning: slot lookup is valid, but the slots tool returns an empty array.
- Mutates `user_text`: no
- Mutates truth packet: yes, `check_slots` fixture result becomes `[]`
- Safe use: `F3`
- Branches: `slots_empty`
- Excludes: `service_busy_result`, `no_valid_after_filter_slots`

## `no_valid_after_filter_slots`

- One-sentence meaning: slots are returned, but none survive the policy filter because they are past or equal to now.
- Mutates `user_text`: sometimes, if the user requests a narrow time window; not required
- Mutates truth packet: yes, slot fixture composition and `current_local_datetime`
- Safe use: `F4`, `F5`, `F6`
- Branches: `no_valid_slot`, `no_valid_after_filter`
- Excludes: `service_busy_result`, `empty_slot_result`, `valid_slot_selection`

## `valid_slot_selection`

- One-sentence meaning: slots are returned and at least one valid future slot exists, so the model must select the correct one.
- Mutates `user_text`: no
- Mutates truth packet: yes, slot fixture contains a valid selectable outcome
- Safe use: `F4`, `F5`, `F6`
- Branches: `slot_selected`, `booking_success`, `booking_failure`
- Excludes: `no_valid_after_filter_slots`

## `similar_slot_ids`

- One-sentence meaning: the slot list contains visually similar IDs, so the model must preserve the exact chosen `slot_id`.
- Mutates `user_text`: no
- Mutates truth packet: yes, slot fixture ID surface
- Safe use: `F4`, `F5`, `F6`
- Branches: `slot_selected`, `booking_success`, `booking_failure`, `no_valid_after_filter`
- Excludes: none

## `unsorted_slots`

- One-sentence meaning: returned slots are not ordered chronologically, so the model must sort by policy rather than trust list order.
- Mutates `user_text`: no
- Mutates truth packet: yes, slot list ordering
- Safe use: `F4`, `F5`, `F6`
- Branches: `slot_selected`, `booking_success`, `booking_failure`, `no_valid_after_filter`
- Excludes: none

## `temporal_boundary`

- One-sentence meaning: some candidate slots are exactly at or very near the current local time, so strict `start_time > now` filtering matters.
- Mutates `user_text`: sometimes, if the user mentions relative timing
- Mutates truth packet: yes, `current_local_datetime` and slot timestamps
- Safe use: `F4`, `F5`, `F6`
- Branches: `slot_selected`, `no_valid_slot`, `no_valid_after_filter`, `booking_success`, `booking_failure`
- Excludes: none

## `booking_failure_fixture`

- One-sentence meaning: the full flow is correct, but the booking tool returns failure and the model must not hallucinate confirmation.
- Mutates `user_text`: no
- Mutates truth packet: yes, `book_slot` fixture result
- Safe use: `F5`, `F6`
- Branches: `booking_failure`
- Excludes: none

## `user_says_skip_checks`

- One-sentence meaning: the user explicitly pushes for shortcutting the workflow, but the model must still follow required operational checks.
- Mutates `user_text`: yes, by adding “just book it” style pressure
- Mutates truth packet: no
- Safe use: `F2`, `F5`, `F6`
- Branches: `ready_for_slot_fetch`, `booking_success`, `booking_failure`, `slots_busy`
- Excludes: none

## `name_conflict`

- One-sentence meaning: the text contains more than one person-name role, so the model must extract the booking first name for the correct person.
- Mutates `user_text`: yes, by adding caller-vs-booking-person ambiguity
- Mutates truth packet: yes, `booking_name`
- Safe use: `F5`, `F6`
- Branches: `booking_success`, `booking_failure`
- Excludes: none

## `unsupported_user_assumption`

- One-sentence meaning: the user states an assumption about how the system works that is not operationally supported, and the model must ignore it.
- Mutates `user_text`: yes, by adding a false assumption or invalid instruction
- Mutates truth packet: no
- Safe use: `F6`
- Branches: `missing_service_inputs`, `not_serviceable`, `booking_success`, `booking_failure`
- Excludes: none

## 3. Truth Packet Mutation Guide

When converting modules into real payloads, treat the truth packet as the canonical state that drives all downstream artifacts.

Recommended canonical fields:

- `intent`
- `booking_name`
- `zip_code`
- `unit_type`
- `unit_class`
- `current_local_datetime`
- `timezone`
- `service_check_fixture`
- `check_slots_fixture`
- `book_slot_fixture`
- `customer_response`
- `final_status`
- `selected_slot_id`

Module categories tend to mutate the truth packet like this:

- extraction pressure:
  - `booking_name`
  - `zip_code`
  - `unit_type`
  - `unit_class`
- intent pressure:
  - `intent`
  - `customer_response`
  - `final_status`
- missing-info pressure:
  - remove one required field from canonical availability
- slot fixture pressure:
  - `check_slots_fixture`
  - `selected_slot_id`
  - `final_status`
  - `customer_response`
- booking fixture pressure:
  - `book_slot_fixture`
  - `final_status`
  - `customer_response`
- temporal pressure:
  - `current_local_datetime`
  - `timezone`
  - slot timestamps

## 4. How to Use This for Payload Generation

Recommended generation flow:

1. Start from `(family, target_branch_id)`.
2. Instantiate the clean base scenario for that branch.
3. Apply the listed modules in deterministic order.
4. Recompute the final truth packet.
5. Generate:
   - `user_text`
   - task schema payload
   - gold output
   - tool fixtures
6. Validate that:
   - the branch is still reachable
   - no excluded module conflicts were introduced
   - the final truth packet still supports deterministic scoring

This should be the source layer for the next implementation step: real task content generation.
