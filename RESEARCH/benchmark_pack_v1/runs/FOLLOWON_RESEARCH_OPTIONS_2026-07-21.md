# Follow-on prompting research options (post-main120)

Generated 2026-07-21 after main120 null on role/competencies.
Source: idea-generation subagent. Rate with owner: Novelty / Usefulness / Feasibility / Dogma-punch (1-5 each).
I reviewed the main120 findings and the v2 design brief before drafting. Two facts from your run shape everything below: (1) your B2 cells sit at ~97% â€” near ceiling, so any follow-on that doesn't add difficulty will null by construction in thinking mode; (2) your failures concentrate in B1, which means B1 is currently your most sensitive instrument. Several options below deliberately exploit that.

---

# Ranked research options

## 1. The Thinking Tax: can prompt scaffolds buy back reasoning at effort=none?

- **Dogma under attack:** Two at once. Old dogma: "you must ask for chain-of-thought / add a planning step." New dogma: "just turn on reasoning mode; prompt scaffolds are obsolete." Nobody has clean numbers on whether prompted planning *substitutes* for native reasoning in a tool agent â€” and what it costs.
- **Core contrast:** Axis S: no scaffold vs "write a short plan before acting" vs forced checklist-before-final-tool-call. Crossed with your existing B1 (effort=none) vs B2 (medium). Secondary read: latency and token cost per condition.
- **Why it might show a real difference:** You already measured an 8.4pp B1â†’B2 gap. If a cheap scaffold closes even half of it at effort=none, that's a concrete cost/latency arbitrage every agent builder cares about ("skip reasoning tokens, keep 4 of the 8 points"). If the scaffold does *nothing* at effort=none, that kills the "just ask it to plan" folklore for tool agents. If it *hurts* at B2 (double-planning interference), that's a genuinely surprising finding.
- **Why it might still null:** Scaffold text may be ignored at effort=none (the failure mode is shallow attention, not missing plan). At B2, ceiling.
- **Eval design sketch:** Same appliance-repair agent, same 120-pack, same deterministic gold evaluator. 3 scaffolds Ã— 2 effort Ã— 120 Ã— 3 repeats = 2160 runs â€” identical scale to what you just did. Add latency/tokens as pre-registered secondary metrics.
- **Insight if positive:** "Prompted planning recovers X% of the reasoning-mode gain at Y% of the latency" â€” directly monetizable advice. **If null:** "In tool agents, planning scaffolds neither substitute for nor stack with native reasoning â€” spend the tokens on rules, not rituals." Both are publishable.
- **Reuse:** 5/5 (only the S-axis prompt variants are new)
- **Risk/effort:** Low
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

## 2. Few-Shot Poisoning: do worked examples help or hijack tool agents?

- **Dogma under attack:** "Few-shot examples always help." The strongest single piece of prompting folklore, almost never tested in tool-calling settings where examples show *trajectories*, not answers.
- **Core contrast:** 0 vs 3 vs 8 in-prompt worked ticket examples; second axis: examples *representative* of the pack vs *adversarially near-miss* (e.g., an example that books, shown before tickets that must refuse).
- **Why it might show a real difference:** Trajectory examples create a prior over action sequences. On tickets whose correct action differs from the example (your name-conflict and non-future-slot families), the model may imitate the example instead of the rules. That's a measurable, family-specific harm with a clean mechanism.
- **Why it might still null:** Frontier models may genuinely condition on rules over examples now. Mitigation: the near-miss arm is designed to maximize interference; if even that nulls, the null is strong.
- **Eval design sketch:** Same agent/pack/evaluator. 3 example-counts Ã— 2 example-types (skip 2 cells: 0-shot has no type) â†’ 5 cells Ã— 120 Ã— 3 â‰ˆ 1800 runs. Pre-register per-family contrasts (your failure taxonomy already segments these).
- **Insight if positive:** "Few-shot examples cause imitation errors in tool agents â€” X pp harm on rule-boundary tickets." **If null:** "Modern tool agents are example-robust; stop maintaining example libraries." 
- **Reuse:** 5/5
- **Risk/effort:** Low
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

## 3. Prompt Bloat: the dose-response curve for "more detail"

- **Dogma under attack:** "Longer, more detailed prompts are safer â€” when in doubt, add it to the system prompt." Every enterprise agent accretes prompt sludge on this belief.
- **Core contrast:** One semantic ruleset at four physical doses: minimal (~300 tokens) vs your current prompt vs 3Ã— padded (redundant paraphrase, boilerplate policy tone) vs 3Ã— padded *with 10 irrelevant-but-plausible policy paragraphs* interleaved. Rules held constant; only bulk and distractors vary.
- **Why it might show a real difference:** Distractor dilution and positional attrition are documented in retrieval QA but not in tool agents, where the cost of missing one rule is a failed booking. The distractor arm also injects difficulty â€” which fixes your B2 ceiling problem in the same stroke.
- **Why it might still null:** Pure padding (arm 3) probably nulls; the claim then rests on the distractor arm. Design accordingly: distractor arm is primary, padding is secondary.
- **Eval design sketch:** Same agent/evaluator, 4 doses Ã— B1/B2 Ã— 120 Ã— 3 â‰ˆ 2880 runs, or drop B2 for arms where you expect ceiling. Metric: pass rate + which-rule-was-violated from taxonomy.
- **Insight if positive:** "Every 1,000 tokens of prompt sludge costs X pp of tool-call correctness" â€” a number procurement people will quote. **If null:** "Frontier agents are bloat-proof up to N tokens; prompt hygiene is aesthetic, not functional."
- **Reuse:** 5/5
- **Risk/effort:** Low-Med (writing convincing distractor policy text takes care)
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

## 4. Where Coaching Lives: system prompt vs tool descriptions

- **Dogma under attack:** "Behavioral guidance belongs in the system prompt; tool descriptions are just API docs." Also its inverse, quietly spreading among agent builders: "put everything in the tool schema, the model reads it at call time."
- **Core contrast:** Same rules placed (a) all in system prompt, (b) all in tool/parameter descriptions, (c) split by relevance, (d) duplicated in both. Token count matched.
- **Why it might show a real difference:** Tool descriptions are attended at tool-selection time; system prompt competes with the whole conversation. For rules that gate *whether* to call a tool (your `service_check` and refusal rules), placement plausibly matters a lot at effort=none.
- **Why it might still null:** The model may flatten the whole context anyway. Even then, "placement doesn't matter â€” stop arguing about it" is a useful null for teams that debate this in every design review.
- **Eval design sketch:** Same everything; 4 placements Ã— B1/B2 Ã— 120 Ã— 3. Deterministic evaluator unchanged. Pre-register the tool-gating families as the primary slice.
- **Insight if positive:** A concrete placement rule ("rules that gate tool X go in tool X's description: +Y pp"). **If null:** placement-agnosticism, also actionable.
- **Reuse:** 5/5
- **Risk/effort:** Low
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

## 5. The Pink Elephant Audit: do negative constraints backfire?

- **Dogma under attack:** "Never tell the model what NOT to do â€” negative instructions plant the forbidden behavior." Repeated in every prompting course; evidence is anecdotal and pre-dates reasoning models.
- **Core contrast:** Your rule set rewritten three ways with identical semantics: positive-only ("only book strictly future slots"), negative-only ("never book a slot that is not strictly in the future"), mixed. Your evaluator already detects exactly these violations deterministically.
- **Why it might show a real difference:** If the effect is real anywhere, it's at effort=none where shallow pattern-matching dominates. Your "book equal-to-now slot" failure family is the perfect probe â€” it's literally a forbidden-action rule.
- **Why it might still null:** Likely nulls at B2, plausibly overall. But this dogma is so widely asserted that a tight confirmatory null ("negative phrasing: Î” = 0.2 pp, CI âˆ’2â€¦+2") is itself a strong publishable claim.
- **Eval design sketch:** 3 phrasings Ã— B1/B2 Ã— 120 Ã— 3 â‰ˆ 2160 runs. Zero new infrastructure.
- **Insight if positive:** "Negative constraints cost X pp â€” here's the rewrite pattern." **If null:** "The pink-elephant rule is folklore; phrase rules however is clearest to your team."
- **Reuse:** 5/5
- **Risk/effort:** Low
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

## 6. The Schema Tax: does Structured Outputs constrain thinking?

- **Dogma under attack:** Both directions again: "always use strict schemas" (reliability camp) vs "constrained decoding degrades reasoning quality" (a claim floating around since early grammar-constrained-decoding papers).
- **Core contrast:** Strict Structured Outputs (current) vs schema-in-prompt + freeform JSON + your parser vs fully freeform + tolerant parser. Crossed with B1/B2.
- **Why it might show a real difference:** If constraint pressure competes with task reasoning, it should show at effort=none. Separately, the freeform arms give you a hard secondary metric â€” parse/validity failure rate â€” quantifying what strictness actually buys.
- **Why it might still null on task success:** Likely. But the deliverable is then a two-sided number: "schemas cost 0 pp of task quality and eliminate Z% parse failures" â€” the definitive citation for a debate that currently runs on vibes.
- **Eval design sketch:** 3 output modes Ã— B1/B2 Ã— 120 Ã— 3. You already built both pipelines (Structured Outputs probe run exists in your runs folder). Metrics: task pass, parse-failure rate, retry count.
- **Reuse:** 4/5 (parser hardening for freeform arm)
- **Risk/effort:** Low-Med
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

## 7. Last Word Wins? Instruction placement and recency in agent contexts

- **Dogma under attack:** "Put critical instructions at the end" / "repeat instructions after long context" â€” extrapolated from needle-in-haystack retrieval studies to agents without evidence.
- **Core contrast:** Critical rules at top vs bottom vs both ends of the system prompt; second axis: short context vs long (pad with the Option-3 distractor corpus, reused).
- **Why it might show a real difference:** Positional effects are context-length-dependent; your current prompts are short enough that placement is untested. The long-context arm is where dogma predicts a big effect â€” if it's absent there, the dogma is dead for this regime.
- **Why it might still null:** At short context, almost certainly nulls; the long arm carries the study. Run it after or jointly with Option 3 to amortize the distractor corpus.
- **Eval design sketch:** 3 placements Ã— 2 context lengths Ã— B1 only (B2 optional) Ã— 120 Ã— 3 â‰ˆ 2160 runs.
- **Insight if positive:** A placement rule with a context-length threshold. **If null:** "Stop cargo-culting 'instructions at the end' from retrieval papers into agents."
- **Reuse:** 4/5
- **Risk/effort:** Med
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

## 8. Check Yourself: does a self-verification instruction actually catch errors?

- **Dogma under attack:** "Add 'verify your answer before finalizing' â€” it's free reliability." Ubiquitous advice; in agents it costs latency and may cause second-guessing (undoing correct decisions).
- **Core contrast:** No check vs verify-instruction ("before your final tool call, confirm each rule is satisfied") vs structured checklist the model must fill (a lightweight extra field in your existing schema, deterministically checkable for honesty).
- **Why it might show a real difference:** B1 failures are exactly the slips a checklist targets. Bonus hard metric the field lacks: checklist honesty â€” how often the model asserts "slot is in the future: yes" while booking a non-future slot. Confabulated self-verification is a headline finding on its own.
- **Why it might still null:** Self-check may be performative (model writes the checklist after deciding). That's what the honesty metric detects â€” so even the null arm produces the confabulation number.
- **Eval design sketch:** 3 check modes Ã— B1/B2 Ã— 120 Ã— 3. Schema extension is small; evaluator compares checklist claims to ground truth.
- **Insight if positive:** "Structured self-check recovers X pp at effort=none." **If null + confabulation found:** "Self-verification in agents is theater: models assert compliance while violating it Y% of the time."
- **Reuse:** 4/5
- **Risk/effort:** Med
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

## 9. The Conciseness Tax: does "be brief" make agents skip steps?

- **Dogma under attack:** "Style instructions are free â€” they change tone, not substance." Everyone bolts "be concise and professional" onto customer-facing agents assuming zero behavioral cost.
- **Core contrast:** No style instruction vs "be concise, minimize steps" vs "be thorough, never skip verification." Everything else frozen.
- **Why it might show a real difference:** Conciseness pressure plausibly suppresses "optional-feeling" tool calls (your `other_type` â†’ `service_check` rule is the canonical victim). Deterministically measurable as tool-call omission rate.
- **Why it might still null:** Style instructions may only affect the text channel, not actions. A clean null is still useful ("style riders are behaviorally free â€” add them without fear") but it's the thinnest standalone story here; consider bundling as a third axis on Option 1 or 5.
- **Eval design sketch:** 3 styles Ã— B1/B2 Ã— 120 Ã— 3. Zero new infrastructure. Primary metric: pass rate; secondary: required-tool-call omission rate.
- **Reuse:** 5/5
- **Risk/effort:** Low
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

## 10. Say It Thrice: is repetition a real reliability lever?

- **Dogma under attack:** Split dogma â€” half the field says repeating critical instructions is an embarrassing hack, half swears by it. Nobody has a number.
- **Core contrast:** The two most-violated rules (from your taxonomy: non-future-slot, name-conflict) stated once vs twice vs three times in different locations, token-matched with neutral filler in the 1Ã— arm.
- **Why it might show a real difference:** Repetition raises effective salience; if any cheap trick moves B1 failures, it's this one. Directly complements Option 3 (bloat hurts?) with its mirror (targeted redundancy helps?) â€” running both gives you a two-sided "prompt mass" story: *bulk is poison, repetition is medicine* (or neither).
- **Why it might still null:** Salience may already be saturated for explicitly stated rules.
- **Eval design sketch:** 3 repetition levels Ã— B1 (B2 optional) Ã— 120 Ã— 3 â‰ˆ 1080â€“2160 runs.
- **Insight if positive:** "Repeat your top-2 failure rules 2Ã—: +X pp, free." **If null:** "Repetition is superstition."
- **Reuse:** 5/5
- **Risk/effort:** Low
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

## 11. Format Wars: XML vs Markdown vs plain prose

- **Dogma under attack:** "Models love XML tags" / "use markdown headers for structure" â€” vendor-specific folklore promoted to universal law.
- **Core contrast:** Identical semantics rendered as XML-tagged sections vs markdown headers vs flat prose. Optionally crossed with prompt length (structure should matter more at 3Ã— length â€” reuse Option 3's arms).
- **Why it might show a real difference:** Structure plausibly aids rule retrieval in long prompts. At your current prompt length, probably not.
- **Why it might still null:** High null risk at short length â€” which is exactly why it should ride along with the bloat study rather than stand alone.
- **Eval design sketch:** 3 formats Ã— 2 lengths Ã— B1 Ã— 120 Ã— 3. Cheapest as a nested axis inside Option 3.
- **Insight if positive:** "Structure only pays above N tokens." **If null:** "Format bikeshedding is wasted engineering time" â€” weak alone, good as a chapter.
- **Reuse:** 5/5
- **Risk/effort:** Low
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

## 12. Needle in the Policy Stack: context stuffing vs curated retrieval

- **Dogma under attack:** "Long context killed RAG â€” just stuff all the docs in." The loudest current dogma, tested almost exclusively on QA benchmarks, not on agents that must *act* on the right policy.
- **Core contrast:** Gold policy snippet only vs gold + 20 irrelevant policies vs gold + 3 *near-miss contradictory* policies (e.g., a different service line's booking rules with different slot logic). The agent must follow the right one; your evaluator checks the action, so wrong-policy-following is deterministically visible.
- **Why it might show a real difference:** Near-miss contradictions are the realistic enterprise failure mode (old policy versions, adjacent departments) and should defeat pure attention where random distractors don't.
- **Why it might still null:** Random-distractor arm likely nulls; contradiction arm is the payload. Requires the most new content authoring of any option here.
- **Eval design sketch:** 3 context conditions Ã— B1/B2 Ã— 120 Ã— 3. New: policy-corpus authoring (~30 documents) and per-ticket gold-policy mapping.
- **Insight if positive:** "Context stuffing survives noise but dies on contradictions: âˆ’X pp â€” curate versions, don't stuff." **If null:** "gpt-5.6-luna-class agents resolve policy conflicts from context alone; retrieval curation is legacy overhead."
- **Reuse:** 3/5
- **Risk/effort:** High
- **Owner ratings:** Novelty ___ / Usefulness ___ / Feasibility ___ / Dogma-punch ___

---

# Top-3 recommendation

**1. Option 1 (Thinking Tax), 2. Option 2 (Few-Shot Poisoning), 3. Option 3 (Prompt Bloat).**

Why these beat "persona doesn't matter" as a story:

- **They attack dogmas with money attached.** "Role prompts don't help" saves a builder 40 tokens. "A scaffold recovers half the reasoning-mode gain at a fraction of the latency" (Opt 1), "your example library is causing imitation errors" (Opt 2), and "prompt sludge costs X pp per 1,000 tokens" (Opt 3) each change an architecture or cost decision. That's the difference between trivia and consulting material.
- **Every outcome is a claim.** All three are designed so the null arm is as quotable as the positive arm â€” you never repeat the "we found nothing and the nothing is thin" problem, because these dogmas are asserted loudly enough that a tight CI around zero is itself news.
- **They fix your ceiling problem instead of inheriting it.** Option 1 works where your instrument is sensitive (B1 failures), Options 2 and 3 inject adversarial difficulty (near-miss examples, distractor policies), pulling B2 off its 97% ceiling. A rerun of any prompt tweak on the unmodified pack would mostly re-measure ceiling noise.
- **They're nearly free.** All three reuse the frozen pack, deterministic evaluator, Structured Outputs pipeline, bootstrap analysis, and failure taxonomy â€” each is roughly the same 2,000-run scale you just executed in one day.

Sequencing suggestion: run Option 1 first (zero new content, immediately continues the B1/B2 thread from main120), author the near-miss examples and distractor corpus in parallel, then run Options 2 and 3 back-to-back â€” the distractor corpus later feeds Options 7 and 12 for free.

---

# Comparison table

| # | Option | Dogma attacked | Reuse | Effort | Dogma-punch potential | Null still useful? |
|---|--------|----------------|:-----:|:------:|:---------------------:|:------------------:|
| 1 | Thinking Tax (scaffolds vs reasoning effort) | "Just enable thinking" / "always ask for CoT" | 5 | Low | High | Yes |
| 2 | Few-Shot Poisoning | "Examples always help" | 5 | Low | High | Yes |
| 3 | Prompt Bloat dose-response | "More detail is always safer" | 5 | Low-Med | High | Yes |
| 4 | System prompt vs tool descriptions | "Coaching goes in the system prompt" | 5 | Low | Med-High | Yes |
| 5 | Negative constraints (pink elephant) | "Never say don't" | 5 | Low | Med-High | Yes (strong null) |
| 6 | Schema Tax | "Schemas degrade reasoning" / "always use schemas" | 4 | Low-Med | Med | Yes (two-sided number) |
| 7 | Instruction placement / recency | "Critical rules go at the end" | 4 | Med | Med | Yes |
| 8 | Self-check honesty | "Verification steps are free reliability" | 4 | Med | Med-High | Yes (confabulation metric) |
| 9 | Conciseness Tax | "Style riders are behaviorally free" | 5 | Low | Med | Weak alone; bundle it |
| 10 | Targeted repetition | "Repetition is a hack" / "repetition works" | 5 | Low | Med | Yes |
| 11 | Format Wars (XML/MD/prose) | "Models love XML" | 5 | Low | Low-Med | Weak alone; nest in #3 |
| 12 | Context stuffing vs curation | "Long context killed RAG" | 3 | High | High | Yes |
