import { normalizeArgs, shallowArgsEqual } from "../normalization.js";

const GENERIC_TOOL_ERROR = {
  error: "tool_call_failed",
  message: "The tool call could not be completed.",
};

/**
 * Fixture-backed deterministic tool simulator.
 * Trace records full mismatch detail; model-facing results stay generic on failure.
 */
export class ToolSimulator {
  constructor(taskCase) {
    this.taskCase = taskCase;
    this.availableTools = new Set(taskCase.task?.available_tools ?? []);
    this.fixtures = taskCase.fixtures ?? {};
    this.executedCalls = [];
    this.stepIndex = 0;
  }

  execute(toolName, argumentsRaw, meta = {}) {
    this.stepIndex += 1;
    const stepIndex = this.stepIndex;
    const startedAt = new Date().toISOString();
    const argsNormalized = normalizeArgs(argumentsRaw ?? {});

    const baseEvent = {
      step_index: stepIndex,
      tool_name: toolName,
      arguments_raw: argumentsRaw ?? {},
      arguments_normalized: argsNormalized,
      call_started_at_utc: startedAt,
      turn_index: meta.turnIndex ?? null,
      call_index_in_turn: meta.callIndexInTurn ?? null,
    };

    if ((meta.callIndexInTurn ?? 0) > 0) {
      const event = {
        ...baseEvent,
        tool_output_raw: GENERIC_TOOL_ERROR,
        tool_output_normalized: GENERIC_TOOL_ERROR,
        tool_call_status: "blocked",
        mismatch_reason: "dependent_tool_call_same_turn",
        call_finished_at_utc: new Date().toISOString(),
      };
      this.executedCalls.push(event);
      return { event, modelResult: GENERIC_TOOL_ERROR };
    }

    if (!this.availableTools.has(toolName)) {
      const event = {
        ...baseEvent,
        tool_output_raw: GENERIC_TOOL_ERROR,
        tool_output_normalized: GENERIC_TOOL_ERROR,
        tool_call_status: "blocked",
        mismatch_reason: "tool_not_in_scope",
        call_finished_at_utc: new Date().toISOString(),
      };
      this.executedCalls.push(event);
      return { event, modelResult: GENERIC_TOOL_ERROR };
    }

    const prerequisiteFailure = this.checkPrerequisites(toolName);
    if (prerequisiteFailure) {
      const event = {
        ...baseEvent,
        tool_output_raw: GENERIC_TOOL_ERROR,
        tool_output_normalized: GENERIC_TOOL_ERROR,
        tool_call_status: "blocked",
        mismatch_reason: prerequisiteFailure,
        call_finished_at_utc: new Date().toISOString(),
      };
      this.executedCalls.push(event);
      return { event, modelResult: GENERIC_TOOL_ERROR };
    }

    const fixtureCalls = this.fixtures?.[toolName]?.expected_calls ?? [];

    if (fixtureCalls.length === 0) {
      const event = {
        ...baseEvent,
        tool_output_raw: GENERIC_TOOL_ERROR,
        tool_output_normalized: GENERIC_TOOL_ERROR,
        tool_call_status: "blocked",
        mismatch_reason: "unwarranted_tool_call",
        call_finished_at_utc: new Date().toISOString(),
      };
      this.executedCalls.push(event);
      return { event, modelResult: GENERIC_TOOL_ERROR };
    }

    const match = fixtureCalls.find((fc) =>
      shallowArgsEqual(
        normalizeArgs(fc.arguments_normalized ?? {}),
        argsNormalized
      )
    );

    if (!match) {
      const event = {
        ...baseEvent,
        tool_output_raw: GENERIC_TOOL_ERROR,
        tool_output_normalized: GENERIC_TOOL_ERROR,
        tool_call_status: "error",
        mismatch_reason: "arguments_no_fixture_match",
        call_finished_at_utc: new Date().toISOString(),
      };
      this.executedCalls.push(event);
      return { event, modelResult: GENERIC_TOOL_ERROR };
    }

    const duplicate = this.executedCalls.some(
      (c) =>
        c.tool_name === toolName &&
        c.tool_call_status === "success" &&
        shallowArgsEqual(c.arguments_normalized, argsNormalized)
    );
    if (duplicate) {
      const event = {
        ...baseEvent,
        tool_output_raw: GENERIC_TOOL_ERROR,
        tool_output_normalized: GENERIC_TOOL_ERROR,
        tool_call_status: "blocked",
        mismatch_reason: "duplicate_tool_call",
        call_finished_at_utc: new Date().toISOString(),
      };
      this.executedCalls.push(event);
      return { event, modelResult: GENERIC_TOOL_ERROR };
    }

    const result = normalizeToolResult(toolName, match);
    const event = {
      ...baseEvent,
      tool_output_raw: result,
      tool_output_normalized: result,
      tool_call_status: "success",
      call_finished_at_utc: new Date().toISOString(),
    };
    this.executedCalls.push(event);
    return { event, modelResult: result };
  }

  getSequence() {
    return [...this.executedCalls];
  }

  checkPrerequisites(toolName) {
    if (toolName === "service_check") return null;

    const successfulServiceCheck = this.executedCalls.find(
      (call) =>
        call.tool_name === "service_check" &&
        call.tool_call_status === "success" &&
        call.tool_output_normalized?.serviceable === true
    );
    if (toolName === "check_slots" && !successfulServiceCheck) {
      return "check_slots_before_successful_service_check";
    }

    const successfulSlotFetch = this.executedCalls.find(
      (call) =>
        call.tool_name === "check_slots" &&
        call.tool_call_status === "success" &&
        Array.isArray(call.tool_output_normalized?.slots)
    );
    if (toolName === "book_slot" && !successfulSlotFetch) {
      return "book_slot_before_successful_slot_fetch";
    }

    return null;
  }
}

function normalizeToolResult(toolName, fixtureCall) {
  if (toolName === "service_check") {
    return fixtureCall.result ?? { serviceable: false, failure_reason: "unknown" };
  }
  if (toolName === "check_slots") {
    const resultType = fixtureCall.result_type ?? "slots_returned";
    if (resultType === "busy") return { status: "busy" };
    if (resultType === "empty_array") return { slots: [] };
    return fixtureCall.result ?? { slots: [] };
  }
  if (toolName === "book_slot") {
    return (
      fixtureCall.result ?? {
        booking_result_type: "booking_failure",
      }
    );
  }
  return fixtureCall.result ?? {};
}
