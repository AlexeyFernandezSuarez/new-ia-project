---
description: SDD · Implement ONE task, tests first (usage: /sdd-implement 002-name T3)
agent: build
---

Implement ONLY task `$2` from `specs/features/$1/tasks.md`, following `specs/features/$1/plan.md`, `specs/features/$1/spec.md`, `specs/constitution/` and the `sdd` skill (`.agents/skills/sdd/SKILL.md`).

$ARGUMENTS

Before touching code:
1. Read the task, its plan, the spec and the constitution.
2. Check that the task does not depend on another pending task. If it does, stop and warn me.
3. If the task or plan is wrong or impossible, stop and explain. Do not improvise a different solution.

Implementation:
1. Write the tests first and verify that they fail.
2. Write code until they pass.
3. Run the project test runner and show the result.
4. If there are visual changes, verify them with the browser or the relevant MCP, including mobile view when applicable.
5. Mark `$2` as done in `tasks.md` and state which FRs it covers.
6. Update `MEMORY.md` with the state and any decision.
7. If it is the last task, update `validation.md` and the roadmap.

Code and canonical docs are in English. If the project has localized copies, update the affected translations and `docs/i18n.md`.

Then STOP. Do not start the next task.
