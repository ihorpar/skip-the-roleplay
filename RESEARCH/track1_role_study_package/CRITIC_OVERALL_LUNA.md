# Critic overall — Track 1 on `gpt-5.6-luna` (postmortem)

**Date:** 2026-07-22  
**Scope:** Main confirmatory experiment only — A1/A2/A3 × B1/B2 × full_120 × 3 repeats = **2160** scored runs.  
**Role:** Fair but diligent critic. No new API runs. No rewrite of `CLAIM.md`.  
**Authority:** `CLAIM.md` · `00_protocol/results-reading-plan-v1.md` · `04_analysis/main120_FINDINGS_2026-07-21.md` · `04_analysis/main120_analysis_v1.json`  
**Out of claim:** nano / nano54 probes (see §8). Do not merge their stories into the locked Axis-A claim.

---

## 1. One-paragraph verdict

We ran a clean, pre-registered study on a strong model asking whether a short role line, then generic competencies, change full-ticket pass rates in a realistic scheduling-agent exam. Under the locked rule, **none** of the role contrasts cleared the bar — not in B1, not in B2, not pooled. That null is real and worth keeping. But the exam sat near the ceiling (especially B2 at ~97%), the A3 “competencies” arm was one soft generic sentence, and the primary score was harsh binary full match. So the honest product takeaway is: **in this common setup, on this strong model, persona fluff did not show a clear help or harm** — not “role prompting never matters anywhere,” and not a precision map of tiny effects.

---

## 2. What is solid / claim-ready

These points hold up under the reading plan and the arithmetic:

1. **Axis A is flat under the pre-registered rule.**  
   A2−A1, A3−A2, and A3−A1 all have ticket-level paired bootstrap 95% CIs that include 0 — inside B1, inside B2, and pooled. Mean gaps are tiny (mostly under ~2.5 pp). That matches `CLAIM.md`.

2. **The study was run like a confirmatory study.**  
   Reading plan locked before the paid 120. Rehearsal → fix → freeze pack → main matrix × 3. Claim language was scoped to “this setup,” not universal law.

3. **Harness quality was excellent.**  
   2160/2160 scored. 0 technical API failures. Repeats stable (r1 92.5% · r2 93.1% · r3 92.6%). We are not looking at a wiring bug dressed up as science.

4. **Prompt deltas were small and intentional.**  
   A2 adds one role line. A3 extends that line with generic competencies only (no workflow coaching). Scaffold, tools, schemas, and user prompt stay fixed. That is a fair test of *persona/competency fluff*, not of “better task instructions.”

5. **`CLAIM.md` already refuses several bad overreads.**  
   It does not claim role never matters anywhere. It does not promote B2>B1 as the Axis-A answer. It flags that A3 was generic only. Keep those fences.

**Soft clarification (critic file only — do not edit `CLAIM.md` unless owner wants):**  
When paraphrasing, prefer “did not show a clear help or harm” over “role does nothing.” The locked wording already leans that way; the risk is oral shorthand collapsing it to “proven useless.”

---

## 3. What was overclaimed or is easy to overclaim

| Tempting line | Why it fails |
|---------------|--------------|
| “Role prompting doesn’t work” / “persona is useless” | Study shows **no clear effect in this setup**. Wide CIs still allow small real effects. Ceiling hides small ones. |
| “We proved role never helps business agents” | One model, one scaffolded scheduling exam, Structured Outputs + exact phrases. Not a product universe. |
| “Thinking is what matters; role is irrelevant” | B2 ≫ B1 is a **mode** pattern, not the primary Axis-A question. Do not launder it into the role claim. |
| “A3 hurt performance” | Point estimates dip a bit (esp. B1 A3), but **no CI excludes 0**. “Hurt” would violate the claim rule. |
| “The exam was easy, so the null is meaningless” | Nano A1×B1 probe shows weaker models nearly floor. Exam is hard for weak models; **strong** models sit near ceiling. Both can be true. |
| Folding nano54 “role helps off-ceiling” into luna | Separate probe; later critic shut that story down. Do not soft-merge. |

**Fair residual language (keep):**  
On luna, in this harness, adding a short role / generic competencies line did not move full-ticket success enough to clear the pre-registered bar.

---

## 4. Biggest weaknesses

1. **Ceiling / saturation.**  
   Overall ~93%. B2 cells ~97%. F1 extract was perfect. Most fails sit in B1 (~79% of fails). When almost every ticket already passes, Axis A has little room to show help. The study is strong at ruling out **large** role effects; weak at detecting **small** ones.

2. **Primary metric is all-or-nothing.**  
   Full pass requires tools + fields + **exact** allowed customer phrase. That is good for a hard exam gate. It is a blunt instrument for “did persona nudge behavior a little?” Soft improvements die as fails.

3. **A3 is a thin treatment.**  
   One longer sentence about “careful listening… adherence to procedures.” No domain coaching (by design). So a null on A3 answers “does this soft competency fluff help?” — not “do good competencies help?” Easy to over-tell as “competencies don’t matter.”

4. **Scaffold already does the real work.**  
   Task rules are long, explicit, and post-rehearsal-hardened. The role line is a tiny add-on. A null here may partly mean: **once instructions are already dense and correct, persona adds little** — which is still useful, but narrower than “role never matters.”

5. **Uncertainty is not tiny.**  
   Especially B1 A3−A1: about −2.2 pp with CI roughly −8 … +4. That is “no clear effect,” not “precisely zero.” Storytelling that sounds precise overclaims the resolution.

6. **Length / verbosity not controlled.**  
   Protocol correctly refused filler equalization. Fine for “content quality” framing. Still: A3 is longer. If someone later sells “competencies hurt,” length/distraction remains a confound (nano54 showed how ugly that story can get).

---

## 5. Was 2160 runs worth it for this question?

**Mostly yes — for a claim-ready answer. Not for discovering a big Axis-A surprise.**

Worth it because:

- The product question (“should we sweat role/persona lines on a strong model in this kind of agent?”) needed a **confirmatory** no-clear-effect, not a vibe from 40 tickets.
- Clean infra + 3 stable repeats make the null trustworthy enough to stop chasing persona as a lever **on this stack**.
- Rehearsal fixes before the main burn were the right spend order.

Limits on the ROI:

- Half the matrix (B2) was near saturated; little Axis-A information there.
- After r1, the A-null was already visible; r2/r3 mainly bought stability and claim discipline, not a new story.
- For *this* Axis-A question alone, a harder exam or a B1-weighted design would have bought more signal per dollar.

**Net:** paid for a disciplined, citeable answer. That is valuable. Do not pretend 2160 runs unlocked deep persona psychology.

---

## 6. How B1 vs B2 should / should not be talked about

**Should:**

- Report B2 much higher than B1 (~97% vs ~89%) as a **mode / reasoning-effort pattern**.
- Keep A-contrasts **separate** inside B1 and inside B2 (as the plan requires).
- Note that most fails live in B1 — exploratory context for where headroom remains.

**Should not:**

- Say the study’s main finding is “thinking helps.” That was not the primary Axis-A question.
- Say “thinking replaces role” or “role only matters without thinking.” A-nulls hold in **both** modes; B2 just has less room to move.
- Pool B1+B2 into one marketing sentence about persona without saying the claim rule still found no clear A-effect either way.

**One clean bridge sentence:**  
*Reasoning effort moved full-ticket success a lot; role/competencies lines did not show a clear move under the same exam.*

---

## 7. Top 3 things to change if redesigning Track 1 today

1. **Give Axis A headroom.**  
   Harder tickets, stricter families, or a pre-registered primary slice where baseline pass is mid-band (e.g. B1-only hard set). Otherwise strong models keep returning flat persona stories by saturation.

2. **Make A3 a real treatment — or rename the claim.**  
   Either add a true domain-coaching arm (separate from generic fluff), or add a length-matched distractor arm so “competencies” is not one soft adjective pile. Today’s A3 cannot support big talk about competency design.

3. **Pre-register one sensitivity metric beside binary full pass.**  
   Examples: schema-held success, tool-sequence match, or phrase-relaxed pass as secondary. Keep binary full pass as the claim gate if desired — but give the study a way to notice soft effects without inventing them after the fact.

Honorable mention: power/MDES note before scale (“with ~97% B2 pass, we cannot resolve X pp effects”). Would have set expectations and maybe cut B2 repeats.

---

## 8. How nano54 (and other nano) side probes should / should not be attached

**Should:**

- Keep them in `06_supporting_nano_probe/` (or the nano54 package) as **appendix context**.
- Use the early nano A1×B1 gap to say: *the luna null is not because the exam is trivial for every model.*
- If mentioning nano54 at all: *a weaker mid-band screen also failed to deliver a claim-ready “role helps” story; do not rewrite luna.*

**Should not:**

- Edit or soften `CLAIM.md` with nano numbers.
- Say “role works when you leave the ceiling” — that narrative did not earn claim strength.
- Average luna and nano, or talk as if there is one cross-model Axis-A claim.
- Let nano54’s A3 schema/formatting drama become folklore about luna competencies.

**Fair bridge (optional):**  
*On luna, Axis A was flat near ceiling. Separate weaker-model probes did not overturn that claim and are not part of it.*

**Unfair bridge:**  
*“Nano shows what luna missed”* or *“together they prove persona policy for all models.”*

---

## Critic bottom line (for the archive)

Luna Track 1 did its job: a clean confirmatory null on role/persona/generic competencies for full-ticket success in this business-agent setup. The claim package is usable. The main scientific limit is **ceiling + thin A3 + harsh binary metric**, not dishonest analysis. Tell the story narrowly. Keep B2’s big lift in the “mode” column. Keep nano probes out of the locked claim.

