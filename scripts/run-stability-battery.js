#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import {
  DEFAULT_BUNDLE_PATH,
  DEFAULT_MODES,
  DEFAULT_PROMPT_STYLES,
} from "./harness/constants.js";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function fmtPct(v) {
  if (v === null || Number.isNaN(v)) return "n/a";
  return `${(v * 100).toFixed(1)}%`;
}

function mean(values) {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdev(values) {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance =
    values.reduce((acc, v) => acc + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

async function runSmokeEval({ models, concurrency, outDir, label }) {
  const args = [
    "scripts/smoke-eval.js",
    "--models",
    models,
    "--concurrency",
    String(concurrency),
    "--out",
    outDir,
  ];
  console.log(`\n[${label}] node ${args.join(" ")}`);

  await new Promise((resolve, reject) => {
    const p = spawn("node", args, { stdio: "inherit" });
    p.on("error", reject);
    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`smoke-eval exit code ${code}`));
    });
  });

  const summaryPath = path.join(outDir, "smoke_summary_latest.json");
  const summary = JSON.parse(await fs.readFile(summaryPath, "utf8"));
  return { summary, summaryPath };
}

function aggregateRuns(entries) {
  const out = {
    repeats: entries.length,
    pass_rate_mean: null,
    pass_rate_std: null,
    exact_match_mean: null,
    exact_match_std: null,
    infra_total: 0,
    unscorable_total: 0,
  };
  if (!entries.length) return out;

  const pass = [];
  const exact = [];
  for (const e of entries) {
    const overall = e.summary?.overall ?? {};
    if (typeof overall.pass_rate === "number") pass.push(overall.pass_rate);
    if (typeof overall.tool_call_exact_match_rate === "number") {
      exact.push(overall.tool_call_exact_match_rate);
    }
    out.infra_total += overall.infra_error_runs ?? 0;
    out.unscorable_total += overall.eval_unscorable_runs ?? 0;
  }
  out.pass_rate_mean = mean(pass);
  out.pass_rate_std = stdev(pass);
  out.exact_match_mean = mean(exact);
  out.exact_match_std = stdev(exact);
  return out;
}

function buildMarkdown(report) {
  const lines = [];
  lines.push("# Stability Battery Report");
  lines.push("");
  lines.push(`- Timestamp: ${report.timestamp}`);
  lines.push(`- Root out dir: \`${report.rootOutDir}\``);
  lines.push("");
  lines.push("## Protocol");
  lines.push("");
  lines.push(`- Prompt styles: ${report.protocol.promptStyles.join(", ")}`);
  lines.push(`- Modes: ${report.protocol.modes.join(", ")}`);
  lines.push(`- Bundle: \`${report.protocol.bundlePath}\``);
  lines.push(`- OpenAI model: ${report.protocol.openaiModel}`);
  lines.push(`- Gemini model: ${report.protocol.geminiModel}`);
  lines.push("");
  lines.push("## Aggregate");
  lines.push("");
  for (const p of report.providers) {
    lines.push(`### ${p.label}`);
    lines.push(
      `- repeats: ${p.aggregate.repeats}, pass_rate: ${fmtPct(
        p.aggregate.pass_rate_mean
      )} (std ${(p.aggregate.pass_rate_std * 100).toFixed(2)} pp)`
    );
    lines.push(
      `- tool_call_exact_match: ${fmtPct(
        p.aggregate.exact_match_mean
      )} (std ${(p.aggregate.exact_match_std * 100).toFixed(2)} pp)`
    );
    lines.push(
      `- infra_total: ${p.aggregate.infra_total}, unscorable_total: ${p.aggregate.unscorable_total}`
    );
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const openaiRepeats = toNumber(args["openai-repeats"], 3);
  // Track 1 v1 is OpenAI-only; Gemini stays available via --gemini-repeats > 0.
  const geminiRepeats = toNumber(args["gemini-repeats"], 0);
  const openaiConcurrency = toNumber(args["openai-concurrency"], 10);
  const geminiConcurrency = toNumber(args["gemini-concurrency"], 1);
  const openaiModel = args["openai-model"] ?? "gpt-5.6-luna";
  const geminiModel = args["gemini-model"] ?? "gemini-3.1-flash-lite-preview";
  const rootOutDir =
    args.out ??
    `RESEARCH/benchmark_pack_v1/runs/stability_battery_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}`;

  await fs.mkdir(rootOutDir, { recursive: true });

  const providers = [
    {
      label: "openai",
      enabled: openaiRepeats > 0,
      repeats: openaiRepeats,
      models: `openai:${openaiModel}`,
      concurrency: openaiConcurrency,
      runs: [],
    },
    {
      label: "gemini",
      enabled: geminiRepeats > 0,
      repeats: geminiRepeats,
      models: `gemini:${geminiModel}`,
      concurrency: geminiConcurrency,
      runs: [],
    },
  ];

  for (const provider of providers) {
    if (!provider.enabled) continue;
    for (let i = 1; i <= provider.repeats; i += 1) {
      const runDir = path.join(rootOutDir, `${provider.label}_r${i}`);
      await fs.mkdir(runDir, { recursive: true });
      const result = await runSmokeEval({
        models: provider.models,
        concurrency: provider.concurrency,
        outDir: runDir,
        label: `${provider.label} repeat ${i}/${provider.repeats}`,
      });
      provider.runs.push({
        repeat: i,
        summaryPath: result.summaryPath,
        summary: result.summary,
      });
    }
    provider.aggregate = aggregateRuns(provider.runs);
  }

  const report = {
    timestamp: new Date().toISOString(),
    rootOutDir,
    protocol: {
      promptStyles: DEFAULT_PROMPT_STYLES,
      modes: DEFAULT_MODES,
      bundlePath: DEFAULT_BUNDLE_PATH,
      openaiModel,
      geminiModel,
    },
    providers,
  };

  const jsonPath = path.join(rootOutDir, "stability_report.json");
  const mdPath = path.join(rootOutDir, "stability_report.md");
  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
  await fs.writeFile(mdPath, buildMarkdown(report));

  console.log("\nStability battery completed.");
  console.log(`Report JSON: ${jsonPath}`);
  console.log(`Report MD: ${mdPath}`);
}

main().catch((err) => {
  console.error("Stability battery failed:", err.message || err);
  process.exit(1);
});
