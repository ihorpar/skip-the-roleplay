# gpt-5.4-nano role experiment — protocol (staged)

**Status:** Closed (R3_SKIP; Stage 5 provisional findings written)  
**Parent claim (luna):** `RESEARCH/track1_role_study_package/CLAIM.md` — unchanged; this study does **not** rewrite it.  
**Reading rule:** same as Track 1 for contrasts — ticket-level paired bootstrap 95% CI must exclude 0 to say helped/hurt (`RESEARCH/results-reading-plan-v1.md`). Until gates say otherwise, language is **provisional**.

---

## Question

On weaker model **`gpt-5.4-nano`**, with mid-band pass (~40%), does adding a **role** (A2) and then **generic competencies** (A3) change full ticket pass vs task-only (A1)?

## Locked design

| Item | Value |
|------|--------|
| Model | `gpt-5.4-nano` only |
| Pack | `full_120` |
| Styles | A1_task · A2_role · A3_comp (same texts as Track 1) |
| Mode | **B1 only** (`reasoning.effort=none`) |
| Repeats target | **up to 3**, gated |
| Out of scope | B2 / thinking; gpt-5-nano; gpt-4.1-nano; density Track 2 |

**Why no B2 here:** keep headroom; avoid “thinking helps” confound.

---

## Stages (do not collapse into one launch)

| Stage | What | Status |
|------:|------|--------|
| 0 | This protocol | **done** |
| 1 | Critic reviews r1 + design | **done** → `CRITIC_r1.md` (**GO_WITH_CHANGES**) |
| 2 | Repeat **2** only (360 runs) | **done** — `nano54_role_full120_r2_20260722T002151` (A1 45.0% · A2 48.3% · A3 45.0%); `R2_SUMMARY.md` |
| 3 | Mid critic on r1+r2 | **done** → `CRITIC_mid_r1_r2.md` (**R3_SKIP**) |
| 4 | Repeat **3** only if gates fire | **skipped** (mid-critic: raw pooled A3−A2 CI excl. 0 but attenuated + schema-cond null on r2; do not spend) |
| 5 | Analysis + package note (separate from luna CLAIM) | **done** → `FINDINGS_PROVISIONAL.md` |

**r1 on disk:**  
`RESEARCH/benchmark_pack_v1/runs/nano54_role_full120_20260721T234354/`  
A1 42.5% · A2 47.5% · A3 36.7% (1 repeat).

**r2 on disk:**  
`RESEARCH/benchmark_pack_v1/runs/nano54_role_full120_r2_20260722T002151/`  
A1 45.0% · A2 48.3% · A3 45.0% (1 repeat).

### Critic-locked reframes (Stage 1)

- Do **not** headline “role helps” from r1: A2−A1 CI includes 0.
- Live r1 candidate under Track-1-style bar: **A3 hurt vs A2** (also report schema-conditional Δ).
- Family (F5) cuts = exploratory only, never proof.
- Reh40 overlap inside r1 had A2 **below** A1 — do not soft-pedal.

### r2 → r3 gates (pre-registered)

After r2, pool ticket means across r1+r2 (and report each repeat):

1. Proceed to r3 **only if** at least one of **A2−A1** or **A3−A2** has pooled bootstrap 95% CI excluding 0.  
2. If **both** collapse to noise (CI includes 0) → **skip r3**, write provisional unstable/null, stop spending.  
3. Always report **schema-conditional** paired Δ (tickets schema-valid under both styles in the contrast) alongside raw pass Δ.

### Stage 3 decision (2026-07-22)

**R3_SKIP** — see `CRITIC_mid_r1_r2.md`.

- Pooled A2−A1: +4.17 pp, CI includes 0 → gate arm dead.  
- Pooled A3−A2: −7.08 pp, CI excludes 0 → necessary raw gate *met*, but mid-critic **declines spend**: r2 alone CI includes 0, schema-cond Δ = 0 on r2, pooled schema-cond CI includes 0, strong attenuation from r1.  
- Stage 4 not authorized. Go to Stage 5 provisional writeup (no luna CLAIM merge).

---

## Stop / pivot rules

- Infra errors >10% in a repeat → fix and re-run that repeat; do not analyze as model fail.
- Enforce r2→r3 gates above (no blind third matrix).
- If critic finds unfair harness confound specific to nano54 → **pause** spending until fixed or explicitly waived.
- Never merge this into luna `CLAIM.md` without a separate owner decision.

---

## Claim wording template (only after stage 5)

> In this weaker-model setup (`gpt-5.4-nano`, same agent exam as Track 1, B1 only), role [did / did not] show a clear effect on full ticket success; adding generic competencies on top of role [did / did not] show a clear effect. (Paired bootstrap rule as Track 1.)
