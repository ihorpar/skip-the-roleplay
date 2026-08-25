# Critic #2 — Related work + novelty framing

**Scope:** Part B related work, title/abstract/intro novelty claims, discussion takeaway skim, locked `CLAIM.md`; appendix fences skimmed only to avoid demanding exploratory into RW novelty.  
**Not in scope:** Part A; methods numbers; more experiments.  
**Applied (owner 2026-07-25):** Added Luz de Araujo et al. 2025 (Principled Personas); tightened ExpertPrompting contrast so rich bios ≠ short role paste (strengthens gap).

---

## 1. Verdict

**Yes-with-fixes.** Related work is peer-shareable after one must-cite add and a small ExpertPrompting contrast tweak. Novelty is correctly fenced to the locked claim (no “first ever,” no “settles persona prompting”); gap language is honest; citations spot-checked are real.

**Citation spot-check (real):** Zheng et al. Findings EMNLP 2024 (162 roles / 2,410 Qs); Kong et al. NAACL 2024 (AQuA 53.5%→63.8% ChatGPT matches); Tseng et al. Findings EMNLP 2024 survey; Yao et al. τ-bench arXiv:2406.12045; Patil et al. BFCL ICML 2025 (PMLR v267). No invented papers in the Sources list from this review.

---

## 2. Worth fixing

- **Add Principled Personas (EMNLP 2025).** Luz de Araujo, Roth, & Hovy, *Principled Personas: Defining and Measuring the Intended Effects of Persona Prompting on Task Performance* (EMNLP 2025 main; arXiv:2508.19764). Workshop reviewers on persona effects will expect it: expert personas usually **positive or non-significant** across many tasks; also stress-tests robustness to irrelevant persona fluff. **Place:** one sentence in “Role and persona prompting,” after Zheng; **adjust Gap** so systematic nulls / non-effects are not framed as “mainly factual QA [Zheng] only”—still distinguish that neither Zheng nor Principled Personas is a confirmatory short-role null on dense tool+schema business agents with deterministic end-to-end gold.

- **Tighten ExpertPrompting contrast (Xu et al., 2023).** Current line is accurate (auto-synthesized experts; LLM-judge quality) but easy to misread as the same intervention as A2/A3. **Adjust:** note that ExpertPrompting uses *detailed, per-instruction expert bios*, not a short “you are a scheduling agent” paste on top of an already dense stack—strengthens (does not soften) the gap.

---

## 3. By design / push back

- **Do not soften title/subtitle** (“Skip the Roleplay” / “did not improve”) or bury the null with extra hedges—body already matches `CLAIM.md` (“no clear help or clear harm … **in this setup**”).
- **Refuse “cite Salewski et al. 2023 / more positive role-play classics / more surveys.”** Positive strand is adequately represented (Kong, Xu, Tseng/Chen surveys); more is style preference.
- **Refuse expanding related work into a general theory of personas, prompt length matching, or multi-model literature review**—gap is operational confirmatory null under fixed tools/schemas; appendix stays fenced.
- **Refuse demanding softer “we cannot rule out tiny effects” language in related work**—ceiling/sensitivity belongs once in Discussion (already there).

---

## 4. Do not change

- Four-strand structure + Gap paragraph architecture.
- Positioning Zheng as closest published cousin, then differentiating QA vs tool-mediated workflows.
- Agent-benchmark framing (API-Bank, ToolLLM, AgentBench, ReAct, BFCL, τ-bench) as capability ceilings, not confirmatory persona A/B.
- Secondary test-time compute strand kept secondary; no title claim creep.
- Gap uses **“Few published studies…”** + “without claiming a general theory”—anti-overclaim already correct.
- Intro ≤3 contributions; contribution 1 matches locked claim; A3 thin fluff + appendix fences respected.
- Citation integrity note (omit unreviewed blog lore)—keep.

---

## 5. Out of scope

- Part A / human story layer.
- Methods, bootstrap rule, N=2160, pass-rate numbers (Critic #1).
- Requests for more experiments, other models in the confirmatory claim, or promoting appendix long-persona / mini results into related-work novelty.
- Punchy title design; A3 intentionally thin; anti-undersell posture.
