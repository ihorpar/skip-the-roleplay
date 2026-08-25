#!/usr/bin/env node
import fs from "fs";
import path from "path";

const base =
  "RESEARCH/benchmark_pack_v1/runs/gemini35flashlite_free_tier_v2";

const map = [
  ["F6_robustness_hard_cases", "A1_task", "batch15_f6_a1_gap"],
  ["F6_robustness_hard_cases", "A2_role", "batch16_f6_a2_gap"],
  ["F6_robustness_hard_cases", "A3_comp", "batch03_f6_a3"],
  ["F6_robustness_hard_cases", "S_role_long_pure", "batch04_f6_pure"],
  ["F5_full_flow", "A1_task", "batch05_f5_a1"],
  ["F5_full_flow", "A2_role", "batch06_f5_a2"],
  ["F5_full_flow", "A3_comp", "batch07_f5_a3"],
  ["F5_full_flow", "S_role_long_pure", "batch08_f5_pure"],
  ["F4_select", "A1_task", "batch09_f4_a1"],
  ["F4_select", "A2_role", "batch10_f4_a2"],
  ["F4_select", "A3_comp", "batch11_f4_a3"],
  ["F4_select", "S_role_long_pure", "batch12_f4_pure"],
  [
    "F1_extract,F2_partial_flow_a,F3_partial_flow_b",
    "A1_task",
    "batch13_f123_a1",
  ],
  [
    "F1_extract,F2_partial_flow_a,F3_partial_flow_b",
    "A2_role",
    "batch14_f123_a2",
  ],
  [
    "F1_extract,F2_partial_flow_a,F3_partial_flow_b",
    "A3_comp",
    "batch17_f123_a3_gap",
  ],
  [
    "F1_extract,F2_partial_flow_a,F3_partial_flow_b",
    "S_role_long_pure",
    "batch18_f123_pure_gap",
  ],
];

const byStyle = {};
const byFamilyStyle = {};
const all = [];
let infra = 0;

for (const [, style, id] of map) {
  const rows = JSON.parse(
    fs.readFileSync(path.join(base, id, "smoke_raw_runs_latest.json"), "utf8")
  );
  for (const r of rows) {
    if (r.eval_status === "infra_error" || r.infra_error) {
      infra += 1;
      continue;
    }
    all.push({ ...r, _source_batch: id });
    const fam = r.task_family;
    byStyle[style] ??= { pass: 0, n: 0, schema: 0 };
    byStyle[style].n += 1;
    if (r.semantic_pass) byStyle[style].pass += 1;
    if (r.schema_valid) byStyle[style].schema += 1;
    const k = `${fam}|${style}`;
    byFamilyStyle[k] ??= { pass: 0, n: 0 };
    byFamilyStyle[k].n += 1;
    if (r.semantic_pass) byFamilyStyle[k].pass += 1;
  }
}

const styles = ["A1_task", "A2_role", "A3_comp", "S_role_long_pure"];
const rate = (s) => byStyle[s].pass / byStyle[s].n;

const summary = {
  label: "gemini_3.5_flash_lite_exploratory_r1_glued",
  model: "gemini-3.5-flash-lite",
  mode: "B1_instant",
  repeats: 1,
  status: "exploratory_not_claim",
  harness_note:
    "Final harness: parametersJsonSchema + VALIDATED + responseJsonSchema with optional slot fields + omit prompt lines. Glued from family batches; not a single contiguous job.",
  batch_map: Object.fromEntries(
    map.map(([f, s, id]) => [`${f}::${s}`, id])
  ),
  totals: {
    graded: all.length,
    infra_excluded: infra,
    expected_graded: 480,
  },
  by_style: Object.fromEntries(
    styles.map((s) => [
      s,
      {
        n: byStyle[s].n,
        pass_count: byStyle[s].pass,
        pass_rate: rate(s),
        schema_valid_rate: byStyle[s].schema / byStyle[s].n,
      },
    ])
  ),
  by_family_style: Object.fromEntries(
    Object.entries(byFamilyStyle).map(([k, v]) => [
      k,
      { n: v.n, pass_count: v.pass, pass_rate: v.pass / v.n },
    ])
  ),
  contrasts_point_estimates_pp: {
    "A2-A1": (rate("A2_role") - rate("A1_task")) * 100,
    "A3-A2": (rate("A3_comp") - rate("A2_role")) * 100,
    "A3-A1": (rate("A3_comp") - rate("A1_task")) * 100,
    "pureLong-A1": (rate("S_role_long_pure") - rate("A1_task")) * 100,
  },
};

const outDir = path.join(base, "exploratory_r1_glued");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "glued_summary.json"),
  JSON.stringify(summary, null, 2)
);
fs.writeFileSync(
  path.join(outDir, "glued_raw_runs.json"),
  JSON.stringify(all, null, 2)
);

console.log(
  JSON.stringify(
    {
      totals: summary.totals,
      by_style: summary.by_style,
      contrasts_pp: summary.contrasts_point_estimates_pp,
    },
    null,
    2
  )
);
