# Critic #1 — Methods + Claims (Part B only)

**Date:** 2026-07-25  
**Scope:** Methods, results, claim fences vs `CLAIM.md`, reading plan, `main120_FINDINGS` + `main120_analysis_v1.json`; appendix/mini fence check.  
**Not in scope:** Part A, related-work novelty, prose style, “run more models.”

**Applied (owner 2026-07-25):** Undersell + Methods/Results boundary fixes landed in `00_title_abstract`, `01_introduction`, `03_methods`, `04_results`, `05_discussion`. No invented B2−B1 bootstrap CI (not in analysis JSON); secondary uses locked overall +8.4 pp and within-style gaps. Part A unchanged.

---

## 1. Verdict

**Yes-with-fixes.** Part B’s confirmatory design, locked excludes-0 rule, primary null, secondary thinking lift, A3 thinness, and exploratory/mini demotion match the locked claim pack; pass rates and contrast CIs match findings/JSON (rounded). Ready enough for peer feedback after tightening undersell (repeated universal-never hedges stacked on a clean locked null) and one Methods/Results boundary clean-up—not after a redesign or more disclaimers.

---

## 2. Must-fix

None. No number mismatches vs `main120_FINDINGS_2026-07-21.md` / `main120_analysis_v1.json`; no universal “never helps” overclaim; mini longer-persona hurt stays appendix/separate; protocol lock is not sold as OSF pre-registration.

---

## 3. Should-fix

- **Methods states the null outcome in the RQ section** (`03_methods.md` “Locked claim language for findings… did not show…”). Keep the *rule* and planned contrasts in Methods; put the *outcome* sentence only in Results/Abstract so peers don’t read Methods as already concluding.
- **Pooled labeling vs primary sentence:** Results tables call pooled “summary; not a separate primary claim,” while the primary null sentence (and `CLAIM.md`) includes “or pooled.” One clarifying phrase is enough—e.g. pooled is a locked *summary check*, not a third research question—so readers don’t think the null was stretched post hoc.
- **Secondary mode contrast:** B2 ≫ B1 is correctly secondary and numerically large (96.9 vs 88.5), but Methods/Results never show a paired B2−B1 Δ/CI the way A-contrasts do. Optional one-liner with case-level paired Δ would make the secondary report as crisp as the primary null (not required to “promote” it to the title claim).

---

## 4. Undersell / overhedge

- **Same fence repeated three times:** Abstract Limits + Results “What this does *not* claim” + Discussion “What the claim is not” all restate “does not prove role never matters” / “thinking is not useless.” Keep **one** short fence block (prefer Discussion or Abstract Limits); drop the Results duplicate so the locked null isn’t surrounded by apology.
- **Sensitivity/MDES immediately under the primary tables** (`04_results.md`) plus ceiling language in Abstract Limits and a long Discussion “Limits that bound how far to push the null” makes a fair reader underrate a clean excludes-0 null. Keep a short ceiling/MDES note once; don’t re-litigate “not exactly zero” in every section.
- **Thinking lift framed as something to apologize for** (“must not become the title finding” × Abstract/Discussion). Title fencing is already decided—report B2 ≫ B1 as a confident secondary result, then move on. Suggested tone: “Secondary: thinking ≫ instant (report; not the title claim).”

---

## 5. Do not change

- Punchy title/subtitle + body “in this setup” / “no clear help or harm under the pre-set rule.”
- Primary claim: short role / soft competencies null under case-level paired bootstrap 95% CI excludes 0; Luna; N=2160; 0 technical failures.
- A3 as thin generic competencies (disclosed), not a bug to redesign.
- Exploratory demotion (long-persona pilots, nano/mini ladder); `gpt-4.1-mini` as separate model claim in appendix (longer persona hurt; short role null).
- Internal protocol lock ≠ public OSF/AsPredicted.
- Terminology: exam case / end-to-end success in public prose; A1–A3 / B1–B2 OK once defined.
- Numbers as drafted (match findings/JSON).

---

## 6. Ignore / out of scope

- Part A (`part_a_public/`) — frozen.
- Related-work novelty / citation completeness.
- Prose style, title wordsmithing beyond claim fairness.
- Suggestions to run more models, domains, or soft metrics.
- Softening the subtitle further (owner decision locked).
