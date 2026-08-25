export const DEFAULT_BUNDLE_PATH =
  "RESEARCH/benchmark_pack_v1/micro_pilot/micro_pilot_bundle_v1.json";
export const DEFAULT_OUT_DIR = "RESEARCH/benchmark_pack_v1/runs";
/** Track 1 v1 default: OpenAI only (`protocol_lock_v1.md`). */
export const DEFAULT_MODELS = [{ provider: "openai", model: "gpt-5.6-luna" }];

/** Short / alternate OpenAI model ids accepted by the CLI. */
export const OPENAI_MODEL_ALIASES = {
  "5.6-luna": "gpt-5.6-luna",
  "gpt-5.6-luna": "gpt-5.6-luna",
  nano: "gpt-5-nano",
  "5-nano": "gpt-5-nano",
  "gpt-5-nano": "gpt-5-nano",
  "5.4-nano": "gpt-5.4-nano",
  "gpt-5.4-nano": "gpt-5.4-nano",
  "4.1-nano": "gpt-4.1-nano",
  "gpt-4.1-nano": "gpt-4.1-nano",
  "4.1-mini": "gpt-4.1-mini",
  "gpt-4.1-mini": "gpt-4.1-mini",
  "5-mini": "gpt-5-mini",
  "gpt-5-mini": "gpt-5-mini",
  "5.4-mini": "gpt-5.4-mini",
  "gpt-5.4-mini": "gpt-5.4-mini",
};

/** Short / alternate Gemini model ids accepted by the CLI. */
export const GEMINI_MODEL_ALIASES = {
  "3.5-flash-lite": "gemini-3.5-flash-lite",
  "gemini-3.5-flash-lite": "gemini-3.5-flash-lite",
  "3.6-flash": "gemini-3.6-flash",
  "gemini-3.6-flash": "gemini-3.6-flash",
};

export const DEFAULT_PROMPT_STYLES = ["A1_task", "A2_role", "A3_comp"];
export const DEFAULT_MODES = ["B1_instant", "B2_thinking"];
export const MAX_TURNS = 8;
export const REQUEST_TIMEOUT_MS = 45000;
export const REQUEST_RETRIES = 2;

export const EXTRACTION_KEYS = [
  "booking_name",
  "intent",
  "zip_code",
  "unit_type",
  "unit_class",
];

export const ENUM_CASE_INSENSITIVE_KEYS = new Set([
  "intent",
  "unit_type",
  "unit_class",
  "final_status",
  "customer_response",
]);

/** Map legacy CLI prompt style names to spec names for trace logging. */
export const PROMPT_STYLE_ALIASES = {
  A1_task: "A1_task_only",
  A2_role: "A2_role",
  A3_comp: "A3_role_plus_competencies",
  A1_task_only: "A1_task_only",
  A3_role_plus_competencies: "A3_role_plus_competencies",
  // Track 2 hypothesis screen (additive; does not change Track 1 A1/A2/A3)
  S_pos: "S_pos_positive_constraints",
  S_neg: "S_neg_negative_constraints",
  S_min: "S_min_minimal_density",
  S_max: "S_max_exhaustive_density",
  S_outcome: "S_outcome_only",
  S_proc: "S_proc_procedural_checklist",
  S_schema_thin: "S_schema_thin_no_enum_restatement",
  S_schema_dup: "S_schema_dup_heavy_enum_restatement",
  S_anti: "S_anti_common_mistakes_block",
  S_role_rich_md: "S_role_rich_markdown_persona",
  S_md_only: "S_md_only_markdown_scaffold",
  S_role_long_plain: "S_role_long_plain_persona",
  S_md_short: "S_md_short_role",
  S_role_long_pure: "S_role_long_pure_persona",
};

export const CANONICAL_RESPONSES = [
  "sorry, I can only help with new booking requests",
  "What is your zip code?",
  "What type of unit do you need service for?",
  "sorry, we can't service this area",
  "sorry, we can't service this unit",
  "sorry, no booking times are available right now",
  "sorry, no valid future booking times are available",
  "we can continue with scheduling",
  "available booking times were found",
  "a valid booking time is available",
  "your booking is confirmed",
  "sorry, I couldn't complete the booking",
];

/** Locked extraction / status enums (prompt + Structured Outputs / tool schemas). */
export const INTENT_ENUM = [
  "new_job",
  "reschedule",
  "cancel",
  "status_check",
  "quote_only",
  "general_question",
  "other",
  "unknown",
];

export const UNIT_TYPE_ENUM = [
  "washer",
  "dryer",
  "refrigerator",
  "dishwasher",
  "oven_range",
  "microwave",
  "other_type",
  "unknown",
];

export const UNIT_CLASS_ENUM = ["residential", "commercial", "unknown"];

export const FINAL_STATUS_ENUM = [
  "stopped_non_new_job",
  "stopped_missing_required_info",
  "stopped_unserviceable",
  "stopped_busy",
  "stopped_no_valid_future_slots",
  "ready_for_slot_fetch",
  "slots_returned",
  "selection_complete",
  "booking_confirmed",
  "booking_failed",
];
