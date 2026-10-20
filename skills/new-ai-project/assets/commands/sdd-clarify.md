---
description: SDD · Review the spec as QA and write clarification.md (detect only, do not solve)
agent: plan
---

Review `specs/features/$1/spec.md` as a rigorous QA engineer. Read `specs/constitution/` and apply the `sdd` skill (`.agents/skills/sdd/SKILL.md`).

$ARGUMENTS

List, in this order:
1. Remaining ambiguities (requirements that cannot be verified).
2. Contradictions between requirements.
3. Uncovered edge cases.
4. Conflicts with `specs/constitution/principles.md`, `mission.md` or `tech-stack.md`.
5. Requirements that cannot be mapped to a test or an explicit manual check.

Do not propose solutions yet: detect only. Format: numbered list with `file:line` when applicable.

Then write `specs/features/$1/clarification.md` with:
- Ambiguities, contradictions, edge cases, conflicts.
- Decisions already made by the user.
- Blocking questions.
- Verdict: `READY` or `NEEDS CHANGES`.

If blocking questions remain, do not mark the spec as approved. Ask me one at a time before closing the verdict.

Keep the English file canonical and sync any localized copy after writing.
