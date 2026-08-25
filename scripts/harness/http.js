import { REQUEST_RETRIES, REQUEST_TIMEOUT_MS } from "./constants.js";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Longer backoff for free-tier 429s (RPM/RPD). */
function retryDelayMs(status, attempt) {
  if (status === 429) {
    // ~5s, 15s, 45s …
    return Math.min(120_000, 5000 * 3 ** attempt);
  }
  return (attempt + 1) * 1500;
}

export async function requestJsonWithRetry(url, options, providerLabel) {
  const maxAttempts = Math.max(REQUEST_RETRIES, 4);
  for (let attempt = 0; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      const body = await res.text();
      if (!res.ok) {
        const prefix = `${providerLabel} ${res.status}: ${body.slice(0, 1000)}`;
        const retryable = res.status === 429 || res.status >= 500;
        if (retryable && attempt < maxAttempts) {
          await sleep(retryDelayMs(res.status, attempt));
          continue;
        }
        throw new Error(prefix);
      }
      return JSON.parse(body);
    } catch (err) {
      const isAbort = err?.name === "AbortError";
      if ((isAbort || /fetch/i.test(String(err))) && attempt < maxAttempts) {
        await sleep(retryDelayMs(0, attempt));
        continue;
      }
      if (isAbort) {
        throw new Error(`${providerLabel} timeout after ${REQUEST_TIMEOUT_MS}ms`);
      }
      throw err;
    } finally {
      clearTimeout(t);
    }
  }
  throw new Error(`${providerLabel} request failed after retries`);
}
