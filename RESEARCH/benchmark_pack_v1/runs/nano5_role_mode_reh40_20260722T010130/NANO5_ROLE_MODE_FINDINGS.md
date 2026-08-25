# gpt-5-nano — role × mode probe (rehearsal_40)

**Date:** 2026-07-22  
**Model:** `openai:gpt-5-nano`  
**Bundle:** `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json`  
**Matrix:** `A1_task`, `A2_role` × `B1_instant`, `B2_thinking` × 1 repeat = **160 runs**  
**Out:** `RESEARCH/benchmark_pack_v1/runs/nano5_role_mode_reh40_20260722T010130/`  
**Prior baseline:** A1×B1 nano reh40 = **0/40 (0%)** (`nano_compare_20260721T231058`)

---

## Verdict

**Medium thinking rescues nano a lot; role does not.**  
B1 stays near floor (~2.5%). B2 lifts pass to ~28–30%. A2_role is flat-to-slightly-worse vs A1 under both modes.

---

## Four-cell pass rates

| Style \ Mode | B1_instant (`reasoning.effort: minimal`) | B2_thinking (`reasoning.effort: medium`) |
|--------------|------------------------------------------|------------------------------------------|
| **A1_task** | **1/40 = 2.5%** | **12/40 = 30.0%** |
| **A2_role** | **1/40 = 2.5%** | **11/40 = 27.5%** |

Overall: **25/160 = 15.6%** pass · schema_valid **27.5%** · infra **0** · JSON **100%**

### vs prior A1×B1 0%

| Run | Cell | Pass |
|-----|------|------|
| Prior nano compare | A1×B1 | 0/40 (**0.0%**) |
| This probe | A1×B1 | 1/40 (**2.5%**) |
| This probe | A2×B1 | 1/40 (**2.5%**) |

B1 is still near floor. The +1 ticket vs prior 0% is noise, not a recovery.

---

## Does thinking rescue nano?

**Yes — partially.**

- B1 pooled: **2/80 = 2.5%** (schema 7/80 = 8.8%)
- B2 pooled: **23/80 = 28.7%** (schema 37/80 = 46.3%)
- Δ B2 − B1: **+26.2 pp** pass; schema roughly **5×** better

B2 also improves tool exact-match (B1 37.5% → B2 73.8%) and cuts under-action (40% → 15%).

Still far from luna reh40 (~82–92% A1×B1). Thinking moves nano off the floor; it does not close the model gap.

Dominant remaining B2 fail: `output.schema_invalid` (A1×B2 20/40; A2×B2 23/40). Gains concentrate on easier families (F1/F2 fully rescued under A1×B2); F4–F6 stay mostly hard.

---

## Does role move anything?

**No meaningful lift.**

| Contrast | Δ (A2 − A1) |
|----------|-------------|
| B1 | 0.0 pp (both 2.5%) |
| B2 | **−2.5 pp** (27.5% vs 30.0%) |
| Pooled style | A1 16.3% vs A2 15.0% |

Role does not fix B1 schema collapse and does not add on top of B2. Same story as other nano role probes: style is not the lever.

---

## Infra / API notes

- **No provider code change required.** Existing `providers/openai.js` mapping already correct:
  - `gpt-5-nano` B1 → `reasoning.effort: "minimal"` (not `none`)
  - B2 → `"medium"` (same as luna)
- **B2 `medium` accepted:** 80/80 B2 runs completed; **0 infra errors**, **0 eval_unscorable**
- Luna / `gpt-5.4-nano` paths untouched (effort branching still model-gated)
- Duration: ~27 min wall (160 runs, concurrency 2)
- Harness: multi_turn; concurrency 2

---

## Bottom line

| Question | Answer |
|----------|--------|
| Thinking rescue? | **Yes** — ~2.5% → ~28–30% |
| Role move? | **No** — flat / −2.5 pp |
| Still near prior A1×B1 floor on B1? | **Yes** (2.5% vs prior 0%) |
| Ready for full_120? | Not run (out of scope for this probe) |
