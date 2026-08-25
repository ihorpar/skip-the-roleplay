# Critic review — gpt-5.4-nano role study (r1)

**Date:** 2026-07-22  
**Scope:** Design + r1 analysis only. No new paid matrix. Spot-checks from `nano54_role_full120_20260721T234354` raw/summary JSON + harness prompts/provider.  
**Protocol:** `PROTOCOL.md` (staged; this is Stage 1).

---

## Verdict

**GO_WITH_CHANGES**

Spend **one** confirmatory repeat (r2, 360 runs) **only after** reframing r1 and locking r2 decision rules below. Do **not** treat r1 as evidence that “role helps on a weaker model.” The only r1 signal that currently clears a Track-1-style paired bar is **A3 hurt vs A2**, and even that is heavily schema-mediated.

If the owner’s real question is only “does role help off-ceiling?” → **STOP** (already answered: not clearly). If the question is the full A1/A2/A3 axis including competencies → **GO_WITH_CHANGES** for r2, then mid-critic before any r3.

---

## Must-fix before r2

1. **Retract / demote the “role mild help” headline.** r1 A2−A1 does **not** clear the locked reading rule (ticket-level paired bootstrap 95% CI must exclude 0). Recomputed from raw: **+5.0 pp, CI ≈ [−1.7, +12.5], includes 0.** Exact McNemar on 13/7 discordant pairs: **p ≈ 0.26**.

2. **Pre-register r2→r3 gates (write into PROTOCOL or a short DECISION note):**
   - After r2, pool ticket means across repeats (or report both repeats + pooled).
   - Proceed to r3 **only if** at least one of A2−A1 or A3−A2 still has pooled CI excluding 0 **or** a pre-specified “unstable but large” rule the owner accepts in writing.
   - If **both** A2−A1 and A3−A2 collapse to ~0 ± noise → **skip r3** (protocol already says this; enforce it).

3. **Require schema-conditional paired Δ in the next writeup** (no new runs; recompute on existing + r2). On r1, among tickets schema-valid under **both** styles: **A2−A1 = 0.0 pp (n=61).** That is a material reinterpretation, not a footnote.

4. **Ban family-level proof language.** F5 may be shown as exploratory only. Net A2−A1 lift is **entirely** F5 (+6 tickets); non-F5 nets **0**.

5. **Fix the reh40 cross-check narrative before spending.** On the rehearsal_40 case overlap inside this full_120 run: A1 **19/40 (47.5%)**, A2 **17/40 (42.5%)**, A3 **13/40 (32.5%)**. A2 is *worse* than A1 on that subset — opposite of the full_120 A2>A1 story. Findings currently soft-pedal this.

No harness “must-fix” bug found that requires a pause for infra (model id locked `gpt-5.4-nano`; styles leak-clean; B1 maps to `temperature: 0` + `reasoning.effort: none` for this id; 0 infra / 0 unscorable). **Do not** pause for SO/API attachment differences by style — none observed. **Do** change the *story*, not the wiring.

---

## Arithmetic audit (r1)

| Check | Findings claim | Raw/summary | Result |
|------:|----------------|-------------|--------|
| A1 / A2 / A3 pass | 51/120, 57/120, 44/120 (42.5 / 47.5 / 36.7%) | summary `by_prompt_style` + recount | **Match** |
| Overall | 152/360 (42.2%) | 152/360 | **Match** |
| Paired flips A2−A1 | 13 / 7 / 100 | recount | **Match** |
| Paired flips A3−A2 | 3 / 16 / 101 | recount | **Match** |
| Paired flips A3−A1 | 9 / 16 / 95 | recount | **Match** |
| Family table | F1…F6 as published | recount (F6 id is `F6_robustness_hard_cases`) | **Match** |
| Style leakage | (implied clean) | A1 has 0 role lines; A2/A3 exact locked lines; no A3 text in A2 | **Clean** |
| Model drift | gpt-5.4-nano | 360/360 | **Clean** |

**Provisional bootstrap (1 repeat, ticket-resampled, B=10k):**

| Contrast | Mean Δ | ~95% CI | Excludes 0? |
|----------|-------:|---------|:-----------:|
| A2 − A1 | +5.0 pp | [−1.7, +12.5] | **No** |
| A3 − A2 | −10.8 pp | [−17.5, −4.2] | **Yes** |
| A3 − A1 | −5.8 pp | [−13.3, +2.5] | **No** |

So: **A2 “help” is noise-compatible; A3-vs-A2 hurt is the only contrast that looks real under the Track-1 rule even at n=120×1.**

---

## Overclaimed statements in r1 findings

> **“A2 (role line) looks modestly better than A1 (+5 pp).”**  
> **Correction:** Directionally +5 pp on one repeat, but **not distinguishable from noise** under the study’s own claim rule. Prefer: “A2−A1 +5 pp screen signal; CI includes 0; McNemar n.s.”

> **“On nano54, the A-axis is not flat: role alone trends up a bit; competencies trend down.”**  
> **Correction:** “Not flat” oversells. A3−A2 down is the supported arm. A2−A1 “trends up” is F5-concentrated and **vanishes** when conditioning on mutual schema validity (0 pp).

> **“That answers the owner question directionally — yes, a clearer gap shows up off-ceiling.”**  
> **Correction:** Unfair vs luna. Luna is **3-repeat claim-ready** near ceiling (~87–89%); this is **1-repeat screen** mid-band. Larger raw pp gaps are expected under lower base rate + higher variance. You may say “larger *point estimates* than luna’s Axis A,” not “answers the question that role shows a clearer real effect.”

> **“Most of the A2 lift sits in F5_full_flow (+6 tickets vs A1).”** (exploratory — fine)  
> **Risk of overclaim if used as support for role:** Net lift is **100% F5**; non-F5 cancel to zero. Reading plan §4: family cuts are not proof. Do not let F5 become the implicit mechanism story without pre-registration.

> **“Role clearer than on luna? Yes, directionally (~5–11 pp moves vs ~0–2 pp).”**  
> **Correction:** Comparing unsigned gap magnitude across models/repeats without uncertainty is narrative cherry-picking. Under the locked rule, luna Axis A is a null; nano A2−A1 is also a null; nano A3−A2 is a candidate negative. That is **not** “role clearer.”

> **“Worth a confirmatory multi-repeat if you care about weaker models.”**  
> **Correction:** Worth **at most one** confirmatory repeat after reframing; r3 only if mid-critic still sees a live contrast. Blindly burning three full matrices to chase a +5 pp A2 story is not justified by r1.

---

## Confounds & design challenges

| Issue | Assessment |
|-------|------------|
| **SO / Structured Outputs attachment** | Shared harness path; no style-specific attachment bug spotted. Not a pause trigger. |
| **Temperature / effort** | `gpt-5.4-nano` B1 → `temperature: 0`, `effort: "none"` (distinct from `gpt-5-nano` minimal). Consistent with protocol. |
| **Model id drift** | None in r1. |
| **Style text leakage** | None. Role lines append after shared scaffold (end-loaded). Length: A1 &lt; A2 &lt; A3 — A3 hurt could be **verbosity / distraction**, not “competencies” content per se (protocol already refuses length correction; flag as interpretive limit). |
| **Family imbalance / F5** | **Serious cherry-picking risk** for A2 help. Net +6 all in F5 (35 tickets). |
| **Schema mediation** | **Dominant.** 154/208 fails (~74%) `output.schema_invalid`. Pass ⇒ schema_valid always. Schema rates track styles (A2 62.5% / A1 56.7% / A3 52.5%). **11/13** A2&gt;A1 flips are schema-gain flips; **12/16** A3&lt;A2 flips are schema-loss flips. Conditional on both schema-valid: A2−A1 **0 pp**. |
| **Reh40 subset reverse** | A2 &lt; A1 on the 40 overlapping reh cases. Undermines “role helps” generalization even within this pack. |
| **1 repeat** | Protocol correctly marks provisional; findings sometimes talk like a directional answer anyway. |

---

## Noise: is +5 / −11 real at n=120×1?

- **+5 pp A2−A1:** No. Discordant mass is only **20/120** tickets; 13 vs 7 is compatible with a fair coin. Bootstrap CI includes 0. **Not worth r3 on this arm alone.**
- **−11 pp A3−A2:** More credible on r1 (CI excludes 0; McNemar p≈0.004), but **schema-heavy** and still one repeat. **Worth r2 confirmation**, not automatic belief.

**What r2 must show to justify r3**

| Arm | Worth r3 if… | Stop arm if… |
|-----|----------------|--------------|
| A2−A1 | Pooled (r1+r2) CI excludes 0 **and** schema-conditional Δ isn’t ~0 | r2 ≈ 0/negative, or pooled CI includes 0 |
| A3−A2 | Pooled CI still excludes 0 (even if attenuated) | r2 near 0 and pooled includes 0 |
| Both flat | — | **Skip r3** (protocol) |

Rough guide: if r2 A2−A1 is ~0, pooled mean ~+2.5 pp — still weak. You need r2 to **replicate** ~+5 (or better) *and* survive schema-conditional scrutiny before paying for r3 on “role helps.”

---

## Unfairness vs luna comparison narrative

1. **Repeats:** luna 3 × claim rule vs nano 1 × screen language dressed as “answers the owner question.”  
2. **Ceiling:** luna B1 ~89% compresses Axis A; nano ~40% expands variance. Larger pp swings ≠ stronger causal role effect.  
3. **Failure regime:** nano is mostly **schema formatting**; luna is mostly past that. Saying “role shows up off-ceiling” without “mostly via schema attainment” imports a product story the exam may not support.  
4. **Do not merge into luna `CLAIM.md`.** Protocol is right; r1 findings’ “clearer gap” tone is the main fairness risk.

---

## Risks if we continue as planned (blind r2→r3)

- **Money:** another 360–720 runs to “confirm” an A2 effect that already fails the claim rule and schema-conditional null.  
- **Narrative lock-in:** “role helps weaker models” becomes folk memory from +5 pp / F5 / schema luck.  
- **Wrong product lesson:** optimizing persona lines instead of schema/output discipline on mid-tier models.  
- **A3 length confound** misread as “competencies hurt forever.”  
- Skipping mid-critic (Stage 3) and collapsing into a 3-repeat spend.

---

## What would falsify the “role helps on weaker model” story

Already nearly falsified on r1; treat as **falsified for claim purposes** unless r2 overturns:

1. Pooled A2−A1 bootstrap CI **includes 0** (true for r1 alone).  
2. Schema-conditional paired A2−A1 **≈ 0** (true on r1: **0 pp**).  
3. A2 lift **fails to replicate** outside F5 / reverses on r2 (reh40 overlap already reverses).  
4. Pass|schema rates stay ~flat across A1/A2 while overall pass moves — i.e. pure schema-selection artifact (r1: pass|schema ≈ 75% vs 76%).  
5. Any honest writeup that applies the **same** helped/hurt rule used for luna.

**Competencies-hurt** is a *different* story: falsify if r2 A3−A2 collapses and/or schema-conditional residual goes to ~0.

---

## Opinionated bottom line

- **Do not** sell r1 as a weaker-model role win.  
- **Do** allow **r2 once**, with corrected framing, mandatory schema-conditional tables, and hard stop before r3.  
- Preferred scientific read today: *On gpt-5.4-nano B1, Axis A is mostly a schema-sensitivity story; role alone is not a clear full-ticket help; bolting generic competencies onto role looks harmful in this probe.*  
- If budget is tight and the only open question was role-help: **STOP** and pocket the win of “not a hot role effect.”
