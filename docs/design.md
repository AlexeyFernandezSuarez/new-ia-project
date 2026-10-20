# Design

This document explains how `new-ai-project` is built, why it is split this way and what guarantees it offers. It does not describe the project the command generates; that is covered by `README.md` and `skills/new-ai-project/references/structure.md`.

## Problem

An agent performs better when the repository answers five questions before it starts:

1. What are we building and for whom?
2. Which rules cannot be broken?
3. Where is the truth about behaviour?
4. What was done and what remains between sessions?
5. Which tools and permissions does the agent have?

The usual answer is an outdated `README`, instructions copied from a blog and decisions that only exist in chat history. `/new_ai_project` turns those answers into versioned files, with a workflow that keeps them alive.

## Principles

- **The command is the product.** Logic lives in one readable, portable Markdown file. Everything else distributes or installs it.
- **No surprises.** Nothing is written, moved, installed or overwritten without approval. Generic mode does not invent, and guided mode does not decide for the user unless asked.
- **Project scope.** Skills, MCPs, commands and subagents are installed in the repository. Global is an explicit installer exception, never a command default.
- **No network in the installer.** Copying files must work offline and be auditable.
- **Real portability.** The command body uses Markdown and `$ARGUMENTS`; the installer adapts frontmatter and paths per harness.
- **English is canonical.** All Markdown artifacts are English. Optional localized copies are translations, never the source of truth.
- **Nothing destructive.** Inventory before touching, backup before overwriting, tests after moving.
- **Spec-anchored and spec-as-source.** The specification is maintained and rules. See [ADR 0001](decisions/0001-spec-anchored-spec-as-source.md).

## Architecture

```text
new-ia-project/
├── skills/new-ai-project/
│   ├── SKILL.md                     # Discovery wrapper (skills.sh)
│   ├── command/new_ai_project.md    # Command source of truth
│   ├── scripts/install.mjs          # Local distribution per harness
│   ├── assets/
│   │   ├── commands/sdd-*.md        # Optional SDD kit
│   │   ├── agents/*.md              # OpenCode subagents
│   │   ├── skills/sdd/SKILL.md      # Local SDD skill
│   │   └── templates/*.md           # Artifact templates
│   └── references/                  # Generated structure and compatibility
├── scripts/validate.mjs             # Static repository validation
├── tests/                           # node:test, no dependencies
└── docs/                            # Design, testing, publishing and ADRs
```

### Layers

| Layer | File | Responsibility |
|---|---|---|
| Discovery | `SKILL.md` | Let skills.sh and `npx skills` find the package and understand what it does. No procedure. |
| Execution | `command/new_ai_project.md` | Diagnosis, questions, decisions, file generation, authorized installation, validation and report. |
| Distribution | `scripts/install.mjs` | Copy the command and, optionally, the SDD kit to each harness path. |
| Support | `assets/`, `references/` | Optional pieces and documentation of what the command generates. |
| Quality | `scripts/validate.mjs`, `tests/` | Prevent regressions in frontmatter, sections, paths and installer behaviour. |

The separation avoids the classic problem of duplicated giant prompts: if the procedure changes, it changes once. `SKILL.md` only routes to the command; it does not paraphrase it.

## Command flows

```text
Preflight
  ├── empty directory ───────────────► Flow A
  └── existing / AI-first project ───► Flow B

Flow A
  ├── 1. Generic structure ─► folders + .md with headings and TODO
  ├── 2. Guided build ──────► interview ─► documents ─► skeleton ─► harness
  └── 3. Cancel

Flow B
  ├── 1. Adapt ─► inventory ─► plan ─► backup ─► merge ─► verification
  ├── 2. New path ─► Flow A at another path
  ├── 3. New folder ─► Flow A in a new folder
  └── 4. Cancel
```

### Flow A, generic mode

Generates the structure and documents with headings, sections and `TODO`, without an invented product, stack or features. It installs no skills or MCPs. The goal is for the user to fill in the content without designing the structure.

All documents are English. With `--lang`, the command also writes complete translations and `docs/i18n.md`.

### Flow A, guided mode

One question per message, from product to delivery:

1. Concept, problem and users.
2. MVP scope and non-goals.
3. Data and entities.
4. Stack and constraints.
5. Architecture and patterns.
6. Initial features and priority.
7. Quality, security and delivery.
8. Harness: skills, MCPs, commands and subagents.
9. Documentation language copies.

Each question offers answering, `Any suggestions?`, `You choose` or stopping with a draft. Delegated decisions are recorded as `[auto]` in `docs/discovery/answers.md` and in the relevant ADR.

At the end it writes the core, validates, proposes the harness and generates a report with decisions, open questions, verification and rollback.

### Flow B, adaptation

Adaptation is a documentation and harness change, not a product change:

1. Inventory of files, stack, tests and existing AI artifacts.
2. Plan with what is added, merged, moved and not touched.
3. Explicit approval, including `find-skills` and essential skills.
4. Backup and non-destructive merge of `AGENTS.md` and `MEMORY.md`.
5. Structural moves only with approval, one at a time, with tests after each.
6. English canonical docs plus optional localized copies; existing docs in other languages are preserved as translations or legacy.
7. Verification and report.

Features are never removed and existing specs are never rewritten. If a spec contradicts the standard, the debt is documented and a change is proposed, not imposed.

## Generated file contract

At minimum, the command creates:

- `AGENTS.md`: purpose, stack, commands, documentation map, SDD flow, conventions, boundaries, verification and memory protocol.
- `MEMORY.md`: current state, decisions, learnings, next steps and links. Recommended maximum: 60 lines.
- `specs/constitution/`: mission, roadmap, stack and principles.
- `specs/features/NNN-slug/`: `spec.md`, `clarification.md`, `plan.md`, `tasks.md`, `validation.md`.
- `docs/`: architecture, discovery, ADRs, session memory, quality and harness.
- Code and test skeleton consistent with the approved stack.
- With `--lang`: a complete `.<code>.md` translation for every `.md` (except `docs/i18n.md`) and a `docs/i18n.md` index.

The templates in `assets/templates/` are the structural reference. The command embeds its own content so it does not depend on the repository being present at run time.

## Language model

- English is the canonical language for every generated Markdown artifact.
- Conversation, questions and reports use the user's language.
- `--lang=<code>` (or `--secondary-lang`) accepts one or more BCP-47-like tags.
- File naming is deterministic: `name.md` → `name.<code>.md`.
- Translations preserve sections, tables, links, code fences, requirement IDs, status tokens, ADR numbers and EARS keywords.
- Each translation starts with `<!-- TRANSLATION of <source> · source: English · synced: YYYY-MM-DD -->`.
- `docs/i18n.md` is the index; if the English source changes and the translation does not, the index marks it `outdated` and the final validation fails until resolved.
- `docs/i18n.md` is the index and is never translated.
- Default is English only; no suffix, no marker, no `docs/i18n.md`.

## Installer

`install.mjs` is a dependency-free Node.js script. Steps:

1. Parse options and validate targets.
2. Resolve scope: current project or user directory.
3. Detect harnesses when no target is specified.
4. Copy the command and transform frontmatter per harness.
5. Copy the SDD kit if requested.
6. Report every created, skipped or backed-up file.

Guarantees:

- `--dry-run` writes nothing.
- An identical file is not touched.
- A different file is skipped unless `--force`; with `--force` a `.bak-<timestamp>` is created.
- `--global` is the only way out of the project.
- `specs/templates/` is copied only at project scope; a global install never writes `~/specs`.
- There is no `fetch`, `http` or `https` in the code.

### Transformation per harness

| Target | File | Frontmatter |
|---|---|---|
| `opencode` | `new_ai_project.md` | Unchanged (`description`, `agent: build`) |
| `claude` | `new_ai_project.md` | `agent` removed |
| `cursor` | `new_ai_project.md` | `agent` removed |
| `copilot` | `new_ai_project.prompt.md` | `mode: agent` and `description` |

The SDD kit is transformed the same way. Subagents are installed only for OpenCode because the other harnesses have no portable equivalent.

## Error handling

- Invalid option or target: message, help and exit code 1.
- Missing source: reported, then continue with the rest, never fail silently.
- File collision: skipped, with an explanation of how to force.
- Invalid JSON in project configuration: the command stops and asks for review before writing.
- Unclassifiable directory: the command asks instead of assuming.

## Extensions

- **New harness**: add the target in `VALID_TARGETS` and `commandPaths()`, document it in `references/compatibility.md`, update the tables and add a test.
- **New SDD command**: add `assets/commands/sdd-<name>.md`, update the `sdd` skill, templates and both README files.
- **New subagent**: add `assets/agents/<name>.md` with minimal permissions and reference it in the generated `AGENTS.md`.
- **New template**: add it in `assets/templates/` and link it from the generated `specs/README.md`.
- **New language**: no code change; `--lang` handles any valid tag.

## Non-goals

- Implementing the user's application.
- Choosing product, market or business model.
- Replacing the generated project's tests, linters or CI.
- Installing global configuration by default.
- Being a runtime framework.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| The command drifts from `SKILL.md` | `npm run validate` checks that the wrapper references the command and that key sections exist |
| The installer overwrites user work | Skip by default, backup with `--force`, `--dry-run` |
| Malicious third-party skills | Prior reading, official sources, project-scoped install, justification and documented uninstall |
| Destructive adaptation | Inventory, approved plan, backup, tests after each move, prohibition on changing features |
| Documentation and code drift | Spec-anchored SDD: the spec is updated before code and `validation.md` closes the loop |
| Stale translations | `docs/i18n.md`, translation markers and a final validation check |
| Windows paths | `path.join`, Windows tests, `--copy` in skills.sh to avoid symlinks |
