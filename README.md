# Skip the Roleplay

## Persona prompting did not improve a real-world AI agent

**Author:** Ihor Parinov (TARK AI). ORCID: https://orcid.org/0009-0006-9411-8633

We ran a confirmatory study on OpenAI `gpt-5.6-luna` over a frozen 120-case appliance-repair scheduling exam with deterministic gold labels. Prompt styles were task-only (A1), plus a short role line (A2), and plus role plus generic soft competencies (A3). Run modes were instant and thinking, with three repeats (2160 graded attempts). Under the locked analysis rule (case-level paired bootstrap 95% CI must exclude 0), short role / soft competencies did not show clear help or clear harm on end-to-end success in this setup. Thinking mode beat instant by +8.4 percentage points overall; that mode contrast is secondary to the persona claim.

## Paper and readout

- PDF: `RESEARCH/publish_pack_v1/paper_draft.pdf`
- Human readout (Part A): `RESEARCH/publish_pack_v1/part_a_public/index-v2.html` (`index.html` is not in this repo; use `index-v2.html`.)

## Re-run evaluation (PowerShell)

```powershell
Copy-Item .env.example .env
# Set OPENAI_API_KEY in .env
npm install
npm run harness:self-test
npm run smoke:eval -- --bundle RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json
```

## Claim fences

One model (`gpt-5.6-luna`), one domain (appliance-repair scheduling), dense task instructions and fixed tools/schemas. This is not a universal theorem that personas never work in any setting.

## License

- Code and evaluation harness: [MIT License](LICENSE).
- Paper, exam bundle, and related research artifacts in `RESEARCH/`: [Creative Commons Attribution 4.0 International (CC-BY 4.0)](LICENSE-CC-BY-4.0).
