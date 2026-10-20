---
description: SDD · Interview and generate the specification (usage: /sdd-spec 002-name initial idea)
agent: plan
---

DO NOT write code at any point. Read `AGENTS.md`, `MEMORY.md`, `specs/constitution/` and `specs/README.md`, and apply the `sdd` skill (`.agents/skills/sdd/SKILL.md`).

Spec folder: `specs/features/$1/`
Initial idea (everything after the folder name): $ARGUMENTS

Your job:
1. Ask me ONE question at a time to remove ambiguity: users, main flow, edge cases, errors, what is out of scope for this version and acceptance criteria. Maximum 5 questions.
2. For each question offer: answer in my own words, `Any suggestions?` or `You choose`.
3. With my answers, create `specs/features/$1/spec.md` using the `sdd` skill template, EARS requirements and `Status: draft`.
4. Also create `clarification.md`, `plan.md`, `tasks.md` and `validation.md` as empty files with the template and `Status: pending`.
5. Add the feature to `specs/constitution/roadmap.md` if it is missing.
6. Only the WHAT and WHY: no stack, architecture or file names.
7. At the end, summarize in 5 lines and tell me the next command: `/sdd-clarify $1`.

If the folder already exists, do not overwrite it: read it and propose changes.

Write the spec in English. If the project uses `--lang` copies, create the translated spec after the English one and update `docs/i18n.md`.
