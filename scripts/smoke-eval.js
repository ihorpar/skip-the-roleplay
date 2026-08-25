#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import {
  DEFAULT_BUNDLE_PATH,
  DEFAULT_MODES,
  DEFAULT_OUT_DIR,
  DEFAULT_PROMPT_STYLES,
} from "./harness/constants.js";
import {
  loadEnvFile,
  parseArgs,
  parseCsv,
  parseModels,
  runWithConcurrency,
} from "./harness/cli.js";
import { runMultiTurnInference } from "./harness/executor.js";
import { runLegacySingleShot } from "./harness/legacy-single-shot.js";
import {
  aggregate,
  fmtRate,
  groupByCondition,
  makeMarkdownSummary,
} from "./harness/reporting.js";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await loadEnvFile();

  const bundlePath = args.bundle ?? DEFAULT_BUNDLE_PATH;
  const outDir = args.out ?? DEFAULT_OUT_DIR;
  const promptStyles = parseCsv(args.styles);
  const modes = parseCsv(args.modes);
  const models = parseModels(args.models);
  const families = new Set(parseCsv(args.families));
  const caseIds = new Set(parseCsv(args["case-ids"]));
  const legacy = Boolean(args["legacy-single-shot"]);
  const defaultConcurrency = legacy ? 2 : 1;
  const concurrency = Number(args.concurrency ?? String(defaultConcurrency));

  const selectedPromptStyles = promptStyles.length ? promptStyles : DEFAULT_PROMPT_STYLES;
  const selectedModes = modes.length ? modes : DEFAULT_MODES;
  const harnessMode = legacy ? "legacy_single_shot" : "multi_turn";

  if (legacy) {
    console.warn(
      "WARNING: --legacy-single-shot uses confounded prompts (mode/style text in system prompt, fixtures in user prompt). Not valid for experimental comparisons."
    );
  }

  if (models.some((m) => m.provider === "openai") && !process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for openai runs");
  }
  if (models.some((m) => m.provider === "gemini") && !process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required for gemini runs");
  }

  const bundleRaw = await fs.readFile(bundlePath, "utf8");
  const bundle = JSON.parse(bundleRaw);
  let cases = Array.isArray(bundle.cases) ? bundle.cases : [];
  if (families.size > 0) {
    cases = cases.filter((c) => families.has(c.task?.task_family));
  }
  if (caseIds.size > 0) {
    cases = cases.filter((c) => caseIds.has(c.case_id));
  }
  if (args.limit) {
    const n = Number(args.limit);
    if (Number.isFinite(n) && n > 0) cases = cases.slice(0, n);
  }
  if (!cases.length) throw new Error("No cases selected");

  const jobs = [];
  for (const taskCase of cases) {
    for (const model of models) {
      for (const style of selectedPromptStyles) {
        for (const mode of selectedModes) {
          jobs.push({
            taskCase,
            provider: model.provider,
            model: model.model,
            promptStyle: style,
            modeCondition: mode,
          });
        }
      }
    }
  }

  const runFn = legacy ? runLegacySingleShot : runMultiTurnInference;

  console.log(
    `Running smoke eval (${harnessMode}): ${jobs.length} runs (${cases.length} cases × ${models.length} models × ${selectedPromptStyles.length} styles × ${selectedModes.length} modes)`
  );

  const startedAt = new Date().toISOString();
  let completed = 0;
  const rows = await runWithConcurrency(jobs, concurrency, async (job) => {
    const row = await runFn(job);
    completed += 1;
    if (completed % 5 === 0 || completed === jobs.length) {
      console.log(`Progress: ${completed}/${jobs.length}`);
    }
    return row;
  });
  const finishedAt = new Date().toISOString();

  const overall = aggregate(rows);
  const byModel = groupByCondition(rows, (r) => `${r.provider}:${r.model}`);
  const byPromptStyle = groupByCondition(rows, (r) => r.prompt_style);
  const byMode = groupByCondition(rows, (r) => r.mode_condition);

  await fs.mkdir(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runsPath = path.join(outDir, `smoke_raw_runs_${stamp}.json`);
  const summaryPath = path.join(outDir, `smoke_summary_${stamp}.json`);
  const markdownPath = path.join(outDir, `smoke_summary_${stamp}.md`);
  const latestRunsPath = path.join(outDir, "smoke_raw_runs_latest.json");
  const latestSummaryPath = path.join(outDir, "smoke_summary_latest.json");
  const latestMarkdownPath = path.join(outDir, "smoke_summary_latest.md");

  const summaryPayload = {
    started_at: startedAt,
    finished_at: finishedAt,
    bundle_path: bundlePath,
    run_config: {
      harnessMode,
      models,
      promptStyles: selectedPromptStyles,
      modes: selectedModes,
      caseCount: cases.length,
      runCount: rows.length,
      concurrency,
    },
    overall,
    by_model: byModel,
    by_prompt_style: byPromptStyle,
    by_mode: byMode,
  };

  await fs.writeFile(runsPath, JSON.stringify(rows, null, 2));
  await fs.writeFile(summaryPath, JSON.stringify(summaryPayload, null, 2));
  const markdown = makeMarkdownSummary({
    startedAt,
    finishedAt,
    bundlePath,
    runConfig: summaryPayload.run_config,
    overall,
    byModel,
    byPromptStyle,
    byMode,
  });
  await fs.writeFile(markdownPath, `${markdown}\n`);

  await fs.copyFile(runsPath, latestRunsPath);
  await fs.copyFile(summaryPath, latestSummaryPath);
  await fs.copyFile(markdownPath, latestMarkdownPath);

  console.log("");
  console.log("Smoke eval completed.");
  console.log(`Runs: ${runsPath}`);
  console.log(`Summary: ${summaryPath}`);
  console.log(`Summary (MD): ${markdownPath}`);
  console.log(
    `pass_rate=${fmtRate(overall.pass_rate)} | exact_tool=${fmtRate(overall.tool_call_exact_match_rate)}`
  );
}

main().catch((err) => {
  console.error("Smoke eval failed:", err.message || err);
  process.exit(1);
});
