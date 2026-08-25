# Hypothesis screen — style definitions

**Date:** 2026-07-21  
**Model:** `openai:gpt-5.6-luna`  
**Mode:** `B1_instant` only (`reasoning.effort=none`)  
**Bundle:** `RESEARCH/benchmark_pack_v1/rehearsal_40/rehearsal_40_bundle_v1.json` (all 40)  
**Repeats:** 1  
**Styles (10):** `A1_task` + 9 screening variants = **400** scored runs target (40×10)

Baseline for every Δ: **`A1_task`** (Track 1 mixed-polarity scaffold, no role).

## Hypotheses

### T02 Constraint polarity
| ID | Intent |
|----|--------|
| `A1_task` | Mixed (do + don't) — shared baseline / mixed cell |
| `S_pos` | Same operational content; positive-only framing (“prefer / only when / treat as valid only…”) |
| `S_neg` | Same operational content; negative-only framing (“never / do not…”) |

### T01 Instruction density
| ID | Intent |
|----|--------|
| `S_min` | Minimal necessary operational rules + thin schema note; keep canonical responses + family rules |
| `A1_task` | Adequate (= Track 1 scaffold) |
| `S_max` | Exhaustive edge-case dump + re-check reminders; still no role folklore |

### T16 Procedural vs outcome
| ID | Intent |
|----|--------|
| `S_outcome` | Outcome/success criteria; thin family endpoint hints (no step checklist) |
| `A1_task` | Somewhat procedural (baseline) |
| `S_proc` | Explicit numbered tool-order checklist + stricter family “obey checklist” line |

### T14 Schema–prompt redundancy (lite)
| ID | Intent |
|----|--------|
| `S_schema_thin` | Strip prose that only restates SO/tool enums (`intent`/`unit_*`/`final_status`/canonical laundry lists); keep policies schemas do not encode |
| `S_schema_dup` | Heavier restatement of enums already in schemas + reminder footer |
| *(skipped)* | Hard conflict cell deferred if thin vs dup shows signal |

### T18 Anti-example (optional)
| ID | Intent |
|----|--------|
| `S_anti` | `A1_task`-equivalent mixed scaffold + “Common mistakes to avoid” from Track 1 failure modes |

### Skipped this screen
- **T09** fat tools / thin system — needs tool-description plumbing; follow-up.

## Implementation
- Module: `scripts/harness/screeningPrompts.js`
- Dispatch: `buildSystemPrompt` routes screening IDs without changing A1/A2/A3
- Family rules: `scripts/harness/familyRules.js` (shared)
- Aliases: `PROMPT_STYLE_ALIASES` in `constants.js`

## Claim discipline
This is a **screen only** — directional gaps guide Track 2 design; not confirmatory proof.
