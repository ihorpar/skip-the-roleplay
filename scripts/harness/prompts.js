import { CANONICAL_RESPONSES } from "./constants.js";
import { buildFamilyRules } from "./familyRules.js";
import {
  buildScreeningSystemPrompt,
  isScreeningStyle,
} from "./screeningPrompts.js";

export { buildFamilyRules } from "./familyRules.js";

/** Locked role line for A2 — the only delta vs A1 on Axis A. */
export const ROLE_LINE_A2 =
  "- You are a scheduling agent for an appliance repair company.";

/** Locked role + competencies line for A3 — A2 plus generic competencies only (no workflow coaching). */
export const ROLE_LINE_A3 =
  "- You are a scheduling agent for an appliance repair company with strong professional competencies in careful listening, clear judgment, accurate follow-through, and disciplined adherence to procedures.";

export function buildRoleBlock(promptStyle) {
  if (promptStyle === "A1_task" || promptStyle === "A1_task_only") {
    return [];
  }
  if (promptStyle === "A2_role") {
    return [ROLE_LINE_A2];
  }
  if (promptStyle === "A3_comp" || promptStyle === "A3_role_plus_competencies") {
    return [ROLE_LINE_A3];
  }
  throw new Error(
    `Unknown Track-1 prompt style for role block: ${promptStyle} (screening styles must use buildScreeningSystemPrompt)`
  );
}

/** Shared scaffold across A1/A2/A3 and B1/B2 — family rules included, role block excluded. */
export function buildScaffold(taskFamily) {
  return [
    "You are running a deterministic appliance-repair scheduling benchmark.",
    "Use the provided tools when operational steps require them.",
    "When you have completed all required tool steps, return ONE JSON object only (no markdown, no prose).",
    "",
    "Final JSON must include these extraction fields:",
    "- booking_name (first name only)",
    "- intent",
    "- zip_code",
    "- unit_type",
    "- unit_class",
    "",
    "Extraction enums (use these exact strings only):",
    "- intent: new_job, reschedule, cancel, status_check, quote_only, general_question, other, unknown",
    "- unit_type: washer, dryer, refrigerator, dishwasher, oven_range, microwave, other_type, unknown",
    "- unit_class: residential, commercial, unknown",
    "- Normalize fridge -> refrigerator; oven/stove/range -> oven_range.",
    "",
    "Rules:",
    "- Use exact extraction enums listed above.",
    "- Never use empty string for unknown values; use literal `unknown`.",
    "- booking_name is the first name of the person the appointment is for.",
    "- If someone is calling on behalf of another person (e.g. \"Alex calling for Sam\"), booking_name is Sam (the booking person), not the caller.",
    "- Map apartment/home/house context to unit_class = residential.",
    "- Map clinic/office/store/cafe workplace kitchens to unit_class = commercial when that context is clear.",
    "- If commercial context is not clear, use unit_class = residential (do not invent unknown for ordinary home appliances).",
    "- `other_type` is allowed for unsupported concrete unit types.",
    "- If unit_type = other_type, call `service_check` once with that type, then stop (never call `check_slots`).",
    "- For time filtering, valid slot means slot start_time > current_local_datetime.",
    "- Never call `book_slot` for a slot that is not strictly in the future.",
    "- If no valid future slot remains, do not call `book_slot`; stop with final_status = stopped_no_valid_future_slots.",
    "- When multiple valid future slots exist, choose the earliest by start_time (then include its slot_id).",
    "",
    "Final output requirements:",
    "- F1_extract: return extraction fields only (no final_status, no customer_response).",
    "- F2-F6: include final_status and customer_response.",
    "- For slots_returned, include returned_slot_ids as a JSON array of strings.",
    "- For selection_complete, booking_confirmed, and booking_failed, include selected_slot_id.",
    "- Omit returned_slot_ids unless final_status is slots_returned.",
    "- Omit selected_slot_id unless final_status is selection_complete, booking_confirmed, or booking_failed.",
    "",
    "final_status must be one of:",
    "stopped_non_new_job, stopped_missing_required_info, stopped_unserviceable,",
    "stopped_busy, stopped_no_valid_future_slots, ready_for_slot_fetch,",
    "slots_returned, selection_complete, booking_confirmed, booking_failed",
    "",
    "customer_response must exactly match one canonical response:",
    ...CANONICAL_RESPONSES.map((r) => `  - ${r}`),
    "",
    ...buildFamilyRules(taskFamily),
    "",
  ].join("\n");
}

/** Mode condition (B1/B2) must not alter prompt text — only provider API settings differ. */
export function buildSystemPrompt(promptStyle, taskFamily) {
  if (isScreeningStyle(promptStyle)) {
    return buildScreeningSystemPrompt(promptStyle, taskFamily);
  }
  const scaffold = buildScaffold(taskFamily);
  const roleLines = buildRoleBlock(promptStyle);
  if (!roleLines.length) return scaffold;
  return `${scaffold}\n${roleLines.join("\n")}`;
}

/** Model-visible user prompt — no fixture data. */
export function buildUserPrompt(taskCase) {
  const task = taskCase.task;
  const payload = {
    case_id: taskCase.case_id,
    task_family: task.task_family,
    user_text: task.input.user_text,
    current_local_datetime: task.input.current_local_datetime,
    timezone: task.input.timezone,
  };

  return [
    "Process the following scheduling request.",
    "Call tools as needed, then return the final JSON object when done.",
    "Task:",
    JSON.stringify(payload, null, 2),
  ].join("\n");
}
