# Protocol: Short role vs long persona (extension after Track 1)

**Date locked:** 2026-07-22  
**Status:** Stage 1 (Luna B1) → stop/pivot. **Stage 1b (nano B2)** → Done — stop / do not expand (see findings).  
**Audience:** study owners + third-party auditors  
**Language:** plain English (decisions and reasons, not jargon)

---

## 1. What this study is about

We ask two separate questions:

1. **Short role** — Does adding a one-line job title (“you are a scheduling agent…”) change how often the model fully passes the exam?
2. **Long persona** — Does adding a longer *who you are* block (experience + qualities, no exam cheat-sheet) change pass rates?

We **do not** study Markdown formatting in this protocol (parked for later).

---

## 2. What we already finished (reuse — do not re-run)

### Track 1 on OpenAI `gpt-5.6-luna` (claim-ready)

- **Design:** 120 tickets × short-role axis (task-only / +short role / +short role + soft competencies) × instant vs thinking × 3 repeats = **2,160** scored runs.
- **Result we treat as settled:** under the pre-registered reading rule, **short role / soft competencies did not show a clear help or harm** on full ticket success.
- **Package:** `RESEARCH/track1_role_study_package/` (`CLAIM.md`).

**Decision:** We **reuse** that result for the “short role” question. We do **not** spend budget re-proving short≈none on Luna.

### Exploratory nano screens (not claim-ready)

Smaller runs on weaker models (`gpt-5.4-nano`, etc.) suggested a **long** persona *might* matter more when the model is weaker or has more headroom. Those runs motivated this protocol; they are **not** merged into the Luna Track 1 claim.

---

## 3. Working theory (why we are doing more work)

- On a **strong** model near the score ceiling, a **short** role is easy to “not notice” and hard to improve further.
- A **long, pure** persona (identity/experience/qualities only) might still help when:
  - the model is **weaker**, and/or
  - even a strong model runs **without** thinking (more room to fail).
- On strong model **with** thinking, scores are already very high — a long persona may show little or nothing (ceiling).

This protocol’s **next paid step** tests the “strong model, no thinking” slice first.

---

## 4. What “pure long persona” means (purity rule)

**Allowed:** who the model is; years of experience; professional qualities (accuracy, calmness, consistency, etc.).

**Not allowed in the persona block:**

- Exam-specific fail-mode coaching (e.g. caller vs booking person) beyond what all arms already share in the task rules
- Tool/workflow steps, slot rules, JSON/schema instructions
- Meta lines like “do not add policies beyond the rest of the prompt”

Locked text: `ROLE_BLOCK_RICH_PURE` in `scripts/harness/screeningPrompts.js`  
Style ID for runs: `S_role_long_pure`

An older “ecological” long role (more like messy real-user prompts, with some exam-adjacent hints) exists for screens only — **not** the confirmatory long arm.

---

## 5. Locked comparisons for this extension

| Question | Evidence plan |
|----------|----------------|
| Short role on Luna | **Reuse Track 1** (A1 vs A2 vs A3). No new matrix required for that claim. |
| Long pure persona on Luna | **New runs:** task-only (`A1_task`) vs pure long (`S_role_long_pure`). |

Markdown: out of scope here.

---

## 6. Stage plan (do not collapse into one big launch)

### Stage 1 — Pilot (approved now)

| Item | Choice | Why |
|------|--------|-----|
| Model | `gpt-5.6-luna` | Same stack as Track 1 claim |
| Mode | **B1 only** (instant / `reasoning.effort=none`) | More headroom than thinking; tests “does long still help when Luna is not thinking?” |
| Tickets | `rehearsal_40` (40 cases) | Cheap directional check before 120 |
| Styles | `A1_task`, `S_role_long_pure` | Same-batch; short role **not** re-run |
| Repeats | 1 | Pilot only |
| Runs | **80** | 40 × 2 |
| **Status** | **Done** | `RESEARCH/benchmark_pack_v1/runs/luna_b1_pure_long_pilot_20260722T152315` — see `STAGE1_PILOT_FINDINGS.md` (A1=S=92.5%, Δ0 → stop/pivot) |

**How we will read Stage 1:** directional only. Worth expanding if pure long looks clearly better than A1 (rough guide: gap well above a few noisy points, e.g. order of ~5+ pp with a coherent fail pattern). Not claim language yet.

### Stage 2 — Only if Stage 1 looks alive

- Same model, **B1**, `A1_task` vs `S_role_long_pure`
- Pack: `full_120`
- Repeats: 2–3
- Claim rule: same as Track 1 (ticket-level paired bootstrap 95% CI must exclude 0 to say helped/hurt)

### Optional later (not approved here)

- Luna **B2** × pure long (expect weak signal / ceiling)
- Weaker model (e.g. `gpt-5.4-nano`) same-batch A1 vs pure long (story: long helps when the model is weaker)
- Markdown factorial

---

## 7. What we will *not* do in Stage 1

- Re-run short role / A3 on Luna
- Run thinking mode (B2) in this pilot
- Mix Markdown into the persona test
- Treat nano screens as proof
- Edit Track 1 `CLAIM.md` based on this pilot alone

---

## 8. Plain-language success criteria

After Stage 1 we should be able to say one of:

- **Expand:** “On Luna without thinking, pure long looked better than task-only on the 40-ticket pilot — schedule Stage 2.”
- **Stop / pivot:** “No meaningful lift on Luna B1 — either long persona does not help this strong model even without thinking, or try the weaker-model arm next; do not burn a 120 matrix yet.”

### Stage 1 outcome (2026-07-22)

**Stop / pivot.** A1 and pure long both **92.5%** (37/40); paired net **0**. No Stage 2 on Luna B1.

Findings: `RESEARCH/benchmark_pack_v1/runs/luna_b1_pure_long_pilot_20260722T152315/STAGE1_PILOT_FINDINGS.md`

### Stage 1b — Weaker-model pilot

After Luna B1 showed no lift, test the other half of the working theory: **long pure persona may still help when the model is weaker.**

| Item | Choice | Why |
|------|--------|-----|
| Model | `gpt-5.4-nano` | Mid-band weaker model (not floor-dead like classic nano / 4.1-nano) |
| Mode | **B2** (thinking / medium) | Matches the earlier exploratory pure-long hint (~65%); nano+thinking is still far below Luna |
| Tickets | `rehearsal_40` | Same 40 as Luna Stage 1 |
| Styles | `A1_task`, `S_role_long_pure` | Same-batch; short role not re-run |
| Repeats | 1 | Pilot only |
| Runs | **80** | 40 × 2 |
| **Status** | **Done** | `RESEARCH/benchmark_pack_v1/runs/nano54_b2_pure_long_pilot_20260722T153848` — see `STAGE1B_PILOT_FINDINGS.md` (A1 47.5% vs S 52.5%, Δ+5.0 pp, paired net +2 → stop / do not expand) |

**Read rule:** directional. Expand to a larger nano matrix only if pure long clearly beats A1 in this same batch. Still **not** claim-ready; does not change Luna Track 1.

**Not in Stage 1b:** Luna Stage 2, Markdown, short role, classic `gpt-5-nano` floor model.

### Stage 1b outcome (2026-07-22)

**Stop / do not expand.** Same-batch A1 **47.5%** (19/40) vs pure long **52.5%** (21/40); Δ **+5.0 pp**; paired net **+2** (8–6). Earlier cross-batch pure long ~65% vs factorial A1 ~50% did **not** hold. Gap is at the noisy threshold without a coherent fail pattern — not clear enough for a larger nano matrix.

Findings: `RESEARCH/benchmark_pack_v1/runs/nano54_b2_pure_long_pilot_20260722T153848/STAGE1B_PILOT_FINDINGS.md`

---

## 9. Artifact paths

| Item | Path |
|------|------|
| This protocol | `RESEARCH/benchmark_pack_v1/runs/long_persona_extension/PROTOCOL.md` |
| Track 1 claim (short role) | `RESEARCH/track1_role_study_package/CLAIM.md` |
| Pure long prompt source | `scripts/harness/screeningPrompts.js` → `ROLE_BLOCK_RICH_PURE` / `S_role_long_pure` |
| Stage 1 run output | `RESEARCH/benchmark_pack_v1/runs/luna_b1_pure_long_pilot_*` (created by the pilot) |
| Stage 1b run output | `RESEARCH/benchmark_pack_v1/runs/nano54_b2_pure_long_pilot_20260722T153848` |

---

## 10. One-sentence owner summary

**Short role on Luna is already answered (no clear effect). Next we only test whether a pure long persona helps Luna when thinking is off — start with 40 tickets, task-only vs pure long, then scale only if the pilot shows a real gap.**
