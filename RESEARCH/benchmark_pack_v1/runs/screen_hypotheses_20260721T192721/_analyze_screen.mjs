import fs from "fs";

const rows = JSON.parse(
  fs.readFileSync(
    "RESEARCH/benchmark_pack_v1/runs/screen_hypotheses_20260721T192721/smoke_raw_runs_latest.json",
    "utf8"
  )
);

const INTENT = new Set([
  "new_job",
  "reschedule",
  "cancel",
  "status_check",
  "quote_only",
  "general_question",
  "other",
  "unknown",
]);

function avg(xs) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}
function toks(r) {
  const u = r.token_usage || r.usage || {};
  return (u.input_tokens || u.prompt_tokens || 0) + (u.output_tokens || u.completion_tokens || 0);
}
function lat(r) {
  return r.latency_ms || r.latency?.total_ms || 0;
}

for (const s of ["A1_task", "S_max", "S_min", "S_schema_thin", "S_outcome", "S_pos"]) {
  const list = rows.filter((r) => r.prompt_style === s);
  console.log(
    s,
    "n",
    list.length,
    "avgTok",
    avg(list.map(toks)).toFixed(0),
    "avgLatMs",
    avg(list.map(lat)).toFixed(0)
  );
}

const thin = rows.filter((r) => r.prompt_style === "S_schema_thin");
let badIntent = 0;
let badResp = 0;
for (const r of thin) {
  const f = r.parsed_semantic_fields || r.final_output_json || {};
  if (f.intent && !INTENT.has(String(f.intent))) badIntent += 1;
  if (f.customer_response && !String(f.customer_response).startsWith("sorry") && !String(f.customer_response).includes("booking") && f.customer_response.length > 60) {
    // rough freeform detector; also count non-canonical via length/novelty
  }
  const canonish = [
    "sorry, I can only help with new booking requests",
    "What is your zip code?",
    "What type of unit do you need service for?",
    "sorry, we can't service this area",
    "sorry, we can't service this unit",
    "sorry, no booking times are available right now",
    "sorry, no valid future booking times are available",
    "we can continue with scheduling",
    "available booking times were found",
    "a valid booking time is available",
    "your booking is confirmed",
    "sorry, I couldn't complete the booking",
  ];
  if (f.customer_response && !canonish.includes(f.customer_response)) badResp += 1;
}
console.log("S_schema_thin badIntent", badIntent, "nonCanonicalResp", badResp, "of", thin.length);

const a1 = rows.filter((r) => r.prompt_style === "A1_task" && !r.semantic_pass);
for (const r of a1) {
  console.log("A1 fail", r.case_id, JSON.stringify(r.semantic_mismatches));
}

// prompt length chars
for (const s of ["A1_task", "S_min", "S_max", "S_schema_thin", "S_schema_dup", "S_proc", "S_outcome"]) {
  const r = rows.find((x) => x.prompt_style === s && x.task_family === "F5_full_flow");
  console.log("promptChars", s, (r?.system_prompt || "").length);
}
