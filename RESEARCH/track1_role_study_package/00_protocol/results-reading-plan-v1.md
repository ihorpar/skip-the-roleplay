# How We Will Read the Results (Track 1 v1)

**Date:** 2026-07-21  
**Status:** Locked (after review)  
**Audience:** humans running the study (plain language)

This document answers one question: **after we run the models, what counts as a real finding, and what is only “interesting to look at”?**

We write this **before** the big paid runs, so we do not invent the rules after seeing numbers we like.

---

## Tiny glossary

| Word | Meaning |
|------|---------|
| **Ticket** | One exam case (customer text + correct answer + tool fakes) |
| **Condition** | One combo of instruction version (A1/A2/A3) and mode (B1/B2) |
| **Cell** | One ticket under one condition (and one repeat of that pair) |
| **Pass rate** | Share of scored runs that fully match gold (pass / (pass+fail)). Older notes may say “TSR” — same idea. |
| **Paired difference** | Compare A-versions on the **same** tickets (not different ticket sets) |
| **Technical problem** | API/harness failure — not counted as the model “failing the exam” |

---

## 1. What we are comparing

We test three versions of the system instructions (same tickets, same tools, same scoring):

| Code | Meaning |
|------|---------|
| **A1** | Task instructions only (no “you are an agent…” line) |
| **A2** | Same instructions + a short **role** line |
| **A3** | Same instructions + role + **generic competencies** (no coaching for this exam) |

And two model modes (same text; only the API “thinking” switch changes):

| Code | Meaning |
|------|---------|
| **B1** | Instant / no thinking |
| **B2** | Thinking on (medium effort on OpenAI) |

**Model for this study:** OpenAI only, `gpt-5.6-luna`.

**What we hope to learn (in one sentence):**  
In this kind of business-agent setup, does adding a role (and then generic competencies) change how often the model fully finishes the ticket correctly — and does that look different when thinking is on vs off?

---

## 2. What “success” means (the main score)

For each single run of one ticket under one condition:

- **Pass** = the run is scored, and the model’s final answer matches the gold answer under our rules (tools + fields + exact allowed customer phrase).
- **Fail** = scored, but something required is wrong.
- **Technical problem** = the API timed out, rate-limited, returned an error, or the run could not be scored for harness reasons. **This is not a fail of the model’s skill.**

**Main number:** among runs that are **not** technical problems, what share are **Pass**? That is the **pass rate**.

We do **not** promote tool-only or “almost right” scores to the main headline. Those stay as **extra diagnostics** (extraction accuracy, tool sequence, wrong-phrase fails, cost, latency, etc.) to explain *why* passes/fails happened.

---

## 3. What counts as the main comparisons

These are the comparisons we treat as the study’s main answers (always computed **separately inside B1 and inside B2**, then also shown overall if useful):

1. **A2 vs A1** — does adding a role help (or hurt)?
2. **A3 vs A2** — does adding generic competencies on top of the role help (or hurt)?
3. **A3 vs A1** — full role+competencies bundle vs task-only.

**About “does the A-effect change when thinking is on?”**  
We will always **show** A-contrasts side-by-side for B1 and for B2.  
Calling that difference itself a headline finding (“thinking changes whether role helps”) is allowed only under the same claim rule as §7. If the numbers are noisy, we describe it as a pattern, not as proof.

**Default matrix:** every ticket × A1,A2,A3 × B1,B2 × `gpt-5.6-luna`.

---

## 4. What we look at only for understanding (not as proof)

Allowed in reports as **“what we noticed”** — **not** sold as proven main findings:

- Breakdowns by ticket family (extract-only vs full booking vs hard cases, etc.)
- Breakdowns by one pressure tag
- Detailed failure subtypes beyond pass/fail
- Cost and speed (retries can inflate these)

**Why:** some families have few tickets. Easy to see a random spike and call it a discovery.

---

## 5. Two phases: 40 rehearsal vs 120 main exam

| Phase | Purpose | Can we publish “role helped / didn’t”? |
|-------|---------|----------------------------------------|
| **~40 tickets (rehearsal)** | Find broken tickets, harness bugs, unstable API; practice the matrix | **No** — numbers are provisional only |
| **120 tickets (main)** | Frozen exam under this reading plan | **Yes** — claim-ready answers use this phase |

Same reading rules in both phases. **Different authority:** only the frozen 120 supports the final claim language.

### Repeats

| Phase | How many times we re-run each ticket×A×B cell |
|-------|-----------------------------------------------|
| 40 rehearsal | **2** independent repeats |
| 120 main | **3** independent repeats |

A repeat = same ticket, same A, same B, same model — run again from scratch.

---

## 6. Technical problems (API / infra)

1. Count technical-problem runs **separately** from pass/fail.  
2. Main pass rate uses only **scored** runs.  
3. If technical problems are **>10%** of attempts for a whole condition (e.g. all B2), that condition is **not trustworthy** for claims until fixed and re-run.  
4. Re-queue failed cells when possible.  
5. **Pairing rule:** if a ticket still lacks a scored result in any A/B cell needed for a contrast after re-queue, **drop that ticket from that contrast entirely** (do not silently treat missing as fail, and do not compare unequal ticket sets).

---

## 7. How we decide “it helped / it didn’t”

**Unit of analysis = ticket** (not raw run):

1. For each ticket × condition, average pass over its repeats (0–1).  
2. Compare A-versions by pairing the **same tickets**.  
3. When we summarize uncertainty, resample **tickets** (bootstrap), not individual API calls.

**Claim rule for v1 (locked):**

- Report pass rates for A1, A2, A3 (overall and inside B1 / inside B2).  
- Report paired differences in **percentage points**: A2−A1, A3−A2, A3−A1.  
- We may say **“helped”** or **“did not help”** for a contrast only if the ticket-level paired bootstrap 95% interval for that difference **does not include 0**.  
- If the interval includes 0, we say the data **do not show a clear effect** (not “proven useless”).  
- We do **not** invent a family-specific proof from exploratory cuts.  
- We do **not** mix other providers into this v1 reading.

**Claim language (locked):**  
*In this setup — which is often used in real-business agents — role/competencies did / did not help.*

Length of A3 vs A2 is **not** something we correct for; if A3 beats A2 under the rule above, we attribute it to competency **content**.

---

## 8. Order of work

1. Freeze this reading plan.  
2. Build ~40 full tickets.  
3. Rehearsal runs on `gpt-5.6-luna` (provisional numbers only).  
4. Fix ticket/harness bugs.  
5. Build and freeze 120.  
6. Pass the protocol go/no-go gate (infra acceptable, A1/A2/A3 covered).  
7. Main run → findings using §3 + §7; §4 only as “what we noticed.”

---

## 9. What this plan deliberately does *not* claim

- Results for every product outside this scaffolded scheduling-agent setup.  
- Competencies **without** a role (never tested).  
- Gemini/Anthropic in v1.  
- That a nicer sentence not on the allowed phrase list still counts as pass.

---

## 10. Change control

If we change this plan after seeing rehearsal numbers, we must:

1. Date the change and reason in this file.  
2. Mark claims that used the old plan.  
3. Prefer re-running affected matrices over quietly reinterpreting.

**Owner decisions:** `RESEARCH/research-prep-analysis-2026-07-21.md` §0  
**Protocol:** `RESEARCH/benchmark_pack_v1/protocol_lock_v1.md`  
**Review:** 2026-07-21 subagent APPROVE-WITH-EDITS; must-fixes applied in this revision.
