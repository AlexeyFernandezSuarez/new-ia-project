---
description: SDD · Generate the technical plan for an approved spec
agent: plan
---

Read `AGENTS.md`, `MEMORY.md`, `specs/constitution/`, `specs/features/$1/spec.md` and `specs/features/$1/clarification.md`. Apply the `sdd` skill (`.agents/skills/sdd/SKILL.md`).

DO NOT write code.

$ARGUMENTS

Generate `specs/features/$1/plan.md` with:
- Technical summary.
- Files created or modified and each one's responsibility.
- Pure or domain functions: inputs, outputs and edge cases. If dates are involved, `today` as a parameter.
- Algorithm or flow in pseudocode.
- Interface/API and how it is rendered or exposed.
- Justified technical decisions, each with its discarded alternative.
- Test strategy: runner, cases, fixtures and which FR each test covers.
- Risks and mitigations.
- Implementation order.
- Coverage table: FR → where it is covered → test.

Everything must respect the constitution and cover every FR. If the spec is not approved, has open questions or its verdict is `NEEDS CHANGES`, stop and warn me.

Write the plan in English and sync any localized copy.
