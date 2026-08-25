# Family Module Matrix Draft v1

This draft defines which challenge modules should be allowed in each task family before generating the full 120-task payload bundle.

The purpose is to make module assignment explicit and reviewable instead of relying only on a global greedy planner.

## Design Rules

- A task may contain more than one challenge module.
- Multi-module tasks are allowed only when the combination remains deterministic and does not create false negatives.
- Module exclusions are binding.
- Missing-info modules require exact clarification questions, not generic stop messages.
- `non_new_job_distraction` must remain narrow and unambiguous: the user is clearly not asking for a new booking.

## `non_new_job_distraction` Wording Guardrails

Allowed non-new-job meanings:
- checking status of an already scheduled visit
- canceling an existing appointment
- rescheduling an existing appointment
- asking about a previous repair or invoice

Avoid:
- wording that could reasonably mean either a new booking or an existing appointment change
- direct benchmark-like wording such as "this is not a new job"
- mixing a new repair request with an existing appointment request in the same user text

Good task text should sound like a real customer, but the intent must remain unambiguous from ordinary language.

## Canonical Missing-Info Responses

- missing `zip_code` -> `What is your zip code?`
- missing `unit_type` -> `What type of unit do you need service for?`

These responses are exact-match outputs in `customer_response`.

## F1 Extract

Goal: extraction-only normalization under realistic text pressure.

Allowed modules:
- `baseline_clean`
- `later_correction`
- `historical_value`

Recommended combinations:
- `later_correction`
- `historical_value`
- `baseline_clean`

Avoid:
- tool-result modules
- booking modules
- slot-selection modules
- missing-info clarification modules, unless we intentionally add extraction-only missing labels later

Rationale: F1 should test extraction and correction discipline only; it should not introduce workflow behavior.

## F2 Partial Flow A

Goal: extraction + intent gate + serviceability endpoint.

Allowed modules:
- `baseline_clean`
- `missing_zip`
- `missing_unit_type`
- `non_new_job_distraction`
- `unsupported_concrete_unit_type`
- `user_says_skip_checks`

Recommended combinations:
- `missing_zip`
- `missing_unit_type`
- `non_new_job_distraction`
- `unsupported_concrete_unit_type`
- `user_says_skip_checks`

Avoid:
- slot fixture modules
- booking modules
- slot-selection modules
- `later_correction` unless we deliberately want F2 extraction pressure in addition to serviceability pressure

Rationale: F2 should prove the model can decide whether `service_check` is warranted and pass exact normalized service arguments when it is.

## F3 Partial Flow B

Goal: extraction + serviceability + slot fetch endpoint.

Allowed modules:
- `baseline_clean`
- `later_correction`
- `historical_value`
- `missing_zip`
- `missing_unit_type`
- `unsupported_concrete_unit_type`
- `service_busy_result`
- `empty_slot_result`

Recommended combinations:
- `later_correction` + `service_busy_result`
- `historical_value` + `empty_slot_result`
- `unsupported_concrete_unit_type`
- `missing_zip`
- `missing_unit_type`

Avoid:
- booking modules
- slot-selection modules that require choosing among returned slots
- `user_says_skip_checks` unless the branch remains clearly scoped to slot fetch

Rationale: F3 should test whether the model reaches the correct slot-fetch endpoint, without selecting or booking.

## F4 Select

Goal: extraction + serviceability + slot fetch + slot selection, without booking.

Allowed modules:
- `baseline_clean`
- `valid_slot_selection`
- `no_valid_after_filter_slots`
- `similar_slot_ids`
- `unsorted_slots`
- `temporal_boundary`

Recommended combinations:
- `valid_slot_selection` + `unsorted_slots`
- `valid_slot_selection` + `similar_slot_ids`
- `valid_slot_selection` + `temporal_boundary`
- `no_valid_after_filter_slots` + `temporal_boundary`
- `no_valid_after_filter_slots` + `unsorted_slots`

Avoid:
- booking modules
- intent-gating modules
- unsupported unit modules
- missing-service-input modules

Rationale: F4 should focus on selection pressure, not upstream serviceability traps.

## F5 Full Flow

Goal: full operational booking flow from user request through booking outcome.

Allowed modules:
- `baseline_clean`
- `later_correction`
- `valid_slot_selection`
- `no_valid_after_filter_slots`
- `similar_slot_ids`
- `unsorted_slots`
- `temporal_boundary`
- `booking_failure_fixture`
- `user_says_skip_checks`
- `name_conflict`
- `service_busy_result`

Recommended combinations:
- `valid_slot_selection` + `unsorted_slots`
- `valid_slot_selection` + `similar_slot_ids`
- `valid_slot_selection` + `temporal_boundary`
- `booking_failure_fixture` + `similar_slot_ids`
- `booking_failure_fixture` + `user_says_skip_checks`
- `no_valid_after_filter_slots` + `temporal_boundary`
- `service_busy_result` + `user_says_skip_checks`

Avoid:
- unsupported concrete unit type, to keep Track 1 F5 focused on supported full-flow tasks
- non-new-job distractions
- broad missing-info tasks, unless the F5 branch quota explicitly includes missing stops later

Rationale: F5 should test complete workflow discipline, especially whether the model proceeds all the way to `book_slot` when required and stops correctly when tool outcomes prevent booking.

## F6 Robustness / Hard Cases

Goal: hard full-flow or stop-flow cases with stronger decision pressure.

Allowed modules:
- `baseline_clean`
- `later_correction`
- `historical_value`
- `missing_zip`
- `missing_unit_type`
- `unsupported_concrete_unit_type`
- `service_busy_result`
- `no_valid_after_filter_slots`
- `valid_slot_selection`
- `similar_slot_ids`
- `unsorted_slots`
- `temporal_boundary`
- `booking_failure_fixture`
- `user_says_skip_checks`
- `name_conflict`
- `unsupported_user_assumption`

Recommended combinations:
- `unsupported_user_assumption` + `user_says_skip_checks`
- `later_correction` + `similar_slot_ids`
- `historical_value` + `unsupported_user_assumption`
- `booking_failure_fixture` + `user_says_skip_checks`
- `no_valid_after_filter_slots` + `temporal_boundary`
- `valid_slot_selection` + `unsorted_slots` + `similar_slot_ids`
- `missing_zip` + `unsupported_user_assumption`
- `unsupported_concrete_unit_type` + `unsupported_user_assumption`

Avoid:
- ambiguous non-new-job wording
- more than three pressure modules in one task
- name conflict overuse; keep it rare and clearly resolvable

Rationale: F6 should carry the hardest cases, but each case still needs one clear correct answer.

## Binding Exclusions

These exclusions should remain enforced by the generator and validator:

- `later_correction` excludes `historical_value`
- `historical_value` excludes `later_correction`
- `unsupported_concrete_unit_type` excludes `missing_zip`
- `unsupported_concrete_unit_type` excludes `missing_unit_type`
- `missing_zip` excludes `unsupported_concrete_unit_type`
- `missing_zip` excludes `non_new_job_distraction`
- `missing_unit_type` excludes `unsupported_concrete_unit_type`
- `missing_unit_type` excludes `non_new_job_distraction`
- `non_new_job_distraction` excludes `missing_zip`
- `non_new_job_distraction` excludes `missing_unit_type`
- `non_new_job_distraction` excludes `unsupported_concrete_unit_type`
- `service_busy_result` excludes `empty_slot_result`
- `service_busy_result` excludes `no_valid_after_filter_slots`
- `empty_slot_result` excludes `service_busy_result`
- `empty_slot_result` excludes `no_valid_after_filter_slots`
- `no_valid_after_filter_slots` excludes `service_busy_result`
- `no_valid_after_filter_slots` excludes `empty_slot_result`
- `no_valid_after_filter_slots` excludes `valid_slot_selection`
- `valid_slot_selection` excludes `no_valid_after_filter_slots`

## Recommended Planner Direction

The next planner should be matrix-driven:

1. Start from the family allocation and branch quotas.
2. Use this family matrix to pick eligible modules.
3. Use explicit per-family module quotas instead of only global pressure-tag targets.
4. Use the global pressure-tag targets as a validation layer, not as the sole assignment mechanism.

This gives us a readable structure such as:

- F1: correction and historical extraction pressure
- F2: intent, missing-info, unsupported-unit, and serviceability pressure
- F3: slot-fetch outcome pressure
- F4: selection and temporal pressure
- F5: full booking pressure
- F6: combined robustness pressure
