# Pointers — archives behind the publish pack

Use this after Part A / Part B. Paths are from repo root.

## Primary claim (OpenAI `gpt-5.6-luna`)

| What | Path |
|------|------|
| Locked claim | `RESEARCH/track1_role_study_package/CLAIM.md` |
| Analysis plan / reading rule | `RESEARCH/track1_role_study_package/00_protocol/results-reading-plan-v1.md` (mirror: `RESEARCH/results-reading-plan-v1.md`) |
| Protocol lock | `RESEARCH/track1_role_study_package/00_protocol/protocol_lock_v1.md` |
| Findings + tables | `RESEARCH/track1_role_study_package/04_analysis/main120_FINDINGS_2026-07-21.md` |
| Analysis JSON | `RESEARCH/track1_role_study_package/04_analysis/main120_analysis_v1.json` |
| Main run summaries | `RESEARCH/track1_role_study_package/03_main_runs/r1`–`r3/` |
| Frozen exam pack | `RESEARCH/benchmark_pack_v1/full_120/` (copy also under claim pack `01_datasets/`) |

Raw API traces (`smoke_raw_runs*.json`) are **gitignored** — ask the owner if you need them.

## Part A / Part B (this pack)

| What | Path |
|------|------|
| Public HTML | `RESEARCH/publish_pack_v1/part_a_public/index.html` |
| Canonical research draft (peer share) | `RESEARCH/publish_pack_v1/peer_share/paper_draft_v2.md` |
| Paper section sources | `RESEARCH/publish_pack_v1/part_b_paper/` |
| Wording glossary | `RESEARCH/publish_pack_v1/part_b_paper/TERMINOLOGY.md` |
| Cover note for peers | `RESEARCH/publish_pack_v1/COVER_NOTE.md` |

## Separate / exploratory

| What | Path |
|------|------|
| `gpt-4.1-mini` claim (3-rep, B1 only) | `RESEARCH/benchmark_pack_v1/runs/gpt41mini_extension/` · claim card under `track1_role_study_package/06_supporting_nano_probe/GPT41MINI_CLAIM.md` |
| Mini/nano difficulty ladder (40-case screens) | `RESEARCH/benchmark_pack_v1/runs/mini_ladder_screens/` |
| Long persona extension | `RESEARCH/benchmark_pack_v1/runs/long_persona_extension/PROTOCOL.md` |
| Nano supporting notes | `RESEARCH/track1_role_study_package/06_supporting_nano_probe/` |

## Harness

| What | Path |
|------|------|
| Eval entry | `npm run smoke:eval` → `scripts/smoke-eval.js` |
| OpenAI provider (effort / temperature quirks) | `scripts/harness/providers/openai.js` |
| Model aliases | `scripts/harness/constants.js` |
