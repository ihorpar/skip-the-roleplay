# Pooled r1+r2 note (informational — mid-critic decides r3)

**Repeats:** r1 `nano54_role_full120_20260721T234354` · r2 `nano54_role_full120_r2_20260722T002151`  
**Pool method:** ticket-mean pass across 2 repeats (each ticket’s style mean = average of r1/r2 binary pass); paired Δ = mean of per-ticket (repeat-averaged) style contrasts; bootstrap 95% CI over tickets (B=10k).

---

## Ticket-mean pass %

| Style | Ticket-mean pass |
|-------|-----------------:|
| A1_task | **43.75%** |
| A2_role | **47.92%** |
| A3_comp | **40.83%** |

(Repeat-mean of style pass% matches: 43.75 / 47.9 / 40.85.)

---

## Pooled paired contrasts

| Contrast | Pooled Δ | ~95% CI (pp) | Excludes 0? |
|----------|---------:|-------------:|:-----------:|
| A2 − A1 | **+4.17 pp** | [−1.67, +10.42] | **No** |
| A3 − A2 | **−7.08 pp** | [−12.92, −1.67] | **Yes** |
| A3 − A1 | −2.92 pp | [−9.17, +3.75] | **No** |

---

## Does the r3 gate look likely to fire?

Critic pre-register (`CRITIC_r1.md`): proceed to r3 **only if** at least one of A2−A1 or A3−A2 still has pooled CI excluding 0 **or** an owner-accepted unstable-but-large rule.

| Arm | Gate status (informational) |
|-----|-----------------------------|
| **A2−A1** | Pooled CI **includes 0**. Schema-cond ≈0 on both repeats. Gate for “role helps” **does not** look likely to fire cleanly. |
| **A3−A2** | Pooled CI **still excludes 0**, but r2 alone collapsed (−3.3 pp, CI incl. 0) and schema-cond residual on r2 is **0**. Gate is **borderline / attenuated** — alive on pooled headline only; mid-critic should weigh schema mediation + attenuation before spending r3. |
| **Both flat?** | Not both flat on pooled headline (A3−A2 still negative), but A2-help is flat under the claim rule. |

**This note does not authorize r3.** Stage 3 mid-critic decides.
