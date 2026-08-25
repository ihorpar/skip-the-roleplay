# 2×3 factorial pilot: role × format (screen only)

**Date:** 2026-07-22  
**Out:** `RESEARCH/benchmark_pack_v1/runs/nano54_factorial_role_md_20260722T132411`  
**Label:** **pilot / screen only — not claim-ready.** One batch, 1 repeat, rehearsal_40, nano. Do not promote to Track 2 claim.

| Factor | Levels |
|--------|--------|
| Role | none · short · long |
| Format | plain · markdown |

**Design cells**

| | plain | markdown |
|--|-------|----------|
| no role | `A1_task` | `S_md_only` |
| short role | `A2_role` | `S_md_short` |
| long role | `S_role_long_plain` | `S_role_rich_md` |

**Run lock**

- Bundle: `rehearsal_40_bundle_v1.json` (40 cases)
- Model: `openai:gpt-5.4-nano`
- Mode: `B2_thinking`
- Styles: all 6 cells above
- Repeats: 1 → **240 scored runs** (same batch)
- Concurrency: 2; wall ~14.1 min
- Infra errors: **0**; eval unscorable: **0**
- Overall pass: **52.5%** (126/240); schema-valid 65%; tool exact 85%

---

## 2×3 pass% table

| | plain | markdown | role marginal |
|--|------:|---------:|--------------:|
| **no role** | **50.0%** (20/40) `A1_task` | **52.5%** (21/40) `S_md_only` | **51.3%** (41/80) |
| **short role** | **52.5%** (21/40) `A2_role` | **50.0%** (20/40) `S_md_short` | **51.3%** (41/80) |
| **long role** | **50.0%** (20/40) `S_role_long_plain` | **60.0%** (24/40) `S_role_rich_md` | **55.0%** (44/80) |
| **format marginal** | **50.8%** (61/120) | **54.2%** (65/120) | — |

**Best cell:** `S_role_rich_md` (long × markdown) — **60.0%**, +10.0 pp vs `A1_task` (paired W/L = 8/4).

---

## Main effects (marginal + paired)

### Short role vs none
- **Marginal:** 51.3% vs 51.3% → **Δ 0.0 pp** (flat).
- **Paired by format:**
  - Plain (`A2_role` − `A1_task`): +2.5 pp; W/L = 8/7 (churn).
  - Markdown (`S_md_short` − `S_md_only`): −2.5 pp; W/L = 5/6 (churn).
- **Read:** short role does **not** clearly hurt here; also does **not** help. Noise-scale.

### Long role vs none
- **Marginal:** 55.0% vs 51.3% → **Δ +3.7 pp**.
- **Paired by format:**
  - Plain (`S_role_long_plain` − `A1_task`): **0.0 pp**; W/L = 5/5.
  - Markdown (`S_role_rich_md` − `S_md_only`): **+7.5 pp**; W/L = 8/5.
- **Read:** long role still helps **only when format is markdown**. On plain, long role = none.

### Markdown vs plain
- **Marginal:** 54.2% vs 50.8% → **Δ +3.4 pp**.
- **Paired by role:**
  - None (`S_md_only` − `A1_task`): +2.5 pp; W/L = 6/5.
  - Short (`S_md_short` − `A2_role`): −2.5 pp; W/L = 8/9.
  - Long (`S_role_rich_md` − `S_role_long_plain`): **+10.0 pp**; W/L = 8/4.
- **Read:** md help is **concentrated in the long-role cell**. Alone (no/short role), md is near-noise.

---

## Process metrics (directional)

| Style | Pass | Schema OK | Tools exact | Over-action |
|-------|-----:|----------:|------------:|------------:|
| A1_task | 50.0% | 60.0% | 85.0% | 12.5% |
| A2_role | 52.5% | 62.5% | 80.0% | 20.0% |
| S_role_long_plain | 50.0% | 57.5% | 92.5% | 7.5% |
| S_md_only | 52.5% | 62.5% | 85.0% | 12.5% |
| S_md_short | 50.0% | 70.0% | 77.5% | 20.0% |
| **S_role_rich_md** | **60.0%** | **77.5%** | **90.0%** | **7.5%** |

Short-role cells show elevated over-action (20%). Best cell also has the highest schema-valid rate.

---

## Answers to screen questions

| Question | Screen answer |
|----------|---------------|
| Best cell? | **`S_role_rich_md`** (long × md) at 60% |
| Does short role still hurt? | **No clear hurt** (marginal 0 pp; ±2.5 by format = churn) |
| Does long role still help? | **Yes, but only with markdown** (+7.5 pp vs md-only; 0 pp on plain) |
| Does md help only with long role? | **Mostly yes** — md lift is driven by the long×md cell (+10 pp vs long-plain); alone ≈ noise |

---

## Owner verdict (plain language)

On nano + B2 + rehearsal_40, the only cell that clearly pulls ahead is **long role wrapped in markdown**. Short role is a wash. Long role without markdown does nothing. Markdown without the long persona is barely a bump. Treat this as a **screen hint that the interaction (long × md) matters more than either factor alone** — not as a locked claim.

---

## What not to do
- Do not treat 60% as confirmatory or publishable Track 2 evidence.
- Do not skip to full_120 from this single nano pilot.
- If followed up: replicate on a stronger model and/or 2–3 repeats; pre-register the long×md interaction contrast.
