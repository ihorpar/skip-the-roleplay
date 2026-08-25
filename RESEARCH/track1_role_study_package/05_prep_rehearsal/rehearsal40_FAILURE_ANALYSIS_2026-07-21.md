# Rehearsal failure analysis (2026-07-21)

Source: `rehearsal40_r1` + `rehearsal40_r2` (480 runs). Failures: **54**.

## Counts

| Primary failure | Count | Meaning in plain language |
|-----------------|------:|---------------------------|
| `tool_trigger.unwarranted` | 25 | Called a tool it should not (often `book_slot` when no future slot) |
| `extraction.booking_name_wrong` | 17 | Booked under the caller’s name instead of the person named for the appointment |
| `tool_trigger.missing_required` | 10 | Skipped a required tool (or booked wrong slot so gold book failed) |
| `output.schema_invalid` | 2 | Rare shape issues |

Almost all fails are on **B1 instant**. B2 rarely fails.

## Clusters (not unfair gold)

1. **Name conflict** (`MP_F6_004`, `R40_F6_002`, `R40_F6_009`): “X calling for Y” → model books X. Contract wants Y. Keep as real test; clarify scaffold wording.
2. **No valid future** (`MP_F5_003`, `R40_F5_007/008`, `R40_F6_006`): model tries to book `slot_eq_*` (equal to now) → blocked → invents `booking_failed`. Keep; clarify “never book non-future slots.”
3. **`other_type` / skip service_check** (`MP_F3_001`): sometimes stops without calling `service_check`. Clarify: still call `service_check` once, then stop (no `check_slots`).
4. **Similar slot IDs** (`R40_F5_004`): picks later similar id. Fair earliest-policy fail.

## Prompt fixes applied after this analysis

- Caller vs booking person rule
- Never `book_slot` unless slot start_time > now; if none, stop with `stopped_no_valid_future_slots`
- `other_type`: call `service_check`, never `check_slots`
