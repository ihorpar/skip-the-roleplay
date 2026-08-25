# gpt-5.4-nano role/persona probe — full_120 × A1/A2/A3 × B1

**Date:** 2026-07-21  
**Out:** `RESEARCH/benchmark_pack_v1/runs/nano54_role_full120_20260721T234354`  
**Question:** On weaker `gpt-5.4-nano` (not ceiling-saturated like luna), do role/persona + competencies show a clearer directional gap than Track 1 on luna?  
**Design:** full_120 × `A1_task` / `A2_role` / `A3_comp` × `B1_instant` × **1 repeat** = **360 scored runs**. Screen/probe only — not Track-1 claim-ready. No B2. No `gpt-5-nano`.

---

## Verdict

**Lukewarm — clearer directional gap than luna, but not a hot role win.**

| Style | Pass | Pass % |
|-------|------|--------|
| **A1_task** | 51/120 | **42.5%** |
| **A2_role** | 57/120 | **47.5%** |
| **A3_comp** | 44/120 | **36.7%** |
| Overall | 152/360 | 42.2% |

- **A2 (role line)** looks modestly better than A1 (+5 pp).
- **A3 (role + competencies)** looks worse than both A1 (−5.8 pp) and A2 (−10.8 pp).
- On luna Track 1 B1, A-gaps were ~0–2 pp near ceiling (~87–89%). Here the same A-axis moves ~5–11 pp on a mid-tier floor (~37–48%). Direction is more visible; still one-repeat noise.

**Temperature:** lukewarm. Worth a confirmatory multi-repeat if you care about weaker models; do **not** treat as a publishable Track-1 role claim.

---

## Paired Δ (ticket-level, same case across styles)

Positive = second condition better. One repeat per cell → treat as screen signal only.

| Contrast | Mean Δ | Ticket flips (win / loss / tie) |
|----------|-------:|----------------------------------|
| **A2 − A1** | **+5.0 pp** | 13 / 7 / 100 |
| **A3 − A2** | **−10.8 pp** | 3 / 16 / 101 |
| **A3 − A1** | **−5.8 pp** | 9 / 16 / 95 |

Run-level Δ matches ticket-mean Δ here (1 repeat): +5.0 / −10.8 / −5.8 pp.

**Caveat:** This is a **screen/probe** (1 repeat, no bootstrap CI). Not claim-ready under the Track-1 reading plan.

### Where A2 moved (exploratory)

Family pass counts (each style × family cell):

| Family | A1 | A2 | A3 |
|--------|---:|---:|---:|
| F1_extract | 10/10 | 9/10 | 8/10 |
| F2_partial_flow_a | 1/10 | 1/10 | 1/10 |
| F3_partial_flow_b | 6/10 | 7/10 | 5/10 |
| F4_select | 2/15 | 0/15 | 1/15 |
| F5_full_flow | 14/35 | **20/35** | 13/35 |
| F6_robustness | 18/40 | 20/40 | 16/40 |

Most of the A2 lift sits in **F5_full_flow** (+6 tickets vs A1). A3 does not keep that gain.

---

## vs luna Track 1 story

Luna main120 B1 (ticket-averaged, 3 repeats, claim-ready null):

| | A1 | A2 | A3 |
|--|---:|---:|---:|
| luna B1 | 89.2% | 89.4% | 86.9% |
| Δ A2−A1 / A3−A2 / A3−A1 | +0.3 / −2.5 / −2.2 pp | (CIs include 0) |

| | A1 | A2 | A3 |
|--|---:|---:|---:|
| **nano54 B1 (this probe)** | **42.5%** | **47.5%** | **36.7%** |
| Δ A2−A1 / A3−A2 / A3−A1 | **+5.0 / −10.8 / −5.8 pp** | (1-rep screen) |

**Read:** On luna, role was near-invisible under ceiling. On nano54, the A-axis is **not** flat: role alone trends up a bit; competencies trend down. That answers the owner question directionally — **yes, a clearer gap shows up off-ceiling** — but the shape is “role mild help / competencies mild-to-moderate hurt,” not “persona magic.”

---

## Rehearsal_40 A1 cross-check

| Slice | Pass % |
|-------|--------|
| Prior probe `nano54_compare_…` reh40 × A1 × B1 | **40.0%** (16/40) |
| This run: reh40 case subset × A1 × B1 | **47.5%** (19/40) |
| This run: reh40 × A2 | 42.5% (17/40) |
| This run: reh40 × A3 | 32.5% (13/40) |

~+7.5 pp A1 reh subset vs prior is within 1-repeat bounce; not a new floor story. Full_120 A1 (42.5%) sits near the prior reh40 A1 (40%).

---

## Run hygiene

- Infra errors: **0**
- Eval unscorable: **0**
- JSON-valid: **100%**
- Schema-valid: **57.2%** overall (A1 56.7% / A2 62.5% / A3 52.5%)
- Tool call exact match: **90.8%**
- Tool trigger precision / recall: **100% / 96.7%**
- Over-action / under-action: **5.3% / 6.1%**
- Concurrency: 2; wall ~11.4 min (360 runs)

---

## Dominant fail modes

Failures are **not** infra. Same regime as the earlier nano54 A1 probe.

Among **208 fails**, primary subcodes:

1. **`output.schema_invalid` — 154/208 (~74%)** — wrong final JSON shape (nested wrappers, extra/missing Track-1 fields). Schema rate tracks style pass (A2 highest schema, A3 lowest).
2. **`customer_response.wrong_canonical_response` — 22**
3. **Tool trigger** missing/unwarranted — 21 combined
4. Extraction field wrongs — handful

Hard families stay hard across styles: **F2** (~10% pass) and **F4** (~7% pass) are near-floor; F5/F6 carry most of the A2 vs A3 swing.

---

## Bottom line

| Ask | Answer |
|-----|--------|
| A1 / A2 / A3 pass % | **42.5% / 47.5% / 36.7%** |
| Role clearer than on luna? | **Yes, directionally** (~5–11 pp moves vs ~0–2 pp) |
| Hot / lukewarm / cold? | **Lukewarm** — A2 mild up, A3 down; 1-rep screen only |
| Next if pursued | Multi-repeat confirmatory on nano54 B1 (or another mid-tier), still no need for B2 density on this question |
