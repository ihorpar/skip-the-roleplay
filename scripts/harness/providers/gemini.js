import { requestJsonWithRetry } from "../http.js";



/** Gemini 3.x Flash / Flash-Lite: thinking_level enum; sampling params deprecated. */

function usesThinkingLevel(model) {

  return /^gemini-3(\.|$)/i.test(String(model));

}



/** JSON Schema for responseJsonSchema / parametersJsonSchema (keeps additionalProperties). */

function sanitizeGeminiJsonSchema(schema) {

  if (!schema || typeof schema !== "object") return schema;

  if (Array.isArray(schema)) {

    return schema.map((item) => sanitizeGeminiJsonSchema(item));

  }

  const out = {};

  for (const [key, value] of Object.entries(schema)) {

    if (key === "$schema" || key === "$id" || key === "unevaluatedProperties") {

      continue;

    }

    out[key] = sanitizeGeminiJsonSchema(value);

  }

  return out;

}

const GEMINI_OPTIONAL_FINAL_FIELDS = new Set([
  "returned_slot_ids",
  "selected_slot_id",
]);

/** Gemini finals: optional slot fields stay in properties but not in `required`. */
function adaptGeminiFinalOutputSchema(schema) {
  const sanitized = sanitizeGeminiJsonSchema(schema);
  if (!sanitized || sanitized.type !== "object" || !Array.isArray(sanitized.required)) {
    return sanitized;
  }
  return {
    ...sanitized,
    required: sanitized.required.filter((key) => !GEMINI_OPTIONAL_FINAL_FIELDS.has(key)),
  };
}

function toGeminiTools(toolSchemas) {

  return [

    {

      functionDeclarations: toolSchemas.map((t) => ({

        name: t.tool_name,

        description: t.description,

        parametersJsonSchema: sanitizeGeminiJsonSchema(t.parameters),

      })),

    },

  ];

}



function buildGeminiContents(messages) {

  const contents = [];

  for (const msg of messages) {

    if (msg.role === "system") continue;

    if (msg.role === "user") {

      contents.push({ role: "user", parts: [{ text: msg.content }] });

    } else if (msg.role === "assistant") {

      // Prefer exact model parts (required for Gemini 3 thought signatures).

      if (Array.isArray(msg.geminiParts) && msg.geminiParts.length) {

        contents.push({ role: "model", parts: msg.geminiParts });

        continue;

      }

      const parts = [];

      if (msg.content) parts.push({ text: msg.content });

      for (const call of msg.toolCalls ?? []) {

        const part = {

          functionCall: {

            name: call.name,

            args: call.arguments ?? {},

          },

        };

        if (call.geminiCallId) part.functionCall.id = call.geminiCallId;

        if (call.thoughtSignature) part.thoughtSignature = call.thoughtSignature;

        parts.push(part);

      }

      if (parts.length) contents.push({ role: "model", parts });

    } else if (msg.role === "tool") {

      const fr = {

        name: msg.name,

        response: msg.result ?? {},

      };

      if (msg.geminiCallId) fr.id = msg.geminiCallId;

      contents.push({

        role: "user",

        parts: [{ functionResponse: fr }],

      });

    }

  }

  return contents;

}



function getSystemText(messages) {

  const system = messages.find((m) => m.role === "system");

  return system?.content ?? "";

}



function normalizeGeminiUsage(usageMetadata) {

  if (!usageMetadata) return null;

  return {

    input_tokens: usageMetadata.promptTokenCount ?? 0,

    output_tokens: usageMetadata.candidatesTokenCount ?? 0,

    reasoning_tokens: usageMetadata.thoughtsTokenCount ?? 0,

    total_tokens: usageMetadata.totalTokenCount ?? 0,

  };

}



function parseGeminiResponse(json) {

  const candidates = Array.isArray(json?.candidates) ? json.candidates : [];

  const parts = candidates?.[0]?.content?.parts ?? [];

  const toolCalls = [];

  const textChunks = [];



  for (const part of parts) {

    if (typeof part?.text === "string" && !part.thought) {

      textChunks.push(part.text);

    }

    if (part?.functionCall) {

      toolCalls.push({

        id: part.functionCall.id ?? `gemini_call_${toolCalls.length}`,

        name: part.functionCall.name,

        arguments: part.functionCall.args ?? {},

        geminiCallId: part.functionCall.id ?? null,

        thoughtSignature: part.thoughtSignature ?? null,

      });

    }

  }



  return {

    text: textChunks.join("\n").trim(),

    toolCalls,

    // Exact parts for multi-turn thought-signature replay

    geminiParts: parts,

    raw: json,

    usage: normalizeGeminiUsage(json.usageMetadata),

  };

}



function buildGenerationConfig({ model, modeCondition, forceJson, jsonSchema, includeTools }) {

  const generationConfig = {};



  // Structured output: schema only on tool-free final turns (tools + schema 400 on same call).

  if (forceJson && jsonSchema && !includeTools) {

    generationConfig.responseMimeType = "application/json";

    generationConfig.responseJsonSchema = adaptGeminiFinalOutputSchema(jsonSchema);

  } else if (forceJson) {

    generationConfig.responseMimeType = "application/json";

  }



  if (usesThinkingLevel(model)) {

    // Gemini 3.x: no temperature / topP / topK; no maxOutputTokens unless set.

    // B1 → minimal (Flash-Lite default / low-latency); B2 → medium.

    generationConfig.thinkingConfig = {

      thinkingLevel: modeCondition === "B2_thinking" ? "medium" : "minimal",

    };

    return generationConfig;

  }



  // Legacy Gemini 2.5 path

  generationConfig.temperature = 0;

  generationConfig.maxOutputTokens = 3000;

  generationConfig.thinkingConfig = {

    thinkingBudget: modeCondition === "B2_thinking" ? 1024 : 0,

  };

  return generationConfig;

}



/** Free-tier Flash-Lite is often ~15 RPM — space requests (~13 RPM). */

const GEMINI_MIN_INTERVAL_MS = Number(process.env.GEMINI_MIN_INTERVAL_MS || 4500);

let geminiGate = Promise.resolve();

let geminiNextAt = 0;



async function withGeminiRateLimit(fn) {

  let release;

  const previous = geminiGate;

  geminiGate = new Promise((resolve) => {

    release = resolve;

  });

  await previous;

  try {

    const wait = Math.max(0, geminiNextAt - Date.now());

    if (wait > 0) await new Promise((r) => setTimeout(r, wait));

    geminiNextAt = Date.now() + GEMINI_MIN_INTERVAL_MS;

    return await fn();

  } finally {

    release();

  }

}



export async function sendGeminiTurn({

  model,

  messages,

  toolSchemas,

  modeCondition,

  includeTools,

  forceJson,

  jsonSchema,

}) {

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) throw new Error("GEMINI_API_KEY not found");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(

    model

  )}:generateContent?key=${encodeURIComponent(apiKey)}`;



  const payload = {

    systemInstruction: {

      parts: [{ text: getSystemText(messages) }],

    },

    contents: buildGeminiContents(messages),

    generationConfig: buildGenerationConfig({

      model,

      modeCondition,

      forceJson,

      jsonSchema,

      includeTools,

    }),

  };

  if (includeTools && toolSchemas.length > 0) {

    payload.tools = toGeminiTools(toolSchemas);

    payload.toolConfig = {

      functionCallingConfig: {

        mode: "VALIDATED",

      },

    };

  }



  const json = await withGeminiRateLimit(() =>

    requestJsonWithRetry(

      url,

      {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(payload),

      },

      "Gemini"

    )

  );



  return parseGeminiResponse(json);

}


