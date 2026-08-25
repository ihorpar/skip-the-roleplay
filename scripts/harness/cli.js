import fs from "fs/promises";
import {
  DEFAULT_MODELS,
  GEMINI_MODEL_ALIASES,
  OPENAI_MODEL_ALIASES,
} from "./constants.js";

export function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

export function parseCsv(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function loadEnvFile(filePath = ".env") {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#")) continue;
      const idx = line.indexOf("=");
      if (idx === -1) continue;
      const k = line.slice(0, idx).trim();
      let v = line.slice(idx + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    // Optional; no-op if absent.
  }
}

export function normalizeModelId(provider, model) {
  if (provider === "openai") {
    return OPENAI_MODEL_ALIASES[model] ?? model;
  }
  if (provider === "gemini") {
    return GEMINI_MODEL_ALIASES[model] ?? model;
  }
  return model;
}

export function parseModels(raw) {
  if (!raw) return DEFAULT_MODELS;
  const parts = parseCsv(raw);
  const parsed = [];
  for (const p of parts) {
    const [provider, modelRaw] = p.split(":").map((x) => x.trim());
    if (!provider || !modelRaw) continue;
    parsed.push({ provider, model: normalizeModelId(provider, modelRaw) });
  }
  return parsed.length ? parsed : DEFAULT_MODELS;
}

export async function runWithConcurrency(items, limit, worker) {
  const results = [];
  let index = 0;
  const runWorker = async () => {
    while (true) {
      const current = index;
      index += 1;
      if (current >= items.length) break;
      const result = await worker(items[current], current);
      results[current] = result;
    }
  };
  const runners = Array.from({ length: Math.max(1, limit) }, () => runWorker());
  await Promise.all(runners);
  return results;
}
