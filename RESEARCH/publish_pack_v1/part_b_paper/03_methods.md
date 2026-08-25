# Methods

*Draft for a research paper. Setup and analysis rules follow the locked study protocol; numbers for the confirmatory matrix appear in Results. Public wording: see `TERMINOLOGY.md`.*

## Research question

We ask whether, in a common tool-using business-agent setup, adding a short role/persona line, and then generic soft competencies, changes how often a frontier model fully completes scheduling **exam cases** correctly, and whether that pattern differs when API-level reasoning ("thinking") is off versus on.

We interpret "clear help / clear harm" only under the pre-set statistical rule below.

## The exam

The exam is a deterministic **appliance-repair scheduling agent** benchmark. Each **exam case** supplies messy customer text, a local clock/timezone, simulated tools, and a gold label. Case families range from extraction-only items that must not book, through to full booking.

**Interaction model.** Each graded attempt is a multi-turn **tool loop** over **one fixed user message** plus fixture-backed tool results, ending in a structured final JSON answer. There is **no** simulated multi-turn customer who clarifies, argues, or changes goals mid-dialogue.

![Exam pipeline](figures/fig1_exam_flow.svg)

*Figure 1. One graded attempt. The customer message is fixed; the system prompt carries the dense task rules plus the A1/A2/A3 block under test; the model runs a tool loop against fixtures and returns a structured answer; a deterministic grader compares everything to gold. Case families stop the loop at different depths.*

The model must call tools when the workflow requires them, and must **not** call them when gold says stop. A case **passes** only if the whole trace matches gold: required tools and arguments, extraction fields, `final_status`, and, where applicable, an exact allowed `customer_response` phrase. Near-misses and paraphrases fail. This is response/trace gold, not "the final database equals the goal state."

Primary outcome: binary pass/fail on **graded** attempts. Tool-sequence and argument diagnostics are secondary and not used for confirmatory prompt-style claims. Case-family and tag breakdowns are exploratory only.

## Case families

The 120 cases split into six families, ordered by how deep the workflow must go:

| Family | What the model must do |
|--------|------------------------|
| F1 extract | Normalize messy text into structured fields. Call no tools. |
| F2 partial flow A | Decide whether `service_check` is warranted (intent gate, missing zip or unit, unsupported units) and stop there. Do not call `check_slots` or `book_slot`. |
| F3 partial flow B | Call `service_check`, then `check_slots`. Do not call `book_slot`. |
| F4 select | Call `service_check` and `check_slots`, then choose the correct slot (lists may be unsorted, slot ids may look alike, some starts may be in the past). Do not call `book_slot`. |
| F5 full flow | Run the whole booking: gate, `service_check`, `check_slots`, select, `book_slot`, and report the outcome. |
| F6 robustness | The hardest mixes (name conflicts, "just skip the checks," unsupported user assumptions), each with one deterministic correct answer. Some require `book_slot`; some require stopping without it. |

Cases also carry pressure modules, such as a stale zip mentioned before the real one, a busy tool result, or a booking-failure fixture. Module combinations are constrained by a binding exclusion list so every case keeps exactly one correct answer.

## Two cases, end to end

**Extraction only (F1).** The customer writes: “Hey, Mira here. Our building elevator was down all morning so I could not message earlier. Dishwasher in my apartment keeps stopping at rinse. We moved from 10021; current place is 10012.” Gold: extract `booking_name = Mira`, `intent = new_job`, `zip_code = 10012`, `unit_type = dishwasher`, `unit_class = residential`, and call no tools. The stale zip 10021 is the trap. Calling `service_check` here fails the case.

**Full booking (F5).** The customer writes: “Jonah here, 10001 apartment. Dishwasher will not start; groceries are coming later so earlier is better.” Local clock: 2026-04-19 08:00, America/New_York. Gold requires `service_check(10001, dishwasher, residential)`, then `check_slots` with the same arguments, then `book_slot(Jonah, slot_700, 2026-04-19T09:00)`, then a final JSON with `final_status = booking_confirmed`, `selected_slot_id = slot_700`, and the exact reply “your booking is confirmed.” Booking any other slot fails. So does a paraphrase of the confirmation phrase.

## Relation to τ-bench

τ-bench [Yao et al., 2024] evaluates tool–agent–**user** dialogues under domain policies with **database-state** gold and reliability metrics such as **pass^k**. Our exam is a different object:

| Dimension | This study | τ-bench-style policy agents |
|-----------|------------|-----------------------------|
| User side | One fixed messy utterance | Simulated multi-turn user |
| Gold | Tools + fields + exact allowed reply / status | Database / world state |
| Reliability | 3 repeats → case-mean pass; overall repeat rates reported | pass^k-style consistency |
| Contribution | Confirmatory **persona A/B** under a fixed dense stack | Capability / reliability leaderboard |

We cite τ-bench as a cousin for business-ops agent evaluation. The contribution here is the locked short-role null under fixed tools/schemas, not a new interactive-agent leaderboard.

## How we score tool use

Evaluation is **rule-based and deterministic** (no LLM judge). Mapping to tool-eval vocabulary (e.g., BFCL-style AST matching):

- **Required calls:** tool name, position/order in the family rubric, and **normalized** arguments must match gold (ZIP → 5-digit; names/enums/datetimes normalized per `evaluation_spec_v1.md`).
- **Forbidden / unexpected calls:** fail the case (e.g., booking when gold says stop; calling `check_slots` when the family forbids it).
- **Abstention / no-call families:** extraction-only and stop-early cases require **not** calling booking tools; correct abstention is part of gold.
- **Serial vs parallel:** the exam expects **serial** tool sequences as specified per family; it is not a parallel-call stress test.
- **Final JSON:** Structured Outputs fields (`final_status`, extraction, `customer_response` where required) must match after normalization; exact phrase gates are intentional operational contracts.
- **Secondary diagnostics** (tool-sequence / arg exact-match rates) exist in the harness but are **not** confirmatory for prompt-style claims.

Primary success is the full required tool trace (name, normalized arguments, order) plus final JSON match under the family rubric. "Mostly right" is still a fail.

## Gold labels and deterministic evaluation

Every case carries gold for expected tool behavior and semantic output. The harness normalizes selected fields before comparison, then applies family rubrics from the locked evaluation spec (`track1_role_study_package/00_protocol/evaluation_spec_v1.md`).

Attempts that fail for API/harness reasons (timeout, rate limit, unscorable trace) are counted as **technical problems**, not model exam fails. Main pass rates use only graded attempts. If a case lacks a graded result in any cell needed for a contrast after re-queue, that case is dropped from the contrast (no silent fail imputation; no unequal case sets).

## Model and harness settings

**Model (confirmatory study):** OpenAI `gpt-5.6-luna` only. Other providers are out of the main study.

**Run mode** changes API settings only; system and user prompt text are identical for a given case and prompt style:

| Code | Setting |
|------|---------|
| **B1** (instant) | `reasoning.effort = none`, `temperature = 0` |
| **B2** (thinking) | `reasoning.effort = medium`, `temperature` omitted |

Shared runtime notes (locked protocol): `max_output_tokens = 3000`; final answers via Structured Outputs (`json_schema` + enums); tool arguments via strict schemas with the same unit enums; request timeout 45 000 ms; up to 2 retries on timeout/network/429/5xx. Tool results are injected from fixtures; the loop terminates when the model returns a final structured answer or hits harness stop/timeout rules.

## Prompt-style conditions

Across A1/A2/A3, the shared task instructions, user prompt, tools, and schemas are fixed. Only the role/competencies block may differ. A3 is locked to **generic** soft competencies (no exam-specific or workflow coaching). This is the text practitioners actually paste as “competencies,” not competency engineering. Prompt length was **not** equalized with filler; if A3 differs from A2 under the analysis rule, attribution is to competency **content**, not length. Competencies without a role were not tested.

**A priori design intent.** A2 tests a **thin domain-matched short role** on top of dense task rules. A3 tests whether adding soft professional virtues (non-task-specific fluff) on top of that role changes end-to-end pass. That is closer to a robustness-style stress on identity text than to domain coaching. Neither arm was designed as a Kong-style strategic role-play / CoT trigger.

Locked role/competency lines (short quotes; full task instructions are longer):

| Code | Meaning | Locked line(s) |
|------|---------|----------------|
| **A1** | Task instructions only | *(no role block)* |
| **A2** | + short role | `- You are a scheduling agent for an appliance repair company.` |
| **A3** | + role + generic competencies | `- You are a scheduling agent for an appliance repair company with strong professional competencies in careful listening, clear judgment, accurate follow-through, and disciplined adherence to procedures.` |

## Confirmatory matrix

| Item | Value |
|------|--------|
| Exam cases | 120 (frozen full pack; a ~40-case rehearsal was prep only) |
| Prompt styles | A1, A2, A3 |
| Modes | B1, B2 |
| Independent repeats | 3 |
| Graded attempts | **2160** (= 120 × 3 × 2 × 3) |
| Technical API failures (main matrix) | 0 |

A ~40-case rehearsal (2 repeats) was used to find broken cases and harness issues; rehearsal numbers are provisional and do not support claim language. Only the frozen 120 under this analysis plan is claim-ready.

## Analysis rule

Unit of analysis is the **exam case**, not the raw API call:

1. For each case × condition, average pass over its repeats (0–1).
2. Form paired differences on the same cases: A2−A1, A3−A2, A3−A1, separately inside B1 and inside B2. **Pooled across modes** is a locked **summary check** on the same three contrasts (same excludes-0 rule), not a third research question invented after seeing the data.
3. Uncertainty: case-level paired **bootstrap** 95% intervals (resample cases, not individual calls).

**Analysis rule (locked):** a contrast shows a “clear effect” (helped or hurt) only if that interval **excludes 0**. If the interval includes 0, we report **no clear effect under this rule**.

Primary confirmatory contrasts are the three prompt-style differences above (B1, B2, and the pooled summary check). B2 vs B1 is a secondary mode result (reasoning effort). We do **not** treat pass^k-style “pass on all *k* repeats” as a confirmatory metric; three repeats feed case means and a stability check on overall rates.

## Protocol lock vs public pre-registration

Before the confirmatory 120-case matrix, we froze an internal **protocol lock** and an **analysis plan** (comparisons, claim rule, what is exploratory). That discipline is best described as an **internal protocol lock**, not as formal public pre-registration (e.g., OSF or AsPredicted). We do not claim OSF-style pre-registration unless a public registry entry exists.

## Scope

Confirmatory matrix: short role / generic competencies on `gpt-5.6-luna`, one domain exam, binary full-case pass, task instructions already long and correct. Competencies without a role were not tested.
