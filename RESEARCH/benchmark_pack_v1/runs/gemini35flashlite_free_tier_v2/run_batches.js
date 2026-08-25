#!/usr/bin/env node
/**
 * Gemini free-tier batch runner — hardest families first, spaced API calls.
 *
 * Usage:
 *   node run_batches.js              # run all pending batches (stops on infra blow-up)
 *   node run_batches.js --day 1      # only day-1 batches
 *   node run_batches.js --only batch01_f6_a1
 */

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../..");
const OUT_ROOT = __dirname;
const BUNDLE =
  "RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json";
const COOLDOWN_MS = Number(process.env.GEMINI_BATCH_COOLDOWN_MS || 180_000);
const INFRA_ABORT_RATE = 0.1;

const BATCHES = [
  { id: "batch01_f6_a1", day: 1, families: "F6_robustness_hard_cases", styles: "A1_task" },
  { id: "batch02_f6_a2", day: 1, families: "F6_robustness_hard_cases", styles: "A2_role" },
  { id: "batch03_f6_a3", day: 2, families: "F6_robustness_hard_cases", styles: "A3_comp" },
  { id: "batch04_f6_pure", day: 2, families: "F6_robustness_hard_cases", styles: "S_role_long_pure" },
  { id: "batch05_f5_a1", day: 3, families: "F5_full_flow", styles: "A1_task" },
  { id: "batch06_f5_a2", day: 3, families: "F5_full_flow", styles: "A2_role" },
  { id: "batch07_f5_a3", day: 4, families: "F5_full_flow", styles: "A3_comp" },
  { id: "batch08_f5_pure", day: 4, families: "F5_full_flow", styles: "S_role_long_pure" },
  { id: "batch09_f4_a1", day: 5, families: "F4_select", styles: "A1_task" },
  { id: "batch10_f4_a2", day: 5, families: "F4_select", styles: "A2_role" },
  { id: "batch11_f4_a3", day: 6, families: "F4_select", styles: "A3_comp" },
  { id: "batch12_f4_pure", day: 6, families: "F4_select", styles: "S_role_long_pure" },
  { id: "batch13_f123_a1", day: 7, families: "F1_extract,F2_partial_flow_a,F3_partial_flow_b", styles: "A1_task" },
  { id: "batch14_f123_a2", day: 7, families: "F1_extract,F2_partial_flow_a,F3_partial_flow_b", styles: "A2_role" },
  // Claim r1 gap-fill on final harness (optional slot schema + omit prompt)
  { id: "batch15_f6_a1_gap", day: 8, families: "F6_robustness_hard_cases", styles: "A1_task" },
  { id: "batch16_f6_a2_gap", day: 8, families: "F6_robustness_hard_cases", styles: "A2_role" },
  { id: "batch17_f123_a3_gap", day: 8, families: "F1_extract,F2_partial_flow_a,F3_partial_flow_b", styles: "A3_comp" },
  { id: "batch18_f123_pure_gap", day: 8, families: "F1_extract,F2_partial_flow_a,F3_partial_flow_b", styles: "S_role_long_pure" },
];

function parseArgs(argv) {
  const out = { day: null, only: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--day" && argv[i + 1]) {
      out.day = Number(argv[++i]);
    } else if (argv[i] === "--only" && argv[i + 1]) {
      out.only = new Set(argv[++i].split(",").map((s) => s.trim()).filter(Boolean));
    }
  }
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runSmokeEval(batch) {
  const outDir = path.join(OUT_ROOT, batch.id);
  const args = [
    "scripts/smoke-eval.js",
    "--bundle",
    BUNDLE,
    "--families",
    batch.families,
    "--models",
    "gemini:gemini-3.5-flash-lite",
    "--styles",
    batch.styles,
    "--modes",
    "B1_instant",
    "--concurrency",
    "1",
    "--out",
    path.relative(REPO_ROOT, outDir).replace(/\\/g, "/"),
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: REPO_ROOT,
      env: {
        ...process.env,
        GEMINI_MIN_INTERVAL_MS: process.env.GEMINI_MIN_INTERVAL_MS || "4500",
      },
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${batch.id} exited with code ${code}`));
    });
  });
}

async function readLatestSummary(batchId) {
  const summaryPath = path.join(OUT_ROOT, batchId, "smoke_summary_latest.json");
  try {
    const raw = await fs.readFile(summaryPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function isBatchDone(batchId) {
  const summary = await readLatestSummary(batchId);
  if (!summary?.overall) return false;
  const { total_runs, scored_runs, infra_error_runs } = summary.overall;
  return total_runs > 0 && scored_runs + infra_error_runs === total_runs;
}

async function main() {
  const { day, only } = parseArgs(process.argv.slice(2));
  let selected = BATCHES;
  if (day) selected = selected.filter((b) => b.day === day);
  if (only) selected = selected.filter((b) => only.has(b.id));

  if (!selected.length) {
    console.error("No batches selected.");
    process.exit(1);
  }

  console.log(`Gemini free-tier runner: ${selected.length} batch(es) queued`);
  console.log(`Cooldown between batches: ${COOLDOWN_MS / 1000}s`);

  for (let i = 0; i < selected.length; i += 1) {
    const batch = selected[i];
    if (await isBatchDone(batch.id)) {
      console.log(`\n[skip] ${batch.id} already complete`);
      continue;
    }

    if (i > 0) {
      console.log(`\n[cooldown] waiting ${COOLDOWN_MS / 1000}s before ${batch.id}...`);
      await sleep(COOLDOWN_MS);
    }

    console.log(`\n[run] ${batch.id} — ${batch.families} × ${batch.styles}`);
    const started = Date.now();
    await runSmokeEval(batch);
    const elapsedMin = ((Date.now() - started) / 60000).toFixed(1);

    const summary = await readLatestSummary(batch.id);
    const overall = summary?.overall ?? {};
    const infraRate =
      overall.total_runs > 0
        ? (overall.infra_error_runs ?? 0) / overall.total_runs
        : 0;

    console.log(
      `[done] ${batch.id} in ${elapsedMin} min — pass=${((overall.pass_rate ?? 0) * 100).toFixed(1)}% schema=${((overall.schema_valid_rate ?? 0) * 100).toFixed(1)}% infra=${((infraRate) * 100).toFixed(1)}%`
    );

    if (infraRate > INFRA_ABORT_RATE) {
      console.error(
        `\n[abort] ${batch.id} infra rate ${(infraRate * 100).toFixed(1)}% > ${INFRA_ABORT_RATE * 100}% — stop for today (RPD/RPM). Resume tomorrow with --day ${batch.day} or --only ${selected.slice(i + 1).map((b) => b.id).join(",")}`
      );
      process.exit(2);
    }
  }

  console.log("\n[complete] all selected batches finished.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
