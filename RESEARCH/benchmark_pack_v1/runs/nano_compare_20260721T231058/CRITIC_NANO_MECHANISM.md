# Critic: did we break nano vs luna on mechanism?

**Date:** 2026-07-22  
**Scope:** Re-read harness + rehearsal/full/crosscheck raw traces + gpt-5.4-nano contrast. No new matrix.  
**Supersedes label nuance in** `NANO_CROSSCHECK.md` **for the mechanism question** (that file’s infra/format notes still stand).

---

## Verdict label

**FAIR_FLOOR**

Same executor path for tools, multi-turn loop, and final JSON as luna. No nano-only silent disable of tools or Structured Outputs. Under locked Track 1 A1×B1, **0–2% is a real relative floor** vs luna (~83–93%) and vs gpt-5.4-nano (~40%) on the same harness. Residual API remaps (`minimal` vs `none`, omit temperature) are small and unavoidable — they do not explain the gap.

---

## 1) Same code path? Any nano-only silent disable?

**Same path. No silent disable.**

| Stage | Shared? | Nano-only? |
|-------|---------|------------|
| `executor.js` multi-turn loop | Yes | No |
| When tools attach (`includeTools`) | Yes — tools on if schemas exist and turn &lt; `MAX_TURNS-1` (8) | No |
| When `forceJson` / `json_schema` attach | Yes — `forceJson = !includeTools \|\| last turn` | No |
| Tool schema shape (`strict: true` functions) | Yes | No |
| Responses API `text.format.json_schema` | Same block when `forceJson` | No |
| Nano-only branches in `openai.js` | — | B1 → `reasoning.effort: "minimal"`; omit `temperature` |

Tools and final-answer wiring are not gated on model id. If tools or SO were broken only for `gpt-5-nano`, gpt-5.4-nano would also be dead on the same code; it is not (16/40 = 40%).

---

## 2) Is `minimal` a fair map of luna’s `none`?

**Fair enough for a locked B1 compare; not identical.**

- API fact: `gpt-5-nano` rejects `effort: "none"`; allowed set is `minimal|low|medium|high`.
- Luna / `gpt-5.4-nano` accept `none` (and reject `minimal` for 5.4-nano).
- Harness maps B1 → closest instant-ish setting: nano `minimal`, others `none`. Temperature 0 is sent for luna/5.4-nano B1 and omitted for classic nano (API often 400s).

That is a **condition mismatch**, not a harness bug. It could slightly change nano behavior vs a true `none` world, but:

- We cannot send luna’s exact B1 payload to classic nano.
- The failure mode is overwhelmingly free-form **missing `final_status` / `customer_response`**, under-tooling, and F1 semantic errors — not “spent too much reasoning” or sampling noise.
- Raising nano to `low`/`medium` would be a **different arm**, not fixing a broken compare.

**Does not invalidate “same condition” for directional Track 1 B1.** Document as API-forced remap.

---

## 3) Structured Outputs: when attached? Does nano get/enforce schema on finals?

**Attached only when `forceJson` is true** (no tools available, or last allowed turn). On normal tool-capable early turns, SO is **off for both models**.

### Trace evidence (rehearsal_40, MAX_TURNS=8)

Classify the turn where the model first returns text (no tool calls) as the “final” turn:

| Model | Finals with SO on | Finals with SO off | SO-off with `final_status` present |
|-------|-------------------|--------------------|--------------------------------------|
| gpt-5-nano | 3 (all F1) | 37 | **2 / 37** |
| gpt-5.6-luna (reh r1 A1×B1) | 3 (all F1) | 37 | **37 / 37** |
| gpt-5.4-nano | 3 (all F1) | 37 | **33 / 37** |

Crosscheck F5 (same tickets, SO off on every F5 final):

- nano: 5/5 finals missing `final_status` (extraction-only keys)
- luna: 5/5 finals include `final_status` + pass

So nano **does** receive SO when the harness attaches it (F1: 3/3 schema_valid on reh; crosscheck F1 schema OK). It almost never reaches the last turn, so F2–F6 “finals” are free-form under the **shared** protocol. Luna and 5.4-nano mostly fill the required fields without SO; classic nano usually dumps extraction-only JSON.

Prior live probes (see `NANO_CROSSCHECK.md`): nano + strict F5 `json_schema` **can** emit `final_status` / `customer_response`. The API enforces schema when asked. Main-run 0% is not “SO silently ignored on every turn.”

---

## 4) Why 0% is or isn’t “too weird”

**Looks weird; taxonomy says weaker model on a format-fragile shared protocol — not “API can’t do tools/SO.”**

### Fail taxonomy (rehearsal_40 A1×B1)

| | gpt-5-nano | gpt-5.4-nano | luna reh r1 |
|--|------------|--------------|-------------|
| Pass | **0/40** | **16/40** | **33/40** |
| Primary `output.schema_invalid` | **36** | 16 | 0 |
| Missing `final_status` (non-F1) | **35/37** | 4/37 | **0/37** |
| ≥1 tool call | 21/40 | 34/40 | 33/40 |
| Early exit (tools available, 1 turn, 0 tools) | **16** | 3 | 4 |
| Tool exact match (summary) | 27.5% | 90% | high |
| Infra errors | 0 | 0 | 0 |

Nano reh summary: tool recall **39%**, under-action **55%**. Luna fails are mostly tool/extraction nits with **schema still valid**. Nano fails are mostly **incomplete free-form finals** after weak/partial tool use.

### Same tickets, SO enforced (F1)

Crosscheck: nano **0/3** pass (schema OK, wrong intent/zip); luna **3/3**. That slice alone shows real capability gap with SO on — not a scoring of something the API cannot do.

### Alive control

`gpt-5.4-nano` at ~40% on the **same** executor proves the harness is not secretly nano-poisoned. Classic `gpt-5-nano` is a different, much weaker band on this exam.

**0% is extreme but coherent:** model stops early, often skips needed tools, and free-forms extraction-only JSON where luna writes full Track 1 objects. We are **not** scoring an unsupported API surface (tools + Responses + SO all work when attached).

---

## 5) What would a *fair* nano vs luna comparison require?

Current setup is **fair for:** “Under locked Track 1 multi-turn (A1×B1), how does nano compare to luna?” → near floor.

If the question is absolute agent capability with format held constant:

1. **Force Structured Outputs on the true final answer turn** after the model stops tool-calling (or a fixed tool-then-answer two-phase). Label as diagnostic / protocol variant — not Track 1 confirmatory without a lock update.
2. Keep tools identical; do not disable SO only for one model.
3. Report two numbers: locked Track 1 free-form-final pass vs SO-forced-final pass.
4. Optionally add a nano effort arm (`low`/`medium`) **separate** from B1 — do not pretend `minimal` ≡ `none` beyond “closest instant setting.”
5. Keep gpt-5.4-nano as the mid-tier control whenever classic nano looks “dead.”

Under (1), format pass for nano would likely rise (live SO probes); semantic/tool gaps would remain and still need measuring (F1 already fails with SO on).

---

## 6) Answers in one line each

1. **Same path** for tools / multi-turn / final JSON; nano-only effort+temperature remaps; **no silent SO/tool disable.**  
2. **`minimal` ≈ best available map of `none`**; not identical, not gap-explaining.  
3. **SO only when `forceJson`**; F1 gets it; almost all F2–F6 nano “finals” are **SO-off free-form** (same as luna — luna still shapes correctly).  
4. **0% not too weird once taxonomy is seen**; weaker + format-fragile; API can do tools/SO; 5.4-nano alive on same harness.  
5. Fair relative Track 1 as-is; for absolute fairness add **SO-on-final diagnostic** + optional effort arms.  
6. **FAIR_FLOOR**

---

## Artifacts used

- `scripts/harness/providers/openai.js`, `executor.js`, `schemas.js` (`MAX_TURNS=8`)
- `rehearsal40_a1_b1/`, `full120_a1_b1/`, `crosscheck_f1_f5/`
- `NANO_COMPARE_FINDINGS.md`, `NANO_CROSSCHECK.md`
- Contrast: `runs/nano54_compare_20260721T232743/` (~40%); luna reh r1 / screen A1×B1
- No new diagnostic runs (prior probes + crosscheck already show SO/tools work when attached)
