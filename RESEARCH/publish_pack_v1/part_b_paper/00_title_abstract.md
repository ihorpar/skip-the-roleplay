# Title and abstract

**Status:** Writing draft for workshop / arXiv framing.  
**Claim authority:** `RESEARCH/track1_role_study_package/CLAIM.md`  
**Venue posture:** Confirmatory null with a punchy title; body scoped to this setup.  
**Wording:** Prefer public terms in `TERMINOLOGY.md` (exam **case**, not lab “ticket”).

---

## Title (locked)

**Skip the Roleplay**  
*Persona prompting did not improve a real-world AI agent*

Part A public readout keeps its question headline (“Does telling the model ‘you are an expert’ still help?”); that is fine for the human story layer.

*Note:* The subtitle is punchy by design. Body text uses the locked claim (“did not show a clear help or clear harm … **in this setup**”).

*Retired title drafts:* Task Rules Are Enough; Role Is Optional; Instructions Beat Identity; longer descriptive titles.

---

## Abstract

Teams that ship LLM agents still prepend short role lines (“you are a scheduling agent…”) and soft competency text to tool-using business agents. It is unclear whether those additions change **end-to-end success** when the task instructions, tools, and schemas are already dense and correct.

We test that common paste, a short identity line plus soft generic virtues, on top of an already dense stack. This is not a test of strategically designed role-play as an implicit chain-of-thought method on sparse reasoning benchmarks, and not a test of rich auto-synthesized expert biographies.

We run a confirmatory matrix on OpenAI `gpt-5.6-luna` over a frozen **120-case** appliance-repair scheduling exam with deterministic gold labels (required tools and fields, plus an exact allowed customer reply where applicable). Interaction is a multi-turn **tool loop** over one fixed user message and fixture-backed tools (not a simulated multi-turn user). Prompt styles are task-only (A1), +short role (A2), and +role + **generic** soft competencies only (A3). Run modes are instant (`reasoning.effort=none`, B1) and thinking (`reasoning.effort=medium`, B2), with three repeats: **2160** graded attempts and 0 technical API failures.

Under the locked analysis rule (case-level paired bootstrap 95% CI must exclude 0), none of A2−A1, A3−A2, or A3−A1 meet that threshold in B1, in B2, or in the pooled summary check: short role / soft competencies did not show a clear help or clear harm on end-to-end success **in this setup**. High pass rates, especially in thinking mode, limit sensitivity to tiny prompt-style effects, so the claim is no clear effect under the locked threshold, not an effect size of exactly zero. A secondary result: thinking mode beat instant by **+8.4 pp** overall (96.9% vs 88.5%). We report it; it is not the title finding.

**Limits.** A3 is soft generic fluff, not domain coaching; the metric is binary full pass; evidence is one confirmatory model and one domain. Scope fences and the desiderata mapping live in Discussion.
