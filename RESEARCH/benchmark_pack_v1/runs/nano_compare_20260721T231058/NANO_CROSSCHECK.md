# Nano cross-check: real floor vs harness bug?

**Date:** 2026-07-21  
**Folder:** `RESEARCH/benchmark_pack_v1/runs/nano_compare_20260721T231058/`  
**Challenge:** rehearsal_40 nano hit **0%** — is that a legitimate model floor, or did we mis-configure the harness for nano?

---

## Verdict (one line)

**FAIR_FLOOR** (mechanism critic 2026-07-22) — same tools/multi-turn/final path as luna; no silent disable; 0–2% is a real relative floor under locked Track 1. Format-fragile nuance remains (SO off on most F2–F6 finals for *both* models). Full write-up: `CRITIC_NANO_MECHANISM.md`.

| Label | Fits? |
|-------|--------|
| **FAIR_FLOOR** (under Track 1 harness as locked) | **Yes** — same code path as luna; nano fails hard |
| PARTLY_UNFAIR | No as primary — `minimal`≠`none` is API-forced remap only |
| HARNESS_BUG / silent SO drop / dead tools | **No** |
| Mixed (format-fragile) | **Yes as nuance** — Track 1 often does **not** attach Structured Outputs on early tool-capable turns; nano free-forms incomplete JSON; luna does not. When SO *is* forced, nano can emit `final_status` |

---

## 1) Why run full_120 after 0/40?

**For directional “is nano worse?” — 40 was enough; 120 was confirmatory, not necessary.**

We ran 120 because the original job said: if rehearsal succeeds *cleanly* (API completes), also run full_120. It adds:
- scale confirmation (1.7% not 0%, still near floor; Δ still ~−85–88 pp)
- evidence the rehearsal mix wasn’t a fluke composition

It does **not** change the decision. If the goal is only a cheap gap probe, stop after a clean 0/40.

---

## 2A) Infra vs model

| Run | n | infra_error | unscorable | empty traces | timeouts | token_usage=0 | stop_reason |
|-----|---|-------------|------------|--------------|----------|---------------|-------------|
| rehearsal_40 nano | 40 | **0** | 0 | 0 | 0 | 0 | completed ×40 |
| full_120 nano | 120 | **0** | 0 | 0 | 0 | 0 | completed ×120 |

- **100%** finals JSON-parseable; real token counts (reh mean ~2.7k tok/run; full ~3.2k).
- Tools used: 21/40 reh, 79/120 full had ≥1 tool call — not a “tools never attached” failure.
- Latency sane (p50 ~2–3s, max ~9s) — not timeout storms.

→ Failures are **scored model/eval fails**, not technical errors.

---

## 2B) Nano API wiring (re-read + live check)

### Code (`scripts/harness/providers/openai.js`)

Nano-only branches (luna unchanged):
1. B1 → `reasoning.effort: "minimal"` (nano rejects `"none"`)
2. Omit `temperature` on nano (luna B1 still `temperature: 0`)
3. Tools: same `strict: true` function tools for both
4. Structured Outputs: same `text.format.json_schema` when `forceJson` — **no nano-specific disable**

### When is SO actually attached? (`executor.js`)

```
includeTools = tools.length > 0 && turn < MAX_TURNS - 1
forceJson    = !includeTools || turn === MAX_TURNS - 1
```

So on **normal tool-capable early turns**, SO is **off** for **both** models. Final answer is free-form JSON until max-turn. That is Track 1 protocol behavior, not a nano-only miss.

### Live API probes (same session)

| Probe | Result |
|-------|--------|
| nano + F1 `json_schema` strict | Works — valid extraction object |
| nano + F5 `json_schema` strict | Works — includes `final_status` + `customer_response` |
| luna + F5 SO | Works (same shape) |
| nano + tools, no SO | Returns free-form / wrong-shaped JSON; may skip tools |

→ SO and tools are **not** silently unsupported on nano. Wiring works. Nano’s main-run failures are **not** “schema never enforced because API ignored it on every turn.”

### Spot-check pattern (rehearsal raw)

- **F1:** SO on (no tools) → schema_valid, but **wrong semantics** (`intent=unknown`, bad zip) while luna passes same tickets.
- **F2–F6:** Often emit extraction-only object (no `final_status` / `customer_response`) even after calling tools → `output.schema_invalid`.
- reh40 non-F1: nano **35/37** missing `final_status`; luna screen **0/37**. Nano early-exit with tools available but unused: 16/37; luna: 3/37.

---

## 2C) Fairness micro-probe (side-by-side)

**Out:** `crosscheck_f1_f5/` — 3 F1 + 5 F5 rehearsal cases × nano + luna × A1 × B1 = 16 runs.

| Slice | nano pass | luna pass |
|-------|-----------|-----------|
| F1_extract (n=3) | **0/3** (schema OK; intent/zip wrong) | **3/3** |
| F5_full_flow (n=5) | **0/5** (all schema_invalid; extraction-only finals) | **5/5** (full status fields; tools OK) |
| Paired | nano win **0**, lose **8**, tie **0** | |

This kills the “maybe only hard F6 / weird rehearsal” story: on **easy F1 with SO enforced**, nano still loses to luna on content. On **F5**, same harness, luna completes the agent loop; nano does not emit required final fields.

No harness fix was applied — wiring looked OK; gap is model behavior under protocol.

---

## 2D) What would a *fairer* nano vs luna ask require?

**Current compare is fair for:** “Under locked Track 1 multi-turn harness (A1×B1), does nano do worse than luna?” → **Yes, dramatically.**

**If the worry is absolute capability with schema always enforced**, you’d need a **different protocol** (label as diagnostic, not Track 1):
- Force `json_schema` on the final answer turn even when tools exist (e.g. after model stops tool-calling, or always dual-phase tool-then-SO).
- Optionally raise nano effort (`low`/`medium`) as a separate arm — B1 `minimal` ≠ luna `none`, but that’s an API constraint, not a bug.
- Do **not** claim that arm as Track 1 confirmatory without a protocol lock update.

Under that SO-always-final protocol, live probes suggest nano’s **format** floor would rise; **semantic/tool** gaps (F1 intent/zip, F5 sequencing) would still need measuring.

---

## Bottom line for the owner

1. **0% is not empty/timeout/mis-wired SO.** Infra clean; tools fire; SO works when attached.
2. **Under Track 1 as locked, nano is near floor vs luna** — legitimate relative result; F1 SO-on fails still prove real weakness.
3. **Nuance:** many F2–F6 fails are format-fragile under “no SO on early tool turns”; luna follows the prompt, nano dumps extraction-only. That’s model fragility on the shared protocol, not a nano-only harness bug.
4. **full_120 was optional confirmation** after a clean 0/40 — redundant for the yes/no, useful for scale.

Artifacts: this file; `NANO_COMPARE_FINDINGS.md`; `rehearsal40_a1_b1/`; `full120_a1_b1/`; `crosscheck_f1_f5/`.
