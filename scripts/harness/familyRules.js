/** Family-scoped endpoint constraints shared by Track 1 and screening prompts. */
export function buildFamilyRules(taskFamily) {
  // Thinning policy: keep tool scope + family endpoint constraints.
  // Do NOT paste canonical customer_response strings (those live once in the shared list).
  // Downstream scoring still requires exact gold status/response — models must map them.
  if (taskFamily === "F1_extract") {
    return [
      "Family-specific rules (F1):",
      "- Extraction only. Do not call any tools.",
      "- Return final JSON with extraction fields only.",
    ];
  }
  if (taskFamily === "F2_partial_flow_a") {
    return [
      "Family-specific rules (F2):",
      "- Never call `check_slots` or `book_slot` in F2.",
      "- If intent is not `new_job`, stop with final_status = `stopped_non_new_job`.",
      "- If intent is `new_job`, call `service_check` exactly once when required fields are available.",
      "- After a serviceable `service_check` in F2, stop at the F2 boundary with final_status = `ready_for_slot_fetch` (do not fetch slots).",
      "- If `service_check` is unserviceable, stop with final_status = `stopped_unserviceable`.",
    ];
  }
  if (taskFamily === "F3_partial_flow_b") {
    return [
      "Family-specific rules (F3):",
      "- When warranted, call `service_check` then `check_slots`.",
      "- Never call `book_slot` in F3.",
      "- When slots are returned, stop with final_status = `slots_returned` and include `returned_slot_ids` (array of slot ID strings; order does not matter).",
    ];
  }
  if (taskFamily === "F4_select") {
    return [
      "Family-specific rules (F4):",
      "- Select a slot; do not only list slots.",
      "- When warranted, call `service_check` then `check_slots`.",
      "- Never call `book_slot` in F4.",
      "- On successful selection, stop with final_status = `selection_complete` and include `selected_slot_id`.",
    ];
  }
  if (taskFamily === "F5_full_flow" || taskFamily === "F6_robustness_hard_cases") {
    return [
      "Family-specific rules (F5/F6):",
      "- When warranted, complete the full workflow: extract, gate, service_check, check_slots, select, book_slot.",
      "- Do not call `book_slot` unless every prior condition is satisfied.",
      "- Do not claim booking success unless `book_slot` succeeded.",
    ];
  }
  return [];
}
