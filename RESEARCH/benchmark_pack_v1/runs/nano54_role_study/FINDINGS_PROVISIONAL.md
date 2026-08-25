# gpt-5.4-nano role study — provisional findings (Stage 5)

**Date:** 2026-07-22  
**Status:** Closed without r3 (`CRITIC_mid_r1_r2.md` → **R3_SKIP**)  
**Authority:** provisional only — **not** merged into luna `CLAIM.md`  
**Folder:** `RESEARCH/benchmark_pack_v1/runs/nano54_role_study/`

---

## Plain-language answer

On **`gpt-5.4-nano`** (weaker model, mid success ~40–48%), with the **same** A1/A2/A3 prompts as Track 1 and **no** thinking mode:

1. **Role alone (A2 vs A1):** no clear help. Point estimates were a few points higher, but uncertainty always included “no difference,” and among tickets that already produced valid schema JSON under both styles the gap was ~0.
2. **Role + generic competencies (A3 vs A2):** first repeat looked like a clear hurt; the second repeat mostly washed it out. The remaining pooled negative gap is largely about **getting valid structured output**, not a clean “competencies content” effect worth a third paid matrix.
3. **vs luna Track 1:** luna’s near-ceiling null on role still stands as the claim-ready strong-model result. This nano54 study does **not** overturn it and does **not** prove “role works on weaker models.”

---

## What we ran

| Item | Value |
|------|--------|
| Model | `gpt-5.4-nano` |
| Pack | full_120 |
| Styles | A1_task · A2_role · A3_comp |
| Mode | B1 only |
| Repeats | **2** (r3 skipped by mid-critic) |
| Scored runs | **720** (0 infra errors) |

| Repeat | A1 | A2 | A3 |
|--------|---:|---:|---:|
| r1 | 42.5% | 47.5% | 36.7% |
| r2 | 45.0% | 48.3% | 45.0% |
| **Pooled ticket-mean** | **43.8%** | **47.9%** | **40.8%** |

| Contrast (pooled) | Δ | Clears “helped/hurt” bar? |
|--------------------|--:|:-------------------------:|
| A2 − A1 | +4.2 pp | **No** (CI includes 0) |
| A3 − A2 | −7.1 pp | Raw CI excludes 0, but **not** treated as claim — failed r2 replication + schema-cond residual ~0 |
| A3 − A1 | −2.9 pp | **No** |

Critics: `CRITIC_r1.md`, `CRITIC_mid_r1_r2.md`. Pool: `POOL_r1_r2_NOTE.md`. Protocol: `PROTOCOL.md`.

---

## Owner takeaway

Budget stop was correct: another 360 runs would mostly re-fight schema fragility, not deliver a clean persona claim. If you still want a weaker-model role story later, redesign around **schema-held** success or a model that isn’t dominated by `schema_invalid` fails — don’t just add r3 on this stack.
