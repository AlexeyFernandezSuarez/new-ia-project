---
description: SDD · Split the plan into small, verifiable tasks
agent: plan
---

From `specs/features/$1/spec.md`, `clarification.md` and `plan.md`, generate `specs/features/$1/tasks.md` following the `sdd` skill (`.agents/skills/sdd/SKILL.md`).

$ARGUMENTS

Rules:
- Small tasks (maximum 20-30 min each), in dependency order.
- Each one lists the FRs it covers and a verifiable `Done when:` line.
- Checkboxes.
- Maximum 10 tasks. If there are more, propose splitting the spec before writing.
- Each task must state whether it depends on another.

Format:

```markdown
- [ ] **T1. Description.** FR-1, FR-2
  - Done when: verifiable check.
  - Estimate: 20-30 min.
  - Depends on: —
```

Do not implement anything. Write the file in English and sync any localized copy. At the end, tell me how many tasks there are and which one is first.
