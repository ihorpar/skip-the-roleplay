# Critic overall — gpt-5.4-nano role study (postmortem)

**Date:** 2026-07-22  
**Scope:** Closed experiment (r1 + r2; **R3_SKIP**). No new runs. No new gate.  
**Role:** Same fair diligent critic as `CRITIC_r1.md` and `CRITIC_mid_r1_r2.md`.  
**Inputs:** `PROTOCOL.md` · `CRITIC_r1.md` · `CRITIC_mid_r1_r2.md` · `FINDINGS_PROVISIONAL.md` · `POOL_r1_r2_NOTE.md`  
**Luna context (read-only):** `RESEARCH/track1_role_study_package/CLAIM.md` — not rewritten.

---

## 1. One-paragraph verdict

We spent two full matrices (720 scored runs) asking whether a role line, then generic competencies, move full-ticket pass on a weaker mid-band model. The honest answer: **role alone never cleared the same helped/hurt bar we use for luna**, and the early “competencies hurt” scare was mostly **fragile schema formatting**, not a clean content effect. Stopping before a third matrix was correct. This study was worth running as a **screen that shut down a tempting weaker-model role story** — not as a claim package.

---

## 2. What we learned that is solid

These points survive both repeats, schema-conditional checks, and the critics’ arithmetic audits:

1. **Role (A2 vs A1) is not a clear full-ticket help on `gpt-5.4-nano` B1.**  
   Point estimates stayed a few points up (+5.0 → +3.3 → pooled +4.2 pp). Every CI included 0. Schema-conditional Δ stayed ~0 on both repeats. That is a **stable null under the Track-1 rule**, not a near-miss win.

2. **Most fails on this stack are schema/output validity, not “wrong business answer after valid JSON.”**  
   Pass moves tracked schema attainment. Flips were heavily schema-gain / schema-loss. Once both styles already produced valid schema, role’s pass gap disappeared. That is the main mechanism lesson.

3. **A3’s big r1 drop did not hold as a claim-strength competencies effect.**  
   r1 looked real (−10.8 pp, CI excl. 0). r2 attenuated (−3.3 pp, CI incl. 0) and schema-cond residual went to **0**. Pooled raw A3−A2 still negative (−7.1 pp) mainly because **r1 still pulls the ticket means**. Solid learning: discovery hits on nano can look like “competencies hurt” when they are mostly **formatting sensitivity + length/distraction risk**.

4. **Family (F5) concentration is real as an exploratory warning, not as proof.**  
   Net A2−A1 lift stayed F5-heavy; non-F5 cancelled. Reh40 overlap inside full_120 even had A2 **below** A1 on r1. Solid learning: do not build a “role helps weaker models” story from one family or one subset.

5. **Harness was clean enough to trust the null.**  
   Model id locked; styles leak-clean; 0 infra / 0 unscorable across 720 runs. We did not stop for a wiring bug. We stopped because the **signal** failed.

6. **Staged gates worked.**  
   Critic → one confirmatory repeat → mid-critic → skip r3 prevented burning another 360 runs on an attenuating schema story.

---

## 3. What we overclaimed or almost overclaimed

Things that appeared (or nearly appeared) in early writeups and must stay demoted:

| Tempting line | Why it fails |
|---------------|--------------|
| “Role helps on a weaker / off-ceiling model” | A2−A1 never cleared the paired-bootstrap bar; schema-cond ≈ 0. Larger pp swings than luna ≠ causal role effect. |
| “The A-axis is not flat” (as a role win) | Only A3−A2 looked non-flat on r1; A2−A1 was noise-compatible the whole time. |
| “Role clearer than on luna” | Unfair: luna is 3-repeat claim-ready near ceiling; this is a 2-repeat mid-band screen. Under the **same** rule, both Axis-A role contrasts are nulls. |
| “Competencies hurt on weaker models” (as proven content harm) | Raw pooled CI excludes 0, but r2 failed claim-strength replication and schema-cond residual vanished. Headline would become folk memory from **r1 pull**. |
| “F5 shows the mechanism” | Exploratory only; net lift 100% F5 on r1; reading plan forbids family proof. |
| Merging into luna `CLAIM.md` | Protocol forbade it; still the main narrative risk if anyone soft-merges “weaker models differ.” |

**Fair residual language (keep):**  
There is a **provisional raw association** that A3 scored lower than A2 when pooling with the discovery repeat. Say that carefully. Do **not** say we proved generic competencies content hurts ticket success.

---

## 4. Was stopping at 2 repeats the right call?

**Yes.**

Why:

- The **role-help arm** was already dead under the claim rule after r1 and stayed dead after r2 and pooling.
- The **A3-hurt arm** met the *necessary* pooled-CI gate, but failed Stage-1 falsifiers on the confirmatory repeat: attenuation, r2 CI includes 0, schema-cond residual 0, pooled schema-cond CI includes 0.
- A third matrix would mostly buy another draw on **schema fragility**, not a sharper Axis-A persona claim.
- Mid-critic correctly treated “ONLY if pooled CI excludes 0” as **necessary ≠ sufficient**. That judgment matches the protocol’s purpose for Stage 3.

Stopping earlier (after r1 only) would also have been defensible **if** the owner only cared about “does role help?” — r1 already answered that. Spending r2 was still reasonable to stress-test the A3 scare. Spending r3 was not.

---

## 5. Was this experiment worth running at all?

**Yes — as a bounded screen with hard stops. No — as a claim factory.**

Worth it because:

- It **falsified** (for this setup) the tempting product story that role “shows up” once you leave luna’s ceiling.
- It showed that mid-tier nano54 exam noise is dominated by **schema attainment**, which changes what you should optimize next.
- Staged spend (r1 screen → r2 confirm → skip r3) was a good use of budget relative to a blind 3× matrix.

Not worth treating as a second Track-1 claim package because:

- Failure regime ≠ luna’s (schema vs post-schema).
- Only 2 repeats; A3 arm never became claim-ready under schema-held scrutiny.
- Comparing unsigned gap sizes across models without shared uncertainty is how overclaims start.

**Net:** paid for a clear “don’t chase persona on this stack” lesson. That is useful. Do not inflate it into “we mapped Axis A on weak models.”

---

## 6. If we redid it, top 3 design changes

1. **Primary metric: schema-held (or schema-valid) success, not raw pass alone.**  
   Pre-register raw pass as secondary. Most of the drama here was formatting. Without that split, persona stories get laundered through schema luck.

2. **Kill length/verbosity confound for A3 up front.**  
   Either length-match A2 vs A3, or run a short “A3-short / distractor text” arm. Today’s A3 hurt could be **more tokens / more instructions**, not “competencies” content. Protocol refused length correction; that limit bit us.

3. **Pre-register family and subset non-claims harder — and make r3 sufficiency explicit.**  
   Ban F5 mechanism language before launch. Write “necessary pooled CI ≠ automatic r3” into the protocol text (not only critic notes). Optionally require **both** raw pooled CI excl. 0 **and** schema-cond CI excl. 0 before any third matrix.

Honorable mention (not displacing the top 3): pick a mid-tier model or harness mode less dominated by `schema_invalid` if the scientific question is really “does role change task reasoning,” not “does role change JSON attainment.”

---

## 7. How this sits next to luna Track 1

| | **Luna Track 1** | **This nano54 study** |
|--|------------------|------------------------|
| Model | `gpt-5.6-luna` (strong, near ceiling) | `gpt-5.4-nano` (weaker, mid-band) |
| Axis A question | Same A1/A2/A3 texts | Same texts |
| Modes | B1 + B2 | B1 only |
| Repeats | 3, claim-ready | 2, provisional; r3 skipped |
| Locked claim | Role / competencies: **no clear help or harm** on full ticket success | **Separate note only** — does not rewrite luna |

**Do not muddy luna’s claim:**

- Luna’s CLAIM remains the strong-model, claim-ready result: Axis A flat under the paired-bootstrap rule.
- Nano54 does **not** overturn that. It also does **not** prove the opposite niche story (“role works when the model is weaker”).
- Fair bridge sentence: *On a weaker mid-band model, we also failed to find a clear full-ticket role help; extra competency text looked harmful mainly through schema attainment and did not earn a third repeat.*
- Unfair bridge sentence: *“Role effects show up off-ceiling”* or *“nano contradicts luna’s null.”*

Keep packages separate. Owner may later decide on a cross-model synthesis doc; that is not this file, and it is not an edit to `CLAIM.md`.

---

## Critic bottom line (for the archive)

The main nano experiment did its job: it **stopped a narrative**, enforced spend discipline, and left a cautious product lesson (schema first on mid-tier). It did **not** deliver a second claim-ready Axis-A finding. That is a successful closed screen, not a failed claim study.
