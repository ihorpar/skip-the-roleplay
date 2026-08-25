# Mid-point critic — gpt-5.4-nano role study (r1+r2)

**Date:** 2026-07-22  
**Scope:** Stage 3 gate audit on r1 + r2 only. No r3 matrix. No paid diagnostics (published numbers verified from raw).  
**Inputs:** `PROTOCOL.md` r2→r3 gates · `CRITIC_r1.md` · `POOL_r1_r2_NOTE.md` ·  
`nano54_role_full120_20260721T234354` · `nano54_role_full120_r2_20260722T002151` / `R2_SUMMARY.md`

---

## Verdict

**R3_SKIP**

Do **not** spend the third 360-run matrix. The pre-registered *necessary* gate (“pooled A2−A1 **or** A3−A2 CI excludes 0”) is technically met by **raw** pooled A3−A2, but that arm fails the mid-critic weighing the protocol also requires: replication on r2, schema-conditional residual, attenuation, cost, and overclaim risk. Treating “ONLY if” as automatic spend would burn money to confirm a schema-mediated, attenuating association that already collapsed under the Stage-1 falsifiers.

---

## Gate audit (recomputed)

**Method (matches pool note):** per-ticket style mean = average of r1/r2 binary pass; paired Δ = mean of those ticket contrasts; ticket-resampled bootstrap B=10k, 95% percentile CI. Pass = `evaluator_result.pass` (r1 152/360, r2 166/360 — match summaries).

### Per-repeat (verified)

| | A1 | A2 | A3 | A2−A1 | A3−A2 |
|--|---:|---:|---:|------:|------:|
| **r1** | 42.5% | 47.5% | 36.7% | +5.0 pp · CI incl. 0 | **−10.8 pp · CI excl. 0** |
| **r2** | 45.0% | 48.3% | 45.0% | +3.3 pp · CI incl. 0 | −3.3 pp · CI incl. 0 |

r2 flips match published: A2−A1 11/7/102; A3−A2 7/11/102; A3−A1 9/9/102. Schema-cond both styles valid: **A2−A1 0.0 pp (n=60)**; **A3−A2 0.0 pp (n=60)** — match `R2_SUMMARY.md`.

### Pooled ticket-mean pass

| Style | Ticket-mean |
|-------|------------:|
| A1_task | **43.75%** |
| A2_role | **47.92%** |
| A3_comp | **40.83%** |

### Pooled paired contrasts (recomputed)

| Contrast | Pooled Δ | ~95% CI (pp) | Excludes 0? | vs `POOL_r1_r2_NOTE` |
|----------|---------:|-------------:|:-----------:|----------------------|
| **A2 − A1** | **+4.17 pp** | **[−1.67, +10.0]** (±seed) | **No** | **Match** (note [−1.67, +10.42]) |
| **A3 − A2** | **−7.08 pp** | **[−12.92, −1.67]** (±seed; some seeds −1.25) | **Yes** | **Match / audited** |
| A3 − A1 | −2.92 pp | [−9.6, +3.3] approx | **No** | Match direction |

**Audit of “pooled A3−A2 still excludes 0 (−7.1 pp)”:** **Confirmed.** Mean −7.083 pp; upper CI bound stays negative across seeds (≈ −1.67 or −1.25). Not a reporting error.

### Gate checklist

| Pre-registered rule | Result |
|---------------------|--------|
| Proceed **only if** pooled A2−A1 **or** A3−A2 CI excludes 0 | Raw A3−A2 **excludes 0** → necessary condition **met** |
| If **both** noise → skip | Not both noise on raw pooled headline |
| Always report schema-conditional Δ | See below — this is where the spend fails |

**Necessary ≠ sufficient.** Protocol Stage 3 exists to weigh schema-cond, attenuation, and cost. Stage 1 already listed A3 falsifiers: “r2 A3−A2 collapses and/or schema-conditional residual goes to ~0.” **Both happened on r2.**

---

## Is A3-hurt real vs schema artifact?

**Mostly schema artifact; not a clean competencies-content hurt.**

| Evidence | Read |
|----------|------|
| r1 A3−A2 −10.8, CI excl. 0; schema-cond residual **−5.1 pp** (n=59) | Discovery signal, partly non-schema |
| r2 A3−A2 −3.3, CI **incl. 0**; schema-cond **0.0 pp** (n=60) | **Failed claim-strength replication**; residual gone |
| Schema-loss share of A3&lt;A2 flips | r1 12/16; r2 9/11 — pass moves track schema attainment |
| Pooled schema-cond A3−A2 | Strict (both styles schema-valid both repeats): **−1.9 pp**, n=52, CI **incl. 0**. Availability-pooled: **−3.0 pp**, n=67, CI **incl. 0** |
| Attenuation | −10.8 → −3.3 (≈69% shrink); A3 pass bounced +8.3 pp r1→r2 |

Honest frame: raw pooled A3−A2 stays negative because **r1’s large discovery hit still pulls the ticket means**. That is not the same as a stable, schema-held competencies effect worth another 360 runs.

**A2−A1:** never cleared the Track-1 bar (r1, r2, or pooled). Schema-cond ≈ **0** both repeats. Still F5-concentrated on r2 (+5 net in F5; non-F5 −1). Role-help remains **noise-compatible**.

---

## Weighing (why SKIP despite raw pooled A3−A2)

1. **Replication:** confirmatory repeat did not clear the helped/hurt rule for A3−A2.  
2. **Schema-cond:** r2 residual 0; pooled schema-cond CI includes 0 — protocol requires this table alongside raw Δ.  
3. **Attenuation:** classic regression-to-mean / one-hit discovery pattern.  
4. **Cost:** +360 runs would mainly buy a third draw on a schema-sensitivity story, not a sharper Axis-A claim.  
5. **Overclaim risk:** “competencies hurt on weaker models” becomes folk memory from a pooled raw CI that is **driven by r1** and **vanishes under mutual schema validity on r2**.

No harness bug suspected; no ≤10-run diagnostic needed.

---

## Recommended owner language (use this)

On `gpt-5.4-nano` B1 full_120 (2 repeats), role alone (A2) does **not** show a clear full-ticket help vs task-only (A1): pooled +4.2 pp with CI including 0, and schema-conditional Δ ≈ 0. Adding generic competencies (A3) is associated with lower raw pass vs role in the **pooled** headline (−7.1 pp, CI excludes 0), but that contrast **attenuated and failed the claim bar on r2**, and is largely a **schema-attainment** effect (schema-conditional residual 0 on r2; pooled schema-cond CI includes 0). Stop at 2 repeats; do not merge into luna `CLAIM.md`.

---

## If R3_SKIP — what Stage 5 writeup should say instead

- **Status:** provisional screen + one confirmatory repeat; **not** claim-ready under Track-1 paired-bootstrap rule for either “role helps” or “competencies hurt” as a stable content effect.  
- **Role (A2−A1):** null / noise-compatible across r1, r2, and pool; schema-cond flat; exploratory F5 concentration only.  
- **Competencies (A3−A2):** provisional **negative association on raw pass** when pooling with the discovery repeat; **do not** headline as proven competencies-content harm. State schema mediation + failed r2 claim-strength replication + skip r3 per mid-critic.  
- **Product lesson (cautious):** mid-tier nano54 failures are dominated by **output schema validity**; persona/competency prompt length is a plausible distractor for formatting, not evidence that “role unlocks weaker models.”  
- **Explicit non-actions:** no r3; no merge into luna CLAIM; no “role clearer off-ceiling than luna” comparison as a causal claim.  
- **Optional follow-on (separate study, not this matrix):** schema-hardening or shorter A3 ablations — only if owner cares about formatting vs content, not another blind A1/A2/A3 repeat.
