# Introduction

**Status:** Writing draft. Keep ≤3 contribution bullets. Primary claim fences match `CLAIM.md`.  
**Wording:** Prefer public terms in `TERMINOLOGY.md`.

---

## Motivation

A common piece of prompting advice is to cast the model as an expert: "you are a helpful scheduling agent," sometimes followed by a short list of professional virtues. That advice is familiar in chat. It is also still common in agents that call tools to book real jobs. Those product prompts already contain a long task policy, tool schemas, and an output contract. Whether a short role line, or a generic competency sentence on top, then changes how often the agent fully completes the job is less clear than the advice implies.

That is worth measuring. If the extra identity text rarely clears a pre-set statistical bar once the task rules are locked, people who ship these agents can stop treating it as a primary lever and spend time on the rules, the evaluation, and (where the API offers it) reasoning effort. If it does help or hurt under a locked design, that is worth knowing too.

We test this on an appliance-repair scheduling exam: simulated tools, Structured Outputs, and a deterministic grader. No LLM-as-judge for pass/fail. The confirmatory model is OpenAI `gpt-5.6-luna`. The primary contrast is short role / generic competencies versus task-only. Instant versus thinking is secondary. Related work on Kong-style role-play and ExpertPrompting biographies is a different intervention; we return to that in Discussion.

---

## Contributions

1. **A confirmatory, protocol-locked null on short role / generic competency text** in this tool-using scheduling exam on `gpt-5.6-luna` (*N* = 2160 graded attempts). Under a pre-set case-level paired bootstrap rule, none of the primary prompt-style contrasts meet the threshold for clear help or clear harm on full-case pass **in this setup**.

2. **A secondary mode result.** Medium reasoning effort lifts full-pass rates versus instant (+8.4 pp overall). Asking the model to think changes outcomes here. The short identity line does not.

3. **Appendix A.** On `gpt-4.1-mini`, a longer pure persona clearly hurt (−8.6 pp). Short role still did not clear the bar. Nano models show the exam is hard when the model is weak. None of that rewrites the Luna claim.
