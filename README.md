# Skip the Roleplay

Persona prompting did not improve a real-world AI agent.

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22089532.svg)](https://doi.org/10.5281/zenodo.22089532)

**Ihor Parinov (TARK AI)** · [ORCID](https://orcid.org/0009-0006-9411-8633)

We ran a confirmatory study on OpenAI `gpt-5.6-luna`, with 120 frozen appliance-repair scheduling cases, simulated tools, Structured Outputs, and a deterministic grader. Prompt styles were task instructions only, the same plus a short role line, and the same plus that role line and one generic competency sentence. Instant and thinking modes. Three repeats. 2160 graded attempts.

Under the locked analysis rule (case-level paired bootstrap 95% CI must exclude 0), the short role line did not show a clear help or a clear harm on full-case pass. Thinking beat instant by 8.4 points (96.9% vs 88.5%). That mode gap is secondary. The title is about the role line.

## Read it

- Story: [ihorparinov.com/research/skip-roleplay-part-a](https://ihorparinov.com/research/skip-roleplay-part-a/)
- Paper DOI, always the latest version: [doi.org/10.5281/zenodo.22089532](https://doi.org/10.5281/zenodo.22089532)
- This version: [zenodo.org/records/22090051](https://zenodo.org/records/22090051)
- PDF in this repo: [`RESEARCH/publish_pack_v1/paper_draft.pdf`](RESEARCH/publish_pack_v1/paper_draft.pdf)

## Re-run the eval

```powershell
Copy-Item .env.example .env
# Set OPENAI_API_KEY in .env
npm install
npm run harness:self-test
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json
```

## Claim fences

One model (`gpt-5.6-luna`), one domain (appliance-repair scheduling), dense task instructions, and fixed tools and schemas. This is not a proof that personas never work anywhere.

A longer persona on `gpt-4.1-mini` hurt in a follow-up. That is a separate appendix claim, not the title result.

## License

- Code and evaluation harness: [MIT License](LICENSE).
- Paper, exam bundle, and related research artifacts in `RESEARCH/`: [Creative Commons Attribution 4.0 International (CC-BY 4.0)](LICENSE-CC-BY-4.0).
