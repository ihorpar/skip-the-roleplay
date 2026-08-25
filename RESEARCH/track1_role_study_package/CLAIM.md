# Track 1 — locked claim (role / persona / competencies)

**Status:** Confirmatory study complete (2026-07-21)  
**Authority for “what counts as a finding”:** `00_protocol/results-reading-plan-v1.md`

## Claim (plain language)

**In this setup — which is often used in real-business agents — adding a role/persona line, and then generic competencies, did not show a clear help or clear harm on full ticket success.**

Under the pre-registered rule (ticket-level paired bootstrap 95% CI must exclude 0), **none** of these contrasts clear the bar in B1, in B2, or pooled:

- A2 − A1 (role vs task-only)
- A3 − A2 (role+competencies vs role)
- A3 − A1 (full bundle vs task-only)

## What this does *not* claim

- It does **not** prove that role prompting never matters in any product or model.
- It does **not** say “thinking is useless”: B2 (medium reasoning effort) scored much higher than B1, but that was **not** the primary Axis-A question.
- It does **not** cover domain-specific coaching disguised as “competencies” (A3 was locked to **generic** competencies only).

## Confirmatory matrix (what was run)

| Item | Value |
|------|--------|
| Model | OpenAI `gpt-5.6-luna` |
| Tickets | 120 (`full_120_bundle_v1.json`) |
| Prompt styles | A1 task-only · A2 +role · A3 +role + generic competencies |
| Modes | B1 `reasoning.effort=none` · B2 `reasoning.effort=medium` |
| Repeats | 3 |
| Scored runs | **2160** (0 technical API failures) |
| Primary metric | Binary full pass/fail vs deterministic gold |

Numbers and writeup: `04_analysis/`.
