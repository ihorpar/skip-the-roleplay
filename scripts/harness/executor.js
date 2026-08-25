import crypto from "crypto";
import { MAX_TURNS, PROMPT_STYLE_ALIASES } from "./constants.js";
import { buildSystemPrompt, buildUserPrompt } from "./prompts.js";
import {
  buildFinalOutputJsonSchema,
  buildToolSchemas,
  validateFamilySchema,
} from "./schemas.js";
import { extractJsonObject } from "./normalization.js";
import { evaluateRunFromTrace } from "./evaluator.js";
import { ToolSimulator } from "./tools/simulator.js";
import { sendProviderTurn } from "./providers/index.js";

function mergeUsage(acc, next) {
  if (!next) return acc;
  const out = { ...(acc ?? {}) };
  for (const [k, v] of Object.entries(next)) {
    if (typeof v === "number") out[k] = (out[k] ?? 0) + v;
  }
  return out;
}

/** Drop null optional fields produced by strict nullable Structured Outputs. */
function stripNullOptionals(parsed) {
  if (!parsed || typeof parsed !== "object") return parsed;
  const out = { ...parsed };
  for (const key of ["returned_slot_ids", "selected_slot_id"]) {
    if (out[key] === null) delete out[key];
  }
  return out;
}

function buildRunId(parts) {
  return crypto.createHash("md5").update(parts.join("|")).digest("hex").slice(0, 12);
}

export async function runMultiTurnInference({
  taskCase,
  provider,
  model,
  promptStyle,
  modeCondition,
}) {
  const taskFamily = taskCase.task?.task_family ?? "unknown";
  const systemPrompt = buildSystemPrompt(promptStyle, taskFamily);
  const userPrompt = buildUserPrompt(taskCase);
  const toolSchemas = buildToolSchemas(taskCase.task?.available_tools ?? []);

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const simulator = new ToolSimulator(taskCase);
  const rawModelTurns = [];
  const runStartMs = Date.now();
  let usage = null;
  let finalText = "";
  let finalParsed = null;
  let evalStatus = "scored";
  let infraError = null;
  let stopReason = "completed";
  let schema = { valid: false, errors: [] };

  try {
    let lastTurn = 0;
    for (let turn = 0; turn < MAX_TURNS; turn += 1) {
      lastTurn = turn;
      const turnStart = new Date().toISOString();
      const includeTools = toolSchemas.length > 0 && turn < MAX_TURNS - 1;
      const forceJson = !includeTools || turn === MAX_TURNS - 1;
      const jsonSchema = forceJson ? buildFinalOutputJsonSchema(taskFamily) : null;

      const response = await sendProviderTurn({
        provider,
        model,
        messages,
        toolSchemas,
        modeCondition,
        includeTools,
        forceJson,
        jsonSchema,
      });

      usage = mergeUsage(usage, response.usage);

      rawModelTurns.push({
        step_index: turn + 1,
        role: "assistant",
        content_raw: response.text || JSON.stringify(response.toolCalls),
        tool_calls: response.toolCalls,
        timestamp_start_utc: turnStart,
        timestamp_end_utc: new Date().toISOString(),
      });

      if (response.toolCalls?.length > 0) {
        messages.push({
          role: "assistant",
          content: response.text || "",
          toolCalls: response.toolCalls,
          geminiParts: response.geminiParts ?? null,
        });

        for (let callIndex = 0; callIndex < response.toolCalls.length; callIndex += 1) {
          const call = response.toolCalls[callIndex];
          const { modelResult } = simulator.execute(call.name, call.arguments, {
            turnIndex: turn + 1,
            callIndexInTurn: callIndex,
          });
          messages.push({
            role: "tool",
            callId: call.id,
            geminiCallId: call.geminiCallId ?? null,
            name: call.name,
            result: modelResult,
          });
        }
        continue;
      }

      finalText = response.text;
      finalParsed = stripNullOptionals(extractJsonObject(finalText));
      if (finalParsed) break;
      if (turn === MAX_TURNS - 1) {
        stopReason = "max_turns_no_json";
      }
    }

    if (!finalParsed) {
      stopReason =
        lastTurn === MAX_TURNS - 1 ? "max_turns_no_json" : "no_final_json";
    } else {
      schema = validateFamilySchema(finalParsed, taskFamily);
    }
  } catch (err) {
    evalStatus = "infra_error";
    infraError = String(err?.message ?? err);
    stopReason = "infra_error";
  }

  const elapsedMs = Date.now() - runStartMs;
  const toolCallSequence = simulator.getSequence();
  const jsonValid = Boolean(finalParsed);

  let evaluation = {
    semantic_pass: false,
    semantic_mismatches: [],
    tool_counts: { tp: 0, fp: 0, fn: 0, arg_correct: 0 },
    tool_call_exact_match: false,
    over_action: false,
    under_action: false,
    evaluator_result: {
      eval_status: evalStatus,
      pass: false,
      primary_failure_subcode: "not_applicable",
      all_failure_subcodes: [],
      metric_components: {},
    },
  };

  if (evalStatus === "scored") {
    evaluation = evaluateRunFromTrace({
      taskCase,
      finalParsed,
      toolCallSequence,
      jsonValid,
      schemaValid: schema.valid,
    });
  }

  const promptCondition =
    PROMPT_STYLE_ALIASES[promptStyle] ?? promptStyle;

  const trace = {
    run_id: buildRunId([
      taskCase.case_id,
      provider,
      model,
      promptStyle,
      modeCondition,
      String(runStartMs),
    ]),
    eval_spec_version: "v1_partial",
    contract_version: "track1_locked",
    timestamp_utc: new Date(runStartMs).toISOString(),
    provider,
    model,
    prompt_condition: promptCondition,
    prompt_style: promptStyle,
    mode_condition: modeCondition,
    task_id: taskCase.task?.task_id ?? taskCase.case_id,
    task_family: taskFamily,
    case_id: taskCase.case_id,
    pressure_tags: taskCase.task?.pressure_tags ?? [],
    current_local_datetime: taskCase.task?.input?.current_local_datetime,
    timezone: taskCase.task?.input?.timezone,
    system_prompt: systemPrompt,
    user_prompt: userPrompt,
    full_prompt: `${systemPrompt}\n\n${userPrompt}`,
    tool_schemas: toolSchemas,
    raw_model_turns: rawModelTurns,
    tool_call_sequence: toolCallSequence,
    final_output_raw: finalText,
    final_output_json: finalParsed,
    final_output_json_valid: jsonValid,
    final_output_schema_valid: schema.valid,
    parsed_semantic_fields: finalParsed ?? {},
    stop_reason: stopReason,
    turn_count: rawModelTurns.length,
    token_usage: usage,
    latency: {
      run_start_timestamp_ms: runStartMs,
      run_end_timestamp_ms: Date.now(),
      end_to_end_ms: elapsedMs,
    },
    evaluator_result: evaluation.evaluator_result,
  };

  return {
    ...trace,
    eval_status: evalStatus,
    latency_ms: elapsedMs,
    raw_text: finalText,
    parsed_output: finalParsed,
    json_valid: jsonValid,
    schema_valid: schema.valid,
    schema_errors: schema.errors,
    semantic_pass: evaluation.semantic_pass,
    semantic_mismatches: evaluation.semantic_mismatches,
    tool_counts: evaluation.tool_counts,
    tool_call_exact_match: evaluation.tool_call_exact_match,
    over_action: evaluation.over_action,
    under_action: evaluation.under_action,
    usage,
    infra_error: infraError,
    harness_mode: "multi_turn",
  };
}
