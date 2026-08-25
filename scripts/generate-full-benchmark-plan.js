#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";

const DEFAULT_CONFIG =
  "RESEARCH/benchmark_pack_v1/full_set/generator_config_v1.json";
const DEFAULT_OUT =
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

function shallowClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function sumValues(obj) {
  return Object.values(obj).reduce((acc, value) => acc + value, 0);
}

function familyShortName(family) {
  if (family.startsWith("F1")) return "F1";
  if (family.startsWith("F2")) return "F2";
  if (family.startsWith("F3")) return "F3";
  if (family.startsWith("F4")) return "F4";
  if (family.startsWith("F5")) return "F5";
  return "F6";
}

function buildBaseScenarioId(family, branchId) {
  return `${familyShortName(family)}__${branchId}`;
}

function chooseCompatibleModules({
  config,
  family,
  branchId,
  moduleCount,
  usedTagCounts,
}) {
  const catalogEntries = Object.entries(config.module_catalog)
    .filter(([moduleId, module]) => {
      if (!module.compatible_families.includes(family)) return false;
      if (!module.compatible_branch_ids.includes(branchId)) return false;
      return true;
    })
    .map(([moduleId, module]) => ({
      moduleId,
      module,
      unmetPressureScore: (module.pressure_tags || []).reduce((acc, tag) => {
        const target = config.pressure_tag_targets[tag] ?? 0;
        const used = usedTagCounts[tag] ?? 0;
        return acc + Math.max(0, target - used);
      }, 0),
    }))
    .sort((a, b) => {
      if (b.unmetPressureScore !== a.unmetPressureScore) {
        return b.unmetPressureScore - a.unmetPressureScore;
      }
      return a.moduleId.localeCompare(b.moduleId);
    });

  const selected = [];
  const blocked = new Set();
  for (const entry of catalogEntries) {
    if (selected.length >= moduleCount) break;
    if (blocked.has(entry.moduleId)) continue;
    const excludedBySelected = selected.some((item) =>
      (item.module.excludes || []).includes(entry.moduleId)
    );
    if (excludedBySelected) continue;
    const conflictsWithSelected = selected.some((item) =>
      (entry.module.excludes || []).includes(item.moduleId)
    );
    if (conflictsWithSelected) continue;
    selected.push(entry);
    for (const excluded of entry.module.excludes || []) blocked.add(excluded);
  }

  return selected.map((item) => item.moduleId);
}

function preferredModuleCount(config, family, branchId) {
  if (family === "F6_robustness_hard_cases") return 2;
  if (family === "F5_full_flow") return branchId === "booking_success" ? 1 : 2;
  if (family === "F4_select") return branchId === "slot_selected" ? 1 : 2;
  if (family === "F3_partial_flow_b") return branchId === "slots_returned" ? 1 : 2;
  if (family === "F2_partial_flow_a") return branchId === "ready_for_slot_fetch" ? 1 : 2;
  return 1;
}

function buildCasePlan({
  config,
  family,
  branchId,
  caseNumber,
  usedTagCounts,
}) {
  const familyRule = config.family_rules[family];
  const desired = preferredModuleCount(config, family, branchId);
  const candidateCounts = [...familyRule.allowed_module_counts].sort((a, b) => {
    const da = Math.abs(a - desired);
    const db = Math.abs(b - desired);
    if (da !== db) return da - db;
    return b - a;
  });
  let moduleIds = [];
  let chosenCount = null;
  for (const count of candidateCounts) {
    const picked = chooseCompatibleModules({
      config,
      family,
      branchId,
      moduleCount: count,
      usedTagCounts,
    });
    if (picked.length === count) {
      moduleIds = picked;
      chosenCount = count;
      break;
    }
  }
  if (chosenCount === null) {
    throw new Error(
      `Could not select a valid module count for ${family} / ${branchId}`
    );
  }
  const pressureTags = moduleIds.flatMap(
    (moduleId) => config.module_catalog[moduleId].pressure_tags || []
  );

  for (const tag of pressureTags) {
    usedTagCounts[tag] = (usedTagCounts[tag] ?? 0) + 1;
  }

  return {
    case_id: `${familyShortName(family)}_${String(caseNumber).padStart(3, "0")}`,
    task_family: family,
    target_branch_id: branchId,
    base_scenario_id: buildBaseScenarioId(family, branchId),
    module_ids: moduleIds,
    pressure_tags: pressureTags,
    task_variant_id: "base"
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const configPath = args.config ?? DEFAULT_CONFIG;
  const outPath = args.out ?? DEFAULT_OUT;
  const config = JSON.parse(await fs.readFile(configPath, "utf8"));

  const plan = {
    plan_version: "v1",
    source_config_path: configPath,
    bundle_id: config.bundle_id,
    total_tasks: config.total_tasks,
    generated_at: new Date().toISOString(),
    families: {},
    tasks: []
  };

  const usedTagCounts = {};
  let globalCaseCounter = 1;
  for (const [family, allocation] of Object.entries(config.family_allocations)) {
    const familyBranchQuotas = shallowClone(config.branch_quotas[family]);
    const familyTotal = sumValues(familyBranchQuotas);
    if (familyTotal !== allocation) {
      throw new Error(
        `Branch quota mismatch for ${family}: expected ${allocation}, got ${familyTotal}`
      );
    }

    plan.families[family] = [];
    let familyCaseIndex = 1;
    for (const [branchId, count] of Object.entries(familyBranchQuotas)) {
      for (let i = 0; i < count; i += 1) {
        const casePlan = buildCasePlan({
          config,
          family,
          branchId,
          caseNumber: familyCaseIndex,
          usedTagCounts
        });
        casePlan.global_index = globalCaseCounter;
        plan.tasks.push(casePlan);
        plan.families[family].push(casePlan.case_id);
        familyCaseIndex += 1;
        globalCaseCounter += 1;
      }
    }
  }

  plan.derived_pressure_counts = usedTagCounts;

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(plan, null, 2));
  console.log(`Generated full benchmark plan: ${outPath}`);
  console.log(`Total tasks: ${plan.tasks.length}`);
}

main().catch((err) => {
  console.error("Failed to generate full benchmark plan:", err.message || err);
  process.exit(1);
});
