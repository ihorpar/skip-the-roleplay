import { sendOpenAiTurn } from "./openai.js";
import { sendGeminiTurn } from "./gemini.js";

export async function sendProviderTurn({
  provider,
  model,
  messages,
  toolSchemas,
  modeCondition,
  includeTools,
  forceJson,
  jsonSchema,
}) {
  if (provider === "openai") {
    return sendOpenAiTurn({
      model,
      messages,
      toolSchemas,
      modeCondition,
      includeTools,
      forceJson,
      jsonSchema,
    });
  }
  if (provider === "gemini") {
    return sendGeminiTurn({
      model,
      messages,
      toolSchemas,
      modeCondition,
      includeTools,
      forceJson,
      jsonSchema,
    });
  }
  throw new Error(`Unsupported provider: ${provider}`);
}
