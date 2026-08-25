# Reproducibility

**Audience:** Outside reader who should find artifacts without Slack.  
**Scope:** Confirmatory Luna study first; exploratory paths listed last.  
**Wording:** Prefer public terms in `TERMINOLOGY.md`.

---

Public repository: [github.com/ihorpar/skip-the-roleplay](https://github.com/ihorpar/skip-the-roleplay). Paths below are relative to that repo. Cite this preprint with the concept DOI [10.5281/zenodo.22089532](https://doi.org/10.5281/zenodo.22089532) (always the latest version).

## Pinned models

| Role | Model id (as used in harness / claim pack) | Notes |
|------|--------------------------------------------|--------|
| **Primary confirmatory** | `gpt-5.6-luna` (OpenAI; harness form often `openai:gpt-5.6-luna`) | Main claim model |
| Mode B1 | `reasoning.effort=none` | Instant |
| Mode B2 | `reasoning.effort=medium` | Thinking |
| Long-persona Stage 1 | `gpt-5.6-luna` · B1 only | Exploratory pilot |
| Long-persona Stage 1b | `gpt-5.4-nano` · B2 | Exploratory pilot |
| Floor / mid ladder | `gpt-5-nano`, `gpt-5-mini`, `gpt-5.4-nano`, `gpt-5.4-mini` | 40-case A1×B1 screens; see `mini_ladder_screens/` |
| Mid-band (separate claim) | `gpt-4.1-mini` / `openai:gpt-4.1-mini` | B1 only; 3-rep claim pack under `gpt41mini_extension/` |
| Mid-band (exploratory screen) | `gemini-3.5-flash-lite` | B1 only; 1-rep glued full_120 under `gemini35flashlite_free_tier_v2/exploratory_r1_glued/`; **not** a claim |

**API drift:** Provider model behavior can change over time. Re-runs should record request date window, API surface (Responses), and harness commit when sharing numbers.

---

## Claim pack

Root: `RESEARCH/track1_role_study_package/`

| Path | What |
|------|------|
| `CLAIM.md` | Locked plain-language claim + fences |
| `00_protocol/results-reading-plan-v1.md` | How contrasts are read (also mirrored at `RESEARCH/results-reading-plan-v1.md`) |
| `00_protocol/protocol_lock_v1.md` | Protocol lock |
| `00_protocol/evaluation_spec_v1.md` | Pass definition |
| `00_protocol/track1_contract.md` | Study contract |
| `01_datasets/full_120_bundle_v1.json` | Frozen 120-case exam (pack copy) |
| `02_prompts_and_eval/` | Prompt / schema / evaluator snapshots |
| `03_main_runs/r1`–`r3/` | Summaries + `smoke_raw_runs_latest.json` |
| `04_analysis/main120_FINDINGS_2026-07-21.md` | Tables + claim wording |
| `04_analysis/main120_analysis_v1.json` | Case-level analysis for recomputation |
| `06_supporting_nano_probe/` | Exploratory pointers only |

Also: live bundle under `RESEARCH/benchmark_pack_v1/full_120/` (same exam family used by the harness).

---

## Analysis plan

**Clear help / clear harm** only if the case-level paired bootstrap **95% CI excludes 0** for the contrast of interest (A2−A1, A3−A2, A3−A1), within B1, within B2, and/or pooled as specified in the analysis plan.

Disclose: this was an **internal protocol lock** before the confirmatory 120-case matrix, not automatically a public OSF/AsPredicted pre-registration unless separately registered.

---

## Re-running the eval

From repo root (PowerShell-friendly):

```powershell
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json
```

Useful variants (see pack READMEs):

```powershell
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json --limit 5
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json --families F5_full_flow
```

Entrypoint: `package.json` script `smoke:eval` → `node scripts/smoke-eval.js`.  
Prompt style / mode flags and model selection follow the multi-turn harness docs under `RESEARCH/` (e.g. `--styles`, `--modes`, `--models`). Self-checks: `npm run harness:self-test`.

**Success metric:** binary end-to-end pass vs deterministic gold (tools + fields + exact allowed customer phrase where required), not an LLM judge.

---

## Analysis JSON

| Artifact | Path |
|----------|------|
| Confirmatory analysis | `RESEARCH/track1_role_study_package/04_analysis/main120_analysis_v1.json` |
| Findings prose | `…/04_analysis/main120_FINDINGS_2026-07-21.md` |
| Raw repeats | `…/03_main_runs/r{1,2,3}/smoke_raw_runs_latest.json` |

Recompute paired contrasts from the analysis JSON or by re-aggregating raw runs; do not hand-edit claim language without updating `CLAIM.md` and the analysis plan.

---

## Exploratory protocols

| Study | Protocol / findings |
|-------|---------------------|
| Long persona extension | `RESEARCH/benchmark_pack_v1/runs/long_persona_extension/PROTOCOL.md` |
| Mini ladder screens | `RESEARCH/benchmark_pack_v1/runs/mini_ladder_screens/PROTOCOL.md` · `MINI_LADDER_FINDINGS.md` |
| gpt-4.1-mini 3-rep claim | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_extension/PROTOCOL.md` · `GPT41MINI_CLAIM_FINDINGS.md` |
| gemini-3.5-flash-lite 1-rep screen | `RESEARCH/benchmark_pack_v1/runs/gemini35flashlite_free_tier_v2/PROTOCOL.md` · `exploratory_r1_glued/GEMINI_FLASHLITE_EXPLORATORY_FINDINGS.md` |
| Publish claim map | `RESEARCH/publish_pack_v1/PACKAGE_STRUCTURE.md` |

---

## Release checklist

**What ships with / via the claim pack (intended public artifacts):**

| Artifact | Path / note |
|----------|-------------|
| Locked claim + fences | `CLAIM.md` |
| Analysis plan + protocol lock | `00_protocol/results-reading-plan-v1.md`, `protocol_lock_v1.md` |
| Evaluation spec (gold / scoring) | `00_protocol/evaluation_spec_v1.md` |
| Frozen 120-case exam bundle | `01_datasets/full_120_bundle_v1.json` (+ live copy under `benchmark_pack_v1/full_120/`) |
| Prompt / schema / evaluator snapshots | `02_prompts_and_eval/` |
| Findings + analysis JSON | `04_analysis/main120_FINDINGS_*.md`, `main120_analysis_v1.json` |
| Per-repeat run summaries | `03_main_runs/r1`–`r3/` |
| Harness entry | `npm run smoke:eval` → `scripts/smoke-eval.js`; `npm run harness:self-test` |

**Often gated / local-only (ask owner if needed):**

| Artifact | Why |
|----------|-----|
| Full raw API traces (`smoke_raw_runs*.json` bodies) | Large; may be gitignored; enough analysis JSON ships to recompute contrasts |
| Live API keys / `.env` | **Never** ship |

**Minimum recompute bar:** with the frozen bundle, evaluation spec, analysis JSON, and harness commit, an external reader should recompute A2−A1 / A3−A2 / A3−A1 tables without Slack. Record model id, mode settings, date window, and git commit when publishing numbers.

---

## Ethics and compute

No human subjects; synthetic / scripted exam cases. Cost is API inference for the confirmatory matrix (*N* = 2160 on `gpt-5.6-luna`) plus later exploratory pilots. Do not ship API keys or `.env` in any share zip.
