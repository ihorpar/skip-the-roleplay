# Disentangle markdown vs long-role (factor pilot)

**Date:** 2026-07-22  
**Out:** `RESEARCH/benchmark_pack_v1/runs/nano54_disentangle_md_role_20260722T124645`  
**Question:** Prior compound `S_role_rich_md` beat A1/A2, but changed *two* things at once. Which factor drives the lift — markdown scaffold, voluminous persona, both (additive), or an interaction?

**Design (locked):**
- Bundle: `rehearsal_40` (40 cases)
- Model: `openai:gpt-5.4-nano`
- Mode: `B2_thinking` only
- Styles (same batch): `A1_task` | `S_md_only` | `S_role_long_plain` | `S_role_rich_md`
- Repeats: 1 → **160 scored runs**
- Concurrency: 2; wall ~10.1 min; infra errors: **0**; unscorable: **0**

**Factor map:**
| Style | Markdown scaffold | Long persona |
|-------|-------------------|--------------|
| A1_task | no | no |
| S_md_only | yes | no |
| S_role_long_plain | no (heading markers stripped) | yes |
| S_role_rich_md | yes | yes |

---

## Verdict

**Long role wins. Markdown alone hurts. Compound is best, with positive synergy.**

Voluminous persona is the factor that lifts pass rate. Markdown scaffolding by itself drops below plain A1. Putting both together beats either part and exceeds a naive sum of main effects (positive interaction on this pilot).

| Style | Pass | Pass % |
|-------|------|--------|
| **A1_task** (plain baseline) | 21/40 | **52.5%** |
| **S_md_only** (md, no role) | 18/40 | **45.0%** |
| **S_role_long_plain** (long role, plain) | 24/40 | **60.0%** |
| **S_role_rich_md** (md + long role) | 26/40 | **65.0%** |

**Owner plain takeaway:** Keep investing in the **rich / long persona**, not markdown formatting alone. Md-only is a regression. Compound packaging is still the top cell here (+12.5 pp vs A1) and slightly edges long-role-plain (+5.0 pp).

---

## Contrasts (aggregate pass% Δ)

| Contrast | Δ pp | Read |
|----------|------|------|
| Markdown effect: `S_md_only − A1` | **−7.5** | md alone hurts |
| Long-role effect: `S_role_long_plain − A1` | **+7.5** | long role helps |
| Compound vs A1: `S_role_rich_md − A1` | **+12.5** | best lift vs baseline |
| Compound vs md: `S_role_rich_md − S_md_only` | **+20.0** | role rescues/overtakes md |
| Compound vs long-plain: `S_role_rich_md − S_role_long_plain` | **+5.0** | mild extra from wrapping role in md |

### Interaction check

- Main effects vs A1: md **−7.5** + long-role **+7.5** → additive expectation **~0 pp**
- Observed compound vs A1: **+12.5 pp**
- Residual (interaction): **≈ +12.5 pp**

So this is **not** pure additivity and **not** “one factor only with null other.” Pattern:

1. **One factor dominates the helpful direction:** long role (+7.5 alone).
2. **Markdown alone is harmful** (−7.5).
3. **Positive interaction:** md + long role together outperform the sum of parts; compound also beats long-role-plain by +5 pp (paired net +2 cases).

Treat interaction magnitude as **directional on n=40**, not settled law.

---

## Paired flips (same 40 cases)

| Contrast | Both pass | Both fail | First-only | Second-only | Net (2nd − 1st) |
|----------|-----------|-----------|------------|-------------|-----------------|
| S_md_only vs A1 | 14 | 15 | A1-only **7** | md-only **4** | **−3** |
| S_role_long_plain vs A1 | 16 | 11 | A1-only **5** | role-only **8** | **+3** |
| S_role_rich_md vs A1 | 17 | 10 | A1-only **4** | compound-only **9** | **+5** |
| S_role_rich_md vs S_md_only | 15 | 11 | md-only **3** | compound-only **11** | **+8** |
| S_role_rich_md vs S_role_long_plain | 19 | 9 | plain-role-only **5** | compound-only **7** | **+2** |

---

## Side signals (not primary)

| Style | Schema-valid | Tool exact | Over-action | Under-action |
|-------|--------------|------------|-------------|--------------|
| A1_task | 60.0% | 92.5% | 7.5% | 5.0% |
| S_md_only | 55.0% | 80.0% | **17.5%** | 7.5% |
| S_role_long_plain | 72.5% | 85.0% | 12.5% | 7.5% |
| S_role_rich_md | **80.0%** | 82.5% | 15.0% | 7.5% |

Schema-valid tracks the pass ranking (compound highest). Md-only shows the worst over-action. Tools are slightly softer under all non-A1 styles.

### Family sketch (passes / n)

| Family | n | A1 | md | role_plain | compound |
|--------|---|----|----|------------|----------|
| F1_extract | 3 | 3 | 3 | 3 | 3 |
| F2_partial_flow_a | 3 | 2 | 2 | 1 | 3 |
| F3_partial_flow_b | 3 | 1 | 2 | 2 | 2 |
| F4_select | 5 | 3 | 2 | 3 | 4 |
| F5_full_flow | 12 | 5 | 6 | **8** | 5 |
| F6_robustness | 14 | 7 | 3 | 7 | **9** |

Notes: md-only collapses on F6; long-role-plain is strongest on F5; compound recovers F6 and leads overall.

---

## Link to prior compound pilot

Prior same stack (`nano54_rich_role_md_pilot_20260722T120923`): A1 50.0%, A2 37.5%, `S_role_rich_md` 57.5%.  
This batch: A1 **52.5%**, compound **65.0%** (same direction; levels moved with re-roll). Disentangle now attributes the helpful signal primarily to **long persona**, with compound packaging still preferred over plain long-role.

---

## Bottom line

| Claim | Supported? |
|-------|------------|
| Markdown alone explains the prior win | **No** (md-only −7.5 pp) |
| Long role alone explains most of the lift | **Yes** (+7.5 pp; dominates helpful main effect) |
| Factors purely additive | **No** (compound ≫ sum of parts) |
| Prefer compound packaging over either part | **Yes on this pilot** (65% > 60% > 52.5% > 45%) |

**Factor that wins:** long / rich persona. Markdown is not the hero; use it only as packaging around the role, not as a standalone upgrade.
