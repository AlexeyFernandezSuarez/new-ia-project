---
description: SDD · Validate the spec FR by FR (tests + manual checks)
agent: build
---

Walk through `specs/features/$1/spec.md` requirement by requirement. Read `tasks.md`, `plan.md`, `validation.md`, `specs/constitution/` and the `sdd` skill (`.agents/skills/sdd/SKILL.md`).

$ARGUMENTS

For each FR:
1. State which test covers it and the result of running it with the project runner.
2. If there is no test, state which manual check covers it.
3. UI requirements that cannot be automated must be verified with the browser or the relevant MCP, including mobile view when applicable.

Then:
- Check the completion criteria.
- Check that no out-of-scope files were touched.
- Check that the project still starts.
- Write `specs/features/$1/validation.md` with the FR → evidence → result matrix, manual checks, criteria and verdict.
- Update `MEMORY.md` and the status in `roadmap.md`.

If any FR is uncovered or failing, say so clearly. Do NOT fix anything yet.

Write the validation in English and sync any localized copy. Final verdict: `APPROVED` or `CHANGES REQUIRED`.
