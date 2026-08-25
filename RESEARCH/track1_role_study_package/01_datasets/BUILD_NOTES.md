# Full 120 Build Notes

Pack: `full_120_v1` — 40 rehearsal_40 cases copied as-is + 80 new cases.

## Family totals

| Family | Count |
|--------|------:|
| F1_extract | 10 |
| F2_partial_flow_a | 10 |
| F3_partial_flow_b | 10 |
| F4_select | 15 |
| F5_full_flow | 35 |
| F6_robustness_hard_cases | 40 |

## New cases (audit)

| case_id | branch | pressure_tags |
|---------|--------|---------------|
| F120_F1_001 | extract_only | later_correction, irrelevant_chatter |
| F120_F1_002 | extract_only | historical_value, irrelevant_chatter |
| F120_F1_003 | extract_only | — |
| F120_F1_004 | extract_only | later_correction |
| F120_F1_005 | extract_only | irrelevant_chatter |
| F120_F1_006 | extract_only | historical_value |
| F120_F1_007 | extract_only | later_correction, irrelevant_chatter |
| F120_F2_001 | non_new_job | excluded_intent_distraction |
| F120_F2_002 | missing_service_inputs | — |
| F120_F2_003 | missing_service_inputs | — |
| F120_F2_004 | not_serviceable | irrelevant_chatter |
| F120_F2_005 | ready_for_slot_fetch | — |
| F120_F2_006 | ready_for_slot_fetch | user_says_skip_checks |
| F120_F2_007 | ready_for_slot_fetch | irrelevant_chatter |
| F120_F3_001 | not_serviceable | unsupported_concrete_unit_type, irrelevant_chatter |
| F120_F3_002 | missing_slot_inputs | — |
| F120_F3_003 | slots_busy | busy_result |
| F120_F3_004 | slots_empty | empty_result |
| F120_F3_005 | slots_returned | unsorted_slots, irrelevant_chatter |
| F120_F3_006 | slots_returned | later_correction |
| F120_F3_007 | slots_returned | historical_value, similar_slot_ids |
| F120_F4_001 | slot_selected | unsorted_slots |
| F120_F4_002 | slot_selected | similar_slot_ids, unsorted_slots |
| F120_F4_003 | slot_selected | temporal_boundary |
| F120_F4_004 | slot_selected | unsorted_slots, irrelevant_chatter |
| F120_F4_005 | slot_selected | — |
| F120_F4_006 | slot_selected | similar_slot_ids, temporal_boundary |
| F120_F4_007 | slot_selected | unsorted_slots |
| F120_F4_008 | no_valid_slot | no_valid_after_filter, temporal_boundary |
| F120_F4_009 | no_valid_slot | no_valid_after_filter, unsorted_slots |
| F120_F4_010 | no_valid_slot | no_valid_after_filter, temporal_boundary, unsorted_slots |
| F120_F5_001 | booking_success | — |
| F120_F5_002 | booking_success | unsorted_slots |
| F120_F5_003 | booking_success | similar_slot_ids, unsorted_slots |
| F120_F5_004 | booking_success | irrelevant_chatter |
| F120_F5_005 | booking_success | temporal_boundary |
| F120_F5_006 | booking_success | unsorted_slots |
| F120_F5_007 | booking_failure | booking_failure, irrelevant_chatter |
| F120_F5_008 | booking_failure | booking_failure |
| F120_F5_009 | booking_failure | booking_failure, similar_slot_ids, unsorted_slots |
| F120_F5_010 | booking_failure | booking_failure, temporal_boundary |
| F120_F5_011 | booking_failure | booking_failure, unsorted_slots |
| F120_F5_012 | booking_failure | booking_failure |
| F120_F5_013 | slots_busy | busy_result, irrelevant_chatter |
| F120_F5_014 | slots_busy | busy_result |
| F120_F5_015 | slots_busy | busy_result, user_says_skip_checks |
| F120_F5_016 | slots_busy | busy_result |
| F120_F5_017 | slots_busy | busy_result, irrelevant_chatter |
| F120_F5_018 | no_valid_after_filter | no_valid_after_filter, temporal_boundary |
| F120_F5_019 | no_valid_after_filter | no_valid_after_filter, unsorted_slots, temporal_boundary |
| F120_F5_020 | no_valid_after_filter | no_valid_after_filter, temporal_boundary |
| F120_F5_021 | no_valid_after_filter | no_valid_after_filter, unsorted_slots |
| F120_F5_022 | no_valid_after_filter | no_valid_after_filter, temporal_boundary |
| F120_F5_023 | no_valid_after_filter | no_valid_after_filter, unsorted_slots, temporal_boundary |
| F120_F6_001 | booking_success | later_correction, historical_value, irrelevant_chatter |
| F120_F6_002 | booking_success | name_conflict, irrelevant_chatter |
| F120_F6_003 | booking_success | similar_slot_ids, unsorted_slots |
| F120_F6_004 | booking_success | user_says_skip_checks |
| F120_F6_005 | booking_success | temporal_boundary |
| F120_F6_006 | booking_success | name_conflict, unsorted_slots |
| F120_F6_007 | booking_failure | booking_failure, name_conflict, irrelevant_chatter |
| F120_F6_008 | booking_failure | booking_failure, temporal_boundary |
| F120_F6_009 | booking_failure | booking_failure, similar_slot_ids, unsorted_slots |
| F120_F6_010 | booking_failure | booking_failure, unsupported_user_assumption |
| F120_F6_011 | booking_failure | booking_failure, name_conflict |
| F120_F6_012 | slots_busy | busy_result, later_correction, user_says_skip_checks |
| F120_F6_013 | slots_busy | busy_result, historical_value |
| F120_F6_014 | slots_busy | busy_result, unsupported_user_assumption |
| F120_F6_015 | no_valid_after_filter | no_valid_after_filter, temporal_boundary, unsorted_slots |
| F120_F6_016 | no_valid_after_filter | no_valid_after_filter, later_correction, temporal_boundary |
| F120_F6_017 | no_valid_after_filter | no_valid_after_filter, temporal_boundary, similar_slot_ids |
| F120_F6_018 | no_valid_after_filter | no_valid_after_filter, historical_value, unsorted_slots |
| F120_F6_019 | not_serviceable | unsupported_concrete_unit_type, irrelevant_chatter |
| F120_F6_020 | not_serviceable | irrelevant_chatter |
| F120_F6_021 | not_serviceable | unsupported_concrete_unit_type |
| F120_F6_022 | not_serviceable | unsupported_concrete_unit_type, later_correction, unsupported_user_assumption |
| F120_F6_023 | missing_service_inputs | unsupported_user_assumption, irrelevant_chatter |
| F120_F6_024 | missing_service_inputs | — |
| F120_F6_025 | missing_service_inputs | user_says_skip_checks, unsupported_user_assumption |
| F120_F6_026 | missing_service_inputs | historical_value, unsupported_user_assumption |

## Rehearsal 40 cases included

- MP_F1_001 → extract_only
- MP_F2_001 → non_new_job
- MP_F2_002 → ready_for_slot_fetch
- MP_F3_001 → not_serviceable
- MP_F3_002 → slots_returned
- MP_F4_001 → slot_selected
- MP_F5_001 → booking_success
- MP_F5_002 → slots_busy
- MP_F5_003 → no_valid_after_filter
- MP_F5_004 → booking_failure
- MP_F6_001 → booking_success
- MP_F6_002 → booking_success
- MP_F6_003 → missing_service_inputs
- MP_F6_004 → booking_success
- MP_F6_005 → booking_success
- R40_F1_001 → extract_only
- R40_F1_002 → extract_only
- R40_F2_001 → not_serviceable
- R40_F3_001 → slots_busy
- R40_F4_001 → slot_selected
- R40_F4_002 → slot_selected
- R40_F4_003 → no_valid_slot
- R40_F4_004 → no_valid_slot
- R40_F5_001 → booking_success
- R40_F5_002 → booking_success
- R40_F5_003 → booking_failure
- R40_F5_004 → booking_failure
- R40_F5_005 → slots_busy
- R40_F5_006 → slots_busy
- R40_F5_007 → no_valid_after_filter
- R40_F5_008 → no_valid_after_filter
- R40_F6_001 → booking_success
- R40_F6_002 → booking_success
- R40_F6_003 → booking_success
- R40_F6_004 → booking_failure
- R40_F6_005 → slots_busy
- R40_F6_006 → no_valid_after_filter
- R40_F6_007 → not_serviceable
- R40_F6_008 → missing_service_inputs
- R40_F6_009 → booking_failure

## F6 new booking_success cap

New F6 booking_success cases: 6 / 26 (max 8).
