# Pure Long Persona Findings

**Run folder:** `nano54_pure_long_persona_20260722T143752`  
**Bundle:** `rehearsal_40/rehearsal_40_bundle_v1.json` (40 cases)  
**Model / mode:** `openai:gpt-5.4-nano` × `B2_thinking`  
**Style:** `S_role_long_pure` only (no A1 / short-role re-run)

## Result

| Arm | Pass rate | Exact tool |
| --- | ---: | ---: |
| `S_role_long_pure` | **65.0%** | 87.5% |

Supporting rates: json_valid 100%, schema_valid 75%, over_action 12.5%, under_action 5.0%, infra/eval unscorable 0.

## Cross-batch deltas (reference only)

Reference batch: `nano54_factorial_role_md_20260722T132411` (same model/mode/bundle setup, **different batch** — not same-run comparable).

| Reference arm (prior batch) | Ref pass | This run | Δ (pp) |
| --- | ---: | ---: | ---: |
| A1_task plain none | 50.0% | 65.0% | **+15.0** |
| A2_role short | 52.5% | 65.0% | **+12.5** |
| S_role_long_plain (old ecological long) | 50.0% | 65.0% | **+15.0** |
| S_role_rich_md (compound) | 60.0% | 65.0% | **+5.0** |

Label all comparisons **cross-batch**.

## Purity intent

`S_role_long_pure` isolates **who / experience / qualities** on the plain mixed Track-1-like scaffold (`ROLE_BLOCK_RICH_PURE`).

It deliberately omits:

- exam fail-mode coaching
- tool / JSON / procedure hints
- markdown packaging
- the meta line “Do not add policies…”

Text ends at: “If something is unknown, you treat it as unknown.”

## Locked pure persona text (`ROLE_BLOCK_RICH_PURE`)

```
You are an experienced scheduling and dispatch professional for an appliance repair company.

You have more than 20 years of experience coordinating service appointments: taking customer requests,
keeping booking details accurate, and staying organized when information is incomplete or arrives out of order.
You are used to high call volume, interrupted conversations, and correcting small details before anything is finalized.

In that work you have built a reputation for:
- precise handling of names, addresses, times, and other booking details
- careful attention when information is messy, partial, or revised mid-conversation
- calm, steady judgment under time pressure
- consistency — you do not rush past details just to close a request quickly
- discipline with professional standards and company procedures

You take accuracy seriously. You prefer a correct, complete record over a fast but sloppy one.
You do not invent missing facts. If something is unknown, you treat it as unknown.
```

## Takeaway

On this batch, pure long persona alone landed at **65.0%**, ahead of prior-batch A1 / short / ecological-long references and slightly ahead of the prior compound `S_role_rich_md` (60%). Treat as suggestive only until a same-batch factorial recheck.
