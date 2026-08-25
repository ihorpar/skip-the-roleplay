# Rehearsal 40 Build Notes

Pack: `rehearsal_40_v1` — 15 micro-pilot cases copied as-is + 25 new cases.

## Family totals

| Family | Count |
|--------|------:|
| F1_extract | 3 |
| F2_partial_flow_a | 3 |
| F3_partial_flow_b | 3 |
| F4_select | 5 |
| F5_full_flow | 12 |
| F6_robustness_hard_cases | 14 |

## New cases (audit)

| case_id | branch | pressure_tags |
|---------|--------|---------------|
| R40_F1_001 | extract_only | later_correction, irrelevant_chatter |
| R40_F1_002 | extract_only | historical_value, irrelevant_chatter |
| R40_F2_001 | not_serviceable | irrelevant_chatter |
| R40_F3_001 | slots_busy | busy_result, irrelevant_chatter |
| R40_F4_001 | slot_selected | similar_slot_ids, unsorted_slots |
| R40_F4_002 | slot_selected | unsorted_slots, irrelevant_chatter |
| R40_F4_003 | no_valid_slot | no_valid_after_filter, temporal_boundary |
| R40_F4_004 | no_valid_slot | temporal_boundary, unsorted_slots |
| R40_F5_001 | booking_success | irrelevant_chatter |
| R40_F5_002 | booking_success | unsorted_slots |
| R40_F5_003 | booking_failure | booking_failure, irrelevant_chatter |
| R40_F5_004 | booking_failure | booking_failure, similar_slot_ids, unsorted_slots |
| R40_F5_005 | slots_busy | busy_result, irrelevant_chatter |
| R40_F5_006 | slots_busy | busy_result |
| R40_F5_007 | no_valid_after_filter | no_valid_after_filter, temporal_boundary |
| R40_F5_008 | no_valid_after_filter | no_valid_after_filter, unsorted_slots, temporal_boundary |
| R40_F6_001 | booking_success | later_correction, historical_value, irrelevant_chatter |
| R40_F6_002 | booking_success | name_conflict, irrelevant_chatter |
| R40_F6_003 | booking_success | similar_slot_ids, unsorted_slots |
| R40_F6_004 | booking_failure | booking_failure, temporal_boundary |
| R40_F6_005 | slots_busy | busy_result, later_correction, user_says_skip_checks |
| R40_F6_006 | no_valid_after_filter | no_valid_after_filter, temporal_boundary, unsorted_slots |
| R40_F6_007 | not_serviceable | unsupported_concrete_unit_type, irrelevant_chatter |
| R40_F6_008 | missing_service_inputs | unsupported_user_assumption, irrelevant_chatter |
| R40_F6_009 | booking_failure | booking_failure, name_conflict, irrelevant_chatter |

## Micro-pilot cases included

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

## F6 new booking_success cap

New F6 booking_success cases: 3 / 9 (max 3).
