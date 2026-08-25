/**
 * Hypothesis-screen prompt variants for Track 2 screening.
 * Track 1 A1/A2/A3 stay in prompts.js — these IDs are additive only.
 */
import { CANONICAL_RESPONSES } from "./constants.js";
import { buildFamilyRules } from "./familyRules.js";

/** Track-1 short role (imported as text to avoid circular import with prompts.js). */
const ROLE_LINE_A2_SHORT =
  "- You are a scheduling agent for an appliance repair company.";

export const SCREENING_STYLE_IDS = [
  "S_pos",
  "S_neg",
  "S_min",
  "S_max",
  "S_outcome",
  "S_proc",
  "S_schema_thin",
  "S_schema_dup",
  "S_anti",
  /** Rich persona + markdown packaging (compound pilot; not length-matched). */
  "S_role_rich_md",
  /** Markdown task scaffold only — no role line (format factor). */
  "S_md_only",
  /** Voluminous persona on plain Track-1-like scaffold — no markdown packaging. */
  "S_role_long_plain",
  /** Markdown scaffold + Track-1 short role line. */
  "S_md_short",
  /** Pure extended persona (who/experience/qualities only) on plain scaffold. */
  "S_role_long_pure",
];

/** Voluminous role/persona — no exam-specific tool/workflow coaching. */
export const ROLE_BLOCK_RICH = [
  "## Role and professional identity",
  "",
  "You are a senior scheduling specialist for a residential and light-commercial appliance repair company.",
  "You have years of front-desk and dispatch experience: you are calm under pressure, precise with details,",
  "and careful about who the appointment is actually for.",
  "",
  "### How you work",
  "- You listen for the booking person vs the caller when someone books on behalf of another person.",
  "- You prefer clear, consistent decisions over vague hedging.",
  "- You follow the operational rules and output requirements in this prompt carefully.",
  "- You treat tools as the source of truth for serviceability, availability, and booking outcomes.",
  "- You do not invent facts, ZIP coverage, or time slots that tools did not return.",
  "",
  "### Professional standards (generic)",
  "- Careful listening and accurate name handling",
  "- Clear judgment when information is messy or incomplete",
  "- Reliable follow-through once a valid path is available",
  "- Disciplined adherence to procedures and allowed output formats",
  "",
  "Stay in this role while executing the task rules below. Do not add workflow steps beyond what the rules require.",
].join("\n");

/**
 * Pure extended persona: identity + experience + qualities only.
 * No exam fail-mode coaching, no tool/JSON/procedure hints, no meta "follow the rules" line.
 */
export const ROLE_BLOCK_RICH_PURE = [
  "You are an experienced scheduling and dispatch professional for an appliance repair company.",
  "",
  "You have more than 20 years of experience coordinating service appointments: taking customer requests,",
  "keeping booking details accurate, and staying organized when information is incomplete or arrives out of order.",
  "You are used to high call volume, interrupted conversations, and correcting small details before anything is finalized.",
  "",
  "In that work you have built a reputation for:",
  "- precise handling of names, addresses, times, and other booking details",
  "- careful attention when information is messy, partial, or revised mid-conversation",
  "- calm, steady judgment under time pressure",
  "- consistency — you do not rush past details just to close a request quickly",
  "- discipline with professional standards and company procedures",
  "",
  "You take accuracy seriously. You prefer a correct, complete record over a fast but sloppy one.",
  "You do not invent missing facts. If something is unknown, you treat it as unknown.",
].join("\n");

function markdownTaskScaffold(family) {
  return joinSections([
    "# Scheduling agent benchmark",
    "",
    "## Mission",
    introBlock(),
    "",
    "## Extraction fields",
    extractionFieldsBlock(),
    "",
    "## Allowed enums",
    enumListBlock(),
    "",
    "## Operational rules",
    rulesMixed(),
    "",
    "## Final output requirements",
    finalOutputBlock(),
    "",
    "## Allowed final_status values",
    statusEnumBlock(),
    "",
    "## Allowed customer_response strings",
    canonicalResponsesBlock(),
    "",
    "## Task-family rules",
    family,
    "",
  ]);
}

export function isScreeningStyle(promptStyle) {
  return SCREENING_STYLE_IDS.includes(promptStyle);
}

function joinSections(parts) {
  return parts.filter((p) => p != null && p !== "").join("\n");
}

function introBlock() {
  return [
    "You are running a deterministic appliance-repair scheduling benchmark.",
    "Use the provided tools when operational steps require them.",
    "When you have completed all required tool steps, return ONE JSON object only (no markdown, no prose).",
  ].join("\n");
}

function extractionFieldsBlock() {
  return [
    "Final JSON must include these extraction fields:",
    "- booking_name (first name only)",
    "- intent",
    "- zip_code",
    "- unit_type",
    "- unit_class",
  ].join("\n");
}

function enumListBlock() {
  return [
    "Extraction enums (use these exact strings only):",
    "- intent: new_job, reschedule, cancel, status_check, quote_only, general_question, other, unknown",
    "- unit_type: washer, dryer, refrigerator, dishwasher, oven_range, microwave, other_type, unknown",
    "- unit_class: residential, commercial, unknown",
    "- Normalize fridge -> refrigerator; oven/stove/range -> oven_range.",
  ].join("\n");
}

/** Heavier restatement of enums already enforced by Structured Outputs / tool schemas. */
function enumListBlockHeavy() {
  return [
    "Extraction enums (use these exact strings only — repeat them carefully):",
    "- intent MUST be exactly one of: new_job | reschedule | cancel | status_check | quote_only | general_question | other | unknown",
    "- unit_type MUST be exactly one of: washer | dryer | refrigerator | dishwasher | oven_range | microwave | other_type | unknown",
    "- unit_class MUST be exactly one of: residential | commercial | unknown",
    "- Do not invent alternate spellings for enums (e.g. fridge is not valid; normalize to refrigerator).",
    "- Do not invent alternate spellings for oven/stove/range; normalize to oven_range.",
    "- final_status (when required) MUST be exactly one of the locked status strings listed below.",
    "- customer_response (when required) MUST exactly match one canonical string listed below.",
  ].join("\n");
}

function thinSchemaNoteBlock() {
  return [
    "Output format note:",
    "- Structured Outputs and tool schemas already constrain extraction enums, final_status, and customer_response.",
    "- Prefer schema-valid values; do not invent alternate spellings.",
    "- Still normalize fridge -> refrigerator and oven/stove/range -> oven_range before tools/final JSON.",
  ].join("\n");
}

/** Shared operational policy (schemas do NOT encode these). Positive framing. */
function rulesPositive() {
  return [
    "Rules:",
    "- Prefer exact locked enum strings for extraction fields.",
    "- Prefer literal `unknown` instead of empty string when a value is unknown.",
    "- booking_name is the first name of the person the appointment is for.",
    "- If someone is calling on behalf of another person (e.g. \"Alex calling for Sam\"), booking_name is Sam (the booking person).",
    "- Map apartment/home/house context to unit_class = residential.",
    "- Map clinic/office/store/cafe workplace kitchens to unit_class = commercial when that context is clear.",
    "- If commercial context is not clear, use unit_class = residential for ordinary home appliances.",
    "- `other_type` is allowed for unsupported concrete unit types.",
    "- If unit_type = other_type, call `service_check` once with that type, then stop with the appropriate unserviceable/stop outcome (skip slot fetch).",
    "- Treat a slot as valid only when start_time is strictly after current_local_datetime.",
    "- Call `book_slot` only for a strictly future valid slot.",
    "- If no valid future slot remains, stop with final_status = stopped_no_valid_future_slots (skip booking).",
    "- When multiple valid future slots exist, choose the earliest by start_time (then include its slot_id).",
  ].join("\n");
}

/** Same operational content; negative framing. */
function rulesNegative() {
  return [
    "Rules:",
    "- Do not invent extraction enum strings outside the locked lists.",
    "- Never use empty string for unknown values; do not omit unknowns — use literal `unknown`.",
    "- Never set booking_name to a title, full name, or placeholder when a first name is available.",
    "- Never set booking_name to the caller when they are calling on behalf of another person (e.g. do not book Alex when \"Alex calling for Sam\" — do not ignore Sam).",
    "- Do not map ordinary home/apartment context to commercial.",
    "- Do not invent commercial unit_class when workplace/clinic/office/store context is unclear.",
    "- Do not invent unknown unit_class for ordinary home appliances when residential is clear.",
    "- Do not invent supported unit_type labels for unsupported concrete appliances — use other_type instead of guessing.",
    "- Never call `check_slots` or `book_slot` when unit_type = other_type; do not skip the required `service_check` for other_type.",
    "- Never treat a slot with start_time <= current_local_datetime as valid.",
    "- Never call `book_slot` for a slot that is not strictly in the future.",
    "- Never call `book_slot` when no valid future slot remains; do not invent a booking.",
    "- Never choose a later valid future slot when an earlier one exists.",
  ].join("\n");
}

/** Baseline-like mixed polarity (Track 1 A1 rules). */
function rulesMixed() {
  return [
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
  ].join("\n");
}

function rulesMinimal() {
  return [
    "Rules:",
    "- booking_name = first name of the booking person (not a caller-on-behalf).",
    "- unit_class: home/apartment -> residential; clear workplace kitchen -> commercial; else residential for ordinary home appliances.",
    "- other_type: call service_check once, then stop (no check_slots / book_slot).",
    "- Valid slots: start_time > current_local_datetime only.",
    "- Book only the earliest valid future slot; if none, stop with stopped_no_valid_future_slots.",
    "- Use literal unknown (not empty string) when needed.",
  ].join("\n");
}

function rulesExhaustive() {
  return [
    "Rules (exhaustive edge-case guidance):",
    "- Use exact extraction enums listed above; never invent near-synonyms as enum values.",
    "- Never use empty string for unknown values; use literal `unknown`.",
    "- booking_name is the first name of the person the appointment is for (not a last name, not a full name).",
    "- If someone is calling on behalf of another person (e.g. \"Alex calling for Sam\", \"this is Maya booking for Jordan\"), booking_name is the booking person (Sam/Jordan), not the caller.",
    "- If the caller says \"my name is X\" and also names a different booking person, prefer the booking person for booking_name.",
    "- If only one person is named and they are clearly the customer for the job, that person is booking_name.",
    "- Map apartment/home/house/condo context to unit_class = residential.",
    "- Map clinic/office/store/cafe/restaurant workplace kitchens to unit_class = commercial when that context is clear.",
    "- If commercial context is not clear, use unit_class = residential (do not invent unknown for ordinary home appliances).",
    "- Do not flip residential/commercial based on appliance brand alone.",
    "- `other_type` is allowed for unsupported concrete unit types (e.g. wine fridge / ice machine if not in the supported list).",
    "- If unit_type = other_type, call `service_check` exactly once with that type, then stop (never call `check_slots` or `book_slot`).",
    "- For time filtering, valid slot means slot start_time is strictly greater than current_local_datetime (equal-to-now is invalid).",
    "- Never call `book_slot` for a slot that is not strictly in the future.",
    "- If no valid future slot remains after filtering, do not call `book_slot`; stop with final_status = stopped_no_valid_future_slots.",
    "- When multiple valid future slots exist, choose the earliest by start_time; break ties by keeping the earliest listed valid option and include its slot_id.",
    "- Do not book a later slot for convenience, proximity wording, or customer preference unless the earlier slots are invalid.",
    "- Do not claim booking success unless `book_slot` succeeded.",
    "- Do not call tools banned by the active task family rules below.",
    "- If required fields are missing for a tool, stop with the appropriate missing-info / family endpoint status rather than guessing.",
    "- Keep customer_response as an exact canonical string match (character-for-character among allowed responses).",
  ].join("\n");
}

function rulesOutcomeOnly() {
  return [
    "Success criteria (outcome-focused; no step checklist):",
    "- Produce correct extraction fields for the customer request.",
    "- Reach the correct family endpoint (correct final_status and fields) for this task family.",
    "- Use tools only when needed to obtain facts required for a correct outcome.",
    "- booking_name must be the booking person (not a caller-on-behalf).",
    "- Only future slots (start_time > current_local_datetime) may be selected/booked; choose the earliest valid future slot when booking/selecting.",
    "- other_type requests must be service-checked and must not proceed to slot fetch/booking.",
    "- customer_response must exactly match a canonical allowed string when required.",
  ].join("\n");
}

function rulesProcedural() {
  return [
    "Procedure checklist (follow in order when the family allows each step):",
    "1) Extract booking_name, intent, zip_code, unit_type, unit_class from the customer text.",
    "2) If this is F1_extract, return extraction JSON only and stop (no tools).",
    "3) If intent is not new_job and the family requires stopping, stop with stopped_non_new_job (no further tools).",
    "4) If required fields are missing, stop with stopped_missing_required_info (do not guess).",
    "5) Call service_check exactly once when the family requires a serviceability gate.",
    "6) If unserviceable, stop with stopped_unserviceable (do not fetch slots / book).",
    "7) If unit_type is other_type, after service_check stop (never call check_slots or book_slot).",
    "8) If the family allows slot fetch and serviceability passed, call check_slots once.",
    "9) Filter to slots with start_time > current_local_datetime only.",
    "10) If no valid future slot remains, stop with stopped_no_valid_future_slots (do not book).",
    "11) If the family stops at slots_returned, return returned_slot_ids and stop (never book_slot).",
    "12) If the family requires selection, choose the earliest valid future slot and set selected_slot_id; do not book unless the family allows booking.",
    "13) If the family requires booking, call book_slot once for that earliest valid future slot with booking_name and matching date_time.",
    "14) Only after a successful book_slot, return booking_confirmed with the matching canonical customer_response.",
    "",
    "Also:",
    "- Never use empty string for unknown values; use literal `unknown`.",
    "- If someone is calling on behalf of another person, booking_name is the booking person, not the caller.",
    "- Map home/apartment to residential; clear workplace kitchen to commercial; otherwise residential for ordinary home appliances.",
  ].join("\n");
}

function finalOutputBlock() {
  return [
    "Final output requirements:",
    "- F1_extract: return extraction fields only (no final_status, no customer_response).",
    "- F2-F6: include final_status and customer_response.",
    "- For slots_returned, include returned_slot_ids as a JSON array of strings.",
    "- For selection_complete, booking_confirmed, and booking_failed, include selected_slot_id.",
    "- Omit returned_slot_ids unless final_status is slots_returned.",
    "- Omit selected_slot_id unless final_status is selection_complete, booking_confirmed, or booking_failed.",
  ].join("\n");
}

function finalOutputBlockMinimal() {
  return [
    "Final output:",
    "- F1: extraction fields only.",
    "- F2-F6: include final_status + customer_response; add returned_slot_ids or selected_slot_id when that endpoint requires them.",
    "- Omit returned_slot_ids unless final_status is slots_returned.",
    "- Omit selected_slot_id unless final_status is selection_complete, booking_confirmed, or booking_failed.",
  ].join("\n");
}

function statusEnumBlock() {
  return [
    "final_status must be one of:",
    "stopped_non_new_job, stopped_missing_required_info, stopped_unserviceable,",
    "stopped_busy, stopped_no_valid_future_slots, ready_for_slot_fetch,",
    "slots_returned, selection_complete, booking_confirmed, booking_failed",
  ].join("\n");
}

function canonicalResponsesBlock() {
  return [
    "customer_response must exactly match one canonical response:",
    ...CANONICAL_RESPONSES.map((r) => `  - ${r}`),
  ].join("\n");
}

function antiExampleBlock() {
  return [
    "Common mistakes to avoid (from prior failure analysis):",
    "- Do not book a slot whose start_time is equal to current_local_datetime (equal-to-now is invalid; require strictly future).",
    "- Do not set booking_name to the caller when the text is \"X calling for Y\" — Y is the booking person.",
    "- Do not call check_slots after other_type; service_check then stop.",
    "- Do not skip service_check when the family/flow requires a serviceability gate.",
    "- Do not choose a later slot when an earlier valid future slot exists.",
    "- Do not invent non-canonical customer_response wording.",
  ].join("\n");
}

/** Outcome-oriented family hints (thin procedure). */
function buildOutcomeFamilyRules(taskFamily) {
  if (taskFamily === "F1_extract") {
    return [
      "Family endpoint (F1):",
      "- Success = correct extraction fields only; no tools.",
    ];
  }
  if (taskFamily === "F2_partial_flow_a") {
    return [
      "Family endpoint (F2):",
      "- Success ends at ready_for_slot_fetch after a serviceable service_check for new_job, or the correct stop status otherwise.",
      "- Do not fetch slots or book in F2.",
    ];
  }
  if (taskFamily === "F3_partial_flow_b") {
    return [
      "Family endpoint (F3):",
      "- Success ends at slots_returned with returned_slot_ids when slots are available.",
      "- Do not book in F3.",
    ];
  }
  if (taskFamily === "F4_select") {
    return [
      "Family endpoint (F4):",
      "- Success ends at selection_complete with selected_slot_id = earliest valid future slot.",
      "- Do not book in F4.",
    ];
  }
  if (taskFamily === "F5_full_flow" || taskFamily === "F6_robustness_hard_cases") {
    return [
      "Family endpoint (F5/F6):",
      "- Success ends at booking_confirmed only after a successful book_slot of the earliest valid future slot (or the correct stop/failure status).",
      "- Do not claim booking success without a successful book_slot.",
    ];
  }
  return [];
}

/** Extra-procedural family rules. */
function buildProcFamilyRules(taskFamily) {
  const base = buildFamilyRules(taskFamily);
  if (!base.length) return base;
  return [
    ...base,
    "- Obey the global procedure checklist; do not skip earlier gated steps.",
  ];
}

function familyBlock(taskFamily, style) {
  let lines;
  if (style === "S_outcome") {
    lines = buildOutcomeFamilyRules(taskFamily);
  } else if (style === "S_proc") {
    lines = buildProcFamilyRules(taskFamily);
  } else {
    lines = buildFamilyRules(taskFamily);
  }
  if (!lines.length) return "";
  return lines.join("\n");
}

/**
 * Build system prompt for a screening style ID.
 * @param {string} promptStyle
 * @param {string} taskFamily
 */
export function buildScreeningSystemPrompt(promptStyle, taskFamily) {
  const family = familyBlock(taskFamily, promptStyle);

  if (promptStyle === "S_pos") {
    return joinSections([
      introBlock(),
      "",
      extractionFieldsBlock(),
      "",
      enumListBlock(),
      "",
      rulesPositive(),
      "",
      finalOutputBlock(),
      "",
      statusEnumBlock(),
      "",
      canonicalResponsesBlock(),
      "",
      family,
      "",
    ]);
  }

  if (promptStyle === "S_neg") {
    return joinSections([
      introBlock(),
      "",
      extractionFieldsBlock(),
      "",
      enumListBlock(),
      "",
      rulesNegative(),
      "",
      finalOutputBlock(),
      "",
      statusEnumBlock(),
      "",
      canonicalResponsesBlock(),
      "",
      family,
      "",
    ]);
  }

  if (promptStyle === "S_min") {
    return joinSections([
      introBlock(),
      "",
      extractionFieldsBlock(),
      "",
      thinSchemaNoteBlock(),
      "",
      rulesMinimal(),
      "",
      finalOutputBlockMinimal(),
      "",
      "customer_response (when required) must exactly match one canonical response:",
      ...CANONICAL_RESPONSES.map((r) => `  - ${r}`),
      "",
      family,
      "",
    ]);
  }

  if (promptStyle === "S_max") {
    return joinSections([
      introBlock(),
      "",
      extractionFieldsBlock(),
      "",
      enumListBlock(),
      "",
      rulesExhaustive(),
      "",
      finalOutputBlock(),
      "",
      statusEnumBlock(),
      "",
      canonicalResponsesBlock(),
      "",
      family,
      "",
      "Additional reminders:",
      "- Re-check booking_name against caller-vs-booking-person wording before any book_slot.",
      "- Re-check slot start_time against current_local_datetime before any book_slot.",
      "- Re-check family tool bans before each tool call.",
      "",
    ]);
  }

  if (promptStyle === "S_outcome") {
    return joinSections([
      introBlock(),
      "",
      extractionFieldsBlock(),
      "",
      enumListBlock(),
      "",
      rulesOutcomeOnly(),
      "",
      finalOutputBlock(),
      "",
      statusEnumBlock(),
      "",
      canonicalResponsesBlock(),
      "",
      family,
      "",
    ]);
  }

  if (promptStyle === "S_proc") {
    return joinSections([
      introBlock(),
      "",
      extractionFieldsBlock(),
      "",
      enumListBlock(),
      "",
      rulesProcedural(),
      "",
      finalOutputBlock(),
      "",
      statusEnumBlock(),
      "",
      canonicalResponsesBlock(),
      "",
      family,
      "",
    ]);
  }

  if (promptStyle === "S_schema_thin") {
    return joinSections([
      introBlock(),
      "",
      extractionFieldsBlock(),
      "",
      thinSchemaNoteBlock(),
      "",
      // Operational policy only — no enum / status / response laundry lists.
      "Operational policy (not fully encoded by schemas):",
      "- booking_name is the first name of the person the appointment is for.",
      "- If someone is calling on behalf of another person (e.g. \"Alex calling for Sam\"), booking_name is Sam (the booking person), not the caller.",
      "- Map apartment/home/house context to unit_class = residential.",
      "- Map clinic/office/store/cafe workplace kitchens to unit_class = commercial when that context is clear.",
      "- If commercial context is not clear, use unit_class = residential (do not invent unknown for ordinary home appliances).",
      "- Normalize fridge -> refrigerator; oven/stove/range -> oven_range.",
      "- Never use empty string for unknown values; use literal `unknown`.",
      "- If unit_type = other_type, call `service_check` once with that type, then stop (never call `check_slots`).",
      "- Valid slot means start_time > current_local_datetime.",
      "- Never call `book_slot` for a non-future slot.",
      "- If no valid future slot remains, do not call `book_slot`; stop with stopped_no_valid_future_slots.",
      "- When multiple valid future slots exist, choose the earliest by start_time.",
      "",
      finalOutputBlock(),
      "",
      family,
      "",
    ]);
  }

  if (promptStyle === "S_schema_dup") {
    return joinSections([
      introBlock(),
      "",
      extractionFieldsBlock(),
      "",
      enumListBlockHeavy(),
      "",
      rulesMixed(),
      "",
      finalOutputBlock(),
      "",
      statusEnumBlock(),
      "",
      canonicalResponsesBlock(),
      "",
      family,
      "",
      "Schema restatement reminder:",
      "- Intent/unit_type/unit_class/final_status/customer_response values must stay inside the locked enums above even though schemas also enforce them.",
      "",
    ]);
  }

  if (promptStyle === "S_anti") {
    // Baseline mixed scaffold + anti-example appendix (assembled here to avoid role coupling).
    return joinSections([
      introBlock(),
      "",
      extractionFieldsBlock(),
      "",
      enumListBlock(),
      "",
      rulesMixed(),
      "",
      finalOutputBlock(),
      "",
      statusEnumBlock(),
      "",
      canonicalResponsesBlock(),
      "",
      family,
      "",
      antiExampleBlock(),
      "",
    ]);
  }

  if (promptStyle === "S_role_rich_md") {
    // Compound: markdown-structured task scaffold + voluminous persona (no workflow coaching).
    return joinSections([markdownTaskScaffold(family), ROLE_BLOCK_RICH, ""]);
  }

  if (promptStyle === "S_md_only") {
    // Format factor only: same operational content as adequate/mixed scaffold, markdown headings, no role.
    return joinSections([markdownTaskScaffold(family), ""]);
  }

  if (promptStyle === "S_role_long_plain") {
    // Long persona only: plain (non-markdown) mixed scaffold + voluminous role.
    return joinSections([
      introBlock(),
      "",
      extractionFieldsBlock(),
      "",
      enumListBlock(),
      "",
      rulesMixed(),
      "",
      finalOutputBlock(),
      "",
      statusEnumBlock(),
      "",
      canonicalResponsesBlock(),
      "",
      family,
      "",
      // Plain-text twin of ROLE_BLOCK_RICH (strip markdown heading markers for this arm).
      ROLE_BLOCK_RICH.replace(/^#{1,3}\s+/gm, "").trim(),
      "",
    ]);
  }

  if (promptStyle === "S_md_short") {
    // Markdown scaffold + Track-1 short role line only.
    return joinSections([
      markdownTaskScaffold(family),
      "## Role",
      ROLE_LINE_A2_SHORT,
      "",
    ]);
  }

  if (promptStyle === "S_role_long_pure") {
    return joinSections([
      introBlock(),
      "",
      extractionFieldsBlock(),
      "",
      enumListBlock(),
      "",
      rulesMixed(),
      "",
      finalOutputBlock(),
      "",
      statusEnumBlock(),
      "",
      canonicalResponsesBlock(),
      "",
      family,
      "",
      ROLE_BLOCK_RICH_PURE,
      "",
    ]);
  }

  throw new Error(`Unknown screening prompt style: ${promptStyle}`);
}
