---
name: new-ai-project
description: Create or adapt an AI-first software project with Spec-Driven Development, AGENTS.md, persistent memory, project-level skills/MCPs and subagents. Use when the user asks to start a new AI project, scaffold specs/docs, or standardize an existing repo. Writes English documentation and optional localized copies. Not for implementing product features or fixing bugs.
license: MIT
metadata:
  author: new-ai-project
  version: 1.0.1
---

# New AI Project

This skill is the distribution wrapper for the **`/new_ai_project`** command. The command is the product; this skill exists so the command can be discovered and installed through the open skills ecosystem (GitHub, skills.sh, `npx skills`).

## What it does

`/new_ai_project` prepares a repository for AI-assisted software development:

- Detects whether the directory is empty or already contains a project.
- Lets the user choose a **generic skeleton** (folders + Markdown headings only) or a **guided interview** (product, requirements, stack, features).
- Creates `AGENTS.md`, `MEMORY.md`, `specs/` (constitution + features), `docs/` (architecture, quality, memory, harness) and a stack-appropriate code skeleton.
- Writes **all Markdown in English**; the conversation follows the user's language.
- With `--lang=<code>`, creates complete localized copies next to each document (`AGENTS.es.md`, `spec.es.md`, ...) and a `docs/i18n.md` index.
- Uses **spec-anchored + spec-as-source** SDD: every behaviour change starts in the spec.
- Optionally installs, always at project scope and with explicit approval: `find-skills`, essential stack skills, MCP servers, the `/sdd-*` command kit and the `coordinator`/`planner`/`implementer`/`reviewer` subagents.
- Adapts an existing project without changing its features or existing specs.

## When to use

- "Create a new project with AI / SDD / AGENTS.md / MEMORY.md."
- "Scaffold the specs and docs for this idea."
- "Standardize this repo for AI-assisted development."
- "Install the `/new_ai_project` command."
- "I want the project docs in English and Spanish copies."

## When NOT to use

- Implementing a feature or fixing a bug in an existing app. Use the project's `/sdd-*` commands instead.
- A quick one-off prompt that does not need project structure.
- Installing global configuration. This skill is project-scoped by design.

## How to run

### If the slash command is already installed

Invoke `/new_ai_project`. If the user invoked this skill instead, read `command/new_ai_project.md` (next to this `SKILL.md`) and follow it exactly as if the user had run `/new_ai_project`, passing the user's arguments.

Show command help with `/new_ai_project --help`.

### If the slash command is not installed

From the target project:

```bash
node scripts/install.mjs --project --target opencode
```

Or, to make it available in every project:

```bash
node scripts/install.mjs --global --target opencode
```

Install the optional SDD kit at project scope:

```bash
node scripts/install.mjs --project --target opencode --with-sdd-kit
```

The installer writes only local files. It never downloads anything and never installs globally unless `--global` is explicit.

## Operating rules

- **One question at a time.** Never dump a questionnaire.
- **Ask before writing** the project structure, and before installing anything.
- **English artifacts.** All generated Markdown is English; the conversation uses the user's language.
- **Localized copies are optional and complete.** `--lang=es` produces `*.es.md` siblings; English remains the source of truth.
- **Project scope only** for skills, MCPs, commands and agents. Never `-g`.
- **No secrets** in prompts, docs or configuration. Use `.env.example` and `{env:VAR}`.
- **Never overwrite** existing files without reading them and asking.
- **Never change features** of an existing project during adaptation.
- **Verify** paths, JSON, links, translations and tests before declaring the job done.

## Files

```text
skills/new-ai-project/
├── SKILL.md                     # This file
├── command/new_ai_project.md    # Canonical slash command (source of truth)
├── scripts/install.mjs          # Project/global installer, no network
├── assets/commands/             # Optional /sdd-* commands
├── assets/agents/               # Optional OpenCode subagents
├── assets/skills/sdd/SKILL.md   # Optional local SDD skill
├── assets/templates/            # Spec/plan/tasks/validation templates
└── references/
    ├── structure.md             # Generated structure and rationale
    └── compatibility.md         # Harness paths and portability
```

## References

- `references/structure.md` — the exact folder/file tree the command creates.
- `references/compatibility.md` — OpenCode, Claude Code, Cursor and Copilot paths.
- `command/new_ai_project.md` — full procedure, question bank, templates, language policy and validation.
