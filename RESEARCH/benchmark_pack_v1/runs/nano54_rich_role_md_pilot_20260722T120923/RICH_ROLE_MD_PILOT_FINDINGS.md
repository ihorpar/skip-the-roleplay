# Rich role + markdown packaging pilot (owner concern)

**Date:** 2026-07-22  
**Out:** `RESEARCH/benchmark_pack_v1/runs/nano54_rich_role_md_pilot_20260722T120923`  
**Question:** Was Track-1 role too thin / poorly packaged, so the model ignored (or was hurt by) it? Does a markdown-structured scaffold + voluminous persona help on mid-band nano?

**Design (locked):**
- Bundle: `rehearsal_40` (40 cases)
- Model: `openai:gpt-5.4-nano`
- Mode: `B2_thinking` only
- Styles: `A1_task` | `A2_role` | `S_role_rich_md`
- Repeats: 1 → **120 scored runs**
- Concurrency: 2; wall ~7.4 min; infra errors: **0**; unscorable: **0**

**Caveat (compound treatment):** `S_role_rich_md` changes *two* things at once — markdown task scaffold **and** a longer persona. A win does **not** say which factor mattered.

---

## Verdict

**Lukewarm overall; hot vs the thin short role.**

Rich+md beats both baselines on this pilot, but the story is mostly “thin role was bad,” not “rich+md is a slam-dunk upgrade over plain task.”

| Style | Pass | Pass % |
|-------|------|--------|
| **A1_task** (plain, no role) | 20/40 | **50.0%** |
| **A2_role** (Track-1 short role) | 15/40 | **37.5%** |
| **S_role_rich_md** (md scaffold + rich persona) | 23/40 | **57.5%** |

**Temperature vs short role (`A2`):** **hot** (+20.0 pp aggregate; paired net +8 cases).  
**Temperature vs plain task (`A1`):** **lukewarm** (+7.5 pp aggregate; paired net +3 cases).

Owner concern is directionally supported: short role underperformed plain task on this mid-band model; richer packaging recovered and slightly exceeded no-role. Do **not** treat as a factor-isolated packaging claim.

---

## Paired Δ (same 40 cases)

### Aggregate (pass% deltas)

| Contrast | Δ pp |
|----------|------|
| S − A1 | **+7.5** |
| S − A2 | **+20.0** |
| A2 − A1 | **−12.5** |

### Case-paired flips

| Contrast | Both pass | Both fail | First-only | Second-only | Net (2nd − 1st) |
|----------|-----------|-----------|------------|-------------|-----------------|
| S vs A1 | 16 | 13 | A1-only **4** | S-only **7** | **+3** |
| S vs A2 | 13 | 15 | A2-only **2** | S-only **10** | **+8** |
| A2 vs A1 | 13 | 18 | A1-only **7** | A2-only **2** | **−5** |

Read: short role loses cases to plain task; rich+md wins most of those back and picks up a few more, especially vs A2.

---

## Side signals (not primary)

| Style | Schema-valid | Tool exact | Over-action | Under-action |
|-------|--------------|------------|-------------|--------------|
| A1_task | 57.5% | 92.5% | 5.0% | 5.0% |
| A2_role | 50.0% | 82.5% | **17.5%** | 2.5% |
| S_role_rich_md | **75.0%** | 87.5% | 7.5% | 10.0% |

Schema-valid jumps with rich+md (75% vs ~50–58%). Short role also shows more over-action. Tools stay mostly fine across styles.

### Family sketch (passes / n)

| Family | n | A1 | A2 | S |
|--------|---|----|----|---|
| F1_extract | 3 | 3 | 3 | 3 |
| F2_partial_flow_a | 3 | 1 | 2 | 3 |
| F3_partial_flow_b | 3 | 1 | 0 | 2 |
| F4_select | 5 | 4 | 2 | 1 |
| F5_full_flow | 12 | 7 | 5 | 7 |
| F6_robustness | 14 | 4 | 3 | 7 |

S gains look concentrated in partial-flow / robustness; F4_select is a soft spot for S on this 1-rep draw (noise possible).

---

## Does rich+md look hot / lukewarm / cold vs short role?

**Hot vs `A2_role`.** Thin Track-1 role looked actively harmful here (−12.5 pp vs no role). Rich markdown+persona reversed that and led the three-way.

**Lukewarm vs `A1_task`.** Only +7.5 pp / net +3 paired flips — interesting, not decisive.

---

## Next step (if pursuing)

Because this is a **compound** treatment, the logical follow-on if you want to keep the thread hot:

1. **Markdown-only** scaffold with the same short (or no) role  
2. **Long-role-only** (voluminous persona) without the markdown scaffold  

Same bundle/model/mode, still rehearsal_40, still 1-rep is fine for directional disentangle. No full_120 until a single factor looks hot on its own.

---

## Hygiene

- 120/120 scored; 0 infra / 0 unscorable  
- Overall pass 48.3%; JSON-valid 100%  
- No full_120; no commit
