# Track 1 main findings (120 tickets) — 2026-07-21

**Authority:** claim-ready under `RESEARCH/results-reading-plan-v1.md`  
**Setup:** appliance-repair scheduling agent benchmark; OpenAI `gpt-5.6-luna`; Structured Outputs + tool schemas with locked enums  
**Design:** 120 tickets × A1/A2/A3 × B1/B2 × 3 repeats = **2160** scored runs (0 technical API failures)

Artifacts:
- Pack: `RESEARCH/benchmark_pack_v1/full_120/`
- Runs: `main120_r1_…`, `main120_r2_…`, `main120_r3_…`
- Numbers: `main120_analysis_v1.json`

---

## Plain-language claim (locked wording)

**In this setup — which is often used in real-business agents — role/competencies did not show a clear help (or harm) on full ticket success.**

More precisely: under the pre-registered rule (ticket-level paired bootstrap 95% CI must exclude 0), **none** of A2−A1, A3−A2, or A3−A1 clear that bar in B1, in B2, or pooled.

---

## What we measured

| Code | Meaning |
|------|---------|
| A1 | Task instructions only |
| A2 | + role line |
| A3 | + role + generic competencies |
| B1 | `reasoning.effort = none` |
| B2 | `reasoning.effort = medium` |
| Success | Full pass/fail vs gold (tools + fields + exact allowed customer phrase) |

---

## Overall pass rates (ticket-averaged)

| Slice | Pass % |
|-------|-------:|
| A1 | 92.9 |
| A2 | 93.3 |
| A3 | 91.9 |
| B1 instant | 88.5 |
| B2 thinking | 96.9 |

### Cells (ticket-averaged)

| | B1 | B2 |
|--|---:|---:|
| A1 | 89.2 | 96.7 |
| A2 | 89.4 | 97.2 |
| A3 | 86.9 | 96.9 |

Repeat-level overall run pass: r1 **92.5%**, r2 **93.1%**, r3 **92.6%**.

---

## Main contrasts (pre-registered)

Difference in percentage points (pp). Positive = second condition better.  
Claim “helped/hurt” only if 95% CI excludes 0.

### Inside B1 (instant / effort none)

| Contrast | Mean Δ | 95% CI | Clear effect? |
|----------|-------:|--------|---------------|
| A2 − A1 | +0.3 pp | −3.9 … +4.7 | **No** |
| A3 − A2 | −2.5 pp | −7.5 … +2.2 | **No** |
| A3 − A1 | −2.2 pp | −8.3 … +3.9 | **No** |

### Inside B2 (thinking / effort medium)

| Contrast | Mean Δ | 95% CI | Clear effect? |
|----------|-------:|--------|---------------|
| A2 − A1 | +0.6 pp | −2.2 … +3.3 | **No** |
| A3 − A2 | −0.3 pp | −3.3 … +2.2 | **No** |
| A3 − A1 | +0.3 pp | −2.2 … +2.5 | **No** |

### Pooled across modes (exploratory summary)

| Contrast | Mean Δ | 95% CI | Clear effect? |
|----------|-------:|--------|---------------|
| A2 − A1 | +0.4 pp | −2.4 … +3.2 | **No** |
| A3 − A2 | −1.4 pp | −4.4 … +1.5 | **No** |
| A3 − A1 | −1.0 pp | −4.6 … +2.8 | **No** |

**Mode pattern (not an A-contrast):** B2 is much higher than B1 overall (~97% vs ~89%). That is a reasoning-effort effect, not a role/competencies effect.

---

## What we noticed (exploratory only — not proof)

- Failures concentrate on B1; name-conflict and “book equal-to-now slot” patterns still appear.
- Family breakdowns and secondary metrics were not used for the claim rule above.

---

## Path to this result

1. Rehearsal 40 → failure analysis → prompt clarifications (caller vs booking person; no book on non-future slots; `other_type` still calls `service_check`).
2. Enums enforced via Structured Outputs + strict tool schemas.
3. Built/frozen `full_120` (40 rehearsal + 80 new; audited).
4. Main matrix × 3 repeats under the results-reading plan.
