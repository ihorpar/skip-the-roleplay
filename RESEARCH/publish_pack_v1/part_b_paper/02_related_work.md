# Related Work

Short role lines (“you are a scheduling agent”) and soft competency text remain standard practice in production agents. Prior literature shows that persona and instruction effects are real in some settings and null in others, but almost always on QA, reasoning, or open-ended writing, not on dense tool-using instruction stacks with deterministic business gold. We situate our confirmatory study in four strands.

## Role and persona prompting

Persona / role prompting is a crowded area, now surveyed as LLM *role-playing* (assigning a persona to the model) versus *personalization* (conditioning on a user persona) [Tseng et al., 2024; Chen et al., 2024]. Early positive results include Kong et al. [2024], who report that strategically designed role-play prompting improves zero-shot reasoning over standard prompting on most of twelve benchmarks (e.g., AQuA 53.5%→63.8% with ChatGPT), acting as an implicit chain-of-thought trigger. Xu et al. [2023] (*ExpertPrompting*) show that detailed, auto-synthesized expert biographies, often tailored per instruction, can raise judged answer quality and support stronger instruction-tuned assistants. That is a different intervention from the short “you are a scheduling agent” line practitioners add on top of an already dense task stack (our A2/A3). These gains are typically measured with soft or LLM-as-judge metrics, or on math/symbolic tasks without tools.

Negative and mixed evidence is equally important. Zheng et al. [2024] systematically evaluate 162 social / expert roles as system-prompt personas across multiple model families and 2,410 factual questions, finding that adding a persona does **not** improve objective accuracy relative to a no-persona control; any per-question “best persona” effect is hard to select automatically and often indistinguishable from chance. Luz de Araujo et al. [2025] (*Principled Personas*) then measure expert-persona prompting against explicit desiderata across many models and tasks: expert personas are usually positive or non-significant, while irrelevant persona details can hurt sharply. That is useful framing for when identity text should matter, though still mostly outside dense tool+schema business workflows with deterministic end-to-end gold. Zheng remains the closest published analogue to our confirmatory null; Principled Personas is the closest recent measurement framework. Neither is a locked A/B of short role / soft competency text under fixed tools, schemas, and pass criteria. We therefore re-measure that operational intervention in our scheduling exam.

## System prompts and instruction following

Modern chat APIs separate system instructions from user turns; alignment work (InstructGPT; Ouyang et al., 2022) made following those instructions a first-class capability. Evaluation has moved toward *verifiable* compliance: IFEval [Zhou et al., 2023] scores objective constraints (length, keywords, format) with deterministic checkers rather than LLM judges. That design matches our scheduling exam, where tools, fields, and exact phrases are programmatically scored, but IFEval does not ask whether adding identity text on top of an already dense instruction stack changes pass rates. In deployment, the practical question is often incremental: given a long, correct task policy, do short role or competency appendages still move outcomes? Prior instruction-following work rarely isolates that contrast under a fixed tool/schema harness.

## Tool-using agents and workflow benchmarks

Tool-augmented evaluation has matured quickly. API-Bank [Li et al., 2023] and ToolLLM / ToolBench [Qin et al., 2024] stress API calling, retrieval, and multi-step planning. AgentBench [Liu et al., 2024] expands to interactive environments (OS, DB, web, games). ReAct [Yao et al., 2023] established interleaved reasoning-and-acting as a standard agent pattern. The Berkeley Function Calling Leaderboard [Patil et al., 2025] standardizes AST-based scoring of serial/parallel and multi-turn calls. Closest to business operations, τ-bench [Yao et al., 2024] evaluates tool–agent–user dialogues under domain policies (e.g., retail, airline) with database-state gold and reliability metrics (pass^k). Our exam differs on purpose: fixed user utterance plus tool loop, response/trace gold rather than database state, and case-mean pass rather than pass^k; see Methods.

These benchmarks primarily rank *models* and *agent stacks*. They seldom run pre-specified, confirmatory A/B tests of short persona deltas while holding tools, schemas, and task rules fixed, especially under a binary end-to-end success metric on dense production-style task instructions. That is the operational setting where practitioners most often paste “you are an expert” and expect a lift.

## Reasoning effort and test-time compute

Separately, eliciting more inference-time deliberation reliably helps hard tasks. Chain-of-thought prompting [Wei et al., 2022] showed that intermediate reasoning steps improve multi-step performance; subsequent work treats *test-time compute* as a scalable axis. Snell et al. [2024] argue that compute-optimal allocation of inference search / revision can outperform simply scaling model size on matched FLOPs. Vendor reasoning models (e.g., OpenAI’s o1-class reports; OpenAI, 2024) likewise frame accuracy as increasing with train-time RL *and* time spent thinking at inference. In our design, reasoning effort is a **secondary** contrast (instant vs. thinking), not the primary claim: we ask whether short role lines still matter once the task instructions are dense, and only then report how mode affects full-pass rates. Where Kong-style role-play may act as an implicit deliberation trigger on sparse reasoning prompts, our secondary lift comes from explicit API reasoning effort, independent of short identity text.

## Gap

Across these strands, positive persona effects appear mainly on reasoning or judged writing (often with rich expert bios [Xu et al., 2023], not short role pastes); systematic nulls and non-effects appear on factual QA and broader task suites [Zheng et al., 2024; Luz de Araujo et al., 2025]; agent benchmarks emphasize capability ceilings rather than confirmatory nulls on prompt *identity* under fixed tools. **Few published studies report confirmatory nulls for short role / soft competency prompting on dense-instruction, tool-using business agents with deterministic gold.** Our confirmatory study targets that gap: a locked analysis plan, a frozen scheduling exam, programmatically scored end-to-end success, and small prompt-style deltas, without claiming a general theory of personas.

---

## Sources

1. **Tseng, Y.-M., Huang, Y.-C., Hsiao, T.-Y., Chen, W.-L., Huang, C.-W., Meng, Y., & Chen, Y.-N.** (2024). *Two Tales of Persona in LLMs: A Survey of Role-Playing and Personalization.* Findings of EMNLP 2024. https://doi.org/10.18653/v1/2024.findings-emnlp.969 · https://aclanthology.org/2024.findings-emnlp.969/

2. **Chen, J., Wang, X., Xu, R., Yuan, S., Zhang, Y., Shi, W., Xie, J., Li, S., Yang, R., Zhu, T., et al.** (2024). *From Persona to Personalization: A Survey on Role-Playing Language Agents.* arXiv:2404.18231. https://doi.org/10.48550/arXiv.2404.18231 · https://arxiv.org/abs/2404.18231

3. **Kong, A., Zhao, S., Chen, H., Li, Q., Qin, Y., Sun, R., Zhou, X., Wang, E., & Dong, X.** (2024). *Better Zero-Shot Reasoning with Role-Play Prompting.* NAACL 2024. https://doi.org/10.18653/v1/2024.naacl-long.228 · https://aclanthology.org/2024.naacl-long.228/

4. **Xu, B., Yang, A., Lin, J., Wang, Q., Zhou, C., Zhang, Y., & Mao, Z.** (2023). *ExpertPrompting: Instructing Large Language Models to be Distinguished Experts.* arXiv:2305.14688. https://doi.org/10.48550/arXiv.2305.14688 · https://arxiv.org/abs/2305.14688

5. **Zheng, M., Pei, J., Logeswaran, L., Lee, M., & Jurgens, D.** (2024). *When “A Helpful Assistant” Is Not Really Helpful: Personas in System Prompts Do Not Improve Performances of Large Language Models.* Findings of EMNLP 2024. https://doi.org/10.18653/v1/2024.findings-emnlp.888 · https://aclanthology.org/2024.findings-emnlp.888/ · https://arxiv.org/abs/2311.10054

6. **Luz de Araujo, P. H., Röttger, P., Hovy, D., & Roth, B.** (2025). *Principled Personas: Defining and Measuring the Intended Effects of Persona Prompting on Task Performance.* EMNLP 2025. https://doi.org/10.18653/v1/2025.emnlp-main.1364 · https://aclanthology.org/2025.emnlp-main.1364/ · https://arxiv.org/abs/2508.19764

7. **Ouyang, L., Wu, J., Jiang, X., Almeida, D., Wainwright, C., Mishkin, P., Zhang, C., Agarwal, S., Slama, K., Ray, A., et al.** (2022). *Training language models to follow instructions with human feedback.* NeurIPS 2022. https://proceedings.neurips.cc/paper_files/paper/2022/hash/b1efde53be364a73914f58805a001731-Abstract-Conference.html · https://arxiv.org/abs/2203.02155

8. **Zhou, J., Lu, T., Mishra, S., Brahma, S., Basu, S., Luan, Y., Zhou, D., & Hou, L.** (2023). *Instruction-Following Evaluation for Large Language Models.* arXiv:2311.07911. https://doi.org/10.48550/arXiv.2311.07911 · https://arxiv.org/abs/2311.07911

9. **Li, M., Zhao, Y., Yu, B., Song, F., Li, H., Yu, H., Li, Z., Huang, F., & Li, Y.** (2023). *API-Bank: A Comprehensive Benchmark for Tool-Augmented LLMs.* EMNLP 2023. https://doi.org/10.18653/v1/2023.emnlp-main.187 · https://aclanthology.org/2023.emnlp-main.187/

10. **Qin, Y., Liang, S., Ye, Y., Zhu, K., Yan, L., Lu, Y., Lin, Y., Cong, X., Tang, X., Qian, B., et al.** (2024). *ToolLLM: Facilitating Large Language Models to Master 16000+ Real-world APIs.* ICLR 2024. https://openreview.net/forum?id=dHng2O0Jjr · https://arxiv.org/abs/2307.16789

11. **Liu, X., Yu, H., Zhang, H., Xu, Y., Lei, X., Lai, H., Gu, Y., Ding, H., Men, K., Yang, K., et al.** (2024). *AgentBench: Evaluating LLMs as Agents.* ICLR 2024. https://proceedings.iclr.cc/paper_files/paper/2024/file/e9df36b21ff4ee211a8b71ee8b7e9f57-Paper-Conference.pdf · https://arxiv.org/abs/2308.03688

12. **Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y.** (2023). *ReAct: Synergizing Reasoning and Acting in Language Models.* ICLR 2023. https://arxiv.org/abs/2210.03629 · https://github.com/ysymyth/ReAct

13. **Yao, S., Shinn, N., Razavi, P., & Narasimhan, K.** (2024). *τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains.* arXiv:2406.12045. https://doi.org/10.48550/arXiv.2406.12045 · https://arxiv.org/abs/2406.12045

14. **Patil, S. G., Mao, H., Yan, F., Cheng-Jie Ji, C., Suresh, V., Stoica, I., & Gonzalez, J. E.** (2025). *The Berkeley Function Calling Leaderboard (BFCL): From Tool Use to Agentic Evaluation of Large Language Models.* ICML 2025. https://proceedings.mlr.press/v267/patil25a.html · https://gorilla.cs.berkeley.edu/leaderboard.html

15. **Wei, J., Wang, X., Schuurmans, D., Bosma, M., Ichter, B., Xia, F., Chi, E., Le, Q., & Zhou, D.** (2022). *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.* NeurIPS 2022. https://proceedings.neurips.cc/paper_files/paper/2022/hash/9d5609613524ecf4f15af0f7b31abca4-Abstract-Conference.html · https://arxiv.org/abs/2201.11903

16. **Snell, C., Lee, J., Xu, K., & Kumar, A.** (2024). *Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters.* arXiv:2408.03314. https://doi.org/10.48550/arXiv.2408.03314 · https://arxiv.org/abs/2408.03314

17. **OpenAI.** (2024). *Learning to reason with LLMs* (o1 announcement / technical overview). https://openai.com/index/learning-to-reason-with-llms/

### Citation integrity note

Omitted several widely blogged claims (e.g., informal “expert persona hurts MMLU” writeups; unreviewed persona meta-analyses) where we could not confirm a stable title/author/venue record. Prefer the peer-reviewed or arXiv-primary sources above when expanding this section.
