---
description: SDD · Propose or review the project constitution (mission, roadmap, stack and principles)
agent: plan
---

We are going to create or review the project constitution. Read `AGENTS.md`, `MEMORY.md`, `specs/README.md` and, if it exists, `specs/constitution/`. Apply the `sdd` skill (`.agents/skills/sdd/SKILL.md`).

Additional context: $ARGUMENTS

Your job:
1. If there is no constitution, propose these four pieces:
   - `specs/constitution/mission.md`: what the project is, who it is for, problem, value proposition, non-goals, metrics and tone.
   - `specs/constitution/roadmap.md`: features ordered by value and dependency, with status and priority.
   - `specs/constitution/tech-stack.md`: languages, frameworks, versions, data, infrastructure, commands, allowed/forbidden dependencies and architecture.
   - `specs/constitution/principles.md`: 6-8 non-negotiable principles, each with what it implies and how it is verified.
2. If it already exists, detect gaps, contradictions and obsolete decisions. Do not rewrite it entirely without need.
3. Always include the SDD level **spec-anchored + spec-as-source** and the rule that no behaviour change is implemented without updating the spec.
4. Maximum 15 lines per principle and 60 lines per document, except `tech-stack.md`.
5. Do not write files yet. Show me the proposal and wait for my approval.
6. On approval, write the files and update `MEMORY.md` and `AGENTS.md` if paths change.

All documents are written in English. Keep localized copies in sync if the project uses them.

Do not implement code.
