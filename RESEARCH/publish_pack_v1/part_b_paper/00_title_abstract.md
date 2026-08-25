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

Production agents that book jobs and call tools often start with a role line ("you are a scheduling agent") and a sentence of generic professional virtues. The rest of the prompt is usually already a long, correct task policy plus strict tool and output schemas. We tested whether those extra identity lines change how often the agent fully completes the job.

The exam is appliance-repair scheduling. Each case is one messy customer message, simulated tools, and a gold answer. The agent passes only if the required tool calls, arguments, extracted fields, and (when required) the exact customer reply all match gold. A paraphrase or a near-miss is a fail.

We ran OpenAI `gpt-5.6-luna` on 120 frozen cases. Prompt styles: task instructions only (A1); the same plus a short role line (A2); the same plus that role line and one generic competency sentence (A3). API modes: instant (`reasoning.effort=none`) and thinking (`reasoning.effort=medium`). Three repeats. 2160 graded attempts, 0 technical API failures. This is the short line people paste onto an already specified agent, not Kong-style role-play on reasoning benchmarks and not ExpertPrompting-style expert biographies.

Under the locked rule (case-level paired bootstrap 95% CI must exclude 0), none of A2−A1, A3−A2, or A3−A1 cleared that bar in instant, in thinking, or pooled. Short role and generic competencies did not show a clear help or clear harm **in this setup**. Pass rates are high, especially with thinking on, so a tiny true effect could still hide. Thinking beat instant by **+8.4 pp** (96.9% vs 88.5%). The title is about the role line, not that mode gap.

**Limits.** A3 is one generic sentence, not domain coaching. Pass/fail is all-or-nothing. One confirmatory model, one domain.
