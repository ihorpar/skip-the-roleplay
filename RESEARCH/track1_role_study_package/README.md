# Track 1 study package — role / persona prompting

**Self-contained archive** of the confirmatory Track 1 study: datasets, protocol, prompt/eval snapshots, main-run summaries + raw traces, and the locked analysis.

Start here: **[`CLAIM.md`](CLAIM.md)** (the conclusion you can show).

---

## Folder map

| Folder | Contents |
|--------|----------|
| `00_protocol/` | Contract, evaluation spec, design brief, protocol lock, **how results are read** (claim rules), prep analysis |
| `01_datasets/` | Exam packs: micro-pilot, rehearsal 40, **full 120** bundle + coverage/build notes |
| `02_prompts_and_eval/` | Snapshot of harness files used for prompts, schemas, normalization, evaluator |
| `03_main_runs/` | Three confirmatory repeats (`r1`–`r3`): summary JSON/MD + full raw run JSON |
| `04_analysis/` | Ticket-level analysis JSON, findings writeup, run log |
| `05_prep_rehearsal/` | Rehearsal notes / failure analysis (prep path — **not** the claim-primary matrix) |
| `06_supporting_nano_probe/` | Optional: `gpt-5-nano` vs luna on A1×B1 (shows exam is hard for weaker models; **not** part of role claim) |

---

## What “success” meant (test expectations)

Each ticket is a scheduling request with:

- customer text + clock/timezone
- allowed tools (simulated)
- **gold** extraction fields, tool behavior, `final_status`, and (for F2–F6) an **exact** allowed `customer_response`

A run **passes** only if the scored output matches gold under the evaluator rules (tools + fields + phrase). API/harness failures are technical problems, not model fails.

Details: `00_protocol/evaluation_spec_v1.md`, `00_protocol/track1_contract.md`.

---

## Prompt conditions (Axis A)

Same task scaffold; only these lines differ:

| Code | Meaning |
|------|---------|
| **A1** | Task instructions only (no “you are a scheduling agent…”) |
| **A2** | A1 + short role/persona line |
| **A3** | A2 + generic competencies (no workflow coaching for this exam) |

Mode (Axis B) changes API `reasoning.effort` only — **not** the prompt text.

Prompt source snapshot: `02_prompts_and_eval/prompts.js`.

---

## How to cite numbers

1. Read `CLAIM.md` for the wording.
2. Open `04_analysis/main120_FINDINGS_2026-07-21.md` for tables.
3. Recompute from `04_analysis/main120_analysis_v1.json` or from `03_main_runs/*/smoke_raw_runs_latest.json` if needed.

---

## Out of scope for this package

- Later **hypothesis screen** (density, polarity, etc.) — not part of Track 1 claim; lives under `RESEARCH/benchmark_pack_v1/runs/screen_hypotheses_*`.
- Do not mix screen results into the role/persona conclusion.
