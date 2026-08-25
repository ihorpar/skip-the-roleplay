# Introduction

**Status:** Writing draft. Keep ≤3 contribution bullets. Primary claim fences match `CLAIM.md`.  
**Wording:** Prefer public terms in `TERMINOLOGY.md`.

---

## Motivation

A durable piece of prompting folklore tells teams that ship LLM agents to cast the model as an expert: “you are a helpful scheduling agent,” sometimes followed by a short list of professional virtues. In chat-only settings that advice is familiar; in **tool-using business agents** it is still common. Product prompts often already contain dense task rules, tool schemas, and output contracts. Whether a short role line, or soft generic competencies on top, changes end-to-end success is less clear than the folklore implies.

That question matters operationally. If short persona text rarely meets a serious statistical threshold once the instruction stack is locked, people who deploy these agents can stop treating it as a primary lever and spend attention on task rules, evaluation, and (where available) reasoning effort. If it *does* help or hurt in a confirmatory design, that is also worth knowing before the next round of prompt lore.

We study this in a realistic but scoped setup: an appliance-repair scheduling agent exam with simulated tools, Structured Outputs, and a deterministic gold evaluator (no LLM-as-judge for pass/fail). The confirmatory model is OpenAI `gpt-5.6-luna`. The primary factor is short role / soft competencies vs task-only; thinking vs instant is reported as secondary. The intervention under test is short identity paste on a dense agent stack. It is not strategically designed role-play as a chain-of-thought trigger on sparse reasoning benchmarks, and not rich ExpertPrompting-style biographies.

---

## Contributions

1. **A confirmatory, protocol-locked null on short role / soft competency text** in a dense tool-using business-agent exam on `gpt-5.6-luna` (*N* = 2160 graded attempts): under a pre-set case-level paired bootstrap rule, none of the primary prompt-style contrasts meet the threshold for clear help or clear harm on end-to-end success **in this setup**. This does not refute Kong-style role-play as an implicit CoT trigger on reasoning benchmarks without that stack.

2. **A clear secondary mode result.** Medium reasoning effort lifts full-pass rates substantially vs instant (+8.4 pp overall). Eliciting deliberation changes outcomes here; shallow identity text does not. We report this separately from the prompt-style claim.

3. **Fenced follow-ups:** A3 is soft generic fluff (not domain coaching); longer-persona and other-model checks stay in the appendix and do not rewrite the Luna claim.
