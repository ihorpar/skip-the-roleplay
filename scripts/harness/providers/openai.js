import { requestJsonWithRetry } from "../http.js";

function toOpenAiTools(toolSchemas) {
  return toolSchemas.map((t) => ({
    type: "function",
    name: t.tool_name,
    description: t.description,
    parameters: t.parameters,
    strict: true,
  }));
}

function buildOpenAiInput(messages) {
  const input = [];
  for (const msg of messages) {
    if (msg.role === "system") {
      input.push({
        role: "system",
        content: [{ type: "input_text", text: msg.content }],
      });
    } else if (msg.role === "user") {
      input.push({
        role: "user",
        content: [{ type: "input_text", text: msg.content }],
      });
    } else if (msg.role === "assistant") {
      if (msg.content) {
        input.push({
          role: "assistant",
          content: [{ type: "output_text", text: msg.content }],
        });
      }
      for (const call of msg.toolCalls ?? []) {
        input.push({
          type: "function_call",
          call_id: call.id,
          name: call.name,
          arguments:
            typeof call.arguments === "string"
              ? call.arguments
              : JSON.stringify(call.arguments ?? {}),
        });
      }
    } else if (msg.role === "tool") {
      input.push({
        type: "function_call_output",
        call_id: msg.callId,
        output:
          typeof msg.result === "string" ? msg.result : JSON.stringify(msg.result ?? {}),
      });
    }
  }
  return input;
}

function parseOpenAiResponse(json) {
  const output = Array.isArray(json?.output) ? json.output : [];
  const toolCalls = [];
  const textChunks = [];

  for (const item of output) {
    if (item?.type === "function_call") {
      let args = {};
      try {
        args =
          typeof item.arguments === "string"
            ? JSON.parse(item.arguments)
            : item.arguments ?? {};
      } catch {
        args = {};
      }
      toolCalls.push({
        id: item.call_id ?? item.id ?? `call_${toolCalls.length}`,
        name: item.name,
        arguments: args,
      });
    }
    if (item?.type === "message") {
      const content = Array.isArray(item.content) ? item.content : [];
      for (const c of content) {
        if (typeof c?.text === "string") textChunks.push(c.text);
        if (typeof c?.output_text === "string") textChunks.push(c.output_text);
      }
    }
  }

  if (!textChunks.length && typeof json?.output_text === "string") {
    textChunks.push(json.output_text);
  }

  return {
    text: textChunks.join("\n").trim(),
    toolCalls,
    raw: json,
    usage: json.usage ?? null,
  };
}

/**
 * gpt-5-nano / gpt-5-mini (not gpt-5.4-*) reject effort "none"; map B1 → "minimal".
 * gpt-5.4-nano / gpt-5.4-mini accept luna-like efforts: none|low|medium|high|xhigh (reject "minimal").
 * gpt-4.1-* (mini/nano/base) rejects the reasoning block entirely (non-reasoning Responses models).
 */
function isGpt5Nano(model) {
  return typeof model === "string" && /^gpt-5-nano($|-)/i.test(model);
}

/** gpt-5-nano and gpt-5-mini B1: effort in {minimal, low, medium, high} — no "none". */
function rejectsNoneReasoningEffort(model) {
  return typeof model === "string" && /^gpt-5-(nano|mini)($|-)/i.test(model);
}

function isGpt41Family(model) {
  return typeof model === "string" && /^gpt-4\.1($|-)/i.test(model);
}

function supportsReasoningEffort(model) {
  return !isGpt41Family(model);
}

function reasoningEffortFor(model, modeCondition) {
  if (modeCondition === "B2_thinking") return "medium";
  // B1_instant: luna + gpt-5.4-* use "none"; gpt-5-nano/mini only accept minimal|low|medium|high
  return rejectsNoneReasoningEffort(model) ? "minimal" : "none";
}

export async function sendOpenAiTurn({
  model,
  messages,
  toolSchemas,
  modeCondition,
  includeTools,
  forceJson,
  jsonSchema,
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not found");

  const payload = {
    model,
    max_output_tokens: 3000,
    // gpt-5.6-luna / gpt-5.4-*: effort in {none, low, medium, high, xhigh[, max]}
    // gpt-5-nano / gpt-5-mini: effort in {minimal, low, medium, high} — no "none"
    // gpt-4.1-*: omit reasoning entirely (unsupported_parameter)
    input: buildOpenAiInput(messages),
  };
  if (supportsReasoningEffort(model)) {
    payload.reasoning = { effort: reasoningEffortFor(model, modeCondition) };
  }
  // Sampling params: luna + gpt-5.4-* + gpt-4.1-* B1 use temperature 0.
  // gpt-5-nano / gpt-5-mini reject temperature; omit for those models.
  if (modeCondition === "B1_instant" && !rejectsNoneReasoningEffort(model)) {
    payload.temperature = 0;
  }
  if (includeTools && toolSchemas.length > 0) {
    payload.tools = toOpenAiTools(toolSchemas);
  }
  if (forceJson) {
    if (jsonSchema) {
      payload.text = {
        format: {
          type: "json_schema",
          name: "track1_final_output",
          strict: true,
          schema: jsonSchema,
        },
      };
    } else {
      payload.text = { format: { type: "json_object" } };
    }
  }

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

  return parseOpenAiResponse(json);
}
