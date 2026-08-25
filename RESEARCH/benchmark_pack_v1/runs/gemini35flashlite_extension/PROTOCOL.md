# Protocol: Gemini 3.5 Flash-Lite free-tier screen

**Date:** 2026-07-30  
**Model:** `gemini:gemini-3.5-flash-lite`  
**Mode:** `B1_instant` → `thinkingLevel: minimal` · no `maxOutputTokens`  
**Status:** Capacity measured — **free day budget exhausted / RPM-bound**; stop for today

## Capacity estimate (measured)

| Item | Value |
|------|--------|
| Avg API calls / scored case (OpenAI ref) | ~2.9 |
| Smoke (clean) | 5 scored, 0 infra · ~12 API calls |
| Free RPM (practical) | **≤15** — unthrottled concurrency=1 still 429s |
| Free RPD (practical today) | **~burned after ~230–400 calls + 429 retries** |

### What fits in one free day (with 4.5s throttle ≈ 13 RPM)

| Design | Scored | Est. API | Wall @ 4.5s/call | Verdict |
|--------|-------:|---------:|------------------:|---------|
| Smoke 5 | 5 | ~12 | ~1 min | Easy |
| reh40 × **1** style | 40 | ~115 | ~10–15 min | Safe |
| reh40 × **2** styles | 80 | ~230 | ~20–30 min | Safe |
| reh40 × **4** styles | 160 | ~460 | ~40–60 min | Needs clean throttle + headroom |
| full_120 × 1 style | 120 | ~345 | ~30–45 min | Possible if RPD ≥1k |
| full_120 × 4 × 1 | 480 | ~1,380 | ~2+ hrs | Needs ~1.5k RPD **or paid** |
| full_120 × 4 × 3 | 1440 | ~4,130 | — | Multi-day free / paid |

## Runs today

### Smoke (clean) — DONE
`gemini35flashlite_smoke_20260730_102407` — 5/5 scored, 0 infra, pass 80%

### Stage A unthrottled reh40 × 4 — DONE (noisy)
`gemini35flashlite_reh40_20260730_110210`

| Metric | Value |
|--------|------:|
| Total | 160 |
| Scored | 80 |
| Infra (all **429**) | **80** |
| API turns logged | 231 |
| Pass among scored | 41.3% |

Pass among scored (biased — hard families often 429’d):

| Style | Pass / scored |
|-------|--------------:|
| A1 | 7/23 (~30%) |
| A2 | 10/20 (50%) |
| A3 | 8/17 (~47%) |
| pureLong | 8/20 (40%) |

**Do not treat as a persona result** — 50% infra on F4/F5/F6.

### Stage A throttled re-run — ABORTED
`gemini35flashlite_reh40_throttled_20260730_111955`  
Harness updated: 4.5s Gemini spacing + longer 429 backoff. Run reached ~85/160 then stalled in long 429 retries (RPD/RPM exhausted after earlier burn). **Killed** after ~90+ min.

## Harness fixes landed
- Strip `additionalProperties` from Gemini tool schemas
- Replay `thoughtSignature` / exact model parts
- `thinkingLevel: minimal` for B1 on Gemini 3.x
- `GEMINI_MIN_INTERVAL_MS` default 4500 + stronger 429 backoff

## Next (tomorrow / paid)
1. Confirm live RPM/RPD in AI Studio for this project.
2. Fresh day: **reh40 × A1 + A2 only** (or ×4 with throttle from cold start).
3. Or enable billing (Tier 1) and run full_120 × 4 × 1 properly.
