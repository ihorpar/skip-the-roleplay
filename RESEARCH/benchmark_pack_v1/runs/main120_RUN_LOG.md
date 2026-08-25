# Main 120 run log

**Pack:** `RESEARCH/benchmark_pack_v1/full_120/full_120_bundle_v1.json` (audited)  
**Model:** `openai:gpt-5.6-luna`  
**Matrix per plan:** A1/A2/A3 × B1/B2 × **3 repeats**  
**Prompt:** post–failure-analysis clarifications + Structured Outputs enums  

## Pre-main fixes from rehearsal analysis
- Clarified caller vs booking-person for `booking_name`
- Never book non-future slots; stop cleanly when none remain
- `other_type`: still call `service_check`, never `check_slots`
- Fail-cluster re-probe (5 hard cases × A1–A3 × B1): **80%** pass (was near-zero on those cells)

## Repeat folders
- r1: `main120_r1_20260721T1725` — pass **92.5%**, infra 0
- r2: `main120_r2_20260721T1742` — pass **93.1%**, infra 0
- r3: `main120_r3_20260721T1758` — pass **92.6%**, infra 0

## Analysis
- `main120_analysis_v1.json`
- `main120_FINDINGS_2026-07-21.md` (claim-ready writeup)
