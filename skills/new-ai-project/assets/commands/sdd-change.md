---
description: SDD · New requirement or change: spec first, then plan, tasks and code
agent: plan
---

New requirement or change for `specs/features/$1/`: $ARGUMENTS

Read `specs/features/$1/spec.md`, `clarification.md`, `plan.md`, `tasks.md`, `specs/constitution/` and apply the `sdd` skill (`.agents/skills/sdd/SKILL.md`).

DO NOT touch code.

1. Update `spec.md`: add a new EARS FR or change an existing one, its edge cases and what is out of scope.
2. Update `clarification.md` if the change introduces ambiguity.
3. State which parts of `plan.md` and `tasks.md` would need to change afterwards.
4. Show me the spec diff and wait for my approval.
5. Only with approval, update `plan.md` and `tasks.md`.
6. After that, code is implemented with `/sdd-implement`.

Keep the English document canonical. If the project has localized copies, update them after the English spec is approved and keep `docs/i18n.md` current.

If the change affects the constitution, stop and propose `/sdd-constitution` first.
