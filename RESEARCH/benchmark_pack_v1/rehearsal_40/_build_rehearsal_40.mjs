/**
 * One-shot builder for rehearsal_40_bundle_v1.json + companion files.
 * Run: node RESEARCH/benchmark_pack_v1/rehearsal_40/_build_rehearsal_40.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const MP_PATH = path.join(
  ROOT,
  "RESEARCH/benchmark_pack_v1/micro_pilot/micro_pilot_bundle_v1.json"
);
const OUT_DIR = __dirname;

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

function buildNewCases() {
  const cases = [];

  // ── F1: 2 new ──────────────────────────────────────────────
  {
    const id = "R40_F1_001";
    const ex = extraction("Dana", "new_job", "10003", "dishwasher", "commercial");
    cases.push(
      makeCase({
        caseId: id,
        family: "F1_extract",
        title: "Clinic ZIP correction extraction",
        userText:
          "This is Dana from the dental clinic on 5th. I wrote 10002 in my notes first, but the clinic ZIP is 10003. Break-room dishwasher will not drain and staff lunches are backing up.",
        pressureTags: ["later_correction", "irrelevant_chatter"],
        notes: "F1 commercial extraction with later ZIP correction",
        branch: "extract_only",
        extract: ex,
        ops: opsNone(),
        semantic: { ...ex },
        fixtures: emptyFixtures(id),
      })
    );
  }
  {
    const id = "R40_F1_002";
    const ex = extraction("Sam", "new_job", "10001", "washer", "residential");
    cases.push(
      makeCase({
        caseId: id,
        family: "F1_extract",
        title: "Stale prior ZIP extraction",
        userText:
          "Sam at my house. Washer keeps leaving clothes soaked. We used to live at 11201 before we moved here to 10001 last fall, and the moving company still emails me about boxes.",
        pressureTags: ["historical_value", "irrelevant_chatter"],
        notes: "F1 residential extraction with historical ZIP distraction",
        branch: "extract_only",
        extract: ex,
        ops: opsNone(),
        semantic: { ...ex },
        fixtures: emptyFixtures(id),
      })
    );
  }

  // ── F2: 1 new ──────────────────────────────────────────────
  {
    const id = "R40_F2_001";
    const zip = "90210";
    const unit = "oven_range";
    const cls = "residential";
    const name = "Grace";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F2_partial_flow_a",
        title: "Unsupported area stop",
        userText:
          "Hi, I am Grace. Oven at my apartment in 90210 is dead and dinner plans are ruined tonight.",
        tools: ["service_check"],
        pressureTags: ["irrelevant_chatter"],
        notes: "F2 not-serviceable unsupported area",
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

  // ── F3: 1 new ──────────────────────────────────────────────
  {
    const id = "R40_F3_001";
    const zip = "10003";
    const unit = "microwave";
    const cls = "commercial";
    const name = "Kai";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F3_partial_flow_b",
        title: "Busy slots stop at fetch",
        userText:
          "Kai from the store kitchen at 10003. Microwave quit mid-lunch rush and the manager is pacing the aisle.",
        tools: ["service_check", "check_slots"],
        pressureTags: ["busy_result", "irrelevant_chatter"],
        notes: "F3 slots-busy endpoint",
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

  // ── F4: 4 new (2 selected, 2 no_valid) ─────────────────────
  {
    const id = "R40_F4_001";
    const zip = "10001";
    const unit = "dryer";
    const cls = "residential";
    const name = "Nina";
    const now = "2026-04-19T09:00:00-04:00";
    const selected = "slot_071";
    const selectedTime = "2026-04-19T09:20:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F4_select",
        title: "Similar IDs earliest future select",
        userText:
          "Nina here, 10001 apartment. Dryer will not heat; ASAP would help because laundry is piled on the couch.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots"],
        pressureTags: ["similar_slot_ids", "unsorted_slots"],
        notes: "F4 select earliest among similar slot IDs",
        branch: "slot_selected",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "selection_complete",
          selected_slot_id: selected,
          customer_response: "a valid booking time is available",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: "slot_017",
                  start_time: "2026-04-19T09:45:00-04:00",
                  technician: "Maya",
                },
                {
                  slot_id: selected,
                  start_time: selectedTime,
                  technician: "Noah",
                },
                {
                  slot_id: "slot_017A",
                  start_time: "2026-04-19T10:00:00-04:00",
                  technician: "Liam",
                },
                {
                  slot_id: "slot_eq_now",
                  start_time: now,
                  technician: "Zoe",
                },
              ]),
            ],
          },
        },
      })
    );
  }
  {
    const id = "R40_F4_002";
    const zip = "10003";
    const unit = "refrigerator";
    const cls = "commercial";
    const name = "Omar";
    const now = "2026-04-19T11:00:00-04:00";
    const selected = "slot_office_1115";
    const selectedTime = "2026-04-19T11:15:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F4_select",
        title: "Office fridge earliest select",
        userText:
          "Omar calling from the office break room at 10003. Refrigerator is warm and the staff fridge smell is getting worse.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots"],
        pressureTags: ["unsorted_slots", "irrelevant_chatter"],
        notes: "F4 commercial slot_selected",
        branch: "slot_selected",
        extract: ex,
        ops: opsThroughSlots(),
        toolSeq: toolSeqSlots(zip, unit, cls),
        semantic: {
          ...ex,
          final_status: "selection_complete",
          selected_slot_id: selected,
          customer_response: "a valid booking time is available",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: "slot_office_1200",
                  start_time: "2026-04-19T12:00:00-04:00",
                  technician: "Maya",
                },
                {
                  slot_id: "slot_past_1030",
                  start_time: "2026-04-19T10:30:00-04:00",
                  technician: "Noah",
                },
                {
                  slot_id: selected,
                  start_time: selectedTime,
                  technician: "Liam",
                },
              ]),
            ],
          },
        },
      })
    );
  }
  {
    const id = "R40_F4_003";
    const zip = "10001";
    const unit = "dishwasher";
    const cls = "residential";
    const name = "Vera";
    const now = "2026-04-19T16:00:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F4_select",
        title: "No valid future after filter",
        userText:
          "Vera, 10001 apartment. Dishwasher leaves a puddle under the door; I can be home whenever.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots"],
        pressureTags: ["no_valid_after_filter", "temporal_boundary"],
        notes: "F4 no_valid_slot — past and equal-now only",
        branch: "no_valid_slot",
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
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: "slot_past_1500",
                  start_time: "2026-04-19T15:00:00-04:00",
                  technician: "Maya",
                },
                {
                  slot_id: "slot_eq_1600",
                  start_time: now,
                  technician: "Noah",
                },
                {
                  slot_id: "slot_past_1430",
                  start_time: "2026-04-19T14:30:00-04:00",
                  technician: "Liam",
                },
              ]),
            ],
          },
        },
      })
    );
  }
  {
    const id = "R40_F4_004";
    const zip = "10012";
    const unit = "washer";
    const cls = "residential";
    const name = "Troy";
    const now = "2026-04-19T13:00:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F4_select",
        title: "Equal-now only no valid slot",
        userText:
          "Troy from my house at 10012. Washer is banging on spin and the hallway is loud enough already.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots"],
        pressureTags: ["temporal_boundary", "unsorted_slots"],
        notes: "F4 no_valid_slot — equal-now and past unsorted",
        branch: "no_valid_slot",
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
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: "slot_eq_1300",
                  start_time: now,
                  technician: "Maya",
                },
                {
                  slot_id: "slot_past_1200",
                  start_time: "2026-04-19T12:00:00-04:00",
                  technician: "Noah",
                },
                {
                  slot_id: "slot_past_1145",
                  start_time: "2026-04-19T11:45:00-04:00",
                  technician: "Liam",
                },
              ]),
            ],
          },
        },
      })
    );
  }

  // ── F5: 8 new (2 success, 2 failure, 2 busy, 2 no_valid) ───
  {
    const id = "R40_F5_001";
    const zip = "10003";
    const unit = "microwave";
    const cls = "commercial";
    const name = "Iris";
    const now = "2026-04-19T08:00:00-04:00";
    const slotId = "slot_c830";
    const slotTime = "2026-04-19T08:30:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F5_full_flow",
        title: "Clinic microwave booking success",
        userText:
          "Iris at the clinic kitchen, 10003. Microwave sparks when we start it; ASAP please so lunch trays keep moving.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["irrelevant_chatter"],
        notes: "F5 commercial booking_success",
        branch: "booking_success",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(zip, unit, cls, name, slotId, slotTime),
        semantic: {
          ...ex,
          final_status: "booking_confirmed",
          selected_slot_id: slotId,
          customer_response: "your booking is confirmed",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: slotId,
                  start_time: slotTime,
                  technician: "Maya",
                },
                {
                  slot_id: "slot_c930",
                  start_time: "2026-04-19T09:30:00-04:00",
                  technician: "Noah",
                },
              ]),
            ],
          },
          book_slot: {
            expected_calls: [
              bookCall(name, slotId, slotTime, "booking_success", "conf_r40_501"),
            ],
          },
        },
      })
    );
  }
  {
    const id = "R40_F5_002";
    const zip = "10001";
    const unit = "refrigerator";
    const cls = "residential";
    const name = "Blake";
    const now = "2026-04-19T10:00:00-04:00";
    const slotId = "slot_1015";
    const slotTime = "2026-04-19T10:15:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F5_full_flow",
        title: "Home fridge ASAP booking success",
        userText:
          "Blake here, 10001 apartment. Refrigerator is warming up — can someone come as soon as you can?",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["unsorted_slots"],
        notes: "F5 residential booking_success ASAP aligned with earliest",
        branch: "booking_success",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(zip, unit, cls, name, slotId, slotTime),
        semantic: {
          ...ex,
          final_status: "booking_confirmed",
          selected_slot_id: slotId,
          customer_response: "your booking is confirmed",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: "slot_1100",
                  start_time: "2026-04-19T11:00:00-04:00",
                  technician: "Maya",
                },
                {
                  slot_id: slotId,
                  start_time: slotTime,
                  technician: "Noah",
                },
                {
                  slot_id: "slot_eq_1000",
                  start_time: now,
                  technician: "Liam",
                },
              ]),
            ],
          },
          book_slot: {
            expected_calls: [
              bookCall(name, slotId, slotTime, "booking_success", "conf_r40_502"),
            ],
          },
        },
      })
    );
  }
  {
    const id = "R40_F5_003";
    const zip = "10001";
    const unit = "oven_range";
    const cls = "residential";
    const name = "Clara";
    const now = "2026-04-19T09:30:00-04:00";
    const slotId = "slot_0945";
    const slotTime = "2026-04-19T09:45:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F5_full_flow",
        title: "Oven booking failure",
        userText:
          "Clara, apartment 10001. Range will not ignite and the kitchen smells like gas faintly after we tried.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["booking_failure", "irrelevant_chatter"],
        notes: "F5 booking_failure",
        branch: "booking_failure",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(zip, unit, cls, name, slotId, slotTime),
        semantic: {
          ...ex,
          final_status: "booking_failed",
          selected_slot_id: slotId,
          customer_response: "sorry, I couldn't complete the booking",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: slotId,
                  start_time: slotTime,
                  technician: "Maya",
                },
                {
                  slot_id: "slot_1030",
                  start_time: "2026-04-19T10:30:00-04:00",
                  technician: "Noah",
                },
              ]),
            ],
          },
          book_slot: {
            expected_calls: [
              bookCall(name, slotId, slotTime, "booking_failure", "not_applicable"),
            ],
          },
        },
      })
    );
  }
  {
    const id = "R40_F5_004";
    const zip = "10012";
    const unit = "dishwasher";
    const cls = "residential";
    const name = "Quinn";
    const now = "2026-04-19T08:15:00-04:00";
    const slotId = "slot_071";
    const slotTime = "2026-04-19T08:30:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F5_full_flow",
        title: "Similar IDs booking failure",
        userText:
          "Quinn at my house in 10012. Dishwasher stops mid-cycle; neighbors keep asking about the water noise.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["booking_failure", "similar_slot_ids", "unsorted_slots"],
        notes: "F5 booking_failure with similar slot IDs",
        branch: "booking_failure",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(zip, unit, cls, name, slotId, slotTime),
        semantic: {
          ...ex,
          final_status: "booking_failed",
          selected_slot_id: slotId,
          customer_response: "sorry, I couldn't complete the booking",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: "slot_017",
                  start_time: "2026-04-19T09:00:00-04:00",
                  technician: "Maya",
                },
                {
                  slot_id: "slot_017A",
                  start_time: "2026-04-19T09:15:00-04:00",
                  technician: "Liam",
                },
                {
                  slot_id: slotId,
                  start_time: slotTime,
                  technician: "Noah",
                },
              ]),
            ],
          },
          book_slot: {
            expected_calls: [
              bookCall(name, slotId, slotTime, "booking_failure", "not_applicable"),
            ],
          },
        },
      })
    );
  }
  {
    const id = "R40_F5_005";
    const zip = "10001";
    const unit = "washer";
    const cls = "residential";
    const name = "Holly";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F5_full_flow",
        title: "Washer busy stop",
        userText:
          "Holly, 10001 apartment. Washer will not drain and the laundry room is a mess today.",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["busy_result", "irrelevant_chatter"],
        notes: "F5 slots_busy",
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
    const id = "R40_F5_006";
    const zip = "10003";
    const unit = "oven_range";
    const cls = "commercial";
    const name = "Derek";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F5_full_flow",
        title: "Store range busy stop",
        userText:
          "Derek from the store cafe at 10003. Oven range will not hold temperature and the lunch line is stuck.",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["busy_result"],
        notes: "F5 commercial slots_busy",
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
    const id = "R40_F5_007";
    const zip = "10001";
    const unit = "microwave";
    const cls = "residential";
    const name = "Pia";
    const now = "2026-04-19T15:30:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F5_full_flow",
        title: "No valid future microwave",
        userText:
          "Pia here in my apartment at 10001. Microwave died during leftovers; I can step out if needed.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["no_valid_after_filter", "temporal_boundary"],
        notes: "F5 no_valid_after_filter",
        branch: "no_valid_after_filter",
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
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: "slot_past_1500",
                  start_time: "2026-04-19T15:00:00-04:00",
                  technician: "Maya",
                },
                {
                  slot_id: "slot_eq_1530",
                  start_time: now,
                  technician: "Noah",
                },
                {
                  slot_id: "slot_past_1400",
                  start_time: "2026-04-19T14:00:00-04:00",
                  technician: "Liam",
                },
              ]),
            ],
          },
        },
      })
    );
  }
  {
    const id = "R40_F5_008";
    const zip = "10012";
    const unit = "dryer";
    const cls = "residential";
    const name = "Rex";
    const now = "2026-04-19T18:00:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F5_full_flow",
        title: "Unsorted past slots no valid",
        userText:
          "Rex at my house, 10012. Dryer drum spins but there is no heat and the laundry basket is overflowing.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["no_valid_after_filter", "unsorted_slots", "temporal_boundary"],
        notes: "F5 no_valid_after_filter with unsorted past/equal slots",
        branch: "no_valid_after_filter",
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
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: "slot_eq_1800",
                  start_time: now,
                  technician: "Maya",
                },
                {
                  slot_id: "slot_past_1700",
                  start_time: "2026-04-19T17:00:00-04:00",
                  technician: "Noah",
                },
                {
                  slot_id: "slot_past_1630",
                  start_time: "2026-04-19T16:30:00-04:00",
                  technician: "Liam",
                },
              ]),
            ],
          },
        },
      })
    );
  }

  // ── F6: 9 new (≤3 booking_success) ─────────────────────────
  // Success #1
  {
    const id = "R40_F6_001";
    const zip = "10001";
    const unit = "washer";
    const cls = "residential";
    const name = "Sasha";
    const now = "2026-04-19T10:00:00-04:00";
    const slotId = "slot_1030";
    const slotTime = "2026-04-19T10:30:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F6_robustness_hard_cases",
        title: "Later correction under booking success",
        userText:
          "Hi, Sasha at my apartment. I put 10011 in the form by mistake — actual ZIP is 10001. Also I said dryer earlier but it is the washer that will not spin. Elevator music is stuck on loop today.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["later_correction", "historical_value", "irrelevant_chatter"],
        notes: "F6 booking_success with later ZIP/unit correction",
        branch: "booking_success",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(zip, unit, cls, name, slotId, slotTime),
        semantic: {
          ...ex,
          final_status: "booking_confirmed",
          selected_slot_id: slotId,
          customer_response: "your booking is confirmed",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: slotId,
                  start_time: slotTime,
                  technician: "Maya",
                },
                {
                  slot_id: "slot_1100",
                  start_time: "2026-04-19T11:00:00-04:00",
                  technician: "Noah",
                },
              ]),
            ],
          },
          book_slot: {
            expected_calls: [
              bookCall(name, slotId, slotTime, "booking_success", "conf_r40_601"),
            ],
          },
        },
      })
    );
  }
  // Success #2
  {
    const id = "R40_F6_002";
    const zip = "10001";
    const unit = "dishwasher";
    const cls = "residential";
    const name = "Maya";
    const now = "2026-04-19T12:00:00-04:00";
    const slotId = "slot_1215";
    const slotTime = "2026-04-19T12:15:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F6_robustness_hard_cases",
        title: "Name conflict booking success",
        userText:
          "Noah calling for Maya at apartment 10001. Dishwasher will not start and the hallway is being mopped again.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["name_conflict", "irrelevant_chatter"],
        notes: "F6 booking_success name_conflict — book under Maya",
        branch: "booking_success",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(zip, unit, cls, name, slotId, slotTime),
        semantic: {
          ...ex,
          final_status: "booking_confirmed",
          selected_slot_id: slotId,
          customer_response: "your booking is confirmed",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: slotId,
                  start_time: slotTime,
                  technician: "Zoe",
                },
                {
                  slot_id: "slot_1245",
                  start_time: "2026-04-19T12:45:00-04:00",
                  technician: "Liam",
                },
              ]),
            ],
          },
          book_slot: {
            expected_calls: [
              bookCall(name, slotId, slotTime, "booking_success", "conf_r40_602"),
            ],
          },
        },
      })
    );
  }
  // Success #3 (last allowed)
  {
    const id = "R40_F6_003";
    const zip = "10001";
    const unit = "microwave";
    const cls = "residential";
    const name = "Jade";
    const now = "2026-04-19T07:45:00-04:00";
    const slotId = "slot_071";
    const slotTime = "2026-04-19T08:00:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F6_robustness_hard_cases",
        title: "Similar IDs ASAP booking success",
        userText:
          "Jade, 10001 apartment. Microwave died — as soon as you can would be great; package buzzers keep going off.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["similar_slot_ids", "unsorted_slots"],
        notes: "F6 booking_success similar IDs + ASAP",
        branch: "booking_success",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(zip, unit, cls, name, slotId, slotTime),
        semantic: {
          ...ex,
          final_status: "booking_confirmed",
          selected_slot_id: slotId,
          customer_response: "your booking is confirmed",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: "slot_017A",
                  start_time: "2026-04-19T08:30:00-04:00",
                  technician: "Maya",
                },
                {
                  slot_id: "slot_017",
                  start_time: "2026-04-19T08:15:00-04:00",
                  technician: "Noah",
                },
                {
                  slot_id: slotId,
                  start_time: slotTime,
                  technician: "Liam",
                },
              ]),
            ],
          },
          book_slot: {
            expected_calls: [
              bookCall(name, slotId, slotTime, "booking_success", "conf_r40_603"),
            ],
          },
        },
      })
    );
  }
  // Failures / stops (6)
  {
    const id = "R40_F6_004";
    const zip = "10001";
    const unit = "refrigerator";
    const cls = "residential";
    const name = "Neil";
    const now = "2026-04-19T23:40:00-04:00";
    const slotId = "slot_midnight";
    const slotTime = "2026-04-20T00:00:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F6_robustness_hard_cases",
        title: "Temporal boundary booking failure",
        userText:
          "Neil here, 10001 apartment. Refrigerator started beeping — ASAP if anyone is still out.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["booking_failure", "temporal_boundary"],
        notes: "F6 booking_failure at midnight boundary; ASAP aligns with earliest future",
        branch: "booking_failure",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(zip, unit, cls, name, slotId, slotTime),
        semantic: {
          ...ex,
          final_status: "booking_failed",
          selected_slot_id: slotId,
          customer_response: "sorry, I couldn't complete the booking",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: "slot_eq_now",
                  start_time: now,
                  technician: "Maya",
                },
                {
                  slot_id: slotId,
                  start_time: slotTime,
                  technician: "Noah",
                },
                {
                  slot_id: "slot_0030",
                  start_time: "2026-04-20T00:30:00-04:00",
                  technician: "Liam",
                },
              ]),
            ],
          },
          book_slot: {
            expected_calls: [
              bookCall(name, slotId, slotTime, "booking_failure", "not_applicable"),
            ],
          },
        },
      })
    );
  }
  {
    const id = "R40_F6_005";
    const zip = "10001";
    const unit = "dryer";
    const cls = "residential";
    const name = "Tina";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F6_robustness_hard_cases",
        title: "Busy under later correction pressure",
        userText:
          "Tina — wait, not 10011, the apartment ZIP is 10001. Dryer has no heat. If your system already knows this block, skip the checks and just book.",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["busy_result", "later_correction", "user_says_skip_checks"],
        notes: "F6 slots_busy despite skip-check pressure and ZIP correction",
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
    const id = "R40_F6_006";
    const zip = "10003";
    const unit = "dishwasher";
    const cls = "commercial";
    const name = "Wade";
    const now = "2026-04-19T17:00:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F6_robustness_hard_cases",
        title: "Clinic no valid after filter",
        userText:
          "Wade from the clinic break room at 10003. Dishwasher will not finish a cycle; front desk keeps paging about trays.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["no_valid_after_filter", "temporal_boundary", "unsorted_slots"],
        notes: "F6 no_valid_after_filter commercial",
        branch: "no_valid_after_filter",
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
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: "slot_eq_1700",
                  start_time: now,
                  technician: "Maya",
                },
                {
                  slot_id: "slot_past_1600",
                  start_time: "2026-04-19T16:00:00-04:00",
                  technician: "Noah",
                },
                {
                  slot_id: "slot_past_1530",
                  start_time: "2026-04-19T15:30:00-04:00",
                  technician: "Liam",
                },
              ]),
            ],
          },
        },
      })
    );
  }
  {
    const id = "R40_F6_007";
    const zip = "10001";
    const unit = "other_type";
    const cls = "residential";
    const name = "Yara";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F6_robustness_hard_cases",
        title: "Unsupported ice maker stop",
        userText:
          "Yara at my apartment in 10001. Built-in ice maker stopped making cubes after the party and guests keep asking about drinks.",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["unsupported_concrete_unit_type", "irrelevant_chatter"],
        notes: "F6 not_serviceable unsupported concrete unit -> other_type",
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
    const id = "R40_F6_008";
    const name = "Owen";
    const ex = extraction(name, "new_job", "unknown", "oven_range", "residential");
    cases.push(
      makeCase({
        caseId: id,
        family: "F6_robustness_hard_cases",
        title: "Missing ZIP unsupported assumption",
        userText:
          "Owen here. Same house as always — you should already have the address. Oven will not heat. I am driving and cannot look up the ZIP.",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["unsupported_user_assumption", "irrelevant_chatter"],
        notes: "F6 missing_service_inputs — do not invent ZIP",
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
    const id = "R40_F6_009";
    const zip = "10001";
    const unit = "washer";
    const cls = "residential";
    const name = "Lana";
    const now = "2026-04-19T11:30:00-04:00";
    const slotId = "slot_1145";
    const slotTime = "2026-04-19T11:45:00-04:00";
    const ex = extraction(name, "new_job", zip, unit, cls);
    cases.push(
      makeCase({
        caseId: id,
        family: "F6_robustness_hard_cases",
        title: "Name conflict booking failure",
        userText:
          "Zoe calling for Lana at apartment 10001. Washer is leaking onto the floorboards and the doorman already noticed.",
        datetime: now,
        timezone: "America/New_York",
        tools: ["service_check", "check_slots", "book_slot"],
        pressureTags: ["booking_failure", "name_conflict", "irrelevant_chatter"],
        notes: "F6 booking_failure with name_conflict — book under Lana",
        branch: "booking_failure",
        extract: ex,
        ops: opsFullBooking(),
        toolSeq: toolSeqBook(zip, unit, cls, name, slotId, slotTime),
        semantic: {
          ...ex,
          final_status: "booking_failed",
          selected_slot_id: slotId,
          customer_response: "sorry, I couldn't complete the booking",
        },
        fixtures: {
          ...emptyFixtures(id),
          service_check: { expected_calls: [serviceOkCall(zip, unit, cls)] },
          check_slots: {
            expected_calls: [
              slotsReturnedCall(zip, unit, cls, [
                {
                  slot_id: slotId,
                  start_time: slotTime,
                  technician: "Maya",
                },
                {
                  slot_id: "slot_1215",
                  start_time: "2026-04-19T12:15:00-04:00",
                  technician: "Noah",
                },
              ]),
            ],
          },
          book_slot: {
            expected_calls: [
              bookCall(name, slotId, slotTime, "booking_failure", "not_applicable"),
            ],
          },
        },
      })
    );
  }

  return cases;
}

function shallowEqual(a, b) {
  const ak = Object.keys(a).sort();
  const bk = Object.keys(b).sort();
  if (ak.length !== bk.length) return false;
  return ak.every((k, i) => k === bk[i] && a[k] === b[k]);
}

function validateBundle(bundle) {
  const errors = [];
  if (bundle.schema_version !== "benchmark_data_model_v1") {
    errors.push("bad schema_version");
  }
  if (!Array.isArray(bundle.cases) || bundle.cases.length !== 40) {
    errors.push(`expected 40 cases, got ${bundle.cases?.length}`);
  }

  const familyTargets = {
    F1_extract: 3,
    F2_partial_flow_a: 3,
    F3_partial_flow_b: 3,
    F4_select: 5,
    F5_full_flow: 12,
    F6_robustness_hard_cases: 14,
  };
  const familyCounts = {};
  const ids = new Set();

  for (const c of bundle.cases) {
    if (ids.has(c.case_id)) errors.push(`duplicate case_id ${c.case_id}`);
    ids.add(c.case_id);
    const fam = c.task?.task_family;
    familyCounts[fam] = (familyCounts[fam] || 0) + 1;

    if (c.case_id !== c.task?.task_id || c.case_id !== c.gold?.task_id || c.case_id !== c.fixtures?.task_id) {
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

    // Booking consistency: selected slot must exist in fixture slots when booking
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
      if (c.gold.expected_semantic_output?.selected_slot_id !== bs.arguments_normalized.slot_id) {
        errors.push(`${c.case_id}: semantic selected_slot_id != book_slot slot_id`);
      }
    }

    // Earliest-future sanity for selection/booking branches
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
  }

  for (const [fam, n] of Object.entries(familyTargets)) {
    if ((familyCounts[fam] || 0) !== n) {
      errors.push(`family ${fam}: expected ${n}, got ${familyCounts[fam] || 0}`);
    }
  }

  const newF6 = bundle.cases.filter(
    (c) => c.case_id.startsWith("R40_F6_") && c.gold.expected_branch_id === "booking_success"
  );
  if (newF6.length > 3) {
    errors.push(`new F6 booking_success count ${newF6.length} exceeds max 3`);
  }

  const mpIds = bundle.cases.filter((c) => c.case_id.startsWith("MP_"));
  if (mpIds.length !== 15) errors.push(`expected 15 MP cases, got ${mpIds.length}`);

  return { errors, familyCounts };
}

async function main() {
  const mpRaw = await fs.readFile(MP_PATH, "utf8");
  const mp = JSON.parse(mpRaw);
  if (!Array.isArray(mp.cases) || mp.cases.length !== 15) {
    throw new Error(`micro_pilot expected 15 cases, got ${mp.cases?.length}`);
  }

  const newCases = buildNewCases();
  if (newCases.length !== 25) {
    throw new Error(`expected 25 new cases, got ${newCases.length}`);
  }

  const bundle = {
    schema_version: "benchmark_data_model_v1",
    pack_id: "rehearsal_40_v1",
    cases: [...mp.cases, ...newCases],
  };

  const { errors, familyCounts } = validateBundle(bundle);
  if (errors.length) {
    console.error("VALIDATION FAILED:");
    for (const e of errors) console.error(" -", e);
    process.exit(1);
  }

  const bundlePath = path.join(OUT_DIR, "rehearsal_40_bundle_v1.json");
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
    pack_id: "rehearsal_40_v1",
    status: "ready_for_api_rehearsal",
    total_cases: 40,
    family_counts: familyCounts,
    case_ids_by_family: byFamily,
    case_ids_by_branch: byBranch,
    micro_pilot_case_ids: mp.cases.map((c) => c.case_id),
    new_case_ids: newCases.map((c) => c.case_id),
    notes: [
      "Includes all 15 micro-pilot cases unchanged (MP_* ids).",
      "Adds 25 new R40_F*_### cases to hit family targets.",
      "New F6 booking_success capped at 3 of 9.",
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
    "# Rehearsal 40 Build Notes",
    "",
    "Pack: `rehearsal_40_v1` — 15 micro-pilot cases copied as-is + 25 new cases.",
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
        `| ${c.case_id} | ${c.gold.expected_branch_id} | ${(c.task.pressure_tags || []).join(", ")} |`
    ),
    "",
    "## Micro-pilot cases included",
    "",
    mp.cases.map((c) => `- ${c.case_id} → ${c.gold.expected_branch_id}`).join("\n"),
    "",
    "## F6 new booking_success cap",
    "",
    `New F6 booking_success cases: ${
      newCases.filter((c) => c.case_id.startsWith("R40_F6_") && c.gold.expected_branch_id === "booking_success")
        .length
    } / 9 (max 3).`,
    "",
  ];
  await fs.writeFile(path.join(OUT_DIR, "BUILD_NOTES.md"), buildNotesLines.join("\n"), "utf8");

  const readme = `# Rehearsal 40 Pack v1

Runnable 40-case Track 1 rehearsal pack. Same \`benchmark_data_model_v1\` schema as the micro-pilot bundle so \`smoke:eval\` can load it.

## Files

- \`rehearsal_40_bundle_v1.json\` — full \`task\` / \`gold\` / \`fixtures\` payloads (40 cases)
- \`coverage_manifest_v1.json\` — case IDs by family and branch
- \`BUILD_NOTES.md\` — new-case audit table (branch + pressure tags)

## Composition

- **15** cases copied from \`micro_pilot/micro_pilot_bundle_v1.json\` (\`MP_*\` ids unchanged)
- **25** new cases (\`R40_F*_###\`)

Family totals: F1=3, F2=3, F3=3, F4=5, F5=12, F6=14.

## How to run smoke against this pack

From the repo root, point the harness at this bundle with \`--bundle\`:

\`\`\`powershell
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json
\`\`\`

Optional filters (same as micro-pilot smoke):

\`\`\`powershell
# One family
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json --families F4_select

# Specific cases
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json --case-ids R40_F6_001,MP_F5_001

# Cap run size while debugging
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json --limit 5
\`\`\`

Requires \`OPENAI_API_KEY\` for the default OpenAI model. Outputs land under \`RESEARCH/benchmark_pack_v1/runs/\` (\`smoke_raw_runs_*.json\`, \`smoke_summary_*.json\`, \`smoke_summary_*.md\`).

## Quick integrity check (no API)

\`\`\`powershell
node -e "const b=require('./RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json'); console.log(b.cases.length, b.pack_id)"
\`\`\`

Or re-run the builder (validates gold/fixture arg alignment):

\`\`\`powershell
node RESEARCH/benchmark_pack_v1/rehearsal_40/_build_rehearsal_40.mjs
\`\`\`
`;
  await fs.writeFile(path.join(OUT_DIR, "README.md"), readme, "utf8");

  console.log("Wrote rehearsal_40 pack:");
  console.log(" cases:", bundle.cases.length);
  console.log(" families:", familyCounts);
  console.log(" path:", bundlePath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
