# Supporting probe — role on gpt-5.4-nano (not claim-ready)

**Date:** 2026-07-21  
**Question:** On a weaker model with more headroom, does A1/A2/A3 show a clearer gap than on luna?

## Setup
- Model: `gpt-5.4-nano`
- Pack: `full_120`
- Styles: A1_task / A2_role / A3_comp
- Mode: B1 only × **1 repeat** = 360 runs  
- **Not** Track 1 claim-ready (needs repeats + locked reading rule if promoted)

## Pass rates

| Style | Pass % |
|-------|-------:|
| A1 task-only | 42.5 |
| A2 + role | 47.5 |
| A3 + role + competencies | 36.7 |

Ticket-paired Δ (pp): A2−A1 **+5.0** · A3−A2 **−10.8** · A3−A1 **−5.8**

## Reading
- **Lukewarm:** role alone looks mildly helpful; generic competencies look harmful on this probe.
- Clearer directional movement than luna’s near-null Axis A, but **do not** merge into `CLAIM.md` without a confirmatory protocol.

Full writeup: `../benchmark_pack_v1/runs/nano54_role_full120_20260721T234354/NANO54_ROLE_FINDINGS.md`
