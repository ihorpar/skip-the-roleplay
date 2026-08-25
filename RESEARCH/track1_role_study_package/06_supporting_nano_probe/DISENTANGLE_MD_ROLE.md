# Disentangle markdown vs long role (gpt-5.4-nano × B2 × reh40)

Same-batch screen (160 runs). Not claim-ready.

| Style | Pass |
|-------|-----:|
| A1_task | 52.5% |
| S_md_only | 45.0% |
| S_role_long_plain | 60.0% |
| S_role_rich_md | 65.0% |

**Long role** lifts (+7.5 pp vs A1). **Markdown alone** hurts (−7.5 pp). Compound best (+12.5 vs A1) with some synergy.

Details: `../benchmark_pack_v1/runs/nano54_disentangle_md_role_20260722T124645/DISENTANGLE_MD_ROLE_FINDINGS.md`
