import { ENUM_CASE_INSENSITIVE_KEYS } from "./constants.js";

export function normalizeZipCode(value) {
  if (value === null || value === undefined) return "";
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return String(value).trim();
  return digits.slice(0, 5);
}

export function normalizeBookingName(value) {
  if (value === null || value === undefined) return "";
  const collapsed = String(value).trim().replace(/\s+/g, " ");
  if (!collapsed) return "";
  const first = collapsed.split(" ")[0];
  return first.toLowerCase();
}

export function normalizeScalar(v, key) {
  if (v === null || v === undefined) return "";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  let s = String(v).trim();
  if (key === "zip_code") return normalizeZipCode(s);
  if (key === "booking_name") return normalizeBookingName(s);
  if (ENUM_CASE_INSENSITIVE_KEYS.has(key)) return s.toLowerCase();
  if (key.endsWith("_name")) return s.toLowerCase();
  return s;
}

export function normalizeArgs(args) {
  const out = {};
  if (!args || typeof args !== "object") return out;
  for (const [k, v] of Object.entries(args)) {
    if (Array.isArray(v)) {
      out[k] = v.map((item) => String(item).trim());
    } else {
      out[k] = normalizeScalar(v, k);
    }
  }
  return out;
}

export function shallowArgsEqual(a, b) {
  const ka = Object.keys(a).sort();
  const kb = Object.keys(b).sort();
  if (ka.length !== kb.length) return false;
  for (let i = 0; i < ka.length; i += 1) {
    if (ka[i] !== kb[i]) return false;
    const av = a[ka[i]];
    const bv = b[kb[i]];
    if (Array.isArray(av) || Array.isArray(bv)) {
      if (!Array.isArray(av) || !Array.isArray(bv)) return false;
      if (av.length !== bv.length) return false;
      for (let j = 0; j < av.length; j += 1) {
        if (av[j] !== bv[j]) return false;
      }
    } else if (av !== bv) {
      return false;
    }
  }
  return true;
}

/** Order-insensitive set of slot IDs (eval: unsorted F3 lists must not fail). */
export function normalizeReturnedSlotIds(value) {
  let ids = [];
  if (Array.isArray(value)) {
    ids = value.map((v) => String(v).trim()).filter(Boolean);
  } else if (typeof value === "string") {
    ids = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  } else {
    return "";
  }
  return [...ids].sort((a, b) => a.localeCompare(b)).join(",");
}

export function extractJsonObject(rawText) {
  if (!rawText || typeof rawText !== "string") return null;
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // try fenced block
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const candidate = trimmed.slice(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}
