# Track 1 results HTML — review response

Reviewer verdict: **adequate** (must-fixes listed). Applied 2026-07-21.

## Accepted

| Feedback | Change |
|----------|--------|
| Fake / binary heat map | Cells colored from `data-pct` on ~87–97% scale |
| CI scale unlabeled | Axis labels −10 / 0 / +10 pp above each strip |
| Role bars over-colored | Single ink fill for A1/A2/A3 (near-identical rates) |
| “Within ~1 pp” imprecise | Copy: ~92–93%; within roughly 1–1.5 pp |
| Muted contrast | `--muted` darkened to `#4a5568` |
| Soften / show pooled CIs | Pooled contrast strip + copy that names B1, B2, pooled |
| A3 “skills” wording | Label **+ competencies** |
| Thinking badge not “warn” | `.badge.strong` (success treatment) |
| Mobile flow | “↓ then” on stacked steps |
| Less card-grid for A versions | Definition-style `.trio-row` list |
| Scale note 0–100% | On both bar charts |
| Exact phrase scoring | Called out in exam + score step |

## Pushed back

| Feedback | Why kept as-is |
|----------|----------------|
| Footer should be live links | Intentional: code paths for researchers opening the repo, not a public site |
| Drop the top stats strip | Kept: one job (study scale). Not a marketing card grid |
| Print CSS optional | Added lightly; not required for the claim |

## Later owner feedback (specificity)

Added section `#materials`: exact A1/A2/A3 strings, scaffold excerpt, family table, four verbatim tickets, fixture/branch table with counts, pressure-tag counts, and a concrete `check_slots` payload (`MP_F6_002`).

## Artifacts

- Outline: `track1-results-OUTLINE.md`
- Page: `track1-results.html`
- Numbers: `main120_FINDINGS_2026-07-21.md` / `main120_analysis_v1.json`
