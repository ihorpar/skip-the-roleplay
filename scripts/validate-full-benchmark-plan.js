#!/usr/bin/env node

import fs from "fs/promises";

const DEFAULT_CONFIG =
  "RESEARCH/benchmark_pack_v1/full_set/generator_config_v1.json";
const DEFAULT_PLAN =
  "RESEARCH/benchmark_pack_v1/full_set/full_bundle_plan_v1.json";

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

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = JSON.parse(await fs.readFile(args.config ?? DEFAULT_CONFIG, "utf8"));
  const plan = JSON.parse(await fs.readFile(args.plan ?? DEFAULT_PLAN, "utf8"));

  const errors = [];

  if (plan.tasks.length !== config.total_tasks) {
    errors.push(
      `total task count mismatch: expected ${config.total_tasks}, got ${plan.tasks.length}`
    );
  }

  const familyCounts = countBy(plan.tasks, (task) => task.task_family);
  for (const [family, expected] of Object.entries(config.family_allocations)) {
    const actual = familyCounts[family] ?? 0;
    if (actual !== expected) {
      errors.push(`family allocation mismatch for ${family}: expected ${expected}, got ${actual}`);
    }
  }

  for (const [family, branchQuota] of Object.entries(config.branch_quotas)) {
    const tasks = plan.tasks.filter((task) => task.task_family === family);
    const branchCounts = countBy(tasks, (task) => task.target_branch_id);
    for (const [branchId, expected] of Object.entries(branchQuota)) {
      const actual = branchCounts[branchId] ?? 0;
      if (actual !== expected) {
        errors.push(
          `branch quota mismatch for ${family}/${branchId}: expected ${expected}, got ${actual}`
        );
      }
    }
  }

  for (const task of plan.tasks) {
    const familyRule = config.family_rules[task.task_family];
    if (!familyRule) {
      errors.push(`unknown family in plan: ${task.task_family}`);
      continue;
    }
    if (!familyRule.allowed_branch_ids.includes(task.target_branch_id)) {
      errors.push(
        `branch ${task.target_branch_id} not allowed for family ${task.task_family} in ${task.case_id}`
      );
    }
    if (!familyRule.allowed_module_counts.includes(task.module_ids.length)) {
      errors.push(
        `module count ${task.module_ids.length} not allowed for ${task.case_id}`
      );
    }

    const seen = new Set();
    for (const moduleId of task.module_ids) {
      const module = config.module_catalog[moduleId];
      if (!module) {
        errors.push(`unknown module ${moduleId} in ${task.case_id}`);
        continue;
      }
      if (!module.compatible_families.includes(task.task_family)) {
        errors.push(`module ${moduleId} incompatible with family ${task.task_family} in ${task.case_id}`);
      }
      if (!module.compatible_branch_ids.includes(task.target_branch_id)) {
        errors.push(`module ${moduleId} incompatible with branch ${task.target_branch_id} in ${task.case_id}`);
      }
      for (const excluded of module.excludes || []) {
        if (seen.has(excluded)) {
          errors.push(`module conflict ${moduleId} vs ${excluded} in ${task.case_id}`);
        }
      }
      seen.add(moduleId);
    }
  }

  const derivedTagCounts = countBy(
    plan.tasks.flatMap((task) => task.pressure_tags || []),
    (tag) => tag
  );
  const warnings = [];
  for (const [tag, target] of Object.entries(config.pressure_tag_targets || {})) {
    const actual = derivedTagCounts[tag] ?? 0;
    if (actual !== target) {
      warnings.push(
        `pressure tag target mismatch for ${tag}: target ${target}, actual ${actual}`
      );
    }
  }

  if (errors.length) {
    console.error("Plan validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log("Plan validation passed.");
  console.log(`Tasks: ${plan.tasks.length}`);
  if (warnings.length) {
    console.log("Pressure tag warnings:");
    for (const warning of warnings) console.log(`- ${warning}`);
  }
}

main().catch((err) => {
  console.error("Plan validation failed:", err.message || err);
  process.exit(1);
});
