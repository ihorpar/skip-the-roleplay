# Hypothesis screen findings (not confirmatory)

**Run folder:** `RESEARCH/benchmark_pack_v1/runs/screen_hypotheses_20260721T192721/`  
**Setup:** rehearsal_40 × 10 styles × B1_instant × 1 repeat = **400** scored OpenAI `gpt-5.6-luna` runs (0 infra errors)  
**Baseline:** `A1_task` (92.5% pass, 37/40)  
**Discipline:** directional screen only — do **not** treat as Track 2 proof.

Style definitions: `SCREEN_NOTES.md`. Raw traces: `smoke_raw_runs_latest.json`.

---

## Styles × pass%

| Style | Hypothesis | Pass | n | Δ vs A1 (pp) | Paired W / tie+ / tie− / L | over_action |
|-------|------------|-----:|--:|-------------:|---------------------------:|------------:|
| **S_max** | T01 density | **100.0%** | 40 | **+7.5** | 3 / 37 / 0 / 0 | 0 |
| **S_pos** | T02 polarity | **95.0%** | 40 | **+2.5** | 2 / 36 / 1 / 1 | 2 |
| A1_task | baseline (mixed) | 92.5% | 40 | — | — | 3 |
| S_neg | T02 polarity | 92.5% | 40 | 0.0 | 3 / 34 / 0 / 3 | 1 |
| S_schema_dup | T14 | 90.0% | 40 | −2.5 | 2 / 34 / 1 / 3 | 4 |
| S_anti | T18 | 90.0% | 40 | −2.5 | 2 / 34 / 1 / 3 | 2 |
| S_proc | T16 | 85.0% | 40 | −7.5 | 2 / 32 / 1 / 5 | 6 |
| S_outcome | T16 | 75.0% | 40 | −17.5 | 1 / 29 / 2 / 8 | 7 |
| S_min | T01 density | 12.5% | 40 | −80.0 | 0 / 5 / 3 / 32 | 3 |
| S_schema_thin | T14 | 7.5% | 40 | −85.0 | 0 / 3 / 3 / 34 | 1 |

Overall batch pass 74.0% is pulled down by the two collapsed thin styles; excluding those, styles sit ~75–100%.

Approx prompt size (F5 system prompt chars): `S_min` 2167 · `S_schema_thin` 2337 · `S_outcome` 2747 · `A1_task` 3290 · `S_pos` ~same · `S_schema_dup` 3867 · `S_proc` 3928 · `S_max` 4685.

---

## Per-hypothesis verdicts

### T01 Instruction density — **HOT**
- `S_max` perfect (40/40); rescued all three A1 fails; zero over-action.
- `S_min` collapsed (−80pp), mostly by inventing near-synonym enums (`new_booking` vs `new_job`) and wrong statuses/phrases.
- Builder-relevant: in this agent+locked-string setup, **cutting “adequate” detail is dangerous**; **extra edge-case detail helped** on the residual hard tickets (screen-scale).
- Headroom: A1 already high on rehearsal B1; confirmatory should keep hard tickets / process metrics, but density still moved the ceiling here.
- Confirmatory feasibility: clean 3-cell (`S_min` / `A1` / `S_max`), same harness, pre-register paired CI.

### T14 Schema–prompt redundancy (lite) — **HOT, with harness caveat**
- `S_schema_thin` catastrophic (−85pp): 35/40 invented non-locked `intent`; 37/40 non-canonical `customer_response`.
- `S_schema_dup` ≈ baseline (−2.5pp noise).
- Screen reading: **listing locked enums/phrases in the system prompt still matters a lot** on this stack; “schemas replace prose” did **not** hold in practice.
- **Caveat (must resolve before Track 2 claim):** thin runs often show `schema_valid: true` while emitting values outside the locked enums. Strict `json_schema` is wired in `providers/openai.js`, so either SO is not attached on the emitting turn, enforcement is softer than assumed, or validation ignores enums. Track 2 must **verify SO enforcement** first; if SO is broken/open, re-run thin after fix before claiming a prompting dogma result.
- Conflict cell still deferred.

### T16 Procedural vs outcome — **LUKEWARM → cold for “more procedure helps”**
- `S_outcome` clearly worse (−17.5pp), more over-action.
- `S_proc` also worse (−7.5pp), more over-action than A1.
- Reading: today’s A1 mix beats both pure outcome-only and a heavier checklist — dogma “always add a step list” looks **unlikely** as a win; outcome-only looks **actively harmful**.
- Possible Track 2 angle only if reframed as “does stripping procedure hurt?” (non-inferiority / harm), not as hunting a big procedure win.

### T02 Constraint polarity — **COLD / lukewarm**
- `S_pos` +2.5pp (tiny; 2 rescues / 1 regression).
- `S_neg` 0pp with churn.
- Likely dead for binary pass on this pack; if revisited, use soft-policy or specific fail-mode rates (equal-to-now / name), not headline pass%.

### T18 Anti-example block — **COLD**
- −2.5pp; no clear rescue pattern. Likely dead for full pass; do not prioritize.

### T09 (skipped)
Still the right follow-up once SO plumbing is trusted; needs tool-description variants.

---

## Ranking for Track 2 prospectiveness

| Rank | Hypothesis | Why |
|-----:|------------|-----|
| 1 | **T01 density** | Largest clean directional gap; useful ops advice; confirmatory design is boring-in-a-good-way |
| 2 | **T14 thin vs listed enums** | Equally dramatic, but **blocked on SO-enforcement audit** before a fair confirmatory |
| 3 | T16 (as harm test) | Outcome-only hurt; procedure didn’t help — useful negative result if packaged carefully |
| 4 | T02 polarity | Noise-scale on pass% |
| 5 | T18 anti-examples | Noise / slight hurt |

---

## Recommended next step

### Primary Track 2 candidate: **T01 Instruction density**
- Cells: `S_min` / `A1_task` (adequate) / `S_max` (exhaustive, no role folklore).
- Mode: B1 primary (headroom); optional B2 slice only as secondary.
- Pack: full_120 × 2–3 repeats, or rehearsal_40 × 3 repeats as cheap confirmatory pilot first.
- Claim template (screen-informed, to lock later): “On schema-constrained appliance scheduling agents, exhaustive edge-case operational detail [improves / does not improve] ticket-level pass vs the Track-1 adequate scaffold; minimal prompts [hurt / do not hurt] pass (paired bootstrap CI).”

### Cheap confirmatory pilot (before full 120)
- `A1_task` vs `S_max` only, rehearsal_40 × 3 repeats × B1 ≈ **240** runs — checks whether the +7.5pp screen bump replicates under repeats.

### Parallel hygiene (cheap, do before T14 Track 2)
- Audit when `forceJson` + `json_schema` attach; confirm thin-style illegal enums are rejected by the API. Until then, treat T14 screen as “prompt must still name locked strings,” not as a clean SO-vs-prose proof.

---

## What not to do
- Do not promote this screen to a published Track 2 claim.
- Do not headline “thinking helps.”
- Do not re-run role/competencies as the next main study.
