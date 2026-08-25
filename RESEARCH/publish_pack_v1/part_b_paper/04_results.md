# Results

*Draft. Confirmatory numbers from `track1_role_study_package/04_analysis/` (findings writeup + `main120_analysis_v1.json`). Claim fences match `CLAIM.md`. Public wording: see `TERMINOLOGY.md`.*

## Primary result

**In this setup, which is often used in real-business agents, adding a short role/persona line, and then generic soft competencies, did not show a clear help or clear harm on end-to-end success.**

Under the locked rule (case-level paired bootstrap 95% CI must exclude 0), **none** of A2−A1, A3−A2, or A3−A1 meet that threshold in B1, in B2, or in the pooled summary check. That is a null under the pre-set analysis rule, not a claim that the effect size is exactly zero. Pass rates are high (especially B2 ~97%), so the design rules out large prompt-style lifts under our threshold; tiny true effects remain compatible with these intervals.

Setup: OpenAI `gpt-5.6-luna`; 120 exam cases × A1/A2/A3 × B1/B2 × 3 repeats = **2160** graded attempts; **0** technical API failures on the main matrix.

## Pass rates

Overall by prompt style and by mode:

| Slice | Pass % |
|-------|-------:|
| A1 | 92.9 |
| A2 | 93.3 |
| A3 | 91.9 |
| B1 (instant) | 88.5 |
| B2 (thinking) | 96.9 |

Cell means (case-averaged):

| | B1 | B2 |
|--|---:|---:|
| A1 | 89.2 | 96.7 |
| A2 | 89.4 | 97.2 |
| A3 | 86.9 | 96.9 |

Repeat-level overall pass rates were stable: r1 **92.5%**, r2 **93.1%**, r3 **92.6%** (720 graded attempts each).

![Pass rates by prompt style and mode](figures/fig2_pass_rates.svg)

*Figure 2. Case-averaged pass rates by prompt style inside each mode. The y-axis starts at 80%. Style differences sit within noise in both modes; the mode gap is the visible move.*

## Prompt-style contrasts

Differences are in percentage points (pp). Positive means the second condition has higher case-averaged pass rate. A contrast is a “clear effect” only if the 95% CI excludes 0.

### Inside instant (B1)

| Contrast | Mean Δ | 95% CI | Clear effect? |
|----------|-------:|--------|---------------|
| A2 − A1 | +0.3 pp | −3.9 … +4.7 | No |
| A3 − A2 | −2.5 pp | −7.5 … +2.2 | No |
| A3 − A1 | −2.2 pp | −8.3 … +3.9 | No |

### Inside thinking (B2)

| Contrast | Mean Δ | 95% CI | Clear effect? |
|----------|-------:|--------|---------------|
| A2 − A1 | +0.6 pp | −2.2 … +3.3 | No |
| A3 − A2 | −0.3 pp | −3.3 … +2.2 | No |
| A3 − A1 | +0.3 pp | −2.2 … +2.5 | No |

### Pooled across modes

Same three contrasts, averaged across modes. Not a separate research question; part of the locked reading plan alongside the within-mode tables.

| Contrast | Mean Δ | 95% CI | Clear effect? |
|----------|-------:|--------|---------------|
| A2 − A1 | +0.4 pp | −2.4 … +3.2 | No |
| A3 − A2 | −1.4 pp | −4.4 … +1.5 | No |
| A3 − A1 | −1.0 pp | −4.6 … +2.8 | No |

![Prompt-style contrasts with 95% CIs](figures/fig3_contrasts.svg)

*Figure 3. All nine locked prompt-style contrasts. Every 95% interval crosses zero.*

Point estimates are small. Under the excludes-0 rule: **no clear help or harm** from short role / soft competencies.

## Secondary result: thinking ≫ instant

Mode is not a prompt-style contrast, but the lift is large and consistent. Overall case-averaged pass: **96.9%** (B2) vs **88.5%** (B1), a **+8.4 pp** gap. The same direction appears inside every prompt style (A1: +7.5 pp; A2: +7.8 pp; A3: +10.0 pp). This is a reasoning-effort result: eliciting deliberation moves end-to-end success here; short identity text does not. It is not the title claim, and it does not undermine the prompt-style null, which holds inside both modes.

**Reliability.** Three independent repeats feed case means; overall graded pass by repeat was stable (r1–r3 above). We do not report pass^k-style “pass on all *k* repeats” as a confirmatory metric. Fail-reason splits (tool vs field vs phrase) by prompt style are out of the locked claim tables; secondary harness diagnostics exist but were not used for confirmatory prompt-style language.

**What failures look like.** Fails concentrate in B1. Two recurring patterns in the run logs: booking under the wrong name when the customer text contains a name conflict, and booking a slot whose start time equals the current clock when gold requires a future slot. Both are workflow-discipline errors rather than extraction errors. This is an exploratory observation from failure review, outside the claim tables.

## Exploratory work

Supporting checks on weaker models (nano) and longer pure personas are **exploratory**. A separate confirmatory matrix on `gpt-4.1-mini` (B1 only, 1440 graded attempts) is reported in `06_appendix_exploratory.md` and does **not** rewrite the Luna prompt-style claim; under the same analysis rule, only longer-persona vs task-only met the threshold there (hurt). A one-repeat `gemini-3.5-flash-lite` full_120 screen (~76–80% by style) is also appendix-only and is **not** claim-ready.
