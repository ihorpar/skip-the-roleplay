import {
  normalizeArgs,
  normalizeReturnedSlotIds,
  normalizeScalar,
  shallowArgsEqual,
} from "./normalization.js";

function toolCallsFromSequence(toolCallSequence) {
  return (toolCallSequence ?? [])
    .filter((e) => e.tool_call_status === "success")
    .map((e) => ({
      tool_name: e.tool_name,
      arguments: e.arguments_normalized ?? {},
    }));
}

function hasUnwarrantedToolAttempt(toolCallSequence) {
  return (toolCallSequence ?? []).some(
    (e) =>
      e.tool_call_status === "blocked" ||
      e.tool_call_status === "error" ||
      e.mismatch_reason === "unwarranted_tool_call" ||
      e.mismatch_reason === "duplicate_tool_call" ||
      e.mismatch_reason === "dependent_tool_call_same_turn" ||
      e.mismatch_reason === "check_slots_before_successful_service_check" ||
      e.mismatch_reason === "book_slot_before_successful_slot_fetch"
  );
}

function collectToolSequenceFailures(toolCallSequence) {
  const out = [];
  for (const event of toolCallSequence ?? []) {
    if (event.mismatch_reason === "dependent_tool_call_same_turn") {
      out.push("sequencing.dependent_tool_same_turn");
    } else if (event.mismatch_reason === "check_slots_before_successful_service_check") {
      out.push("sequencing.check_slots_before_service_check");
    } else if (event.mismatch_reason === "book_slot_before_successful_slot_fetch") {
      out.push("sequencing.book_before_slot_fetch");
    } else if (event.mismatch_reason === "duplicate_tool_call") {
      out.push("tool_trigger.duplicate_tool_call");
    } else if (event.mismatch_reason === "tool_not_in_scope") {
      out.push("tool_trigger.tool_not_in_scope");
    } else if (event.mismatch_reason === "unwarranted_tool_call") {
      out.push("tool_trigger.unwarranted");
    } else if (event.mismatch_reason === "arguments_no_fixture_match") {
      out.push("tool_argument.mismatch");
    }
  }
  return [...new Set(out)];
}

function assignFailureSubcodes({
  jsonValid,
  schemaValid,
  expectedTools,
  executedTools,
  mismatches,
  overAction,
  underAction,
  toolCallSequenceFailures,
}) {
  const subcodes = [];
  if (!jsonValid) subcodes.push("output.invalid_json");
  if (jsonValid && !schemaValid) subcodes.push("output.schema_invalid");
  if (underAction) subcodes.push("tool_trigger.missing_required");
  if (overAction) subcodes.push("tool_trigger.unwarranted");
  subcodes.push(...toolCallSequenceFailures);
  for (const m of mismatches) {
    if (EXTRACTION_FIELDS.has(m.field)) {
      subcodes.push(`extraction.${m.field}_wrong`);
    } else if (m.field === "customer_response") {
      subcodes.push("customer_response.wrong_canonical_response");
    } else if (m.field === "final_status") {
      subcodes.push("gating.false_continue");
    }
  }

  let primary = "not_applicable";
  if (subcodes.includes("output.invalid_json")) primary = "output.invalid_json";
  else if (subcodes.includes("output.schema_invalid")) primary = "output.schema_invalid";
  else if (subcodes.some((s) => s.startsWith("extraction."))) {
    primary = subcodes.find((s) => s.startsWith("extraction."));
  } else if (subcodes.includes("tool_trigger.missing_required")) {
    primary = "tool_trigger.missing_required";
  } else if (subcodes.includes("tool_trigger.unwarranted")) {
    primary = "tool_trigger.unwarranted";
  } else if (subcodes.some((s) => s.startsWith("customer_response."))) {
    primary = subcodes.find((s) => s.startsWith("customer_response."));
  }

  const toolOrderWrong = checkToolOrder(expectedTools, executedTools);
  if (toolOrderWrong && primary === "not_applicable") {
    subcodes.push("sequencing.forbidden_interleaving");
    primary = "sequencing.forbidden_interleaving";
  }

  const argWrong = checkToolArgs(expectedTools, executedTools);
  if (argWrong && primary === "not_applicable") {
    subcodes.push("tool_argument.mismatch");
    primary = "tool_argument.mismatch";
  }

  return { primary_failure_subcode: primary, all_failure_subcodes: subcodes };
}

const EXTRACTION_FIELDS = new Set([
  "booking_name",
  "intent",
  "zip_code",
  "unit_type",
  "unit_class",
]);

function checkToolOrder(expectedTools, executedTools) {
  const expectedNames = expectedTools.map((t) =>
    normalizeScalar(t.tool_name, "tool_name")
  );
  const executedNames = executedTools.map((t) =>
    normalizeScalar(t.tool_name, "tool_name")
  );
  if (expectedNames.length !== executedNames.length) return true;
  for (let i = 0; i < expectedNames.length; i += 1) {
    if (expectedNames[i] !== executedNames[i]) return true;
  }
  return false;
}

function checkToolArgs(expectedTools, executedTools) {
  const len = Math.min(expectedTools.length, executedTools.length);
  for (let i = 0; i < len; i += 1) {
    const expectedArgs = normalizeArgs(expectedTools[i].arguments_normalized ?? {});
    const actualArgs = normalizeArgs(executedTools[i].arguments ?? {});
    if (!shallowArgsEqual(expectedArgs, actualArgs)) return true;
  }
  return false;
}

export function evaluateRunFromTrace({
  taskCase,
  finalParsed,
  toolCallSequence,
  jsonValid,
  schemaValid,
}) {
  const expectedTools = taskCase.gold?.expected_tool_sequence ?? [];
  const expectedSemantic = taskCase.gold?.expected_semantic_output ?? {};
  const executedTools = toolCallsFromSequence(toolCallSequence);

  const predictedSemantic = { ...(finalParsed ?? {}) };
  if (predictedSemantic.returned_slot_ids !== undefined) {
    predictedSemantic.returned_slot_ids = normalizeReturnedSlotIds(
      predictedSemantic.returned_slot_ids
    );
  }

  const mismatches = [];
  for (const [k, expectedValueRaw] of Object.entries(expectedSemantic)) {
    let expectedValue = normalizeScalar(expectedValueRaw, k);
    let predictedValue = normalizeScalar(predictedSemantic[k], k);
    if (k === "returned_slot_ids") {
      expectedValue = normalizeReturnedSlotIds(expectedValueRaw);
      predictedValue = normalizeReturnedSlotIds(predictedSemantic[k]);
    }
    if (expectedValue !== predictedValue) {
      mismatches.push({
        field: k,
        expected: expectedValueRaw,
        actual: predictedSemantic[k] ?? null,
      });
    }
  }

  const semanticPass = jsonValid && schemaValid && mismatches.length === 0;

  let tp = 0;
  let argCorrect = 0;
  let toolMismatch = false;
  const maxLen = Math.max(expectedTools.length, executedTools.length);
  for (let i = 0; i < maxLen; i += 1) {
    const expected = expectedTools[i];
    const predicted = executedTools[i];
    if (!expected || !predicted) {
      toolMismatch = true;
      continue;
    }
    const expectedName = normalizeScalar(expected.tool_name, "tool_name");
    const predictedName = normalizeScalar(predicted.tool_name, "tool_name");
    if (expectedName === predictedName) {
      tp += 1;
      const expectedArgs = normalizeArgs(expected.arguments_normalized ?? {});
      const predictedArgs = normalizeArgs(predicted.arguments ?? {});
      if (shallowArgsEqual(expectedArgs, predictedArgs)) {
        argCorrect += 1;
      }
    } else {
      toolMismatch = true;
    }
  }

  const fp = Math.max(0, executedTools.length - tp);
  const fn = Math.max(0, expectedTools.length - tp);
  const unwarrantedAttempt = hasUnwarrantedToolAttempt(toolCallSequence);
  const overAction =
    unwarrantedAttempt ||
    executedTools.length > expectedTools.length ||
    (toolMismatch && executedTools.length >= expectedTools.length);
  const underAction =
    executedTools.length < expectedTools.length ||
    (toolMismatch && expectedTools.length >= executedTools.length);

  let exactMatch = !unwarrantedAttempt;
  if (executedTools.length !== expectedTools.length) {
    exactMatch = false;
  } else if (!unwarrantedAttempt) {
    for (let i = 0; i < expectedTools.length; i += 1) {
      const e = expectedTools[i];
      const p = executedTools[i];
      const sameName =
        normalizeScalar(e.tool_name, "tool_name") ===
        normalizeScalar(p?.tool_name, "tool_name");
      const sameArgs = shallowArgsEqual(
        normalizeArgs(e.arguments_normalized ?? {}),
        normalizeArgs(p?.arguments ?? {})
      );
      if (!sameName || !sameArgs) {
        exactMatch = false;
        break;
      }
    }
  }

  const toolCallSequenceFailures = collectToolSequenceFailures(toolCallSequence);
  const toolProcessPass =
    exactMatch && !overAction && !underAction && toolCallSequenceFailures.length === 0;
  const runPass = semanticPass && toolProcessPass;

  const failureInfo = assignFailureSubcodes({
    jsonValid,
    schemaValid,
    expectedTools,
    executedTools,
    mismatches,
    overAction,
    underAction,
    toolCallSequenceFailures,
  });

  return {
    semantic_pass: runPass,
    semantic_only_pass: semanticPass,
    semantic_mismatches: mismatches,
    tool_counts: { tp, fp, fn, arg_correct: argCorrect },
    tool_call_exact_match: exactMatch,
    over_action: overAction,
    under_action: underAction,
    evaluator_result: {
      eval_status: "scored",
      pass: runPass,
      primary_failure_subcode: runPass
        ? "not_applicable"
        : failureInfo.primary_failure_subcode,
      all_failure_subcodes: runPass ? [] : failureInfo.all_failure_subcodes,
      metric_components: {
        task_success: runPass ? 1 : 0,
        semantic_only_success: semanticPass ? 1 : 0,
        json_valid: jsonValid ? 1 : 0,
        schema_valid: schemaValid ? 1 : 0,
        tool_process_valid: toolProcessPass ? 1 : 0,
        over_action: overAction ? 1 : 0,
        under_action: underAction ? 1 : 0,
      },
    },
  };
}
