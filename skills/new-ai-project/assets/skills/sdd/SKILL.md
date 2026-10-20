---
name: sdd
description: Use whenever you work with Spec-Driven Development in this project (specs/ or any file inside specs/): writing, reviewing or changing specs, plans and tasks, or implementing and validating spec tasks. Do not use it for trivial changes without behaviour impact.
---

# Spec-Driven Development (SDD)

## Principle

This project works at the **spec-anchored + spec-as-source** level:

- The specification stays alive (**spec-anchored**).
- Behaviour is defined in the spec and code derives from it (**spec-as-source**).
- No behaviour change is implemented without updating `spec.md` first, then `clarification.md`, `plan.md`, `tasks.md` and, finally, the code.

## Flow

Constitution → Spec → Clarification → Plan → Tasks → Implementation → Validation → Maintenance.

- Never move to the next phase without the user's explicit approval.
- The spec rules: if something is not in the spec, it is not implemented. If a decision is missing, stop and ask.
- A requirement change is made first in the spec, then in the plan and tasks, and finally in the code.
- Each spec lives in `specs/features/NNN-name/` with `spec.md`, `clarification.md`, `plan.md`, `tasks.md` and `validation.md`.
- At the end of each phase, update `MEMORY.md` and, if the state changes, `specs/constitution/roadmap.md`.

## Language

- All canonical Markdown is written in **English**.
- The conversation with the user uses the user's language.
- If the project has localized copies (`*.es.md`, `*.pt-BR.md`, ...), update the English source first, then mirror the change, and refresh `docs/i18n.md`.
- Keep identifiers, paths, commands, status tokens, ADR numbers and EARS keywords in English inside translations for traceability.
- Never declare a translation current if its English source changed afterwards.

## Artifacts

### `spec.md`
Describes the **what** and **why**. No stack, architecture or file names.

Sections: context and goal, users, user stories, definitions, functional requirements, non-functional requirements, edge cases, out of scope, completion criteria, open questions.

### `clarification.md`
QA review: ambiguities, contradictions, uncovered edge cases, conflicts with the constitution, decisions taken and verdict. Detect only; do not propose solutions until the user asks.

### `plan.md`
How it is built: files and responsibilities, pure functions, algorithm, interface/API, decisions with discarded alternative, test strategy, risks, implementation order and FR coverage.

### `tasks.md`
Small tasks (20-30 min), in dependency order, with the FRs they cover and a verifiable `Done when:` line. Maximum 10 tasks; if there are more, propose splitting the spec.

### `validation.md`
FR → test/evidence → result matrix, manual checks, completion criteria, out-of-scope files and verdict.

## EARS requirements

- `WHEN <event>, THE SYSTEM SHALL <response>.`
- `IF <undesired condition>, THEN THE SYSTEM SHALL <response>.`
- `WHILE <state>, THE SYSTEM SHALL <response>.`
- `THE SYSTEM SHALL <permanent behaviour>.`

Every requirement must be verifiable. No "fast", "nice" or "intuitive" without a measurable criterion.

## Implementation

- One task at a time.
- Tests first (red), then code.
- Run the project runner and show the result.
- Mark the task in `tasks.md`, state which FRs it covers and **stop**. Do not start the next one.
- If the task or plan is wrong or impossible, stop and explain. Do not improvise a different solution.
- If it is the last task of the spec, update `MEMORY.md` and `validation.md`.
- Update localized copies of any document you changed.

## Validation

- Walk the spec FR by FR.
- For each FR: which test covers it and the result.
- UI requirements that cannot be automated must be verified with the browser or the relevant MCP (including mobile view when applicable).
- If any FR is uncovered or failing, say so clearly. Do not fix anything yet.
- Verdict: `APPROVED` or `CHANGES REQUIRED`.

## Response format

- Paths of created or modified files.
- Summary of at most 5 lines.
- Decisions the user must review.
- Exact next step, with the `/sdd-*` command to run.
