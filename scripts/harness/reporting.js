export function safeDiv(num, den) {
  if (!den) return null;
  return num / den;
}

export function aggregate(runRows) {
  const scored = runRows.filter((r) => r.eval_status === "scored");
  const total = runRows.length;
  const jsonValid = scored.filter((r) => r.json_valid).length;
  const schemaValid = scored.filter((r) => r.schema_valid).length;
  const semanticPass = scored.filter((r) => r.semantic_pass).length;
  const exactMatch = scored.filter((r) => r.tool_call_exact_match).length;
  const overAction = scored.filter((r) => r.over_action).length;
  const underAction = scored.filter((r) => r.under_action).length;

  const tp = scored.reduce((acc, r) => acc + (r.tool_counts?.tp ?? 0), 0);
  const fp = scored.reduce((acc, r) => acc + (r.tool_counts?.fp ?? 0), 0);
  const fn = scored.reduce((acc, r) => acc + (r.tool_counts?.fn ?? 0), 0);
  const argCorrect = scored.reduce(
    (acc, r) => acc + (r.tool_counts?.arg_correct ?? 0),
    0
  );

  return {
    total_runs: total,
    scored_runs: scored.length,
    infra_error_runs: runRows.filter((r) => r.eval_status === "infra_error").length,
    eval_unscorable_runs: runRows.filter((r) => r.eval_status === "eval_unscorable")
      .length,
    pass_rate: safeDiv(semanticPass, scored.length),
    json_valid_rate: safeDiv(jsonValid, scored.length),
    schema_valid_rate: safeDiv(schemaValid, scored.length),
    tool_trigger_precision: safeDiv(tp, tp + fp),
    tool_trigger_recall: safeDiv(tp, tp + fn),
    tool_argument_accuracy: safeDiv(argCorrect, tp),
    tool_call_exact_match_rate: safeDiv(exactMatch, scored.length),
    over_action_rate: safeDiv(overAction, scored.length),
    under_action_rate: safeDiv(underAction, scored.length),
  };
}

export function groupByCondition(runRows, keyFn) {
  const groups = new Map();
  for (const row of runRows) {
    const key = keyFn(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  const out = {};
  for (const [k, rows] of groups.entries()) {
    out[k] = aggregate(rows);
  }
  return out;
}

export function fmtRate(v) {
  if (v === null || Number.isNaN(v)) return "n/a";
  return `${(v * 100).toFixed(1)}%`;
}

export function makeMarkdownSummary({
  startedAt,
  finishedAt,
  bundlePath,
  runConfig,
  overall,
  byModel,
  byPromptStyle,
  byMode,
}) {
  const lines = [];
  lines.push("# Smoke Eval Summary");
  lines.push("");
  lines.push(`- Started: ${startedAt}`);
  lines.push(`- Finished: ${finishedAt}`);
  lines.push(`- Bundle: \`${bundlePath}\``);
  lines.push(`- Harness: ${runConfig.harnessMode ?? "multi_turn"}`);
  lines.push(
    `- Models: ${runConfig.models.map((m) => `${m.provider}:${m.model}`).join(", ")}`
  );
  lines.push(`- Prompt styles: ${runConfig.promptStyles.join(", ")}`);
  lines.push(`- Modes: ${runConfig.modes.join(", ")}`);
  lines.push(`- Cases: ${runConfig.caseCount}`);
  lines.push("");
  lines.push("## Overall");
  lines.push("");
  lines.push(`- pass_rate: ${fmtRate(overall.pass_rate)}`);
  lines.push(`- json_valid_rate: ${fmtRate(overall.json_valid_rate)}`);
  lines.push(`- schema_valid_rate: ${fmtRate(overall.schema_valid_rate)}`);
  lines.push(`- tool_trigger_precision: ${fmtRate(overall.tool_trigger_precision)}`);
  lines.push(`- tool_trigger_recall: ${fmtRate(overall.tool_trigger_recall)}`);
  lines.push(`- tool_argument_accuracy: ${fmtRate(overall.tool_argument_accuracy)}`);
  lines.push(`- tool_call_exact_match_rate: ${fmtRate(overall.tool_call_exact_match_rate)}`);
  lines.push(`- over_action_rate: ${fmtRate(overall.over_action_rate)}`);
  lines.push(`- under_action_rate: ${fmtRate(overall.under_action_rate)}`);
  lines.push(
    `- infra_error_runs: ${overall.infra_error_runs}, eval_unscorable_runs: ${overall.eval_unscorable_runs}`
  );
  lines.push("");
  lines.push("## By Model");
  lines.push("");
  for (const [k, v] of Object.entries(byModel)) {
    lines.push(
      `- ${k}: pass ${fmtRate(v.pass_rate)}, exact_tools ${fmtRate(v.tool_call_exact_match_rate)}`
    );
  }
  lines.push("");
  lines.push("## By Prompt Style");
  lines.push("");
  for (const [k, v] of Object.entries(byPromptStyle)) {
    lines.push(
      `- ${k}: pass ${fmtRate(v.pass_rate)}, over_action ${fmtRate(v.over_action_rate)}`
    );
  }
  lines.push("");
  lines.push("## By Mode");
  lines.push("");
  for (const [k, v] of Object.entries(byMode)) {
    lines.push(
      `- ${k}: pass ${fmtRate(v.pass_rate)}, under_action ${fmtRate(v.under_action_rate)}`
    );
  }
  lines.push("");
  return lines.join("\n");
}
