import crypto from "crypto";
import { extractJsonObject, normalizeArgs, normalizeScalar, shallowArgsEqual } from "./normalization.js";
import { EXTRACTION_KEYS } from "./constants.js";
import { requestJsonWithRetry } from "./http.js";

function buildLegacyUserPrompt(taskCase) {
  const task = taskCase.task;
  const fixtures = taskCase.fixtures;
  const fixtureSummary = {
    service_check: fixtures?.service_check?.expected_calls ?? [],
    check_slots: fixtures?.check_slots?.expected_calls ?? [],
    book_slot: fixtures?.book_slot?.expected_calls ?? [],
  };
  const payload = {
    case_id: taskCase.case_id,
    task_family: task.task_family,
    user_text: task.input.user_text,
    current_local_datetime: task.input.current_local_datetime,
    timezone: task.input.timezone,
    available_tools: task.available_tools,
    tool_fixtures: fixtureSummary,
  };
  return [
    "Solve the following task and return only the JSON response object.",
    "Task payload:",
    JSON.stringify(payload, null, 2),
  ].join("\n");
}

function buildLegacySystemPrompt(promptStyle, modeCondition) {
  const base = [
    "You are running a deterministic benchmark task.",
    "Return ONE JSON object only, no markdown.",
    'Use shape: { "extraction": {...}, "tool_calls": [...], "final_output": {...} }',
  ];
  if (modeCondition === "B2_thinking") {
    base.push("- Think carefully through edge cases before final JSON.");
  }
  if (promptStyle === "A1_task") {
    base.push("- Focus on strict task execution and policy compliance.");
  } else {
    base.push("- Role (A3): senior booking operations specialist.");
  }
  return base.join("\n");
}

function validateLegacySchema(parsed) {
  if (!parsed || typeof parsed !== "object") {
    return { valid: false, errors: ["top_level_not_object"] };
  }
  const errors = [];
  if (!parsed.extraction || typeof parsed.extraction !== "object") {
    errors.push("missing_extraction_object");
  } else {
    for (const key of EXTRACTION_KEYS) {
      if (typeof parsed.extraction[key] !== "string") errors.push(`bad_extraction_${key}`);
    }
  }
  if (!Array.isArray(parsed.tool_calls)) errors.push("missing_tool_calls_array");
  if (!parsed.final_output || typeof parsed.final_output !== "object") {
    errors.push("missing_final_output_object");
  }
  return { valid: errors.length === 0, errors };
}

function evaluateLegacyRun(taskCase, parsed, jsonValid, schemaValid) {
  const expectedTools = taskCase.gold?.expected_tool_sequence ?? [];
  const expectedSemantic = taskCase.gold?.expected_semantic_output ?? {};
  const predictedTools = Array.isArray(parsed?.tool_calls) ? parsed.tool_calls : [];
  const predictedSemantic = {
    ...(parsed?.extraction ?? {}),
    ...(parsed?.final_output ?? {}),
  };

  const mismatches = [];
  for (const [k, expectedValueRaw] of Object.entries(expectedSemantic)) {
    const expectedValue = normalizeScalar(expectedValueRaw, k);
    const predictedValue = normalizeScalar(predictedSemantic[k], k);
    if (expectedValue !== predictedValue) {
      mismatches.push({ field: k, expected: expectedValueRaw, actual: predictedSemantic[k] ?? null });
    }
  }
  const semanticPass = jsonValid && schemaValid && mismatches.length === 0;

  let tp = 0;
  let argCorrect = 0;
  let toolMismatch = false;
  const maxLen = Math.max(expectedTools.length, predictedTools.length);
  for (let i = 0; i < maxLen; i += 1) {
    const expected = expectedTools[i];
    const predicted = predictedTools[i];
    if (!expected || !predicted) {
      toolMismatch = true;
      continue;
    }
    if (
      normalizeScalar(expected.tool_name, "tool_name") ===
      normalizeScalar(predicted.tool_name, "tool_name")
    ) {
      tp += 1;
      if (
        shallowArgsEqual(
          normalizeArgs(expected.arguments_normalized ?? {}),
          normalizeArgs(predicted.arguments ?? {})
        )
      ) {
        argCorrect += 1;
      }
    } else {
      toolMismatch = true;
    }
  }

  const fp = Math.max(0, predictedTools.length - tp);
  const fn = Math.max(0, expectedTools.length - tp);
  return {
    semantic_pass: semanticPass,
    semantic_mismatches: mismatches,
    tool_counts: { tp, fp, fn, arg_correct: argCorrect },
    tool_call_exact_match:
      !toolMismatch && predictedTools.length === expectedTools.length,
    over_action:
      predictedTools.length > expectedTools.length ||
      (toolMismatch && predictedTools.length >= expectedTools.length),
    under_action:
      predictedTools.length < expectedTools.length ||
      (toolMismatch && expectedTools.length >= predictedTools.length),
  };
}

function extractOpenAIText(respJson) {
  if (typeof respJson?.output_text === "string" && respJson.output_text.trim()) {
    return respJson.output_text.trim();
  }
  const chunks = [];
  for (const item of respJson?.output ?? []) {
    for (const c of item?.content ?? []) {
      if (typeof c?.text === "string") chunks.push(c.text);
      if (typeof c?.output_text === "string") chunks.push(c.output_text);
    }
  }
  return chunks.join("\n").trim();
}

function extractGeminiText(respJson) {
  const parts = respJson?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts.map((p) => (typeof p?.text === "string" ? p.text : "")).join("\n").trim();
}

async function callOpenAILegacy({ model, systemPrompt, userPrompt, modeCondition }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not found");
  const payload = {
    model,
    max_output_tokens: 3000,
    reasoning: { effort: modeCondition === "B2_thinking" ? "medium" : "none" },
    input: [
      { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
      { role: "user", content: [{ type: "input_text", text: userPrompt }] },
    ],
  };
  if (modeCondition === "B1_instant") payload.temperature = 0;
  const json = await requestJsonWithRetry(
    "https://api.openai.com/v1/responses",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    "OpenAI"
  );
  return { text: extractOpenAIText(json), usage: json.usage ?? null };
}

async function callGeminiLegacy({ model, systemPrompt, userPrompt, modeCondition }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not found");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const modeHint =
    modeCondition === "B2_thinking"
      ? "Use careful multi-step reasoning internally before final JSON."
      : "Be concise; avoid extra deliberation. Return JSON quickly.";
  const payload = {
    systemInstruction: { parts: [{ text: `${systemPrompt}\n${modeHint}` }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
      maxOutputTokens: 3000,
    },
  };
  const json = await requestJsonWithRetry(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Gemini"
  );
  return { text: extractGeminiText(json), usage: json.usageMetadata ?? null };
}

export async function runLegacySingleShot({
  taskCase,
  provider,
  model,
  promptStyle,
  modeCondition,
}) {
  const experimentalWarning =
    "non_experimental_legacy: confounded prompts; do not use for A/B condition comparisons";
  const systemPrompt = buildLegacySystemPrompt(promptStyle, modeCondition);
  const userPrompt = buildLegacyUserPrompt(taskCase);
  const startMs = Date.now();
  let rawText = "";
  let usage = null;
  let parsed = null;
  let schema = { valid: false, errors: [] };
  let evalStatus = "scored";
  let infraError = null;

  try {
    const response =
      provider === "openai"
        ? await callOpenAILegacy({ model, systemPrompt, userPrompt, modeCondition })
        : await callGeminiLegacy({ model, systemPrompt, userPrompt, modeCondition });
    rawText = response.text;
    usage = response.usage;
    parsed = extractJsonObject(rawText);
    if (!parsed) evalStatus = "eval_unscorable";
    else {
      schema = validateLegacySchema(parsed);
      if (!schema.valid) evalStatus = "eval_unscorable";
    }
  } catch (err) {
    evalStatus = "infra_error";
    infraError = String(err?.message ?? err);
  }

  const elapsedMs = Date.now() - startMs;
  let evaluation = {
    semantic_pass: false,
    semantic_mismatches: [],
    tool_counts: { tp: 0, fp: 0, fn: 0, arg_correct: 0 },
    tool_call_exact_match: false,
    over_action: false,
    under_action: false,
  };
  if (evalStatus === "scored") {
    evaluation = evaluateLegacyRun(taskCase, parsed, true, schema.valid);
  }

  return {
    run_id: crypto
      .createHash("md5")
      .update([taskCase.case_id, provider, model, promptStyle, modeCondition, Date.now()].join("|"))
      .digest("hex")
      .slice(0, 12),
    case_id: taskCase.case_id,
    task_id: taskCase.task?.task_id ?? taskCase.case_id,
    task_family: taskCase.task?.task_family ?? "unknown",
    provider,
    model,
    prompt_style: promptStyle,
    mode_condition: modeCondition,
    eval_status: evalStatus,
    latency_ms: elapsedMs,
    raw_text: rawText,
    parsed_output: parsed,
    json_valid: Boolean(parsed),
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
    harness_mode: "legacy_single_shot",
    experimental_warning: experimentalWarning,
  };
}
