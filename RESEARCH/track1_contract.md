# Track 1 Contract  
**Locked research contract for prompting study**

## The Goal
We want to know:

**Does telling an AI to act in a certain role actually help it perform better? Or is it better to simply give clear instructions about the job?**

This contract locks the core design of Track 1 so the study does not drift while tasks, prompts, tools, and evaluation are being built.

---

## The Main Question
We are testing whether adding **role framing** and **role + competencies framing** changes performance compared with **task-only prompting**, and whether that effect changes between:

- **instant mode** - no reasoning tokens
- **thinking mode** - reasoning enabled

---

## What We Compare

### Prompt style
We compare three prompt styles:

#### A1 - Task only
The prompt explains the job, the rules, and what counts as success.  
It does **not** give the AI a role.

#### A2 - Role
The same task prompt, plus a role.  
Example: “You are a scheduling agent for an appliance repair company.”

#### A3 - Role + Competencies
The same task prompt, plus a role and a short list of relevant competencies.

### Important note
This design lets us compare:

- **A2 vs A1** - effect of adding a role
- **A3 vs A2** - effect of adding competencies on top of a role
- **A3 vs A1** - effect of adding the full role + competencies bundle

This design does **not** isolate the effect of competencies without a role.

---

## Two Modes

### B1 - Instant mode
The model answers without reasoning tokens.

### B2 - Thinking mode
The model uses reasoning tokens before answering.

### Provider note
The exact setup differs by provider.  
We must document the exact settings used for each provider.

For reasoning-capable models, **thinking mode uses medium effort**.

For instant mode, we use the provider setting that prevents reasoning-token output when possible.

Adapter compatibility nuance (current harness):
- For `gpt-5.4-mini`, `temperature` is sent only in `B1_instant` (`reasoning.effort = none`).
- For `B2_thinking` (`reasoning.effort = medium`), `temperature` is omitted.

---

## What Kind of Work We Test
We test realistic multi-step work based on an appliance-repair scheduling workflow.

The workflow can involve:

- extracting information from messy user input
- deciding whether the request should continue
- using tools
- choosing the correct timeslot
- completing the full workflow correctly

---

## Locked Task Families
Track 1 uses **6 task families**.

### 1. Extract
Input is messy user text.

The model must extract:
- booking name
- intent
- zip code
- unit type
- unit class

No tools are used.

---

### 2. Partial Flow A - Extract + Gate + Service Check
Input is messy user text.

The model must:
- extract the needed fields
- decide whether the request should continue
- call `service_check` only if allowed
- stop correctly if the intent should not continue
- stop correctly if the serviceability result is false

---

### 3. Partial Flow B - Extract + Gate + Service Check + Slot Fetch
Input is messy user text.

The model must:
- extract the needed fields
- decide whether the request should continue
- call `service_check` only if allowed
- call `check_slots` only if serviceability succeeds
- handle “busy” correctly
- handle returned slot arrays correctly

---

### 4. Select
Input is messy user text.

The model must:
- extract the needed fields
- decide whether the request should continue
- call `service_check` only if allowed
- call `check_slots` only if serviceability succeeds
- exclude all slots that are already in the past
- exclude slots equal to current local datetime
- choose the earliest valid future slot
- preserve the exact `slot_id`
- respond correctly if no valid future slots remain

This family uses a synthetic fixed **current local datetime** provided by the task instance.
It must not use wall-clock time from the run itself.

---

### 5. Full Flow
Input is messy user text.

The model must complete the whole chain:
- extract
- gate
- service check
- slot fetch
- select
- book when warranted

It must not book unless every prior step succeeded, and it must not claim confirmation unless `book_slot` succeeds.

---

### 6. Robustness / Hard Cases Flow
This uses the same overall workflow as Full Flow, but is built specifically around stronger traps and harder conditions.

Examples of hard cases include:
- conflicting details
- corrections later in the text
- irrelevant chatter
- excluded-intent distractions
- similar IDs
- messy slot outputs
- slots provided unsorted and randomly

---

## Robustness scope
Families 1 to 5 are the standard benchmark families.
Family 6 is the dedicated robustness / hard-cases family.

Family 6 contains controlled complications such as:
- outdated or conflicting details
- later corrections
- distracting irrelevant information
- unsupported user assumptions
- similar IDs
- empty or partial tool results

---

## Core Fields and Rules

### Extracted fields
The workflow may require these fields:
- `booking_name`
- `intent`
- `zip_code`
- `unit_type`
- `unit_class`

`booking_name` means the first name of the person the appointment should be booked under.
It may differ from the caller's name.

Allowed `unit_class` values are:
- `residential`
- `commercial`
- `unknown`

Allowed `unit_type` values are:
- `washer`
- `dryer`
- `refrigerator`
- `dishwasher`
- `oven_range`
- `microwave`
- `other_type`
- `unknown`

### Intent rule
Only `new_job` continues into the operational flow.

Other intents must **not** trigger `service_check`, `check_slots`, or `book_slot`.

### Tool rules
The workflow uses these tools:

- `service_check(zip_code, unit_type, unit_class)` -> returns serviceable true/false plus failure reason when not serviceable
- `check_slots(zip_code, unit_type, unit_class)` -> returns either busy or an array of slots
- `book_slot(booking_name, slot_id, date_time)` -> attempts booking

Every tool argument must have a concise schema description.
For `booking_name`, the description must say that it is the first name of the person the appointment should be booked under, and may differ from the caller's name.

### Customer response rule
F2-F6 outputs must include `customer_response`.

This is a closed-set exact-match field, not free-form prose.
The expected response is stored in gold and must be returned exactly.

Missing required information is a clarification branch, not a silent stop.

If a required field is missing, the model must not call the dependent tool and must return the exact missing-field question from gold:
- missing `zip_code` -> `What is your zip code?`
- missing `unit_type` -> `What type of unit do you need service for?`

### Slot rule
For selection:
- past slots must be excluded
- among valid future slots, the earliest one must be chosen

---

## Primary Outcome

### Task Success Rate
This is the main metric.

A run counts as a **pass** only if it fully satisfies the rubric for that task family.

That means the run must get all required decisions, actions, tool use, ordering, structured output, and canonical `customer_response` correctness right for that family.

If any required part is wrong, the run is a **fail**.

---

## Secondary Metrics
These metrics are locked for Track 1.

### 1. Extraction Accuracy
Used for families where extraction is part of the task.

What it measures:
- whether the model extracted the required fields correctly

What it gives us:
- whether errors begin at the input-understanding stage

Typical calculation:
- per-field accuracy
- and/or all-required-fields-correct rate

---

### 2. Tool-Call Correctness
Used for families that require tool use.

What it measures:
- whether the model made the right tool call
- at the right time
- with the right arguments

What it gives us:
- whether the model can actually operate the workflow correctly

Typical calculation:
- fully correct tool events / total applicable tool events

We also log argument-level correctness for debugging and later analysis.

---

### 3. Sequence Correctness
Used where order matters.

What it measures:
- whether the model used tools in the correct order

What it gives us:
- whether the model followed the process correctly

Typical calculation:
- runs with correct order / applicable runs

---

### 4. Selection Correctness
Used for Select and flow families that include slot selection.

What it measures:
- whether the model excluded past slots
- chose the earliest valid future slot
- preserved the correct `slot_id`
- rendered the result correctly for the user

What it gives us:
- whether the model can reason correctly over tool outputs

Typical calculation:
- correct selections / applicable runs

---

### 5. Hallucinated Success Rate
What it measures:
- how often the model claims success when success did not actually happen

Examples:
- says the request is serviceable when tool output says false
- says a booking succeeded when it did not
- invents a slot or confirmation

What it gives us:
- an important reliability and safety signal

Typical calculation:
- runs with fake success claims / total runs

---

### 6. Cost per Run
What it measures:
- how expensive each run is

Typical calculation:
- provider billing based on input tokens, output tokens, reasoning tokens where applicable, and any tracked tool cost

What it gives us:
- whether performance gains are worth the cost

---

### 7. Latency per Run
What it measures:
- how long each run takes from start to finish

Typical calculation:
- wall-clock time per run

What it gives us:
- whether any quality gain comes with a practical speed penalty

---

## What Stays Constant
To keep the comparison fair, the following must stay fixed across A1, A2, and A3:

- task instances
- task-family definitions
- tool schemas
- tool descriptions
- output rules
- evaluation logic
- scaffolding outside the tested role block
- decoding settings where applicable
- maximum output settings
- aggregation rules
- repeat policy
- current datetime injection rule
- logging fields

### Core rule
Across A1, A2, and A3, the **only intended prompt difference** is the role / competencies block under test.

### Canonical prompt placement
The tested role / competencies block must be inserted in the system prompt.

All non-tested scaffold content must stay fixed across A1, A2, and A3.

---

## What Counts as a Valid Comparison
The same task instance must be run across all prompt and mode combinations.

That means the design compares the same task under:

- A1 + B1
- A2 + B1
- A3 + B1
- A1 + B2
- A2 + B2
- A3 + B2

This keeps task variation from distorting the comparison.

---

## Threats to Validity
The main risks to validity are:

- changing more than the tested role block
- evaluator bias
- benchmark design bias
- differences across providers in how thinking mode works
- relying too heavily on one workflow type
- random output variation across runs

These risks do not cancel the study, but they must be acknowledged and controlled where possible.

---

## Pilot Success Criteria
The pilot is considered successful if:

- the evaluator works reliably on pilot tasks
- the harness logs complete traces
- per-family scoring works in practice
- most failures fit the failure taxonomy
- cost and latency can be measured reliably
- the study can move into larger-scale runs without redesigning the contract

---

## Failure Taxonomy
Failures should be labeled using these top-level buckets:

- extraction failure
- gating failure
- tool-trigger failure
- tool-argument failure
- sequencing failure
- selection failure
- hallucination failure
- customer-response failure
- robustness failure

More detailed subcodes can live in the evaluation spec.

---

## Change Control
After this contract is locked, the following should not be changed casually:

- the main question
- the prompt conditions
- the two modes
- the task families
- the primary outcome
- the locked secondary metrics
- the constants that must stay fixed

If any of these must change, the change must be written down as an explicit amendment with:
- date
- reason
- exact change made

---

## Simple Glossary

### Role framing
Telling the AI who it is supposed to be.

### Competencies
A short list of relevant capabilities declared in the prompt.

### Instant mode
A setup where the model answers without reasoning tokens.

### Thinking mode
A setup where the model uses reasoning tokens before answering.

### Task family
A group of tasks that test one type of behavior or one part of the workflow.

### Task instance
One concrete test case.

### Tool-call correctness
Whether the right tool was called at the right time with the right inputs.

### Sequence correctness
Whether the steps happened in the right order.

### Hallucinated success
A case where the model claims something succeeded when it did not.

---

## Status
**This contract is locked for Track 1.**
