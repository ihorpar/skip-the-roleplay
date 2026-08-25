#!/usr/bin/env node

/**
 * No-network harness self-tests for simulator, prompts, schemas, and evaluator.
 */
import fs from "fs/promises";
import assert from "node:assert/strict";
import {
  ROLE_LINE_A2,
  ROLE_LINE_A3,
  buildFamilyRules,
  buildSystemPrompt,
  buildUserPrompt,
} from "./harness/prompts.js";
import { SCREENING_STYLE_IDS } from "./harness/screeningPrompts.js";
import { buildToolSchemas, validateFamilySchema } from "./harness/schemas.js";
import { ToolSimulator } from "./harness/tools/simulator.js";
import { evaluateRunFromTrace } from "./harness/evaluator.js";

const BUNDLE_PATH =
  "RESEARCH/benchmark_pack_v1/micro_pilot/micro_pilot_bundle_v1.json";

async function loadCase(caseId) {
  const raw = await fs.readFile(BUNDLE_PATH, "utf8");
  const bundle = JSON.parse(raw);
  const found = bundle.cases.find((c) => c.case_id === caseId);
  if (!found) throw new Error(`Case not found: ${caseId}`);
  return found;
}

function testPromptHasNoFixtures(taskCase) {
  const prompt = buildUserPrompt(taskCase);
  assert.equal(prompt.includes("tool_fixtures"), false, "fixtures leaked to prompt");
  assert.equal(prompt.includes("expected_calls"), false, "fixture calls leaked");
}

function testPromptConditionIsolation(taskCase) {
  const family = taskCase.task.task_family;
  const a1 = buildSystemPrompt("A1_task", family);
  const a2 = buildSystemPrompt("A2_role", family);
  const a3 = buildSystemPrompt("A3_comp", family);
  const userPrompt = buildUserPrompt(taskCase);

  assert.equal(a1.includes("scheduling agent"), false, "A1 must not include role text");
  assert.equal(a1.includes("Focus on strict task execution"), false);
  assert.equal(a2.endsWith(ROLE_LINE_A2), true, "A2 must end with locked role line");
  assert.equal(a3.endsWith(ROLE_LINE_A3), true, "A3 must end with locked role+competencies line");
  assert.equal(a2, `${a1}\n${ROLE_LINE_A2}`, "A2 vs A1 delta must be role line only");
  assert.equal(
    a3,
    a2.replace(ROLE_LINE_A2, ROLE_LINE_A3),
    "A3 vs A2 delta must be competency expansion only"
  );

  for (const style of ["A1_task", "A2_role", "A3_comp"]) {
    assert.equal(
      buildUserPrompt(taskCase),
      userPrompt,
      `user prompt must be invariant across style ${style}`
    );
  }
}

function testScreeningStylesDoNotBreakTrack1(taskCase) {
  const family = taskCase.task.task_family;
  const a1 = buildSystemPrompt("A1_task", family);
  assert.equal(a1.includes("scheduling agent for an appliance"), false);

  for (const style of SCREENING_STYLE_IDS) {
    const prompt = buildSystemPrompt(style, family);
    assert.ok(prompt.length > 100, `${style} prompt too short`);
    assert.equal(
      prompt.includes("You are a scheduling agent for an appliance repair company"),
      false,
      `${style} must not add Track-1 role folklore`
    );
    assert.equal(
      buildUserPrompt(taskCase),
      buildUserPrompt(taskCase),
      "user prompt stable"
    );
  }

  const thin = buildSystemPrompt("S_schema_thin", family);
  assert.equal(thin.includes("intent: new_job, reschedule"), false, "thin should drop enum laundry list");
  assert.ok(thin.includes("calling on behalf"), "thin keeps caller vs booking policy");

  const pos = buildSystemPrompt("S_pos", family);
  const neg = buildSystemPrompt("S_neg", family);
  assert.ok(pos.includes("Prefer literal `unknown`") || pos.includes("Treat a slot as valid only"));
  assert.ok(neg.includes("Never call `book_slot`"));

  const anti = buildSystemPrompt("S_anti", family);
  assert.ok(anti.includes("Common mistakes to avoid"));
}

function testToolSimulator(taskCase) {
  const sim = new ToolSimulator(taskCase);
  const expected = taskCase.gold?.expected_tool_sequence ?? [];
  for (const step of expected) {
    const { event } = sim.execute(step.tool_name, step.arguments_normalized);
    assert.equal(event.tool_call_status, "success");
  }
  assert.equal(sim.getSequence().length, expected.length);
}

function testBlockedTool(taskCase) {
  const sim = new ToolSimulator(taskCase);
  const { event } = sim.execute("book_slot", {
    booking_name: "Test",
    slot_id: "x",
    date_time: "2026-01-01T10:00:00-05:00",
  });
  if (!taskCase.task.available_tools.includes("book_slot")) {
    assert.equal(event.tool_call_status, "blocked");
  }
}

function testEvaluatorPass(taskCase) {
  const sim = new ToolSimulator(taskCase);
  const expected = taskCase.gold?.expected_tool_sequence ?? [];
  for (const step of expected) {
    sim.execute(step.tool_name, step.arguments_normalized);
  }
  const finalParsed = { ...taskCase.gold.expected_semantic_output };
  const result = evaluateRunFromTrace({
    taskCase,
    finalParsed,
    toolCallSequence: sim.getSequence(),
    jsonValid: true,
    schemaValid: true,
  });
  assert.equal(result.semantic_pass, true, `expected pass for ${taskCase.case_id}`);
}

function testSkippedToolsFail(taskCase) {
  const finalParsed = { ...taskCase.gold.expected_semantic_output };
  const result = evaluateRunFromTrace({
    taskCase,
    finalParsed,
    toolCallSequence: [],
    jsonValid: true,
    schemaValid: true,
  });
  assert.equal(
    result.semantic_pass,
    false,
    "gold final JSON must fail when required tools were skipped"
  );
  assert.equal(result.under_action, true);
}

function testSameTurnDependentToolsFail(taskCase) {
  const sim = new ToolSimulator(taskCase);
  const expected = taskCase.gold?.expected_tool_sequence ?? [];
  for (let i = 0; i < expected.length; i += 1) {
    sim.execute(expected[i].tool_name, expected[i].arguments_normalized, {
      turnIndex: 1,
      callIndexInTurn: i,
    });
  }

  const finalParsed = { ...taskCase.gold.expected_semantic_output };
  const result = evaluateRunFromTrace({
    taskCase,
    finalParsed,
    toolCallSequence: sim.getSequence(),
    jsonValid: true,
    schemaValid: true,
  });
  assert.equal(
    result.semantic_pass,
    false,
    "dependent same-turn tool calls must fail even with correct final JSON"
  );
  assert.equal(result.over_action, true);
}

function testFamilySchema(taskCase) {
  const family = taskCase.task.task_family;
  const semantic = { ...taskCase.gold.expected_semantic_output };
  const schema = validateFamilySchema(semantic, family);
  assert.equal(schema.valid, true, `schema invalid for ${taskCase.case_id}: ${schema.errors}`);
}

function testOverActionOnUnwarrantedCall() {
  const taskCase = {
    task: { available_tools: ["service_check"] },
    fixtures: { service_check: { expected_calls: [] } },
    gold: { expected_tool_sequence: [], expected_semantic_output: {} },
  };
  const sim = new ToolSimulator(taskCase);
  sim.execute("service_check", {
    zip_code: "10001",
    unit_type: "washer",
    unit_class: "residential",
  });
  const result = evaluateRunFromTrace({
    taskCase,
    finalParsed: {
      booking_name: "x",
      intent: "status_check",
      zip_code: "10001",
      unit_type: "washer",
      unit_class: "residential",
      final_status: "stopped_non_new_job",
      customer_response: "sorry, I can only help with new booking requests",
    },
    toolCallSequence: sim.getSequence(),
    jsonValid: true,
    schemaValid: true,
  });
  assert.equal(result.over_action, true, "blocked tool attempt should count as over_action");
}

function testUnexpectedFinalFieldsFailSchema(taskCase) {
  const semantic = {
    ...taskCase.gold.expected_semantic_output,
    returned_slot_ids: ["unexpected_slot"],
  };
  const schema = validateFamilySchema(semantic, taskCase.task.task_family);
  assert.equal(schema.valid, false, "unexpected slot fields should fail schema");
}

function testReturnedSlotIdsOrderInsensitive(taskCase) {
  const sim = new ToolSimulator(taskCase);
  const expected = taskCase.gold?.expected_tool_sequence ?? [];
  for (const step of expected) {
    sim.execute(step.tool_name, step.arguments_normalized);
  }
  const goldIds = taskCase.gold.expected_semantic_output.returned_slot_ids;
  assert.ok(Array.isArray(goldIds) && goldIds.length > 1, "F3 gold needs multiple slot ids");
  const reordered = [...goldIds].reverse();
  const finalParsed = {
    ...taskCase.gold.expected_semantic_output,
    returned_slot_ids: reordered,
  };
  const result = evaluateRunFromTrace({
    taskCase,
    finalParsed,
    toolCallSequence: sim.getSequence(),
    jsonValid: true,
    schemaValid: true,
  });
  assert.equal(
    result.semantic_pass,
    true,
    "same slot ids in a different order must still pass F3"
  );
}

function testA3IsGenericNotCoaching() {
  const banned = [
    "service-area",
    "noisy context",
    "timeslot",
    "unsupported assumption",
  ];
  for (const phrase of banned) {
    assert.equal(
      ROLE_LINE_A3.toLowerCase().includes(phrase),
      false,
      `A3 must not coach with: ${phrase}`
    );
  }
}

function testSharedScaffoldHasEarliestAndBookingFailedSlotId() {
  const scaffold = buildSystemPrompt("A1_task", "F5_full_flow");
  assert.match(
    scaffold,
    /earliest by start_time/i,
    "shared scaffold must state earliest-slot policy for F5/F6"
  );
  assert.match(
    scaffold,
    /booking_failed.*selected_slot_id|selected_slot_id.*booking_failed/is,
    "shared scaffold must require selected_slot_id for booking_failed"
  );
  const f4 = buildFamilyRules("F4_select").join("\n");
  assert.equal(
    /earliest/i.test(f4),
    false,
    "earliest policy lives in shared scaffold only (avoid F4-only drift)"
  );
}

function testFamilyRulesDoNotPasteCanonicalResponses() {
  const pastedAnswers = [
    "we can continue with scheduling",
    "a valid booking time is available",
    "available booking times were found",
    "your booking is confirmed",
    "sorry, I can only help with new booking requests",
  ];
  const families = [
    "F1_extract",
    "F2_partial_flow_a",
    "F3_partial_flow_b",
    "F4_select",
    "F5_full_flow",
    "F6_robustness_hard_cases",
  ];
  for (const family of families) {
    const rules = buildFamilyRules(family).join("\n").toLowerCase();
    for (const answer of pastedAnswers) {
      assert.equal(
        rules.includes(answer.toLowerCase()),
        false,
        `family rules for ${family} must not paste canonical response: ${answer}`
      );
    }
  }
}

async function main() {
  const f2 = await loadCase("MP_F2_001");
  const f3 = await loadCase("MP_F3_002");
  const f4 = await loadCase("MP_F4_001");
  const f5 = await loadCase("MP_F5_001");

  testA3IsGenericNotCoaching();
  testFamilyRulesDoNotPasteCanonicalResponses();
  testSharedScaffoldHasEarliestAndBookingFailedSlotId();

  for (const c of [f2, f4, f5]) {
    testPromptHasNoFixtures(c);
    testPromptConditionIsolation(c);
    testFamilySchema(c);
    testToolSimulator(c);
    testBlockedTool(c);
    testEvaluatorPass(c);
  }

  testScreeningStylesDoNotBreakTrack1(f5);

  testSkippedToolsFail(f5);
  testSameTurnDependentToolsFail(f5);
  testUnexpectedFinalFieldsFailSchema(f5);
  testReturnedSlotIdsOrderInsensitive(f3);
  testEvaluatorPass(f3);

  const f2Tools = buildToolSchemas(f2.task.available_tools);
  assert.equal(f2Tools.length, 1);
  assert.equal(f2Tools[0].tool_name, "service_check");

  testOverActionOnUnwarrantedCall();

  console.log("harness self-test: all checks passed");
}

main().catch((err) => {
  console.error("harness self-test failed:", err.message || err);
  process.exit(1);
});
