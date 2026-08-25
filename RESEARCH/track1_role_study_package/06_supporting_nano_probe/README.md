# Supporting probe — model gap (not Track 1 Axis A)

**Date:** 2026-07-21  
**Question:** Is the exam only “easy” because frontier models are strong?  
**Probe:** same harness, same tickets, **A1_task × B1 only**, model `gpt-5-nano` vs existing `gpt-5.6-luna` baselines.

## Result (directional)

| Bundle | gpt-5-nano | gpt-5.6-luna (same condition) |
|--------|------------|-------------------------------|
| rehearsal_40 | **0%** (0/40) | ~82–92% |
| full_120 | **1.7%** (2/120) | ~87–91% (ticket-mean A1×B1 ≈ 89%) |

Gap ≈ **−85 to −92 pp**. Forty tickets already showed the floor; 120 confirmed it.

## Interpretation for Track 1

- The **role/persona null** is about Axis A on a strong model near ceiling — not proof the task is trivial for every model.
- This probe is **not** part of the locked role claim in `CLAIM.md`.

Full writeup + raw runs:  
`../benchmark_pack_v1/runs/nano_compare_20260721T231058/NANO_COMPARE_FINDINGS.md`

Related (weaker-but-alive model, role screen):  
`NANO54_ROLE_PROBE.md` in this folder · runs under `../benchmark_pack_v1/runs/nano54_role_full120_20260721T234354/`
