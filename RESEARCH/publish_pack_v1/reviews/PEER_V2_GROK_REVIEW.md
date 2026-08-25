# Peer review — paper_draft_v2 (Grok)

**File reviewed:** `RESEARCH/publish_pack_v1/peer_share/paper_draft_v2.md`  
**Lens:** Scientific clarity + claim fairness for an external persona researcher (esp. Principled Personas / Luz de Araujo).  
**Date:** 2026-07-29  
**Constraints honored:** punchy title locked; primary Luna null under excludes-0; secondary thinking ≫ instant report confidently; thin A3 by design; anti-undersell; exploratory/mini appendix; Part A out of scope. No rewrite; no invented numbers.

---

## 1. Verdict

**Yes-with-nits.** Ready to send Pedro Luz de Araujo for a critical read. Primary null, secondary mode lift, A3 thinness, appendix fence, and Principled Personas desiderata map are already in good shape; remaining issues are short claim-clarity nits, not redesign blockers.

---

## 2. Worth fixing

Prefer ≤8. Only items that would genuinely help Pedro’s critical read.

1. **Bootstrap resample count missing (§3.8).** Say how many case resamples (elsewhere in pack: B=10000). Fix: “case-level paired bootstrap 95% CIs (B=…, resample cases).”
2. **§3.7 over-attributes null to content vs length.** “Any difference … is attributed to content, not length” claims isolation you did not run. Fix: “Length not equalized; we do not claim to have separated token count from content.”
3. **§5.2 gloss risks mis-citing Principled Personas.** “Expert text helps most when it adds information the instruction stack lacks” reads like their result. Fix: “Our reading / consistent with careful-design intuition: …”
4. **Secondary +8.4 pp claim discipline (§4.4).** Report confidently, but one half-clause that this is the overall case-averaged gap, **not** under the primary excludes-0 rule (do not invent a B2−B1 CI if it is not in the analysis JSON).
5. **Pooled summary mechanics (§3.8 / §4.3).** One clause on how “pooled across modes” is formed (e.g., case means averaged over modes vs pooling all graded attempts) so the locked summary check is auditable.
6. **Confirmatory date window (§3.6 or App B).** You already flag API drift; add the matrix date window from the run log when shipping to Pedro.

---

## 3. By design / push back

Things a cautious reviewer may flag; authors should refuse.

1. Soften title/subtitle or bury the excludes-0 null under more universal-never hedges.
2. Redesign A3 into domain coaching / ExpertPrompting-style bios and keep the same confirmatory claim.
3. Require classic name/color Robustness batteries as a condition of accepting the desiderata map.
4. Widen confirmatory primary to more models/domains before peer feedback (appendix already fences the tier story).
5. Swap deterministic gold for LLM-as-judge / soft tone metrics so personas can “show” style gains.
6. Treat internal protocol lock as inadequate unless OSF/AsPredicted exists, or demand a fabricated B2−B1 bootstrap CI without a locked analysis artifact.

---

## 4. Tone check

Residual AI-fluff / lab-lingo / over-hedging (not blockers):

- **Lab-lingo:** “fenced,” “locked rule/matrix,” “right hypothesis class” (§4.5, §5.2, Contributions) — fine for workshop peers; slightly insider for a cold external.
- **Code density:** A1/A2/A3 × B1/B2 is clear once defined; tables lean on it hard (acceptable).
- **Residual undersell:** “not … exactly zero” appears in Abstract + §4.1 (same fence twice). Trim one if editing; do not add more.
- **§5.3 bullet list** largely restates Abstract Limits — redundant, not unfair.
- No purple “AI theater” prose; punchy title is intentional, body hedges with “in this setup.”

---

## 5. Do not change / strengths

- Punchy title + body “in this setup” / excludes-0 null language.
- Primary Luna short-role / soft-competencies null (*N*=2160); secondary thinking ≫ instant kept off the title.
- Thin A3 disclosed; competencies-without-role not tested, stated.
- Exploratory / `gpt-4.1-mini` longer-persona hurt stays appendix.
- §5.2 desiderata table (Expertise Advantage / Robustness-adjacent / Fidelity out of scope) is exactly what a Principled Personas reader wants.
- Related-work gap vs Zheng + Luz de Araujo is fair; Kong/Xu non-refutation is clear.
- Protocol lock ≠ public pre-registration disclosed once.
- Pass rates and CIs look internally consistent with stated cell means (rounding aside).
