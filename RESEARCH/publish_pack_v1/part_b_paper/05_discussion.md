# Discussion

**Status:** Writing draft. Threats and one claim fence; no new numbers invented here. Primary tables live in Methods/Results (from `04_analysis/`). Public wording: see `TERMINOLOGY.md`.

---

## What the claim is

The setup is locked: a long correct task policy, Structured Outputs plus tools, an appliance-repair scheduling exam, OpenAI `gpt-5.6-luna`, and binary full pass against deterministic gold. In that setup, adding a short role line, and then generic soft competencies, **did not show a clear help or clear harm** on full-case pass. Under the analysis rule (case-level paired bootstrap 95% CI must exclude 0), none of A2−A1, A3−A2, or A3−A1 meet that threshold in B1, in B2, or the pooled summary check (`CLAIM.md`).

If you run this kind of agent, do not treat the short persona line as a primary lever when "success" means the whole case matches gold. Follow-up work on longer personas and other model tiers (appendix) did not overturn that.

---

## Mapping to Principled Personas desiderata

Luz de Araujo et al. [2025] ask when personas *should* help via three desiderata. We map our contrasts explicitly (Fidelity is mostly out of scope):

| Contrast | Desideratum lens | What we can claim here |
|----------|------------------|------------------------|
| A2 − A1 | **Expertise Advantage** (thin, domain-matched short role vs no-persona) | Under the locked rule: **no clear positive or negative** Expertise Advantage on end-to-end pass on this dense tool stack (Luna). |
| A3 − A2 | **Robustness-adjacent** (soft generic virtues on the role; not name/color probes, not exam coaching) | Point estimates lean negative in places (esp. B1); **CI includes 0**, so no clear robustness failure under the rule. |
| A3 − A1 | Bundle vs baseline | No clear effect under the rule. |
| Longer pure persona − A1 (`gpt-4.1-mini`, appendix) | Stronger careful-design / Robustness-style warning | Met the **hurt** threshold on that mid-band stack; reported as a separate appendix claim. |

**Fidelity** (ordinal expertise / specialization hierarchy) was **not** tested. Soft virtues in A3 are not a ranked expertise attribute. Expert text helps most when it adds information the instruction stack lacks. Here the stack is already dense, so thin identity text has nowhere to bite. That framing explains the null; it does not weaken it.

---

## What this result is not

- Not a universal theorem that role prompting never matters in any product, model, domain, or metric.
- Not a refutation of strategically designed role-play as an implicit CoT method on sparse reasoning benchmarks [Kong et al., 2024], nor of rich auto-synthesized expert bios [Xu et al., 2023].
- A3 was **generic soft fluff**, not domain coaching or competency engineering.
- Exploratory long-persona pilots and weaker-/mid-band checks (including the separate `gpt-4.1-mini` claim) do **not** rewrite the Luna confirmatory null; see appendix.

Thinking versus instant is a real secondary result in this matrix (+8.4 pp overall). The title stays on the role line.

---

## Limits

### Ceiling / sensitivity

Pass rates on Luna are high; thinking mode is especially saturated. That strengthens ruling out **large** prompt-style lifts and weakens sensitivity to **tiny** ones. This study was not powered for a pre-specified MDES; near-ceiling B2 cells in particular cannot resolve modest role deltas. Locked language: no clear effect under our threshold, compatible with small true effects that the design was not built to pin to zero.

### Thin A3

A3 adds one soft generic competency sentence on top of the short role. Call it soft fluff, not competency engineering.

### Binary full-pass metric

Success is all-or-nothing against gold (tools + fields + exact allowed customer phrase where required). Tone or partial-correctness nudges still fail the exam.

### One model, one domain

The confirmatory claim is one frontier model (`gpt-5.6-luna`), one domain, one Structured Outputs + tool-schema stack. Appendix work extends the *story* to other tiers; it does not widen the locked Luna claim. API drift matters for re-runs (see reproducibility).

### Protocol lock vs formal pre-registration

The analysis plan was locked internally before the confirmatory 120-case matrix. That is stronger than fitting the story after seeing the numbers. It is not a public OSF or AsPredicted registration.

### Prompt length

Prompt length was not tightly matched across A1/A2/A3 (content-over-length by design). Task instructions were hardened in rehearsal before the confirmatory freeze, so the dense baseline is a strong competitor for any short role add-on.

---

## Thinking and deliberation

The largest pattern in the confirmatory matrix is mode, not role: thinking ≫ instant on full pass. The title stays on prompt style; the null holds inside both modes.

For readers of role-play / CoT work: our secondary lift is about **eliciting deliberation** via API reasoning effort. Kong-style role-play is often hypothesized to help by *implicitly* eliciting similar deliberation when the baseline prompt is sparse. A2/A3 were never designed as CoT triggers; they are short identity paste on an already dense stack. A null there is compatible with positive role-play-as-CoT results elsewhere, not a rejection of them.

---

## Implication for deployment

For practitioners running dense, correct task rules on a strong model in a similar exam: prioritize instructions, tools/schemas, and reasoning effort where available over short persona text. For researchers: a citeable confirmatory null under a locked reading plan, plus a clear secondary mode lift, with exploratory follow-ups fenced in the appendix.
