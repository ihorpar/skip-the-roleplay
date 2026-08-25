# Integrity pass — Part A + Part B (findings only; awaiting owner confirm)

**Date:** 2026-07-25  
**Scope:** Overclaims, jargon leaks, claim fences, subtitle vs body.  
**Status:** Findings listed below — **no prose edits applied yet** (confirm first).

---

## Overall

Part A is in good shape for outsiders (plain names; A1/A2/A3 mostly explained once). Part B correctly hedges the abstract body. Biggest tension is **punchy title/subtitle vs locked claim language**, plus a few leftover lab crumbs.

---

## Proposed changes (confirm yes/no)

### P1 — Subtitle vs claim (Part B)

| Item | Issue | Proposed fix |
|------|--------|----------------|
| Subtitle *“Persona prompting did not improve…”* | Reads absolute; body hedges “no clear help/harm in this setup” | Keep punchy title; add one subtitle footnote in `00_title_abstract.md` already exists — **also** mirror a one-liner under the title in README/COVER. Optional softer subtitle: *“…did not clearly improve…”* |
| | | **Ask:** keep current subtitle, or soften to “did not clearly improve”? |

### P2 — Package map still says “tickets” (meta docs)

| Item | Issue | Proposed fix |
|------|--------|----------------|
| `PACKAGE_STRUCTURE.md` claim map | Still “120 tickets” / “full ticket success” | Update to **exam cases** / **end-to-end success** |
| `CHECKLIST.md` claim fence line | “Luna Track 1… exploratory” OK but could mention mini claim as separate | One-line update |

### P3 — Part A small jargon crumbs

| Item | Issue | Proposed fix |
|------|--------|----------------|
| Prompt section: “Research codes were A2 / A3” | Fine as a bridge; optional drop | Keep or delete the research-code aside |
| Journey / prompts: **F2 / F3** labels | Mild lab codes; mostly glossed | Rename to plain (“Stop early”, “List times”) in UI labels if you want zero codes |
| Heatmap cells still say `A1 × B1` etc. | Visible codes | Replace with “Task only · Instant” style labels (optional polish) |

### P4 — Part A claim tone

| Item | Issue | Proposed fix |
|------|--------|----------------|
| “clearly hurt” for mini long persona | OK under claim rule; fine | Keep |
| Footer / takeaways: “long persona hurt” | Scoped to mini — good | Keep; ensure always near “on `gpt-4.1-mini`” |

### P5 — Part B fine as-is (no change unless you want)

- Abstract primary null + secondary thinking: **OK**  
- A1/A2/A3/B1/B2 in methods/results: **OK** for a paper once defined  
- “Never” only appears inside “we do **not** claim never”: **OK**  
- Exploratory appendix fences: **OK**  

### P6 — Optional consistency

| Item | Proposed |
|------|----------|
| Stitch `paper_draft.md` | Concat Part B sections under locked title (later) |
| `PACKAGE_STRUCTURE.md` “Out of claim” | Add mini ladder + `gpt-4.1-mini` claim as demoted/separate |

---

## What I will **not** change without ask

- Part A headline question  
- Locked paper title *Skip the Roleplay*  
- Luna null wording in CLAIM.md  
- Mini −8.6 hurt finding  

---

## Agent critic #1 — what that means

A **separate agent pass** that only reviews:

1. Methods accuracy vs protocol / harness  
2. Whether claims match numbers and the locked analysis rule  
3. Fence violations (exploratory leaking into primary)

It writes notes under `RESEARCH/publish_pack_v1/reviews/` (e.g. `CRITIC_methods_claims.md`). It does **not** rewrite the paper unless you ask. Think of it as a ruthless methods reviewer, not related-work or prose style.

Critic #2 (later) would be related work + novelty framing.
