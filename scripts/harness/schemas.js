import {
  CANONICAL_RESPONSES,
  EXTRACTION_KEYS,
  FINAL_STATUS_ENUM,
  INTENT_ENUM,
  UNIT_CLASS_ENUM,
  UNIT_TYPE_ENUM,
} from "./constants.js";

const zipProp = {
  type: "string",
  description: "Customer service ZIP code for the requested job.",
};

const unitTypeProp = {
  type: "string",
  enum: UNIT_TYPE_ENUM,
  description:
    "Normalized unit type; use other_type only for concrete unsupported unit types.",
};

const unitClassProp = {
  type: "string",
  enum: UNIT_CLASS_ENUM,
  description: "Residential or commercial classification of the requested job.",
};

const TOOL_DEFINITIONS = {
  service_check: {
    tool_name: "service_check",
    description:
      "Check whether the requested zip, unit type, and unit class are serviceable.",
    parameters: {
      type: "object",
      properties: {
        zip_code: zipProp,
        unit_type: unitTypeProp,
        unit_class: unitClassProp,
      },
      required: ["zip_code", "unit_type", "unit_class"],
      additionalProperties: false,
    },
  },
  check_slots: {
    tool_name: "check_slots",
    description: "Fetch available booking slots for a serviceable request.",
    parameters: {
      type: "object",
      properties: {
        zip_code: { ...zipProp, description: "Customer service ZIP code." },
        unit_type: {
          ...unitTypeProp,
          description: "Normalized supported unit type used for slot lookup.",
        },
        unit_class: {
          ...unitClassProp,
          description: "Residential or commercial classification.",
        },
      },
      required: ["zip_code", "unit_type", "unit_class"],
      additionalProperties: false,
    },
  },
  book_slot: {
    tool_name: "book_slot",
    description: "Book the selected valid future slot.",
    parameters: {
      type: "object",
      properties: {
        booking_name: {
          type: "string",
          description:
            "First name of the person the appointment should be booked under.",
        },
        slot_id: {
          type: "string",
          description: "Exact ID of the selected valid future slot.",
        },
        date_time: {
          type: "string",
          description: "Exact ISO 8601 start time of the selected slot.",
        },
      },
      required: ["booking_name", "slot_id", "date_time"],
      additionalProperties: false,
    },
  },
};

export function buildToolSchemas(availableTools) {
  const tools = Array.isArray(availableTools) ? availableTools : [];
  return tools
    .filter((name) => TOOL_DEFINITIONS[name])
    .map((name) => ({ ...TOOL_DEFINITIONS[name] }));
}

function extractionProperties() {
  return {
    booking_name: {
      type: "string",
      description: "First name only for the person to book under.",
    },
    intent: {
      type: "string",
      enum: INTENT_ENUM,
      description: "Locked intent enum.",
    },
    zip_code: {
      type: "string",
      description: "ZIP code string, or literal unknown.",
    },
    unit_type: {
      type: "string",
      enum: UNIT_TYPE_ENUM,
      description: "Locked unit_type enum.",
    },
    unit_class: {
      type: "string",
      enum: UNIT_CLASS_ENUM,
      description: "Locked unit_class enum.",
    },
  };
}

/**
 * OpenAI Responses Structured Outputs schema for the final JSON answer.
 * Optional family fields use nullable anyOf so strict schemas stay valid.
 */
export function buildFinalOutputJsonSchema(taskFamily) {
  const properties = {
    ...extractionProperties(),
  };
  const required = [...EXTRACTION_KEYS];

  if (taskFamily !== "F1_extract") {
    properties.final_status = {
      type: "string",
      enum: FINAL_STATUS_ENUM,
      description: "Locked final_status enum for F2-F6.",
    };
    properties.customer_response = {
      type: "string",
      enum: [...CANONICAL_RESPONSES],
      description: "Must exactly match one canonical customer response.",
    };
    // Nullable optionals required by OpenAI strict Structured Outputs.
    properties.returned_slot_ids = {
      anyOf: [
        { type: "array", items: { type: "string" } },
        { type: "null" },
      ],
      description: "Slot IDs when final_status is slots_returned; else null.",
    };
    properties.selected_slot_id = {
      anyOf: [{ type: "string" }, { type: "null" }],
      description:
        "Selected slot id for selection/booking outcomes; else null.",
    };
    required.push(
      "final_status",
      "customer_response",
      "returned_slot_ids",
      "selected_slot_id"
    );
  }

  return {
    type: "object",
    properties,
    required,
    additionalProperties: false,
  };
}

export function validateFamilySchema(parsed, taskFamily) {
  if (!parsed || typeof parsed !== "object") {
    return { valid: false, errors: ["top_level_not_object"] };
  }

  const errors = [];
  const allowedFields = new Set(EXTRACTION_KEYS);
  for (const key of EXTRACTION_KEYS) {
    if (typeof parsed[key] !== "string") {
      errors.push(`bad_extraction_${key}`);
    }
  }

  if (taskFamily === "F1_extract") {
    rejectUnexpectedFields(parsed, allowedFields, errors);
    return { valid: errors.length === 0, errors };
  }

  allowedFields.add("final_status");
  allowedFields.add("customer_response");

  if (typeof parsed.final_status !== "string") {
    errors.push("missing_final_status");
  }
  if (typeof parsed.customer_response !== "string") {
    errors.push("missing_customer_response");
  }

  if (parsed.final_status === "slots_returned") {
    allowedFields.add("returned_slot_ids");
    if (!Array.isArray(parsed.returned_slot_ids)) {
      errors.push("missing_returned_slot_ids_array");
    }
  } else if (parsed.returned_slot_ids !== undefined) {
    errors.push("unexpected_returned_slot_ids");
  }

  const needsSelectedSlot =
    (taskFamily === "F4_select" && parsed.final_status === "selection_complete") ||
    ((taskFamily === "F5_full_flow" || taskFamily === "F6_robustness_hard_cases") &&
      (parsed.final_status === "booking_confirmed" ||
        parsed.final_status === "booking_failed"));

  if (needsSelectedSlot && typeof parsed.selected_slot_id !== "string") {
    errors.push("missing_selected_slot_id");
  }
  if (needsSelectedSlot) {
    allowedFields.add("selected_slot_id");
  } else if (parsed.selected_slot_id !== undefined) {
    errors.push("unexpected_selected_slot_id");
  }

  rejectUnexpectedFields(parsed, allowedFields, errors);
  return { valid: errors.length === 0, errors };
}

function rejectUnexpectedFields(parsed, allowedFields, errors) {
  for (const key of Object.keys(parsed)) {
    if (!allowedFields.has(key)) {
      errors.push(`unexpected_field_${key}`);
    }
  }
}

export function flattenSemanticOutput(parsed) {
  if (!parsed || typeof parsed !== "object") return {};
  return { ...parsed };
}
