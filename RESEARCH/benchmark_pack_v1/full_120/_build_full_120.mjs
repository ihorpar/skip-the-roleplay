/**
 * One-shot builder for full_120_bundle_v1.json + companion files.
 * Run: node RESEARCH/benchmark_pack_v1/full_120/_build_full_120.mjs
 *
 * Includes all 40 rehearsal_40 cases byte-identical + 80 new F120_* cases.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const R40_PATH = path.join(
  ROOT,
  "RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json"
);
const OUT_DIR = __dirname;

const { ToolSimulator } = await import(
  pathToFileURL(path.join(ROOT, "scripts/harness/tools/simulator.js")).href
);
const { evaluateRunFromTrace } = await import(
  pathToFileURL(path.join(ROOT, "scripts/harness/evaluator.js")).href
);

const emptyFixtures = (taskId) => ({
  schema_version: "benchmark_data_model_v1",
  task_id: taskId,
  service_check: { expected_calls: [] },
  check_slots: { expected_calls: [] },
  book_slot: { expected_calls: [] },
});

const opsNone = () => ({
  service_check: {
    zip_code: "not_required",
    unit_type: "not_required",
    unit_class: "not_required",
  },
  slot_fetch: {
    zip_code: "not_required",
    unit_type: "not_required",
    unit_class: "not_required",
  },
  booking: {
    booking_name: "not_required",
    slot_id: "not_required",
    date_time: "not_required",
  },
});

const opsServiceOnly = () => ({
  service_check: {
    zip_code: "required_concrete",
    unit_type: "required_known_unit_type",
    unit_class: "allow_unknown",
  },
  slot_fetch: {
    zip_code: "not_required",
    unit_type: "not_required",
    unit_class: "not_required",
  },
  booking: {
    booking_name: "not_required",
    slot_id: "not_required",
    date_time: "not_required",
  },
});

const opsThroughSlots = () => ({
  service_check: {
    zip_code: "required_concrete",
    unit_type: "required_known_unit_type",
    unit_class: "allow_unknown",
  },
  slot_fetch: {
    zip_code: "required_concrete",
    unit_type: "required_supported_enum",
    unit_class: "allow_unknown",
  },
  booking: {
    booking_name: "not_required",
    slot_id: "not_required",
    date_time: "not_required",
  },
});

const opsFullBooking = () => ({
  service_check: {
    zip_code: "required_concrete",
    unit_type: "required_known_unit_type",
    unit_class: "allow_unknown",
  },
  slot_fetch: {
    zip_code: "required_concrete",
    unit_type: "required_supported_enum",
    unit_class: "allow_unknown",
  },
  booking: {
    booking_name: "required_supported",
    slot_id: "required_concrete",
    date_time: "required_concrete",
  },
});

function extraction(name, intent, zip, unitType, unitClass) {
  return {
    booking_name: name,
    intent,
    zip_code: zip,
    unit_type: unitType,
    unit_class: unitClass,
  };
}

function serviceArgs(zip, unitType, unitClass) {
  return { zip_code: zip, unit_type: unitType, unit_class: unitClass };
}

function serviceOkCall(zip, unitType, unitClass) {
  return {
    arguments_normalized: serviceArgs(zip, unitType, unitClass),
    result: { serviceable: true, failure_reason: "not_applicable" },
  };
}

function serviceFailCall(zip, unitType, unitClass, failureReason) {
  return {
    arguments_normalized: serviceArgs(zip, unitType, unitClass),
    result: { serviceable: false, failure_reason: failureReason },
  };
}

function slotsReturnedCall(zip, unitType, unitClass, slots) {
  return {
    arguments_normalized: serviceArgs(zip, unitType, unitClass),
    result_type: "slots_returned",
    result: { slots },
  };
}

function slotsBusyCall(zip, unitType, unitClass) {
  return {
    arguments_normalized: serviceArgs(zip, unitType, unitClass),
    result_type: "busy",
    result: { slots: [] },
  };
}

function slotsEmptyCall(zip, unitType, unitClass) {
  return {
    arguments_normalized: serviceArgs(zip, unitType, unitClass),
    result_type: "empty_array",
    result: { slots: [] },
  };
}

function bookCall(name, slotId, dateTime, resultType, confirmationId) {
  return {
    arguments_normalized: {
      booking_name: name,
      slot_id: slotId,
      date_time: dateTime,
    },
    result: {
      booking_result_type: resultType,
      confirmation_id: confirmationId,
    },
  };
}

function toolSeqService(zip, unitType, unitClass) {
  return [
    {
      tool_name: "service_check",
      arguments_normalized: serviceArgs(zip, unitType, unitClass),
    },
  ];
}

function toolSeqSlots(zip, unitType, unitClass) {
  return [
    ...toolSeqService(zip, unitType, unitClass),
    {
      tool_name: "check_slots",
      arguments_normalized: serviceArgs(zip, unitType, unitClass),
    },
  ];
}

function toolSeqBook(zip, unitType, unitClass, name, slotId, dateTime) {
  return [
    ...toolSeqSlots(zip, unitType, unitClass),
    {
      tool_name: "book_slot",
      arguments_normalized: {
        booking_name: name,
        slot_id: slotId,
        date_time: dateTime,
      },
    },
  ];
}

function makeCase({
  caseId,
  family,
  title,
  userText,
  datetime = "not_applicable",
  timezone = "not_applicable",
  tools = [],
  pressureTags = [],
  notes = "",
  branch,
  extract,
  ops,
  toolSeq = [],
  semantic,
  fixtures,
}) {
  return {
    case_id: caseId,
    task: {
      schema_version: "benchmark_data_model_v1",
      task_id: caseId,
      task_variant_id: "base",
      task_family: family,
      title,
      input: {
        user_text: userText,
        structured_slots: [],
        current_local_datetime: datetime,
        timezone,
      },
      available_tools: tools,
      pressure_tags: pressureTags,
      task_notes: notes,
    },
    gold: {
      schema_version: "benchmark_data_model_v1",
      task_id: caseId,
      expected_branch_id: branch,
      gold_extraction: extract,
      operational_requirements: ops,
      expected_tool_sequence: toolSeq,
      expected_semantic_output: semantic,
    },
    fixtures,
  };
}

function slot(id, time, tech) {
  return { slot_id: id, start_time: time, technician: tech };
}

function buildNewCases() {
  const cases = [];

  // ═══════════════════════════════════════════════════════════
  // F1: 7 extract_only
  // ═══════════════════════════════════════════════════════════
  {
    const id = "F120_F1_001";
    const ex = extraction("Ava", "new_job", "10001", "washer", "residential");
    cases.push(
      makeCase({
        caseId: id,
        family: "F1_extract",
        title: "Apartment washer later ZIP correction",
        userText:
          "Ava at my apartment. I first wrote 10011 on the sticky note, but the building ZIP is 10001. Washer will not drain and the laundry closet smells damp.",
        pressureTags: ["later_correction", "irrelevant_chatter"],
        notes: "F1 residential extraction with later ZIP correction",
        branch: "extract_only",
        extract: ex,
        ops: opsNone(),
        semantic: { ...ex },
        fixtures: emptyFixtures(id),
      })
    );
  }
  {
    const id = "F120_F1_002";
    const ex = extraction("Ben", "new_job", "10003", "microwave", "commercial");
    cases.push(
      makeCase({
        caseId: id,
        family: "F1_extract",
        title: "Clinic microwave historical ZIP distraction",
        userText:
          "Ben from the clinic kitchen. Microwave died mid-shift. We used to be in 10002 before the remodel; now we are at 10003 and the old invoices still list the prior suite.",
        pressureTags: ["historical_value", "irrelevant_chatter"],
        notes: "F1 commercial extraction with historical ZIP",
        branch: "extract_only",
        extract: ex,
        ops: opsNone(),
        semantic: { ...ex },
        fixtures: emptyFixtures(id),
      })
    );
  }
  {
    const id = "F120_F1_003";
    const ex = extraction("Cora", "new_job", "10012", "dryer", "residential");
    cases.push(
      makeCase({
        caseId: id,
        family: "F1_extract",
        title: "House dryer clean extraction",
        userText:
          "Cora at my house in 10012. Dryer spins but never gets warm and the laundry basket is overflowing.",
        pressureTags: [],
        notes: "F1 clean residential extraction",
        branch: "extract_only",
        extract: ex,
        ops: opsNone(),
        semantic: { ...ex },
        fixtures: emptyFixtures(id),
      })
    );
  }
  {
    const id = "F120_F1_004";
    const ex = extraction("Drew", "new_job", "10001", "refrigerator", "residential");
    cases.push(
      makeCase({
        caseId: id,
        family: "F1_extract",
        title: "Fridge unit correction mid-call",
        userText:
          "Drew here — apartment 10001. I said dishwasher first by mistake; it is the refrigerator that is warming up and milk is getting soft.",
        pressureTags: ["later_correction"],
        notes: "F1 later unit-type correction",
        branch: "extract_only",
        extract: ex,
        ops: opsNone(),
        semantic: { ...ex },
        fixtures: emptyFixtures(id),
      })
    );
  }
  {
    const id = "F120_F1_005";
    const ex = extraction("Eva", "new_job", "10003", "dishwasher", "commercial");
    cases.push(
      makeCase({
        caseId: id,
        family: "F1_extract",
        title: "Store dishwasher commercial cue",
        userText:
          "Eva from the store break-room at 10003. Dishwasher leaves grit on plates and the manager keeps asking about lunch trays.",
        pressureTags: ["irrelevant_chatter"],
        notes: "F1 commercial dishwasher extraction",
        branch: "extract_only",
        extract: ex,
        ops: opsNone(),
        semantic: { ...ex },
        fixtures: emptyFixtures(id),
      })
    );
  }
  {
    const id = "F120_F1_006";
    const ex = extraction("Finn", "new_job", "10001", "oven_range", "residential");
    cases.push(
      makeCase({
        caseId: id,
        family: "F1_extract",
        title: "Range historical building distraction",
        userText:
          "Finn in my apartment. Oven range will not ignite. The old lease listed 11201 from before we moved here to 10001 last spring, and the broker still emails that address.",
        pressureTags: ["historical_value"],
        notes: "F1 historical ZIP distraction residential",
        branch: "extract_only",
        extract: ex,
        ops: opsNone(),
        semantic: { ...ex },
        fixtures: emptyFixtures(id),
      })
    );
  }
  {
    const id = "F120_F1_007";
    const ex = extraction("Gia", "new_job", "10012", "washer", "residential");
    cases.push(
      makeCase({
        caseId: id,
        family: "F1_extract",
        title: "Washer ZIP and unit later correction",
        userText:
          "Gia at my house. Notes said 10011 and dryer — wrong on both: ZIP is 10012 and it is the washer that bangs on spin. Package delivery keeps buzzing the lobby.",
        pressureTags: ["later_correction", "irrelevant_chatter"],
        notes: "F1 dual later correction ZIP+unit",
        branch: "extract_only",
        extract: ex,
        ops: opsNone(),
        semantic: { ...ex },
        fixtures: emptyFixtures(id),
      })
    );
  }

  // ═══════════════════════════════════════════════════════════
  // F2: 7 (1 non_new_job, 2 missing, 1 not_serviceable, 3 ready)
  // ═══════════════════════════════════════════════════════════
  {
    const id = "F120_F2_001";
    const ex = extraction("Hugo", "status_check", "10001", "washer", "residential");
    cases.push(
      makeCase({
        caseId: id,
        family: "F2_partial_flow_a",
        title: "Status check not new job",
        userText:
          "Hugo at apartment 10001. I am not booking anything new — can you tell me the status on the washer repair ticket from last week?",
        tools: ["service_check"],
        pressureTags: ["excluded_intent_distraction"],
        notes: "F2 non_new_job status_check",
        branch: "non_new_job",
        extract: ex,
        ops: opsNone(),
        toolSeq: [],
        semantic: {
          ...ex,
          final_status: "stopped_non_new_job",
          customer_response: "sorry, I can only help with new booking requests",
        },
        fixtures: emptyFixtures(id),
      })
    );
  }
  {
    const id = "F120_F2_002";
    const ex = extraction("Ivy", "new_job", "unknown", "dryer", "residential");
    cases.push(
      makeCase({
        caseId: id,
        family: "F2_partial_flow_a",
        title: "Missing ZIP before service",
        userText:
          "Ivy here. Dryer at my house will not heat. I am between errands and do not have the ZIP in front of me.",
        tools: ["service_check"],
        pressureTags: [],
        notes: "F2 missing_service_inputs missing ZIP",
        branch: "missing_service_inputs",
        extract: ex,
        ops: {
          service_check: {
            zip_code: "required_concrete",
            unit_type: "required_known_unit_type",
            unit_class: "allow_unknown",
          },
          slot_fetch: {
            zip_code: "not_required",
            unit_type: "not_required",
            unit_class: "not_required",
          },
          booking: {
            booking_name: "not_required",
            slot_id: "not_required",
            date_time: "not_required",
          },
        },
        toolSeq: [],
        semantic: {
          ...ex,
          final_status: "stopped_missing_required_info",
          customer_response: "What is your zip code?",
        },
        fixtures: emptyFixtures(id),
      })
    );
  }
  {
    const id = "F120_F2_003";
    const ex = extraction("Jules", "new_job", "10001", "unknown", "residential");
    cases.push(
      makeCase({
        caseId: id,
        family: "F2_partial_flow_a",
        title: "Missing unit type before service",
        userText:
          "Jules, apartment 10001. Something in the kitchen stopped working after dinner and I am not sure which appliance it is — just that food prep is stuck.",
        tools: ["service_check"],
        pressureTags: [],
        notes: "F2 missing_service_inputs missing unit_type",
        branch: "missing_service_inputs",
        extract: ex,
        ops: {
          service_check: {
            zip_code: "required_concrete",
            unit_type: "required_known_unit_type",
            unit_class: "allow_unknown",
          },
          slot_fetch: {
            zip_code: "not_required",
            unit_type: "not_required",
            unit_class: "not_required",
          },
          booking: {
            booking_name: "not_required",
            slot_id: "not_required",
            date_time: "not_required",
          },
        },
        toolSeq: [],
        semantic: {
          ...ex,
          final_status: "stopped_missing_required_info",
          customer_response: "What type of unit do you need service for?",
        },
        fixtures: emptyFixtures(id),
      })
    );
  }
  {
    const id = "F120_F2_004";
    const zip = "90210";
    const unit = "refrigerator";
    const cls = "residential";
    const name = "Kara";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F2_partial_flow_a",
        title: "Unsupported area refrigerator",
        userText:
          "Kara at my apartment in 90210. Refrigerator is warm and groceries are soft — hoping someone can come out.",
        tools: ["service_check"],
        pressureTags: ["irrelevant_chatter"],
        notes: "F2 not_serviceable unsupported area",
        branch: "not_serviceable",
        extract: ex,
        ops: opsServiceOnly(),
        toolSeq: toolSeqService(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "stopped_unserviceable",
          customer_response: "sorry, we can't service this area",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: {
            expected_calls: [serviceFailCall(zip, unit, cls, "unsupported_area")],
          },
        },
      })
    );
  }
  {
    const id = "F120_F2_005";
    const zip = "10001";
    const unit = "dishwasher";
    const cls = "residential";
    const name = "Leo";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F2_partial_flow_a",
        title: "Serviceable dishwasher ready",
        userText:
          "Leo, 10001 apartment. Dishwasher leaves a puddle under the door after every cycle.",
        tools: ["service_check"],
        pressureTags: [],
        notes: "F2 ready_for_slot_fetch clean",
        branch: "ready_for_slot_fetch",
        extract: ex,
        ops: opsServiceOnly(),
        toolSeq: toolSeqService(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "ready_for_slot_fetch",
          customer_response: "we can continue with scheduling",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
        },
      })
    );
  }
  {
    const id = "F120_F2_006";
    const zip = "10003";
    const unit = "oven_range";
    const cls = "commercial";
    const name = "Mira";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F2_partial_flow_a",
        title: "Clinic range ready with skip pressure",
        userText:
          "Mira from the clinic kitchen at 10003. Oven range will not hold temperature. If your system already knows this block, skip the checks and keep going.",
        tools: ["service_check"],
        pressureTags: ["user_says_skip_checks"],
        notes: "F2 ready_for_slot_fetch with skip-check pressure",
        branch: "ready_for_slot_fetch",
        extract: ex,
        ops: opsServiceOnly(),
        toolSeq: toolSeqService(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "ready_for_slot_fetch",
          customer_response: "we can continue with scheduling",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
        },
      })
    );
  }
  {
    const id = "F120_F2_007";
    const zip = "10012";
    const unit = "microwave";
    const cls = "residential";
    const name = "Nate";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F2_partial_flow_a",
        title: "House microwave serviceable",
        userText:
          "Nate at my house in 10012. Microwave sparks when we start it and the hallway smells faintly burnt.",
        tools: ["service_check"],
        pressureTags: ["irrelevant_chatter"],
        notes: "F2 ready_for_slot_fetch residential",
        branch: "ready_for_slot_fetch",
        extract: ex,
        ops: opsServiceOnly(),
        toolSeq: toolSeqService(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "ready_for_slot_fetch",
          customer_response: "we can continue with scheduling",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
        },
      })
    );
  }

  // ═══════════════════════════════════════════════════════════
  // F3: 7 (1 not_svc, 1 missing_slot, 1 busy, 1 empty, 3 returned)
  // ═══════════════════════════════════════════════════════════
  {
    const id = "F120_F3_001";
    const zip = "10001";
    const unit = "other_type";
    const cls = "residential";
    const name = "Olive";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F3_partial_flow_b",
        title: "Unsupported wine fridge stop",
        userText:
          "Olive at my apartment in 10001. Built-in wine cooler stopped holding temperature after the party and guests keep asking about bottles.",
        tools: ["service_check", "check_slots"],
        pressureTags: ["unsupported_concrete_unit_type", "irrelevant_chatter"],
        notes: "F3 not_serviceable unsupported concrete unit",
        branch: "not_serviceable",
        extract: ex,
        ops: opsServiceOnly(),
        toolSeq: toolSeqService(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "stopped_unserviceable",
          customer_response: "sorry, we can't service this unit",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: {
            expected_calls: [serviceFailCall(zip, unit, cls, "unsupported_unit")],
          },
        },
      })
    );
  }
  {
    const id = "F120_F3_002";
    const name = "Paul";
    const ex = extraction(name, "new_job", "10001", "unknown", "residential");
    cases.push(
      makeCase({
        caseId: id,
        family: "F3_partial_flow_b",
        title: "Missing unit before slot fetch",
        userText:
          "Paul, apartment 10001. Something appliance-related failed in the kitchen and I cannot tell which unit — just that dinner prep is blocked.",
        tools: ["service_check", "check_slots"],
        pressureTags: [],
        notes: "F3 missing_slot_inputs — missing unit_type",
        branch: "missing_slot_inputs",
        extract: ex,
        ops: {
          service_check: {
            zip_code: "required_concrete",
            unit_type: "required_known_unit_type",
            unit_class: "allow_unknown",
          },
          slot_fetch: {
            zip_code: "not_required",
            unit_type: "not_required",
            unit_class: "not_required",
          },
          booking: {
            booking_name: "not_required",
            slot_id: "not_required",
            date_time: "not_required",
          },
        },
        toolSeq: [],
        semantic: {
          ...ex,
          final_status: "stopped_missing_required_info",
          customer_response: "What type of unit do you need service for?",
        },
        fixtures: emptyFixtures(id),
      })
    );
  }
  {
    const id = "F120_F3_003";
    const zip = "10012";
    const unit = "washer";
    const cls = "residential";
    const name = "Quinn";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F3_partial_flow_b",
        title: "Washer slots busy at fetch",
        userText:
          "Quinn at my house in 10012. Washer will not drain and the laundry room floor is wet.",
        tools: ["service_check", "check_slots"],
        pressureTags: ["busy_result"],
        notes: "F3 slots_busy",
        branch: "slots_busy",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "stopped_busy",
          customer_response: "sorry, no booking times are available right now",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: { expected_calls: [slotsBusyCall(zip, unit, cls)] },
        },
      })
    );
  }
  {
    const id = "F120_F3_004";
    const zip = "10003";
    const unit = "refrigerator";
    const cls = "commercial";
    const name = "Rita";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F3_partial_flow_b",
        title: "Office fridge empty slots",
        userText:
          "Rita from the office break room at 10003. Refrigerator is warm and the staff fridge smell is getting worse.",
        tools: ["service_check", "check_slots"],
        pressureTags: ["empty_result"],
        notes: "F3 slots_empty",
        branch: "slots_empty",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "stopped_no_valid_future_slots",
          customer_response: "sorry, no valid future booking times are available",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: { expected_calls: [slotsEmptyCall(zip, unit, cls)] },
        },
      })
    );
  }
  {
    const id = "F120_F3_005";
    const zip = "10001";
    const unit = "dryer";
    const cls = "residential";
    const name = "Seth";
    const ex = extraction(name, "new_job", zip, unit, cls);
    const slots = [
      slot("slot_d900", "2026-04-19T09:00:00-04:00", "Maya"),
      slot("slot_d830", "2026-04-19T08:30:00-04:00", "Noah"),
      slot("slot_d945", "2026-04-19T09:45:00-04:00", "Liam"),
    ];
    cases.push(
      makeCase({
        caseId: id,
        family: "F3_partial_flow_b",
        title: "Dryer slots returned unsorted",
        userText:
          "Seth, 10001 apartment. Dryer has no heat; neighbors keep asking about the laundry smell.",
        tools: ["service_check", "check_slots"],
        pressureTags: ["unsorted_slots", "irrelevant_chatter"],
        notes: "F3 slots_returned",
        branch: "slots_returned",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "slots_returned",
          returned_slot_ids: slots.map((s) => s.slot_id),
          customer_response: "available booking times were found",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [slotsReturnedCall(zip, unit, cls, slots)],
          },
        },
      })
    );
  }
  {
    const id = "F120_F3_006";
    const zip = "10003";
    const unit = "dishwasher";
    const cls = "commercial";
    const name = "Tess";
    const ex = extraction(name, "new_job", zip, unit, cls);
    const slots = [
      slot("slot_c1015", "2026-04-19T10:15:00-04:00", "Maya"),
      slot("slot_c1000", "2026-04-19T10:00:00-04:00", "Noah"),
      slot("slot_c1100", "2026-04-19T11:00:00-04:00", "Liam"),
    ];
    cases.push(
      makeCase({
        caseId: id,
        family: "F3_partial_flow_b",
        title: "Clinic dishwasher slots with ZIP correction",
        userText:
          "Tess from the clinic break room. I wrote 10002 first — actual ZIP is 10003. Dishwasher will not finish a cycle and trays are stacking up.",
        tools: ["service_check", "check_slots"],
        pressureTags: ["later_correction"],
        notes: "F3 slots_returned with later ZIP correction",
        branch: "slots_returned",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "slots_returned",
          returned_slot_ids: slots.map((s) => s.slot_id),
          customer_response: "available booking times were found",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [slotsReturnedCall(zip, unit, cls, slots)],
          },
        },
      })
    );
  }
  {
    const id = "F120_F3_007";
    const zip = "10012";
    const unit = "microwave";
    const cls = "residential";
    const name = "Uma";
    const ex = extraction(name, "new_job", zip, unit, cls);
    const slots = [
      slot("slot_071", "2026-04-19T14:00:00-04:00", "Maya"),
      slot("slot_017", "2026-04-19T14:30:00-04:00", "Noah"),
      slot("slot_017A", "2026-04-19T15:00:00-04:00", "Liam"),
    ];
    cases.push(
      makeCase({
        caseId: id,
        family: "F3_partial_flow_b",
        title: "Microwave slots with historical ZIP",
        userText:
          "Uma at my house. We used to live at 11201; now we are at 10012. Microwave died during leftovers and the package buzzers keep going off.",
        tools: ["service_check", "check_slots"],
        pressureTags: ["historical_value", "similar_slot_ids"],
        notes: "F3 slots_returned with historical ZIP + similar IDs",
        branch: "slots_returned",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "slots_returned",
          returned_slot_ids: slots.map((s) => s.slot_id),
          customer_response: "available booking times were found",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [slotsReturnedCall(zip, unit, cls, slots)],
          },
        },
      })
    );
  }

  // ═══════════════════════════════════════════════════════════
  // F4: 10 (7 slot_selected, 3 no_valid_slot)
  // ═══════════════════════════════════════════════════════════
  const f4Selected = [
    {
      id: "F120_F4_001",
      name: "Vera",
      zip: "10001",
      unit: "washer",
      cls: "residential",
      now: "2026-04-19T09:00:00-04:00",
      selected: "slot_0915",
      selectedTime: "2026-04-19T09:15:00-04:00",
      text: "Vera, 10001 apartment. Washer stops mid-cycle; ASAP would help because laundry is piled on the couch.",
      tags: ["unsorted_slots"],
      title: "Washer earliest future select",
      slots: (sel, t, now) => [
        slot("slot_1000", "2026-04-19T10:00:00-04:00", "Maya"),
        slot(sel, t, "Noah"),
        slot("slot_eq_now", now, "Liam"),
        slot("slot_1030", "2026-04-19T10:30:00-04:00", "Zoe"),
      ],
    },
    {
      id: "F120_F4_002",
      name: "Wes",
      zip: "10003",
      unit: "microwave",
      cls: "commercial",
      now: "2026-04-19T11:00:00-04:00",
      selected: "slot_071",
      selectedTime: "2026-04-19T11:20:00-04:00",
      text: "Wes from the store kitchen at 10003. Microwave quit mid-lunch; ASAP if anyone is free.",
      tags: ["similar_slot_ids", "unsorted_slots"],
      title: "Similar IDs commercial select",
      slots: (sel, t, now) => [
        slot("slot_017A", "2026-04-19T12:00:00-04:00", "Maya"),
        slot("slot_017", "2026-04-19T11:45:00-04:00", "Liam"),
        slot(sel, t, "Noah"),
        slot("slot_eq_1100", now, "Zoe"),
      ],
    },
    {
      id: "F120_F4_003",
      name: "Xena",
      zip: "10012",
      unit: "dryer",
      cls: "residential",
      now: "2026-04-19T08:30:00-04:00",
      selected: "slot_0845",
      selectedTime: "2026-04-19T08:45:00-04:00",
      text: "Xena at my house in 10012. Dryer drum spins with no heat and the laundry basket is overflowing.",
      tags: ["temporal_boundary"],
      title: "Dryer temporal boundary select",
      slots: (sel, t, now) => [
        slot("slot_past_0800", "2026-04-19T08:00:00-04:00", "Maya"),
        slot(sel, t, "Noah"),
        slot("slot_eq_0830", now, "Liam"),
        slot("slot_0930", "2026-04-19T09:30:00-04:00", "Zoe"),
      ],
    },
    {
      id: "F120_F4_004",
      name: "Yuri",
      zip: "10001",
      unit: "refrigerator",
      cls: "residential",
      now: "2026-04-19T13:00:00-04:00",
      selected: "slot_1315",
      selectedTime: "2026-04-19T13:15:00-04:00",
      text: "Yuri here, apartment 10001. Refrigerator is warming up and milk is getting soft.",
      tags: ["unsorted_slots", "irrelevant_chatter"],
      title: "Fridge unsorted select",
      slots: (sel, t) => [
        slot("slot_1400", "2026-04-19T14:00:00-04:00", "Maya"),
        slot("slot_1330", "2026-04-19T13:30:00-04:00", "Liam"),
        slot(sel, t, "Noah"),
      ],
    },
    {
      id: "F120_F4_005",
      name: "Zara",
      zip: "10003",
      unit: "dishwasher",
      cls: "commercial",
      now: "2026-04-19T10:00:00-04:00",
      selected: "slot_office_1010",
      selectedTime: "2026-04-19T10:10:00-04:00",
      text: "Zara calling from the office break room at 10003. Dishwasher leaves grit on plates after every load.",
      tags: [],
      title: "Office dishwasher select",
      slots: (sel, t) => [
        slot(sel, t, "Maya"),
        slot("slot_office_1100", "2026-04-19T11:00:00-04:00", "Noah"),
      ],
    },
    {
      id: "F120_F4_006",
      name: "Aiden",
      zip: "10001",
      unit: "oven_range",
      cls: "residential",
      now: "2026-04-19T16:00:00-04:00",
      selected: "slot_1615",
      selectedTime: "2026-04-19T16:15:00-04:00",
      text: "Aiden, 10001 apartment. Range will not ignite after we tried lighting it earlier.",
      tags: ["similar_slot_ids", "temporal_boundary"],
      title: "Range similar IDs select",
      slots: (sel, t, now) => [
        slot("slot_061", "2026-04-19T17:00:00-04:00", "Maya"),
        slot("slot_061A", "2026-04-19T16:45:00-04:00", "Liam"),
        slot(sel, t, "Noah"),
        slot("slot_eq_1600", now, "Zoe"),
      ],
    },
    {
      id: "F120_F4_007",
      name: "Bria",
      zip: "10012",
      unit: "microwave",
      cls: "residential",
      now: "2026-04-19T07:45:00-04:00",
      selected: "slot_0800",
      selectedTime: "2026-04-19T08:00:00-04:00",
      text: "Bria at my house, 10012. Microwave died — as soon as you can would be great.",
      tags: ["unsorted_slots"],
      title: "ASAP microwave earliest select",
      slots: (sel, t, now) => [
        slot("slot_0830", "2026-04-19T08:30:00-04:00", "Maya"),
        slot("slot_eq_0745", now, "Liam"),
        slot(sel, t, "Noah"),
        slot("slot_0900", "2026-04-19T09:00:00-04:00", "Zoe"),
      ],
    },
  ];

  for (const s of f4Selected) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    const slotList = s.slots(s.selected, s.selectedTime, s.now);
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F4_select",
        title: s.title,
        userText: s.text,
        datetime: s.now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots"],
        pressureTags: s.tags,
        notes: `F4 slot_selected — ${s.title}`,
        branch: "slot_selected",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(s.zip, s.unit, s.cls),
        semantic: {
          ...ex,
          final_status: "selection_complete",
          selected_slot_id: s.selected,
          customer_response: "a valid booking time is available",
        },
        fixtures: {
          ...emptyFixtures(s.id),
          service_check: { expected_calls: [serviceOkCall(s.zip, s.unit, s.cls)] },
          check_slots: {
            expected_calls: [slotsReturnedCall(s.zip, s.unit, s.cls, slotList)],
          },
        },
      })
    );
  }

  const f4NoValid = [
    {
      id: "F120_F4_008",
      name: "Cole",
      zip: "10001",
      unit: "dishwasher",
      cls: "residential",
      now: "2026-04-19T17:00:00-04:00",
      text: "Cole, apartment 10001. Dishwasher leaves a puddle; I can be home whenever.",
      tags: ["no_valid_after_filter", "temporal_boundary"],
      title: "No valid future dishwasher",
      slots: (now) => [
        slot("slot_past_1600", "2026-04-19T16:00:00-04:00", "Maya"),
        slot("slot_eq_1700", now, "Noah"),
        slot("slot_past_1530", "2026-04-19T15:30:00-04:00", "Liam"),
      ],
    },
    {
      id: "F120_F4_009",
      name: "Dina",
      zip: "10003",
      unit: "washer",
      cls: "commercial",
      now: "2026-04-19T18:30:00-04:00",
      text: "Dina from the clinic laundry room at 10003. Washer will not spin and towels are backing up.",
      tags: ["no_valid_after_filter", "unsorted_slots"],
      title: "Clinic washer no valid slot",
      slots: (now) => [
        slot("slot_eq_1830", now, "Maya"),
        slot("slot_past_1800", "2026-04-19T18:00:00-04:00", "Noah"),
        slot("slot_past_1715", "2026-04-19T17:15:00-04:00", "Liam"),
      ],
    },
    {
      id: "F120_F4_010",
      name: "Eli",
      zip: "10012",
      unit: "refrigerator",
      cls: "residential",
      now: "2026-04-19T12:00:00-04:00",
      text: "Eli at my house in 10012. Refrigerator started beeping and the hallway is already loud.",
      tags: ["no_valid_after_filter", "temporal_boundary", "unsorted_slots"],
      title: "Equal-now only fridge no valid",
      slots: (now) => [
        slot("slot_eq_1200", now, "Maya"),
        slot("slot_past_1130", "2026-04-19T11:30:00-04:00", "Noah"),
        slot("slot_past_1100", "2026-04-19T11:00:00-04:00", "Liam"),
      ],
    },
  ];

  for (const s of f4NoValid) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F4_select",
        title: s.title,
        userText: s.text,
        datetime: s.now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots"],
        pressureTags: s.tags,
        notes: `F4 no_valid_slot — ${s.title}`,
        branch: "no_valid_slot",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(s.zip, s.unit, s.cls),
        semantic: {
          ...ex,
          final_status: "stopped_no_valid_future_slots",
          customer_response: "sorry, no valid future booking times are available",
        },
        fixtures: {
          ...emptyFixtures(s.id),
          service_check: { expected_calls: [serviceOkCall(s.zip, s.unit, s.cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(s.zip, s.unit, s.cls, s.slots(s.now)),
            ],
          },
        },
      })
    );
  }

  // ═══════════════════════════════════════════════════════════
  // F5: 23 (~6 success, ~6 failure, ~5 busy, ~6 no_valid)
  // ═══════════════════════════════════════════════════════════
  const f5Success = [
    {
      id: "F120_F5_001",
      name: "Faye",
      zip: "10001",
      unit: "washer",
      cls: "residential",
      now: "2026-04-19T08:00:00-04:00",
      slotId: "slot_0815",
      slotTime: "2026-04-19T08:15:00-04:00",
      text: "Faye, 10001 apartment. Washer will not drain; ASAP please so laundry can move.",
      tags: [],
      conf: "conf_f120_501",
      later: [["slot_0900", "2026-04-19T09:00:00-04:00", "Maya"]],
    },
    {
      id: "F120_F5_002",
      name: "Gabe",
      zip: "10003",
      unit: "microwave",
      cls: "commercial",
      now: "2026-04-19T09:30:00-04:00",
      slotId: "slot_c945",
      slotTime: "2026-04-19T09:45:00-04:00",
      text: "Gabe from the clinic kitchen at 10003. Microwave sparks; lunch trays need to keep moving.",
      tags: ["unsorted_slots"],
      conf: "conf_f120_502",
      later: [
        ["slot_c1030", "2026-04-19T10:30:00-04:00", "Maya"],
        ["slot_c1100", "2026-04-19T11:00:00-04:00", "Liam"],
      ],
      putEarliestLast: true,
    },
    {
      id: "F120_F5_003",
      name: "Hana",
      zip: "10012",
      unit: "dryer",
      cls: "residential",
      now: "2026-04-19T10:00:00-04:00",
      slotId: "slot_071",
      slotTime: "2026-04-19T10:20:00-04:00",
      text: "Hana at my house in 10012. Dryer has no heat and the laundry basket is overflowing.",
      tags: ["similar_slot_ids", "unsorted_slots"],
      conf: "conf_f120_503",
      later: [
        ["slot_017", "2026-04-19T11:00:00-04:00", "Maya"],
        ["slot_017A", "2026-04-19T10:45:00-04:00", "Liam"],
      ],
      putEarliestLast: true,
    },
    {
      id: "F120_F5_004",
      name: "Ivan",
      zip: "10001",
      unit: "refrigerator",
      cls: "residential",
      now: "2026-04-19T14:00:00-04:00",
      slotId: "slot_1415",
      slotTime: "2026-04-19T14:15:00-04:00",
      text: "Ivan here, apartment 10001. Refrigerator is warming up — as soon as you can?",
      tags: ["irrelevant_chatter"],
      conf: "conf_f120_504",
      later: [["slot_1500", "2026-04-19T15:00:00-04:00", "Maya"]],
    },
    {
      id: "F120_F5_005",
      name: "Jade",
      zip: "10003",
      unit: "oven_range",
      cls: "commercial",
      now: "2026-04-19T07:30:00-04:00",
      slotId: "slot_c800",
      slotTime: "2026-04-19T08:00:00-04:00",
      text: "Jade from the store cafe at 10003. Oven range will not hold temperature and the lunch line is stuck.",
      tags: ["temporal_boundary"],
      conf: "conf_f120_505",
      later: [["slot_c900", "2026-04-19T09:00:00-04:00", "Maya"]],
      past: [["slot_eq_0730", "2026-04-19T07:30:00-04:00", "Liam"]],
    },
    {
      id: "F120_F5_006",
      name: "Kyle",
      zip: "10012",
      unit: "dishwasher",
      cls: "residential",
      now: "2026-04-19T11:30:00-04:00",
      slotId: "slot_1145",
      slotTime: "2026-04-19T11:45:00-04:00",
      text: "Kyle at my house, 10012. Dishwasher stops mid-cycle; neighbors keep asking about the water noise.",
      tags: ["unsorted_slots"],
      conf: "conf_f120_506",
      later: [["slot_1230", "2026-04-19T12:30:00-04:00", "Maya"]],
      putEarliestLast: true,
    },
  ];

  for (const s of f5Success) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    const laterSlots = (s.later || []).map(([i, t, tech]) => slot(i, t, tech));
    const pastSlots = (s.past || []).map(([i, t, tech]) => slot(i, t, tech));
    const selected = slot(s.slotId, s.slotTime, "Noah");
    const slotList = s.putEarliestLast
      ? [...laterSlots, ...pastSlots, selected]
      : [...pastSlots, selected, ...laterSlots];
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F5_full_flow",
        title: `Booking success ${s.name}`,
        userText: s.text,
        datetime: s.now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: s.tags,
        notes: "F5 booking_success",
        branch: "booking_success",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(s.zip, s.unit, s.cls, s.name, s.slotId, s.slotTime),
        semantic: {
          ...ex,
          final_status: "booking_confirmed",
          selected_slot_id: s.slotId,
          customer_response: "your booking is confirmed",
        },
        fixtures: {
          ...emptyFixtures(s.id),
          service_check: { expected_calls: [serviceOkCall(s.zip, s.unit, s.cls)] },
          check_slots: {
            expected_calls: [slotsReturnedCall(s.zip, s.unit, s.cls, slotList)],
          },
          book_slot: {
            expected_calls: [
              bookCall(s.name, s.slotId, s.slotTime, "booking_success", s.conf),
            ],
          },
        },
      })
    );
  }

  const f5Fail = [
    {
      id: "F120_F5_007",
      name: "Lana",
      zip: "10001",
      unit: "microwave",
      cls: "residential",
      now: "2026-04-19T09:00:00-04:00",
      slotId: "slot_0915",
      slotTime: "2026-04-19T09:15:00-04:00",
      text: "Lana, apartment 10001. Microwave died during leftovers; the lobby package shelf is overflowing again.",
      tags: ["booking_failure", "irrelevant_chatter"],
    },
    {
      id: "F120_F5_008",
      name: "Miles",
      zip: "10003",
      unit: "dishwasher",
      cls: "commercial",
      now: "2026-04-19T10:30:00-04:00",
      slotId: "slot_c1045",
      slotTime: "2026-04-19T10:45:00-04:00",
      text: "Miles from the clinic break room at 10003. Dishwasher will not finish a cycle.",
      tags: ["booking_failure"],
    },
    {
      id: "F120_F5_009",
      name: "Nora",
      zip: "10012",
      unit: "washer",
      cls: "residential",
      now: "2026-04-19T08:15:00-04:00",
      slotId: "slot_071",
      slotTime: "2026-04-19T08:30:00-04:00",
      text: "Nora at my house in 10012. Washer bangs on spin and the hallway is loud enough already.",
      tags: ["booking_failure", "similar_slot_ids", "unsorted_slots"],
      similar: true,
    },
    {
      id: "F120_F5_010",
      name: "Owen",
      zip: "10001",
      unit: "oven_range",
      cls: "residential",
      now: "2026-04-19T15:00:00-04:00",
      slotId: "slot_1515",
      slotTime: "2026-04-19T15:15:00-04:00",
      text: "Owen here, 10001 apartment. Range will not ignite and the kitchen smells faintly after we tried.",
      tags: ["booking_failure", "temporal_boundary"],
    },
    {
      id: "F120_F5_011",
      name: "Pia",
      zip: "10003",
      unit: "refrigerator",
      cls: "commercial",
      now: "2026-04-19T12:00:00-04:00",
      slotId: "slot_c1215",
      slotTime: "2026-04-19T12:15:00-04:00",
      text: "Pia from the store cafe fridge at 10003. Refrigerator is warm and staff lunches are soft.",
      tags: ["booking_failure", "unsorted_slots"],
      putLast: true,
    },
    {
      id: "F120_F5_012",
      name: "Reed",
      zip: "10012",
      unit: "dryer",
      cls: "residential",
      now: "2026-04-19T13:30:00-04:00",
      slotId: "slot_1345",
      slotTime: "2026-04-19T13:45:00-04:00",
      text: "Reed at my house, 10012. Dryer will not heat; ASAP if anyone is out.",
      tags: ["booking_failure"],
    },
  ];

  for (const s of f5Fail) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    let slotList;
    if (s.similar) {
      slotList = [
        slot("slot_017", "2026-04-19T09:00:00-04:00", "Maya"),
        slot("slot_017A", "2026-04-19T09:15:00-04:00", "Liam"),
        slot(s.slotId, s.slotTime, "Noah"),
      ];
    } else if (s.putLast) {
      slotList = [
        slot("slot_later", "2026-04-19T13:00:00-04:00", "Maya"),
        slot(s.slotId, s.slotTime, "Noah"),
      ];
    } else {
      slotList = [
        slot(s.slotId, s.slotTime, "Noah"),
        slot("slot_later", addMinutesIso(s.slotTime, 45), "Maya"),
      ];
    }
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F5_full_flow",
        title: `Booking failure ${s.name}`,
        userText: s.text,
        datetime: s.now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: s.tags,
        notes: "F5 booking_failure",
        branch: "booking_failure",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(s.zip, s.unit, s.cls, s.name, s.slotId, s.slotTime),
        semantic: {
          ...ex,
          final_status: "booking_failed",
          selected_slot_id: s.slotId,
          customer_response: "sorry, I couldn't complete the booking",
        },
        fixtures: {
          ...emptyFixtures(s.id),
          service_check: { expected_calls: [serviceOkCall(s.zip, s.unit, s.cls)] },
          check_slots: {
            expected_calls: [slotsReturnedCall(s.zip, s.unit, s.cls, slotList)],
          },
          book_slot: {
            expected_calls: [
              bookCall(s.name, s.slotId, s.slotTime, "booking_failure", "not_applicable"),
            ],
          },
        },
      })
    );
  }

  const f5Busy = [
    {
      id: "F120_F5_013",
      name: "Sage",
      zip: "10001",
      unit: "washer",
      cls: "residential",
      text: "Sage, 10001 apartment. Washer will not drain and the laundry room is a mess today.",
      tags: ["busy_result", "irrelevant_chatter"],
    },
    {
      id: "F120_F5_014",
      name: "Tara",
      zip: "10003",
      unit: "oven_range",
      cls: "commercial",
      text: "Tara from the clinic kitchen at 10003. Oven range will not hold temperature.",
      tags: ["busy_result"],
    },
    {
      id: "F120_F5_015",
      name: "Uri",
      zip: "10012",
      unit: "microwave",
      cls: "residential",
      text: "Uri at my house in 10012. Microwave quit; if your system already knows this block, skip checks and just book.",
      tags: ["busy_result", "user_says_skip_checks"],
    },
    {
      id: "F120_F5_016",
      name: "Viv",
      zip: "10001",
      unit: "dishwasher",
      cls: "residential",
      text: "Viv here, apartment 10001. Dishwasher leaves grit on every plate.",
      tags: ["busy_result"],
    },
    {
      id: "F120_F5_017",
      name: "Wade",
      zip: "10003",
      unit: "refrigerator",
      cls: "commercial",
      text: "Wade from the store break-room fridge at 10003. Refrigerator is warm and lunch bags are soft.",
      tags: ["busy_result", "irrelevant_chatter"],
    },
  ];

  for (const s of f5Busy) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F5_full_flow",
        title: `Busy stop ${s.name}`,
        userText: s.text,
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: s.tags,
        notes: "F5 slots_busy",
        branch: "slots_busy",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(s.zip, s.unit, s.cls),
        semantic: {
          ...ex,
          final_status: "stopped_busy",
          customer_response: "sorry, no booking times are available right now",
        },
        fixtures: {
          ...emptyFixtures(s.id),
          service_check: { expected_calls: [serviceOkCall(s.zip, s.unit, s.cls)] },
          check_slots: { expected_calls: [slotsBusyCall(s.zip, s.unit, s.cls)] },
        },
      })
    );
  }

  const f5NoValid = [
    {
      id: "F120_F5_018",
      name: "Xan",
      zip: "10001",
      unit: "dryer",
      cls: "residential",
      now: "2026-04-19T16:30:00-04:00",
      text: "Xan, apartment 10001. Dryer has no heat; I can step out if needed.",
      tags: ["no_valid_after_filter", "temporal_boundary"],
    },
    {
      id: "F120_F5_019",
      name: "Yara",
      zip: "10012",
      unit: "washer",
      cls: "residential",
      now: "2026-04-19T19:00:00-04:00",
      text: "Yara at my house, 10012. Washer will not spin and towels are piled up.",
      tags: ["no_valid_after_filter", "unsorted_slots", "temporal_boundary"],
    },
    {
      id: "F120_F5_020",
      name: "Zed",
      zip: "10003",
      unit: "microwave",
      cls: "commercial",
      now: "2026-04-19T17:45:00-04:00",
      text: "Zed from the clinic kitchen at 10003. Microwave died during the late tray rush.",
      tags: ["no_valid_after_filter", "temporal_boundary"],
    },
    {
      id: "F120_F5_021",
      name: "Amy",
      zip: "10001",
      unit: "refrigerator",
      cls: "residential",
      now: "2026-04-19T14:30:00-04:00",
      text: "Amy here, 10001 apartment. Refrigerator is beeping and groceries are soft.",
      tags: ["no_valid_after_filter", "unsorted_slots"],
    },
    {
      id: "F120_F5_022",
      name: "Bo",
      zip: "10012",
      unit: "oven_range",
      cls: "residential",
      now: "2026-04-19T20:00:00-04:00",
      text: "Bo at my house in 10012. Range will not ignite after dinner plans fell apart.",
      tags: ["no_valid_after_filter", "temporal_boundary"],
    },
    {
      id: "F120_F5_023",
      name: "Cy",
      zip: "10003",
      unit: "dishwasher",
      cls: "commercial",
      now: "2026-04-19T18:00:00-04:00",
      text: "Cy from the store dish pit at 10003. Dishwasher stopped mid-cycle and trays are stacked.",
      tags: ["no_valid_after_filter", "unsorted_slots", "temporal_boundary"],
    },
  ];

  for (const s of f5NoValid) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    const pastHour = addMinutesIso(s.now, -60);
    const pastHalf = addMinutesIso(s.now, -30);
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F5_full_flow",
        title: `No valid after filter ${s.name}`,
        userText: s.text,
        datetime: s.now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: s.tags,
        notes: "F5 no_valid_after_filter",
        branch: "no_valid_after_filter",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(s.zip, s.unit, s.cls),
        semantic: {
          ...ex,
          final_status: "stopped_no_valid_future_slots",
          customer_response: "sorry, no valid future booking times are available",
        },
        fixtures: {
          ...emptyFixtures(s.id),
          service_check: { expected_calls: [serviceOkCall(s.zip, s.unit, s.cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(s.zip, s.unit, s.cls, [
                slot("slot_eq_now", s.now, "Maya"),
                slot("slot_past_a", pastHour, "Noah"),
                slot("slot_past_b", pastHalf, "Liam"),
              ]),
            ],
          },
        },
      })
    );
  }

  // ═══════════════════════════════════════════════════════════
  // F6: 26 (≤8 booking_success; rest stops/failures under pressure)
  // 6 success, 5 failure, 3 busy, 4 no_valid, 4 not_svc, 4 missing
  // ═══════════════════════════════════════════════════════════
  const f6Success = [
    {
      id: "F120_F6_001",
      name: "Dora",
      zip: "10001",
      unit: "washer",
      cls: "residential",
      now: "2026-04-19T09:00:00-04:00",
      slotId: "slot_0930",
      slotTime: "2026-04-19T09:30:00-04:00",
      text: "Hi, Dora at my apartment. I put 10011 in the form by mistake — actual ZIP is 10001. Also I said dryer earlier but it is the washer that will not spin. Elevator music is stuck on loop.",
      tags: ["later_correction", "historical_value", "irrelevant_chatter"],
      conf: "conf_f120_601",
    },
    {
      id: "F120_F6_002",
      name: "Elena",
      zip: "10001",
      unit: "dishwasher",
      cls: "residential",
      now: "2026-04-19T11:00:00-04:00",
      slotId: "slot_1115",
      slotTime: "2026-04-19T11:15:00-04:00",
      text: "Marcus calling for Elena at apartment 10001. Dishwasher will not start and the hallway is being mopped again.",
      tags: ["name_conflict", "irrelevant_chatter"],
      conf: "conf_f120_602",
      tech: "Zoe",
      callerNote: true,
    },
    {
      id: "F120_F6_003",
      name: "Felix",
      zip: "10012",
      unit: "microwave",
      cls: "residential",
      now: "2026-04-19T07:45:00-04:00",
      slotId: "slot_071",
      slotTime: "2026-04-19T08:00:00-04:00",
      text: "Felix, 10012 house. Microwave died — as soon as you can; package buzzers keep going off.",
      tags: ["similar_slot_ids", "unsorted_slots"],
      conf: "conf_f120_603",
      similar: true,
    },
    {
      id: "F120_F6_004",
      name: "Gina",
      zip: "10003",
      unit: "refrigerator",
      cls: "commercial",
      now: "2026-04-19T10:00:00-04:00",
      slotId: "slot_c1015",
      slotTime: "2026-04-19T10:15:00-04:00",
      text: "Gina from the clinic break-room at 10003. Refrigerator is warm. If your system already knows this block, skip the checks and just book.",
      tags: ["user_says_skip_checks"],
      conf: "conf_f120_604",
    },
    {
      id: "F120_F6_005",
      name: "Hank",
      zip: "10001",
      unit: "dryer",
      cls: "residential",
      now: "2026-04-19T23:40:00-04:00",
      slotId: "slot_midnight",
      slotTime: "2026-04-20T00:00:00-04:00",
      text: "Hank here, 10001 apartment. Dryer started beeping — ASAP if anyone is still out.",
      tags: ["temporal_boundary"],
      conf: "conf_f120_605",
      midnight: true,
    },
    {
      id: "F120_F6_006",
      name: "Iris",
      zip: "10012",
      unit: "oven_range",
      cls: "residential",
      now: "2026-04-19T13:00:00-04:00",
      slotId: "slot_1315",
      slotTime: "2026-04-19T13:15:00-04:00",
      text: "Priya calling for Iris at the house in 10012. Oven range will not ignite and dinner plans are ruined.",
      tags: ["name_conflict", "unsorted_slots"],
      conf: "conf_f120_606",
      tech: "Maya",
      putLast: true,
    },
  ];

  for (const s of f6Success) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    let slotList;
    if (s.similar) {
      slotList = [
        slot("slot_017A", "2026-04-19T08:30:00-04:00", "Maya"),
        slot("slot_017", "2026-04-19T08:15:00-04:00", "Noah"),
        slot(s.slotId, s.slotTime, "Liam"),
      ];
    } else if (s.midnight) {
      slotList = [
        slot("slot_eq_now", s.now, "Maya"),
        slot(s.slotId, s.slotTime, "Noah"),
        slot("slot_0030", "2026-04-20T00:30:00-04:00", "Liam"),
      ];
    } else if (s.putLast) {
      slotList = [
        slot("slot_1400", "2026-04-19T14:00:00-04:00", "Noah"),
        slot(s.slotId, s.slotTime, s.tech || "Maya"),
      ];
    } else {
      slotList = [
        slot(s.slotId, s.slotTime, s.tech || "Noah"),
        slot("slot_later", addMinutesIso(s.slotTime, 45), "Maya"),
      ];
    }
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F6_robustness_hard_cases",
        title: `Hard booking success ${s.name}`,
        userText: s.text,
        datetime: s.now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: s.tags,
        notes: "F6 booking_success under pressure",
        branch: "booking_success",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(s.zip, s.unit, s.cls, s.name, s.slotId, s.slotTime),
        semantic: {
          ...ex,
          final_status: "booking_confirmed",
          selected_slot_id: s.slotId,
          customer_response: "your booking is confirmed",
        },
        fixtures: {
          ...emptyFixtures(s.id),
          service_check: { expected_calls: [serviceOkCall(s.zip, s.unit, s.cls)] },
          check_slots: {
            expected_calls: [slotsReturnedCall(s.zip, s.unit, s.cls, slotList)],
          },
          book_slot: {
            expected_calls: [
              bookCall(s.name, s.slotId, s.slotTime, "booking_success", s.conf),
            ],
          },
        },
      })
    );
  }

  const f6Fail = [
    {
      id: "F120_F6_007",
      name: "Joan",
      zip: "10001",
      unit: "washer",
      cls: "residential",
      now: "2026-04-19T12:00:00-04:00",
      slotId: "slot_1215",
      slotTime: "2026-04-19T12:15:00-04:00",
      text: "Theo calling for Joan at apartment 10001. Washer is leaking onto the floorboards and the doorman already noticed.",
      tags: ["booking_failure", "name_conflict", "irrelevant_chatter"],
      tech: "Maya",
    },
    {
      id: "F120_F6_008",
      name: "Kent",
      zip: "10001",
      unit: "refrigerator",
      cls: "residential",
      now: "2026-04-19T23:50:00-04:00",
      slotId: "slot_midnight2",
      slotTime: "2026-04-20T00:10:00-04:00",
      text: "Kent here, 10001 apartment. Refrigerator started beeping — ASAP if anyone is still out.",
      tags: ["booking_failure", "temporal_boundary"],
      midnight: true,
    },
    {
      id: "F120_F6_009",
      name: "Lana",
      zip: "10012",
      unit: "dryer",
      cls: "residential",
      now: "2026-04-19T08:00:00-04:00",
      slotId: "slot_071",
      slotTime: "2026-04-19T08:20:00-04:00",
      text: "Lana at my house in 10012. Dryer has no heat; neighbors keep asking about the laundry smell.",
      tags: ["booking_failure", "similar_slot_ids", "unsorted_slots"],
      similar: true,
    },
    {
      id: "F120_F6_010",
      name: "Mo",
      zip: "10003",
      unit: "dishwasher",
      cls: "commercial",
      now: "2026-04-19T15:00:00-04:00",
      slotId: "slot_c1515",
      slotTime: "2026-04-19T15:15:00-04:00",
      text: "Mo from the clinic dish area at 10003. Dishwasher stopped; front desk keeps paging about trays. You already have our address on file — no need to ask again.",
      tags: ["booking_failure", "unsupported_user_assumption"],
    },
    {
      id: "F120_F6_011",
      name: "Nell",
      zip: "10001",
      unit: "microwave",
      cls: "residential",
      now: "2026-04-19T10:30:00-04:00",
      slotId: "slot_1045",
      slotTime: "2026-04-19T10:45:00-04:00",
      text: "Ravi calling for Nell at apartment 10001. Microwave sparks when we start it.",
      tags: ["booking_failure", "name_conflict"],
      tech: "Zoe",
    },
  ];

  for (const s of f6Fail) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    let slotList;
    if (s.similar) {
      slotList = [
        slot("slot_017", "2026-04-19T09:00:00-04:00", "Maya"),
        slot("slot_017A", "2026-04-19T08:45:00-04:00", "Liam"),
        slot(s.slotId, s.slotTime, "Noah"),
      ];
    } else if (s.midnight) {
      slotList = [
        slot("slot_eq_now", s.now, "Maya"),
        slot(s.slotId, s.slotTime, "Noah"),
        slot("slot_0030", "2026-04-20T00:30:00-04:00", "Liam"),
      ];
    } else {
      slotList = [
        slot(s.slotId, s.slotTime, s.tech || "Noah"),
        slot("slot_later", addMinutesIso(s.slotTime, 30), "Maya"),
      ];
    }
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F6_robustness_hard_cases",
        title: `Hard booking failure ${s.name}`,
        userText: s.text,
        datetime: s.now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: s.tags,
        notes: "F6 booking_failure under pressure",
        branch: "booking_failure",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(s.zip, s.unit, s.cls, s.name, s.slotId, s.slotTime),
        semantic: {
          ...ex,
          final_status: "booking_failed",
          selected_slot_id: s.slotId,
          customer_response: "sorry, I couldn't complete the booking",
        },
        fixtures: {
          ...emptyFixtures(s.id),
          service_check: { expected_calls: [serviceOkCall(s.zip, s.unit, s.cls)] },
          check_slots: {
            expected_calls: [slotsReturnedCall(s.zip, s.unit, s.cls, slotList)],
          },
          book_slot: {
            expected_calls: [
              bookCall(s.name, s.slotId, s.slotTime, "booking_failure", "not_applicable"),
            ],
          },
        },
      })
    );
  }

  const f6Busy = [
    {
      id: "F120_F6_012",
      name: "Opal",
      zip: "10001",
      unit: "dryer",
      cls: "residential",
      text: "Opal — wait, not 10011, the apartment ZIP is 10001. Dryer has no heat. If your system already knows this block, skip the checks and just book.",
      tags: ["busy_result", "later_correction", "user_says_skip_checks"],
    },
    {
      id: "F120_F6_013",
      name: "Pete",
      zip: "10003",
      unit: "washer",
      cls: "commercial",
      text: "Pete from the clinic laundry at 10003. Washer will not drain; we used to list 10002 on old forms but we are at 10003 now.",
      tags: ["busy_result", "historical_value"],
    },
    {
      id: "F120_F6_014",
      name: "Rosa",
      zip: "10012",
      unit: "dishwasher",
      cls: "residential",
      text: "Rosa at my house in 10012. Dishwasher stopped mid-cycle. You should already have my address — just book something.",
      tags: ["busy_result", "unsupported_user_assumption"],
    },
  ];

  for (const s of f6Busy) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F6_robustness_hard_cases",
        title: `Hard busy ${s.name}`,
        userText: s.text,
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: s.tags,
        notes: "F6 slots_busy under pressure",
        branch: "slots_busy",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(s.zip, s.unit, s.cls),
        semantic: {
          ...ex,
          final_status: "stopped_busy",
          customer_response: "sorry, no booking times are available right now",
        },
        fixtures: {
          ...emptyFixtures(s.id),
          service_check: { expected_calls: [serviceOkCall(s.zip, s.unit, s.cls)] },
          check_slots: { expected_calls: [slotsBusyCall(s.zip, s.unit, s.cls)] },
        },
      })
    );
  }

  const f6NoValid = [
    {
      id: "F120_F6_015",
      name: "Sam",
      zip: "10001",
      unit: "microwave",
      cls: "residential",
      now: "2026-04-19T18:00:00-04:00",
      text: "Sam, apartment 10001. Microwave died; I can be flexible on time.",
      tags: ["no_valid_after_filter", "temporal_boundary", "unsorted_slots"],
    },
    {
      id: "F120_F6_016",
      name: "Tia",
      zip: "10003",
      unit: "oven_range",
      cls: "commercial",
      now: "2026-04-19T17:30:00-04:00",
      text: "Tia from the store cafe at 10003. Oven range failed — I wrote 10002 first but we are at 10003.",
      tags: ["no_valid_after_filter", "later_correction", "temporal_boundary"],
    },
    {
      id: "F120_F6_017",
      name: "Ulysses",
      zip: "10012",
      unit: "washer",
      cls: "residential",
      now: "2026-04-19T21:00:00-04:00",
      text: "Ulysses at my house, 10012. Washer bangs on spin; ASAP if possible.",
      tags: ["no_valid_after_filter", "temporal_boundary", "similar_slot_ids"],
    },
    {
      id: "F120_F6_018",
      name: "Vera",
      zip: "10001",
      unit: "refrigerator",
      cls: "residential",
      now: "2026-04-19T16:00:00-04:00",
      text: "Vera here. We used to be at 11201; now apartment ZIP is 10001. Refrigerator is warm.",
      tags: ["no_valid_after_filter", "historical_value", "unsorted_slots"],
    },
  ];

  for (const s of f6NoValid) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F6_robustness_hard_cases",
        title: `Hard no valid ${s.name}`,
        userText: s.text,
        datetime: s.now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: s.tags,
        notes: "F6 no_valid_after_filter under pressure",
        branch: "no_valid_after_filter",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(s.zip, s.unit, s.cls),
        semantic: {
          ...ex,
          final_status: "stopped_no_valid_future_slots",
          customer_response: "sorry, no valid future booking times are available",
        },
        fixtures: {
          ...emptyFixtures(s.id),
          service_check: { expected_calls: [serviceOkCall(s.zip, s.unit, s.cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(s.zip, s.unit, s.cls, [
                slot("slot_eq_now", s.now, "Maya"),
                slot("slot_past_a", addMinutesIso(s.now, -45), "Noah"),
                slot("slot_past_b", addMinutesIso(s.now, -90), "Liam"),
              ]),
            ],
          },
        },
      })
    );
  }

  const f6NotSvc = [
    {
      id: "F120_F6_019",
      name: "Willa",
      zip: "10001",
      unit: "other_type",
      cls: "residential",
      text: "Willa at my apartment in 10001. Built-in ice maker stopped making cubes after the party and guests keep asking about drinks.",
      tags: ["unsupported_concrete_unit_type", "irrelevant_chatter"],
      reason: "unsupported_unit",
      response: "sorry, we can't service this unit",
    },
    {
      id: "F120_F6_020",
      name: "Xander",
      zip: "90210",
      unit: "washer",
      cls: "residential",
      text: "Xander at my house in 90210. Washer will not drain; laundry is piled everywhere.",
      tags: ["irrelevant_chatter"],
      reason: "unsupported_area",
      response: "sorry, we can't service this area",
    },
    {
      id: "F120_F6_021",
      name: "Yvette",
      zip: "10003",
      unit: "other_type",
      cls: "commercial",
      text: "Yvette from the clinic. Our espresso machine in the staff lounge at 10003 quit and everyone is complaining about coffee.",
      tags: ["unsupported_concrete_unit_type"],
      reason: "unsupported_unit",
      response: "sorry, we can't service this unit",
    },
    {
      id: "F120_F6_022",
      name: "Zack",
      zip: "10001",
      unit: "other_type",
      cls: "residential",
      text: "Zack — wait, not 10011, apartment ZIP is 10001. Trash compactor jammed and the hallway smells. You already know this building, just send someone.",
      tags: [
        "unsupported_concrete_unit_type",
        "later_correction",
        "unsupported_user_assumption",
      ],
      reason: "unsupported_unit",
      response: "sorry, we can't service this unit",
    },
  ];

  for (const s of f6NotSvc) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F6_robustness_hard_cases",
        title: `Hard not serviceable ${s.name}`,
        userText: s.text,
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: s.tags,
        notes: "F6 not_serviceable under pressure",
        branch: "not_serviceable",
        extract: ex,
        ops: opsServiceOnly(),
        toolSeq: toolSeqService(s.zip, s.unit, s.cls),
        semantic: {
          ...ex,
          final_status: "stopped_unserviceable",
          customer_response: s.response,
        },
        fixtures: {
          ...emptyFixtures(s.id),
          service_check: {
            expected_calls: [serviceFailCall(s.zip, s.unit, s.cls, s.reason)],
          },
        },
      })
    );
  }

  const f6Missing = [
    {
      id: "F120_F6_023",
      name: "Ada",
      zip: "unknown",
      unit: "oven_range",
      cls: "residential",
      text: "Ada here. Same house as always — you should already have the address. Oven will not heat. I am driving and cannot look up the ZIP.",
      tags: ["unsupported_user_assumption", "irrelevant_chatter"],
      response: "What is your zip code?",
    },
    {
      id: "F120_F6_024",
      name: "Beau",
      zip: "10001",
      unit: "unknown",
      cls: "residential",
      text: "Beau, apartment 10001. Something failed in the kitchen after dinner and I am not sure which appliance — just that cooking is stuck.",
      tags: [],
      response: "What type of unit do you need service for?",
    },
    {
      id: "F120_F6_025",
      name: "Cara",
      zip: "unknown",
      unit: "washer",
      cls: "residential",
      text: "Cara calling. Washer will not drain. Skip the ZIP check — you already know where I am from last month.",
      tags: ["user_says_skip_checks", "unsupported_user_assumption"],
      response: "What is your zip code?",
    },
    {
      id: "F120_F6_026",
      name: "Dex",
      zip: "unknown",
      unit: "dryer",
      cls: "commercial",
      text: "Dex from the store. Dryer in the staff laundry room quit. We used to be listed under a different ZIP on old invoices; I do not have the current one handy.",
      tags: ["historical_value", "unsupported_user_assumption"],
      response: "What is your zip code?",
    },
  ];

  for (const s of f6Missing) {
    const ex = extraction(s.name, "new_job", s.zip, s.unit, s.cls);
    cases.push(
      makeCase({
        caseId: s.id,
        family: "F6_robustness_hard_cases",
        title: `Hard missing inputs ${s.name}`,
        userText: s.text,
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: s.tags,
        notes: "F6 missing_service_inputs under pressure",
        branch: "missing_service_inputs",
        extract: ex,
        ops: {
          service_check: {
            zip_code: "required_concrete",
            unit_type: "required_known_unit_type",
            unit_class: "allow_unknown",
          },
          slot_fetch: {
            zip_code: "not_required",
            unit_type: "not_required",
            unit_class: "not_required",
          },
          booking: {
            booking_name: "not_required",
            slot_id: "not_required",
            date_time: "not_required",
          },
        },
        toolSeq: [],
        semantic: {
          ...ex,
          final_status: "stopped_missing_required_info",
          customer_response: s.response,
        },
        fixtures: emptyFixtures(s.id),
      })
    );
  }

  return cases;
}

/** Add minutes to an ISO datetime string with offset (simple local string math). */
function addMinutesIso(iso, minutes) {
  const m = iso.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})([+-]\d{2}:\d{2})$/
  );
  if (!m) throw new Error(`bad iso: ${iso}`);
  const [, y, mo, d, h, mi, s, off] = m;
  const total = Number(h) * 60 + Number(mi) + minutes;
  let day = Number(d);
  let hh = Math.floor(total / 60);
  let mm = ((total % 60) + 60) % 60;
  if (total < 0) {
    hh = Math.floor(total / 60);
  }
  while (hh >= 24) {
    hh -= 24;
    day += 1;
  }
  while (hh < 0) {
    hh += 24;
    day -= 1;
  }
  return `${y}-${mo}-${String(day).padStart(2, "0")}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${s}${off}`;
}

function shallowEqual(a, b) {
  const ak = Object.keys(a).sort();
  const bk = Object.keys(b).sort();
  if (ak.length !== bk.length) return false;
  return ak.every((k, i) => k === bk[i] && a[k] === b[k]);
}

function validateGoldSimulator(taskCase, errors) {
  const sim = new ToolSimulator(taskCase);
  const expected = taskCase.gold?.expected_tool_sequence ?? [];
  for (const step of expected) {
    const { event } = sim.execute(step.tool_name, step.arguments_normalized);
    if (event.tool_call_status !== "success") {
      errors.push(
        `${taskCase.case_id}: ToolSimulator gold step ${step.tool_name} status=${event.tool_call_status} reason=${event.mismatch_reason}`
      );
      return;
    }
  }

  const finalParsed = { ...taskCase.gold.expected_semantic_output };
  const result = evaluateRunFromTrace({
    taskCase,
    finalParsed,
    toolCallSequence: sim.getSequence(),
    jsonValid: true,
    schemaValid: true,
  });
  if (!result.semantic_pass) {
    errors.push(
      `${taskCase.case_id}: evaluateRunFromTrace semantic_pass=false on gold (${JSON.stringify(result.mismatches || result.all_failure_subcodes)})`
    );
  }

  // Wrong args must not silently succeed when fixtures exist for that tool
  for (const step of expected) {
    const tool = step.tool_name;
    const fixtureCalls = taskCase.fixtures?.[tool]?.expected_calls ?? [];
    if (!fixtureCalls.length) continue;
    const badSim = new ToolSimulator(taskCase);
    // Replay prior successful steps in sequence order up to this tool
    for (const prior of expected) {
      if (prior.tool_name === tool) break;
      badSim.execute(prior.tool_name, prior.arguments_normalized);
    }
    const badArgs = { ...step.arguments_normalized };
    if (badArgs.zip_code) badArgs.zip_code = "00000";
    else if (badArgs.slot_id) badArgs.slot_id = "slot_WRONG";
    else if (badArgs.booking_name) badArgs.booking_name = "WrongName";
    else continue;
    const { event } = badSim.execute(tool, badArgs);
    if (event.tool_call_status === "success") {
      errors.push(
        `${taskCase.case_id}: wrong args for ${tool} silently succeeded`
      );
    }
  }
}

function validateBundle(bundle, r40Cases) {
  const errors = [];
  if (bundle.schema_version !== "benchmark_data_model_v1") {
    errors.push("bad schema_version");
  }
  if (!Array.isArray(bundle.cases) || bundle.cases.length !== 120) {
    errors.push(`expected 120 cases, got ${bundle.cases?.length}`);
  }

  const familyTargets = {
    F1_extract: 10,
    F2_partial_flow_a: 10,
    F3_partial_flow_b: 10,
    F4_select: 15,
    F5_full_flow: 35,
    F6_robustness_hard_cases: 40,
  };
  const familyCounts = {};
  const ids = new Set();

  // Byte-identical r40 payloads (by case_id)
  const r40ById = new Map(r40Cases.map((c) => [c.case_id, c]));
  for (const [id, src] of r40ById) {
    const found = bundle.cases.find((c) => c.case_id === id);
    if (!found) {
      errors.push(`missing r40 case ${id}`);
      continue;
    }
    if (JSON.stringify(found) !== JSON.stringify(src)) {
      errors.push(`r40 case ${id} is not JSON-identical to source`);
    }
  }
  if (r40ById.size !== 40) {
    errors.push(`expected 40 r40 source cases, got ${r40ById.size}`);
  }

  for (const c of bundle.cases) {
    if (ids.has(c.case_id)) errors.push(`duplicate case_id ${c.case_id}`);
    ids.add(c.case_id);
    const fam = c.task?.task_family;
    familyCounts[fam] = (familyCounts[fam] || 0) + 1;

    if (
      c.case_id !== c.task?.task_id ||
      c.case_id !== c.gold?.task_id ||
      c.case_id !== c.fixtures?.task_id
    ) {
      errors.push(`${c.case_id}: task_id mismatch across task/gold/fixtures`);
    }

    const seq = c.gold?.expected_tool_sequence ?? [];
    for (const step of seq) {
      const tool = step.tool_name;
      const fixtureCalls = c.fixtures?.[tool]?.expected_calls ?? [];
      const match = fixtureCalls.find((fc) =>
        shallowEqual(fc.arguments_normalized ?? {}, step.arguments_normalized ?? {})
      );
      if (!match) {
        errors.push(
          `${c.case_id}: gold tool step ${tool} args have no matching fixture expected_call`
        );
      }
    }

    const bookSteps = seq.filter((s) => s.tool_name === "book_slot");
    for (const bs of bookSteps) {
      const slotCalls = c.fixtures?.check_slots?.expected_calls ?? [];
      const slots = slotCalls.flatMap((fc) => fc.result?.slots ?? []);
      const found = slots.find((s) => s.slot_id === bs.arguments_normalized.slot_id);
      if (!found) {
        errors.push(`${c.case_id}: book_slot slot_id not in check_slots fixtures`);
      } else if (found.start_time !== bs.arguments_normalized.date_time) {
        errors.push(`${c.case_id}: book_slot date_time != fixture slot start_time`);
      }
      if (
        c.gold.expected_semantic_output?.selected_slot_id !==
        bs.arguments_normalized.slot_id
      ) {
        errors.push(`${c.case_id}: semantic selected_slot_id != book_slot slot_id`);
      }
    }

    const branch = c.gold?.expected_branch_id;
    if (["slot_selected", "booking_success", "booking_failure"].includes(branch)) {
      const now = c.task.input.current_local_datetime;
      if (now && now !== "not_applicable") {
        const slotCalls = c.fixtures?.check_slots?.expected_calls ?? [];
        const slots = slotCalls.flatMap((fc) => fc.result?.slots ?? []);
        const future = slots
          .filter((s) => s.start_time > now)
          .sort((a, b) => a.start_time.localeCompare(b.start_time));
        const selected =
          c.gold.expected_semantic_output?.selected_slot_id ||
          bookSteps[0]?.arguments_normalized?.slot_id;
        if (future.length && selected && future[0].slot_id !== selected) {
          errors.push(
            `${c.case_id}: selected ${selected} is not earliest future (${future[0].slot_id})`
          );
        }
      }
    }

    if (c.gold.gold_extraction?.booking_name?.includes(" ")) {
      errors.push(`${c.case_id}: booking_name must be first name only`);
    }

    validateGoldSimulator(c, errors);
  }

  for (const [fam, n] of Object.entries(familyTargets)) {
    if ((familyCounts[fam] || 0) !== n) {
      errors.push(`family ${fam}: expected ${n}, got ${familyCounts[fam] || 0}`);
    }
  }

  const newF6Success = bundle.cases.filter(
    (c) =>
      c.case_id.startsWith("F120_F6_") &&
      c.gold.expected_branch_id === "booking_success"
  );
  if (newF6Success.length > 8) {
    errors.push(
      `new F6 booking_success count ${newF6Success.length} exceeds max 8`
    );
  }

  const newIds = bundle.cases.filter((c) => c.case_id.startsWith("F120_"));
  if (newIds.length !== 80) {
    errors.push(`expected 80 F120 cases, got ${newIds.length}`);
  }

  return { errors, familyCounts, newF6SuccessCount: newF6Success.length };
}

async function main() {
  const r40Raw = await fs.readFile(R40_PATH, "utf8");
  const r40 = JSON.parse(r40Raw);
  if (!Array.isArray(r40.cases) || r40.cases.length !== 40) {
    throw new Error(`rehearsal_40 expected 40 cases, got ${r40.cases?.length}`);
  }

  const newCases = buildNewCases();
  if (newCases.length !== 80) {
    throw new Error(`expected 80 new cases, got ${newCases.length}`);
  }

  const bundle = {
    schema_version: "benchmark_data_model_v1",
    pack_id: "full_120_v1",
    cases: [...r40.cases, ...newCases],
  };

  const { errors, familyCounts, newF6SuccessCount } = validateBundle(
    bundle,
    r40.cases
  );
  if (errors.length) {
    console.error("VALIDATION FAILED:");
    for (const e of errors) console.error(" -", e);
    process.exit(1);
  }

  const bundlePath = path.join(OUT_DIR, "full_120_bundle_v1.json");
  await fs.writeFile(bundlePath, JSON.stringify(bundle, null, 2) + "\n", "utf8");

  const byFamily = {};
  const byBranch = {};
  for (const c of bundle.cases) {
    const fam = c.task.task_family;
    const branch = c.gold.expected_branch_id;
    if (!byFamily[fam]) byFamily[fam] = [];
    byFamily[fam].push(c.case_id);
    if (!byBranch[branch]) byBranch[branch] = [];
    byBranch[branch].push(c.case_id);
  }

  const manifest = {
    manifest_version: "v1",
    pack_id: "full_120_v1",
    status: "ready_for_main_run",
    total_cases: 120,
    family_counts: familyCounts,
    case_ids_by_family: byFamily,
    case_ids_by_branch: byBranch,
    rehearsal_40_case_ids: r40.cases.map((c) => c.case_id),
    new_case_ids: newCases.map((c) => c.case_id),
    notes: [
      "Includes all 40 rehearsal_40 cases unchanged (MP_* and R40_* ids).",
      "Adds 80 new F120_F*_### cases to hit family targets of 120.",
      `New F6 booking_success capped at ${newF6SuccessCount} of 26 (max 8).`,
      "Time-sensitive tasks include synthetic current_local_datetime + timezone.",
      "booking_name is first-name-only in every case.",
    ],
  };
  await fs.writeFile(
    path.join(OUT_DIR, "coverage_manifest_v1.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf8"
  );

  const buildNotesLines = [
    "# Full 120 Build Notes",
    "",
    "Pack: `full_120_v1` — 40 rehearsal_40 cases copied as-is + 80 new cases.",
    "",
    "## Family totals",
    "",
    "| Family | Count |",
    "|--------|------:|",
    ...Object.entries(familyCounts).map(([k, v]) => `| ${k} | ${v} |`),
    "",
    "## New cases (audit)",
    "",
    "| case_id | branch | pressure_tags |",
    "|---------|--------|---------------|",
    ...newCases.map(
      (c) =>
        `| ${c.case_id} | ${c.gold.expected_branch_id} | ${(c.task.pressure_tags || []).join(", ") || "—"} |`
    ),
    "",
    "## Rehearsal 40 cases included",
    "",
    r40.cases.map((c) => `- ${c.case_id} → ${c.gold.expected_branch_id}`).join("\n"),
    "",
    "## F6 new booking_success cap",
    "",
    `New F6 booking_success cases: ${newF6SuccessCount} / 26 (max 8).`,
    "",
  ];
  await fs.writeFile(
    path.join(OUT_DIR, "BUILD_NOTES.md"),
    buildNotesLines.join("\n"),
    "utf8"
  );

  const readme = `# Full 120 Pack v1

Frozen 120-case Track 1 exam pack. Same \`benchmark_data_model_v1\` schema as micro-pilot / rehearsal_40 so \`smoke:eval\` can load it.

## Files

- \`full_120_bundle_v1.json\` — full \`task\` / \`gold\` / \`fixtures\` payloads (120 cases)
- \`coverage_manifest_v1.json\` — case IDs by family and branch
- \`BUILD_NOTES.md\` — new-case audit table (branch + pressure tags)
- \`_build_full_120.mjs\` — regenerator + validator

## Composition

- **40** cases copied from \`rehearsal_40/rehearsal_40_bundle_v1.json\` (\`MP_*\` and \`R40_*\` ids unchanged, byte-identical)
- **80** new cases (\`F120_F*_###\`)

Family totals: F1=10, F2=10, F3=10, F4=15, F5=35, F6=40.

## How to run smoke against this pack

From the repo root, point the harness at this bundle with \`--bundle\`:

\`\`\`powershell
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json
\`\`\`

Optional filters:

\`\`\`powershell
# One family
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json --families F5_full_flow

# Specific cases
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json --case-ids F120_F6_001,MP_F5_001

# Cap run size while debugging
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json --limit 5
\`\`\`

Requires \`OPENAI_API_KEY\` for the default OpenAI model. Outputs land under \`RESEARCH/benchmark_pack_v1/runs/\`.

## Quick integrity check (no API)

\`\`\`powershell
node -e "const b=require('./RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json'); console.log(b.cases.length, b.pack_id)"
\`\`\`

Or re-run the builder (validates gold/fixture alignment, r40 byte-identity, ToolSimulator gold steps, and evaluator semantic_pass):

\`\`\`powershell
node RESEARCH/benchmark_pack_v1/full_120/_build_full_120.mjs
\`\`\`
`;
  await fs.writeFile(path.join(OUT_DIR, "README.md"), readme, "utf8");

  console.log("Wrote full_120 pack:");
  console.log(" cases:", bundle.cases.length);
  console.log(" families:", familyCounts);
  console.log(" new F6 booking_success:", newF6SuccessCount);
  console.log(" path:", bundlePath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
