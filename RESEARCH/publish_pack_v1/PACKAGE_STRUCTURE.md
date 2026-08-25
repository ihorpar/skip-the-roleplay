# Research package structure — Track 1 + extensions

**Date:** 2026-07-22  
**Goal:** One coherent package with **two layers** — a clear public story, and a review-ready paper core.  
**Authority for claims:** only pre-registered / protocol-locked results (see below).

---

## Guiding split

| Layer | Who it’s for | Job | Tone |
|-------|----------------|-----|------|
| **Part A — Public readout** | Teams that ship LLM agents, teammates, non-specialists | Why we cared, what we did, what to believe, what not to overread | Visual, short, almost no stats jargon |
| **Part B — Paper** | Reviewers, arXiv/workshop, “first paper” bar | Methods, results, limits, related work, reproducibility | Formal, precise, hedged |

**Rule:** Part A never claims more than Part B. Nano / long-persona pilots stay **appendix / exploratory** unless upgraded later.

---

## Claim map (what is “in” vs “out”)

### In scope for the main claim (Part A headline + Part B primary result)

- **Track 1 on `gpt-5.6-luna`:** short role / soft competencies vs task-only; instant vs thinking; 120 exam cases × 3 repeats; deterministic agent exam.  
- Locked wording: *In this setup, short role / generic competencies did not show a clear help or harm on end-to-end success.*  
- Secondary (reported, not the title claim): thinking mode ≫ instant.

### Out of main claim (appendix / “we also checked”)

- Long pure persona on Luna B1 (null pilot)  
- Long pure persona on `gpt-5.4-nano` same-batch (weak / stop)  
- Markdown × role factorials, ecological long role  
- Floor models (`gpt-5-nano`, `gpt-4.1-nano`) as **difficulty reference** only  

---

## Part A — Simple reader package (suggested files)

Folder idea: `RESEARCH/publish_pack_v1/part_a_public/`

| Piece | Purpose | Source material to reuse |
|-------|---------|---------------------------|
| `01_story.md` (or keep/improve `track1-results.html`) | Narrative: old advice (“you are an expert”) → modern tool agents → our question | HTML readout, Overall design |
| `02_exam_in_pictures.md` | One diagram: exam case → tools → pass/fail; three prompt versions; two modes | Protocol / HTML |
| `03_results_at_a_glance.md` | 2–3 charts max: role flat; thinking lifts; optional model-tier reference bar | `main120_FINDINGS`, nano compare |
| `04_what_we_did_not_find.md` | Long persona pilots in one honest paragraph + “not proven” | `long_persona_extension/PROTOCOL.md` |
| `05_implications_for_deployment.md` | 4–5 bullets: don’t sweat short persona; do sweat instructions + thinking; exam was hard for weak models | Critic + findings |

**Noise to strip from Part A:** family tables, schema mediation essays, every nano cell, CI math (one footnote: “we used a pre-set rule for ‘clear effect’”).

---

## Part B — Paper package (suggested files)

Folder idea: `RESEARCH/publish_pack_v1/part_b_paper/`

| Section | File | Must include |
|---------|------|----------------|
| Title / abstract | `00_abstract.md` | Setup, N=2160, primary null, secondary thinking, limits |
| Introduction | `01_intro.md` | Why role prompting folklore matters for agents |
| Related work | `02_related_work.md` | Role prompting, agent evals, reasoning effort (cite properly later) |
| Method | `03_methods.md` | Exam, gold, harness, A1/A2/A3, B1/B2, reading plan, bootstrap rule |
| Results | `04_results.md` | Main tables + CIs; thinking as secondary |
| Discussion | `05_discussion.md` | Ceiling, thin A3, binary metric; what claim is / isn’t |
| Exploratory appendix | `06_appendix_exploratory.md` | Long persona + nano reference — clearly labeled |
| Reproducibility | `07_reproducibility.md` | Paths to packs, code, seeds/config, how to re-run |
| Ethics / limits | short in discussion | No human subjects; API cost; model version pinning |

**Supporting zip/pointers (not prose):**  
`track1_role_study_package/` (already the archival claim pack) + protocol locks + analysis JSON.

---

## Recommended narrative arc (both parts share this spine)

1. **Hook:** People still tell models “you are an expert.”  
2. **Gap:** Unclear if that helps **tool-using business agents** on frontier models.  
3. **Method:** Hard scheduling exam; short role axis; Luna; pre-registered reading.  
4. **Result:** No clear short-role effect; thinking helps a lot.  
5. **Check:** Longer persona / weaker models — pilots, no clear confirmatory win.  
6. **Implication for deployment:** In this common setup, prioritize instructions, tools/schemas, and reasoning effort over short persona text.  
7. **Limits:** One domain, ceiling, thin competencies arm, binary pass.

---

## Build order (practical)

1. Freeze claim map (this doc) — **done as proposal**.  
2. Academic suitability review (subagent) → adjust ambition (workshop vs journal).  
3. Draft Part A from existing HTML + findings (low risk).  
4. Draft Part B Methods/Results from `CLAIM` + `results-reading-plan` + analysis JSON.  
5. Related work + polish last.  
6. Optional: one critic pass on Part B draft before submission.

---

## What “full package” means when we’re done

```
RESEARCH/publish_pack_v1/
  README.md                 # how to read A vs B
  part_a_public/            # simple story + visuals
  part_b_paper/             # paper sections
  pointers.md               # links to track1_role_study_package + run folders
```

No new experiments required to assemble this package; new runs only if a reviewer-driven gap appears later.
