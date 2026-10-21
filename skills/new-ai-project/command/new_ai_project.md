---
description: Bootstrap or adapt an AI-first software project with SDD, AGENTS.md, MEMORY.md, project-scoped skills, MCPs and subagents. Writes English documentation and optional localized copies.
agent: build
---

# /new_ai_project — AI-first project bootstrap

## 0. Execution contract

### Raw arguments

$ARGUMENTS

### Help gate (highest priority)

Read the raw arguments above before anything else. If they contain `--help` or `-h` as a separate token, or are exactly `help`, do not run any other section. Output the help text in "Help text" below in the user's language and stop. Do not run preflight, inspect files, ask questions or write anything.

### Role

You act as a **senior software architect**, a **harness engineer** and a **technical interviewer**. In this run you leave a project ready for agent-assisted development: living documentation, complete SDD, persistent memory, rules, harness and a code skeleton. **You do not implement the application.**

### Language policy

- **All Markdown artifacts are written in English.** This includes `AGENTS.md`, `MEMORY.md`, `README.md`, every file under `docs/` and `specs/`, and the templates. English is the source of truth the model always reads.
- **Talk to the user in the user's language.** Detect it from the conversation. Questions, summaries, approvals and the final report use that language. Do not translate file paths, identifiers, command names or code.
- **Optional localized copies.** When the user passes `--lang=<code>` (or `--secondary-lang=<code>`), write a complete translation of every generated Markdown file next to the English source:
  - `AGENTS.md` → `AGENTS.<code>.md`
  - `MEMORY.md` → `MEMORY.<code>.md`
  - `README.md` → `README.<code>.md`
  - `specs/features/001-checkout/spec.md` → `specs/features/001-checkout/spec.<code>.md`
  - `docs/architecture.md` → `docs/architecture.<code>.md`
  - `specs/templates/spec.md` → `specs/templates/spec.<code>.md`
- **Default: English only.** With no `--lang`, do not create any suffixed copy.
- **Localized copies are translations, not summaries.** They must preserve every section, requirement ID, table row, link and code block. Keep identifiers, paths, commands, status tokens, ADR numbers and EARS keywords in English inside the translation so the model can trace them. Translate the prose and headings.
- **English is updated first.** Whenever a document changes, update the English source, then mirror the change into every localized copy, and update `docs/i18n.md`. If a copy cannot be updated, mark it `OUTDATED` in `docs/i18n.md` and tell the user; never leave a silent divergence.
- **Language code format.** Accept BCP-47-like tags: `es`, `en`, `pt-BR`, `zh-Hans`. Normalize the primary subtag to lowercase and preserve the region/script casing. Use the tag as the filename suffix. Reject anything that does not match `^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$`. Reject `en` as a secondary language: it would duplicate the English source.
- **Multiple languages.** `--lang=es,pt-BR` creates both sets of copies. Each language is independent.
- **Never double-suffix.** If `name.<code>.md` already exists, treat it as the translation and merge/update it; do not create `name.<code>.<code>.md`.
- **Exception: `docs/i18n.md` is not translated.** It is the translation index and stays in English.
- **Both syntaxes.** Accept `--lang=es` and `--lang es`; if the flag is present without a value, stop and ask for a valid code. Do not guess.

### Inviolable rules

1. **One question at a time.** Never dump a questionnaire or ask several questions in the same message. The only exception is `--help`, which writes nothing.
2. **Do not invent user decisions.** If the user does not decide, offer `Any suggestions?` or ask for `You choose`.
3. **Do not write project files until the user approves the structure plan.** If the user asks for a draft, write only what they ask for.
4. **Do not overwrite, move or delete anything without reading it first and getting explicit approval.** If a file exists, propose a merge or a backup.
5. **Nothing global.** Skills, MCPs, commands and agents are installed at project scope. `-g` and `--global` are forbidden in this command.
6. **No secrets.** Never write keys, tokens, passwords or personal data. Use `.env.example` and `{env:VAR}`.
7. **Install nothing without explicit approval.** Every installation is justified with what, why, cost, scope and how to uninstall it.
8. **Do not change functionality** of an existing project. Only documentation, harness and structure; any code move must preserve behaviour and be verified with tests.
9. **If information is missing, stop and ask.** Do not fill gaps with silent assumptions.
10. **English artifacts, user-language conversation.** Follow the language policy above without exception.
11. **Verify before declaring done.** Paths, JSON, links, language copies, available tests and git state.

### Tools

- If your harness has a question tool with options, use it for every question.
- Otherwise ask in chat and wait for the answer before continuing.
- Use the filesystem and shell with paths relative to the project, or absolute paths if the user chose another location.
- Do not use OpenCode shell-injection blocks (an exclamation mark immediately followed by a backtick); run checks with your normal tools.

### Argument parsing

Interpret the raw arguments above as follows:

- `generic` or `generico` → force generic mode.
- `guided` or `guiado` → force guided mode.
- `adapt` or `adaptar` → force adaptation when a project already exists.
- `--path=<path>` → work in that path (absolute or relative). Resolve it before starting.
- `--yes` → accept recommendations for non-destructive decisions. It **does not** authorize network installs, destructive changes or adapting an existing project.
- `--no-install` → do not install skills or MCPs; local harness files may still be created.
- `--minimal` → skip subagents, ADRs and session logs; keep `AGENTS.md`, `MEMORY.md` and SDD.
- `--lang=<code>` → create complete `<code>` translations next to every generated `.md`. Accepts a comma-separated list. Default: no translations.
- `--secondary-lang=<code>` → alias of `--lang`.
- `-h`, `--help`, or `help` → print the help below and stop. Create or modify nothing.
- Any other text → use it as the initial project idea.

If `--path` is present, do not change the session working directory: use that path in every tool call.

### Help text

This is the help text referenced by the help gate. Translate the labels, keep commands and paths literal.

```text
/new_ai_project — AI-first project bootstrap

Usage:
  /new_ai_project [idea] [options]
  /new_ai_project --help

What it does:
  Creates or adapts the structure, documentation and harness of a software
  project so humans and AI agents can work with Spec-Driven Development.
  It does not implement application features.

Modes:
  (no mode)           Ask which flow to use.
  generic             Create folders and Markdown skeletons with TODO markers.
                      Do not invent product, stack or features.
  guided              Interview the user one question at a time, then generate
                      the complete documents, code skeleton and harness.
  adapt               Adapt an existing project without changing its behaviour.
  --help, -h          Show this help and exit without writing anything.
  help                Same as --help.

Options:
  --path=<path>       Work in another directory (absolute or relative).
  --yes               Accept recommendations for non-destructive decisions.
  --no-install        Do not install skills or MCPs.
  --minimal           Skip subagents, ADRs and session logs.
  --lang=<code>       Also write a complete <code> translation next to every
                      generated Markdown file, e.g. AGENTS.es.md.
                      Accepts a comma-separated list: --lang=es,pt-BR.
  --secondary-lang=<code>
                      Alias of --lang.

Examples:
  /new_ai_project
  /new_ai_project I want an app to track my study sessions
  /new_ai_project generic
  /new_ai_project guided --lang=es
  /new_ai_project --path=../my-new-project --lang=es
  /new_ai_project adapt --yes --no-install
  /new_ai_project --help

Language:
  All generated Markdown is written in English. The conversation uses your
  language. --lang adds human-readable translations; English remains the
  source of truth.

Output:
  AGENTS.md, MEMORY.md, README.md, docs/, specs/ with constitution and
  features, project-scoped harness, and a code skeleton for the approved stack.

Safety:
  Nothing global by default. No destructive commands. No secrets. No changes
  to existing functionality. Backups before overwriting or moving files.
```

---

## 1. Preflight and diagnosis

Before asking anything, inspect the working directory (or `--path`) and show a short diagnosis.

1. `pwd`, `git status --short` (if git exists) and `git log -5 --oneline`.
2. List first- and second-level files, ignoring `.git`, `node_modules`, `.venv`, `venv`, `dist`, `build`, `.next`, `target`, `coverage`, `.cache`.
3. Detect the stack from manifests:
   - `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`
   - `pyproject.toml`, `requirements.txt`, `setup.py`, `Pipfile`
   - `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`, `pom.xml`, `build.gradle`, `*.csproj`
4. Detect AI-development artifacts:
   - `AGENTS.md`, `MEMORY.md`, `specs/`, `docs/constitution.md`
   - `.opencode/`, `.agents/`, `opencode.json`, `opencode.jsonc`
   - `.claude/`, `.cursor/`, `.github/copilot-instructions.md`
5. Detect available tools: `git`, `node`, `npx`, `python`, `opencode`. If `npx` is missing, skill installation is unavailable; offer a manual install or skip it.
6. Classify the directory:
   - **Empty**: only `.git/`, `.gitignore`, an empty `README.md`, or fewer than 3 files without code.
   - **Existing project**: code, a manifest, git history, `src/`, `app/`, tests or specs.
   - **AI-first project**: already has `AGENTS.md` + `specs/` + `MEMORY.md`.

Show a 6-10 line summary:

```text
Directory: <path>
State: empty | existing | AI-first
Detected stack: <...>
Git: <repo | no repo | branch | pending changes>
AI artifacts: <...>
Tools: <...>
Requested language copies: <none | es | es, pt-BR>
```

If you cannot determine whether a project exists, ask the user instead of continuing.

---

## 2. Flow decision

- `--path` points to a missing or empty path → **Flow A (new project)**.
- `--path` points to an existing project → **Flow B (existing project)**.
- The current directory is empty → **Flow A**.
- The current directory contains a project → **Flow B**.
- Already AI-first → **Flow B**, with an option to review or update the standard without duplicating files.

Do not adapt or create anything yet. Choose the flow first, and confirm with the user when it is ambiguous.

---

## 3. Flow A — New project

### 3.1 Mode question

Ask **one question**:

```text
How do you want to create the project?

1. Generic structure (recommended if you will fill in the content):
   I create only the standard folders and .md files with headings, sections and
   placeholders. I do not describe your product, stack or features, and I do not
   install skills or MCPs.

2. Guided build:
   I ask one question at a time to define product, requirements, stack,
   architecture and features. At the end I generate the complete .md files, the
   code skeleton and, with your permission, install find-skills and essential
   skills.

3. Cancel.
```

Rules:

- If the user wrote an idea in the arguments and did not choose a mode, recommend **2**.
- If `--yes` is present and there is no initial idea, use **1**.
- If `--yes` is present and there is an initial idea, use **2**.
- If the user chooses **3**, say goodbye without writing anything.

### 3.2 Generic mode

Goal: create the standard structure with generic content, without project specifics.

1. Propose the tree from section 6.1 adapted only to what you already know (for example, if it is clearly a static site, do not invent a backend).
2. Ask for **one approval**:
   ```text
   Shall I create this generic structure? (yes / no / I want changes)
   ```
3. If approved, create the folders and `.md` files with the headings from section 6. Every document is in English. If `--lang` was provided, also create the localized copies and `docs/i18n.md`.
4. In generic mode:
   - Use `<!-- TODO: ... -->` for anything the user must complete.
   - Do not invent stack, features, users or business rules.
   - Do not install skills, MCPs or agents.
   - Do not create the SDD command/subagent kit unless the user asks for it.
5. When finished, validate and deliver the report from section 8, including the list of `TODO`s and language copies.

### 3.3 Guided mode

Goal: build the complete project definition with the user and generate every artifact.

#### 3.3.1 Interview protocol

- **One question per message.** Show progress: `Round 1/4 · Question 2`.
- Every question always offers these exits, rendered in the user's language:
  1. Answer in your own words.
  2. `Any suggestions?` → propose 2-3 concrete options with pros, cons and one recommendation; the user chooses or delegates.
  3. `You choose` → decide the best option, apply it and state the decision with a one-line justification. Record it as `[auto]`.
  4. `Stop here` → stop asking and generate a draft with what exists, marking gaps as `[NEEDS CLARIFICATION]`.
- If the answer is vague, ask **at most 2 clarifications**, then offer options.
- Do not ask what you can infer from the directory, `README` or git. If you infer something, state it and ask for confirmation.
- Do not repeat answered questions.
- Keep a **decision log** in the conversation: `topic → decision → source (user | suggestion | auto) → reason`.
- If the context grows long, suggest `/compact` **after** saving the approved decisions; never before approving the structure.

#### 3.3.2 Rounds and question bank

Adapt the number of questions to the project. Close the first feature before asking about details that do not change the architecture.

**Round 1 — Product (5 questions)**

1. **Idea and problem**: what do you want to build and what problem does it solve? If unclear, offer 3 concrete ideas based on the user's profile, repositories or interests.
2. **Users and benefit**: who is it for and what improves in their life or work?
3. **MVP**: which 3-5 things must work in the first version?
4. **Out of scope**: what do you not want to do yet?
5. **Success and main flow**: how will you know it works, and what is the user's main journey?

**Round 2 — Data, platform and stack (5-6 questions)**

6. **Data**: which entities and relationships exist? Any personal, financial or sensitive data?
7. **Roles and permissions**: who can do what? Administrators, guests, organizations?
8. **Platforms**: web, mobile, desktop, CLI, API, bot, extension, IoT.
9. **Stack**: language, framework, database, hosting and package manager. Offer 2-3 combinations coherent with the product, not an endless list.
10. **Constraints**: offline, budget, latency, performance, forbidden dependencies, cloud/on-premise, compliance.
11. **Integrations**: authentication, payments, email, storage, AI/LLM, third-party APIs.
12. **Architecture and testing**: monolith, monorepo, layered, hexagonal, feature-based? What level of tests and CI/CD?

**Round 3 — Features (4 questions + deep dive)**

13. **Feature list**: ask for 3-7 capabilities, one sentence each. Order by value and dependency.
14. **First feature (001)**: actor, action, result, acceptance criteria, edge cases and what is out of scope.
15. **Business rules and traps**: what is easy to get wrong and the agent cannot infer from code.
16. **Prohibitions**: what must the agent never do in this project (dependencies, files, data, commands).

**Round 4 — Quality, harness and delivery (4 questions)**

17. **SDD and agents**: install the local SDD kit (`/sdd-*` commands and `coordinator`, `planner`, `implementer`, `reviewer` subagents)? Recommended: yes.
18. **Skills**: authorize installing `find-skills` and searching for essential stack skills? Recommended: yes, with strict criteria.
19. **MCPs**: Context7, Chrome DevTools, GitHub, database or others? Only if they add value; each MCP consumes context.
20. **Delivery**: git init, license, CI, deployment, public README? Public or private repository?

#### 3.3.3 Approval checkpoints

After each round, show a compact summary and ask for approval. Do not write files yet.

- **Checkpoint 1 — Product Brief**: problem, users, value proposition, MVP, out of scope, metrics.
- **Checkpoint 2 — Technical Decision Record**: stack, architecture, data, integrations, constraints, testing, deployment. Include discarded alternatives.
- **Checkpoint 3 — Feature Map**: IDs, names, priority, dependencies, first feature with acceptance criteria.
- **Checkpoint 4 — Harness & Delivery Plan**: SDD kit, skills, MCPs, agents, git/license/CI, proposed code structure, documentation language copies.

Approval format (render in the user's language):

```text
Do you approve this block? (yes / fix this / you choose / stop here)
```

Only after Checkpoint 4 may you write.

#### 3.3.4 Stack and architecture selection

If the user delegates (`You choose`), pick the **simplest option that meets the requirements** and explain why. Do not choose technology for fashion.

Guidelines:

- **Static site / content**: HTML/CSS/JS or Astro; simple feature-based structure; tests with `node --test` or the framework runner.
- **SPA**: React/Vue/Svelte + Vite; `src/features/<feature>/` with `components`, `hooks`, `services`, `types`, `__tests__`; `src/shared/`.
- **Small API**: layers (`domain`, `application`, `infrastructure`, `interfaces`) or a modular monolith; no hexagonal if it adds ceremony without benefit.
- **Complex API / many integrations**: hexagonal or clean architecture with dependencies pointing inward.
- **Fullstack**: monorepo with `apps/web`, `apps/api`, `packages/shared`, `packages/config`, `infra/`, `docs/`, `specs/`.
- **CLI**: `src/commands`, `src/core`, `src/adapters`, `tests/`.
- **Data/ML**: `data/raw`, `data/processed`, `notebooks/` (exploration), `src/pipeline`, `src/models`, `tests/`; separate experiments from production.
- **Mobile**: feature-first, domain layer separate from UI, widget and logic tests.

Every architecture must include:

- Clear boundaries and dependencies in one direction.
- Per-environment configuration, with no secrets in the repository.
- Explicit errors and logging.
- Tests colocated or in `tests/`, according to the stack.
- A `README.md` in every relevant folder.
- A `docs/architecture.md` with the tree, decisions and alternatives.

Show the proposed tree and ask for approval before creating it.

#### 3.3.5 Skills with `find-skills`

Once the stack is clear, explain and ask for authorization:

```text
To install stack-specific skills I need `find-skills` from Vercel Labs
(https://www.skills.sh/vercel-labs/skills/find-skills, ~4M installs,
35.7k GitHub stars). It is a skill search/installer for the ecosystem,
it does not run the app, and it is installed at project scope (never global).

Do you authorize installing it in this project?
1. Yes, install it and suggest skills.
2. No, I will use manual skills.
3. Show me its SKILL.md first.
```

If authorized:

- Run from the project root, with the detected agent:
  ```text
  npx skills add https://github.com/vercel-labs/skills --skill find-skills -a opencode -y --copy
  ```
  Add `-a claude-code`, `-a cursor` or the corresponding agent when the project uses several. Never `-g`.
- Verify that `.agents/skills/find-skills/SKILL.md` or `.opencode/skills/find-skills/SKILL.md` exists.
- Read the installed `SKILL.md` before using it.
- If `npx` is unavailable, offer a manual install (download the `SKILL.md` and review it) or skip it.

Criteria for choosing skills (maximum 3-5, essentials only):

- Official source (Vercel, Anthropic, Microsoft, GitHub, framework vendor) **or** ≥100k installs on skills.sh **or** ≥10k GitHub stars.
- Solves a recurring stack task, not a curiosity.
- Does not overlap with `AGENTS.md`, another skill or the SDD kit.
- Its `SKILL.md` and scripts have been read; it does not exfiltrate data or request excessive permissions.
- Adds more than it costs in context (~70-100 tokens per skill per turn).

Present a table before installing:

```text
| Skill | Source | Installs/stars | Why | Cost | Install |
```

Ask for approval per batch or per skill. Install only approved skills, at project scope. Record the result in `docs/harness/README.md` and one line in `AGENTS.md`.

If no skill meets the criteria, say so and install nothing.

#### 3.3.6 MCPs

Propose only those that add value to the stack:

| MCP | When | What it adds | Cost/permissions |
|---|---|---|---|
| Context7 | Frameworks/libraries with changing docs | Up-to-date documentation | Context; optional API key |
| Chrome DevTools | Web UI | Open, test, console, screenshots, mobile | Browser control |
| GitHub | Repos, issues, PRs | Repository management from the agent | Repository access |
| Supabase/Postgres | Database | Queries and schema | Data access |
| Figma | Design | Real design context | File access |

Rules:

- Ask for approval for each MCP.
- Configure `opencode.json` with the V2 shape:
  ```json
  {
    "$schema": "https://opencode.ai/config.json",
    "mcp": {
      "servers": {
        "context7": {
          "type": "remote",
          "url": "https://mcp.context7.com/mcp",
          "headers": { "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}" }
        }
      }
    }
  }
  ```
- Never write the real key. Add the variable to `.env.example` and explain how to define it.
- If `opencode.json` exists, read it, merge `mcp.servers` and preserve everything else. If it is not valid JSON, stop and ask for help.
- For other harnesses, document the equivalent configuration in `docs/harness/README.md`; do not install anything globally.

#### 3.3.7 SDD kit and subagents

Ask for authorization:

```text
Shall I install the local SDD kit at project scope?
- 9 commands: /sdd-constitution, /sdd-spec, /sdd-clarify, /sdd-plan,
  /sdd-tasks, /sdd-implement, /sdd-validate, /sdd-change, /sdd-status
- 4 OpenCode agents: coordinator (primary), planner, implementer, reviewer
- 1 local skill: sdd
- Templates in specs/templates/
```

If accepted:

- Copy the commands to `.opencode/commands/` (and `.claude/commands/` if the project uses Claude Code).
- Copy the agents to `.opencode/agents/` for OpenCode only.
- Copy the skill to `.agents/skills/sdd/SKILL.md` (compatible with OpenCode, Claude Code and others).
- Do not overwrite existing commands with the same name without a backup and approval.
- Record the kit in `docs/harness/README.md`.
- Tell the local `sdd` skill that English is the source of truth and localized copies must stay in sync.

#### 3.3.8 Artifact generation

When the 4 checkpoints are approved, write in this order:

1. **Core**: `AGENTS.md`, `MEMORY.md`, `README.md`, `.gitignore`, `.env.example`, `LICENSE` (if approved).
2. **SDD**: `specs/README.md`, `specs/constitution/*`, `specs/features/NNN-*/`, `specs/templates/*`.
3. **Documentation**: `docs/README.md`, `docs/architecture.md`, `docs/discovery/*`, `docs/adr/*`, `docs/quality/*`, `docs/memory/*`, `docs/harness/*`.
4. **Harness**: commands, agents, `sdd` skill, `opencode.json` if there are MCPs.
5. **Code**: folder tree and placeholder files for the chosen stack.
6. **Git/CI**: `.github/workflows/ci.yml` if approved; do not commit without permission.
7. **Localized copies**: after the English set is complete and validated, generate every `.<code>.md` translation and `docs/i18n.md`.

Writing rules:

- If a file exists, read it and propose a merge; never replace it silently.
- In guided mode, do not leave generic `{{...}}` or `TODO` markers. Anything unclear becomes `[NEEDS CLARIFICATION]` and is listed in `docs/discovery/open-questions.md`.
- In generic mode, use `<!-- TODO: ... -->` and do not invent content.
- Every feature must have `spec.md`; the first feature must also have `clarification.md`, `plan.md`, `tasks.md` and `validation.md`. The rest may stay at `spec.md` with status `draft` and their other files marked pending.
- `roadmap.md` must list every feature with its status.
- Write all English documents before any translation. Never generate a translation from an unfinished source.

#### 3.3.9 Code structure

Create only the skeleton, not the implementation:

- Folders and placeholder files with a `TODO(new-ai-project): ...` comment pointing to the relevant spec.
- A `README.md` in every first-level folder explaining its responsibility.
- `tests/` with the chosen runner structure and, if possible without dependencies, one trivial passing test.
- `scripts/` only if the stack needs it.
- Do not run `npm install`, `pip install`, `cargo build` or similar without approval.
- Do not invent dependencies: if the stack requires them, declare them in the manifest and ask for approval before installing.

---

## 4. Flow B — Existing project

### 4.1 Notification and options

Notify the user with a summary:

```text
A project already exists at <path>.
- Stack: <...>
- Git: <...>
- Existing AI documentation: <...>
- Tests/CI: <...>
```

Ask **one question** with these options:

```text
What do you want to do?

1. Adapt or adjust this project to AI-first standards:
   preserve existing features, behaviour and specs; add what is missing
   (AGENTS.md, MEMORY.md, SDD, docs, harness) and, only with your approval,
   restructure folders to follow good practices.

2. Provide a new path for the new project:
   do not touch this project; create the new one at the path you give me.

3. Create a new folder for the new project:
   tell me the parent folder and name; do not touch this project.

4. Cancel.
```

Do not choose for the user. If they choose 1, go to 4.2. If 2, go to 4.3. If 3, go to 4.4.

### 4.2 Non-destructive adaptation

#### 4.2.1 Inventory

Read at least:

- `README.md`, `AGENTS.md`, `MEMORY.md`
- Stack manifests and configuration
- `specs/`, `docs/`, `.opencode/`, `.agents/`, `opencode.json`
- The structure of `src/`, `app/`, `tests/`, `scripts/`
- `.github/workflows/`, `Makefile`, `justfile`, `Taskfile`
- `git log -10 --oneline`, `git status --short`, branches

Produce an inventory table:

```text
| Area | Current state | Evidence | Gap vs standard |
```

#### 4.2.2 Adaptation plan

Propose a plan with:

- **Preserved**: features, public APIs, data, existing specs, project decisions.
- **Added**: `AGENTS.md` (or completed), `MEMORY.md`, `specs/constitution`, `specs/features` (if missing), architecture/quality docs, discovery, ADRs, harness, commands/agents, folder structure, English canonical docs and any requested localized copies.
- **Moved/renamed** (only if it adds value and with approval): `from → to`, reason, risk, how it is verified.
- **Not touched**: an explicit list.
- **Backup**: branch `ai-standardization/<date>` if git exists; otherwise `.ai-backup/<timestamp>/` containing only what will be moved.
- **Verification**: current test/lint/build commands and a baseline (did they pass before?).

Ask for approval of the complete plan. If the user wants changes, iterate. Write nothing until approval.

#### 4.2.3 Execution

1. Create the backup before any move.
2. Add missing artifacts without deleting existing ones.
3. If `AGENTS.md` exists, **merge**: keep domain rules and conventions, add missing sections and the documentation map. Do not replace it with a template.
4. If `MEMORY.md` exists, **merge**: keep state and decisions; add the protocol and next steps.
5. If `specs/` uses another format, do not migrate it silently: link it from `specs/README.md` as legacy and propose a feature-by-feature migration.
6. If `.opencode/` exists, do not overwrite commands/agents with the same name: create `.bak-<timestamp>` and ask for confirmation.
7. If you move code, use `git mv` when possible, update imports/configuration and run the tests. If they fail, revert that move and report it.
8. Do not change business logic, public contracts or data.
9. Write all canonical documentation in English. If the user passes `--lang`, add localized copies and `docs/i18n.md`; if the project already had docs in another language, preserve them as translations or legacy, never as the source of truth.
10. Document the adaptation in `docs/migration/ai-standardization.md` with before/after, changes, verification and rollback.

#### 4.2.4 Adaptation and harness

- Ask for authorization to install `find-skills` with the same justification as 3.3.5, only if the stack needs it.
- Propose essential skills with the same criteria.
- Propose MCPs only if they add value; configure them at project scope.
- Ask for authorization for the SDD kit and subagents.
- If the project already has a folder structure that works, **do not change it just for aesthetics**. Propose changes only when they reduce risk, improve boundaries or make testing easier.

### 4.3 New path

1. Ask for the path (absolute or relative).
2. Resolve it and check:
   - Does not exist → create it.
   - Exists and is empty → use it.
   - Exists and has content → warn and offer: adapt that path, choose another, or cancel.
3. Do not touch the current project.
4. Run Flow A in the new path, using absolute paths.

### 4.4 New folder

1. Ask for the parent folder (default: current) and the `kebab-case` name.
2. Validate that `<parent>/<name>` does not exist or is empty.
3. Create it.
4. Run Flow A in that folder, using absolute paths.
5. Do not touch the current project.

---

## 5. Memory, SDD and spec-as-source rules

The generated project must reach the **spec-anchored + spec-as-source** level:

```text
Constitution → Spec → Clarification → Plan → Tasks → Implementation → Validation
```

- **Spec-anchored**: the specification stays alive and is updated with every change.
- **Spec-as-source**: behaviour is defined in the spec; code derives from it. A behaviour change starts in `spec.md`, continues in `clarification.md`, `plan.md` and `tasks.md`, and only then touches code.
- Allowed manual code adjustments must be reflected in the spec in the same session; otherwise the project is considered inconsistent.
- `MEMORY.md` is working memory (state, decisions, next steps). Historical detail goes to `docs/memory/sessions/`.
- `AGENTS.md` is the entry map; it must not contain secrets or duplicate all documentation.
- The constitution (`specs/constitution/`) is stable; if it changes with every feature, it is not a constitution.
- English documentation is canonical. Localized copies are translations and never override the English source.

---

## 6. Structure and templates

### 6.1 Standard tree

```text
<project>/
├── AGENTS.md
├── AGENTS.<lang>.md              # optional, with --lang
├── MEMORY.md
├── MEMORY.<lang>.md              # optional
├── README.md
├── README.<lang>.md              # optional
├── LICENSE
├── .gitignore
├── .env.example
├── opencode.json                 # only with MCPs/OpenCode config
├── docs/
│   ├── README.md
│   ├── architecture.md
│   ├── i18n.md                   # only with --lang
│   ├── discovery/
│   │   ├── README.md
│   │   ├── answers.md
│   │   └── open-questions.md
│   ├── adr/
│   │   ├── README.md
│   │   └── 0001-record-architecture-decisions.md
│   ├── memory/
│   │   ├── README.md
│   │   └── sessions/
│   │       └── .gitkeep
│   ├── quality/
│   │   ├── testing.md
│   │   └── security.md
│   ├── harness/
│   │   └── README.md
│   └── migration/                # only during adaptation
│       └── ai-standardization.md
├── specs/
│   ├── README.md
│   ├── constitution/
│   │   ├── mission.md
│   │   ├── roadmap.md
│   │   ├── tech-stack.md
│   │   └── principles.md
│   ├── features/
│   │   └── 001-<slug>/
│   │       ├── spec.md
│   │       ├── clarification.md
│   │       ├── plan.md
│   │       ├── tasks.md
│   │       └── validation.md
│   └── templates/
│       ├── spec.md
│       ├── clarification.md
│       ├── plan.md
│       ├── tasks.md
│       └── validation.md
├── src/                          # or apps/ + packages/ depending on stack
│   └── README.md
├── tests/
│   └── README.md
├── scripts/
│   └── README.md
└── .opencode/                    # optional, if the kit is installed
    ├── commands/
    └── agents/
```

Adjust `src/` to the approved stack. Every `.md` above also gets a `.<lang>.md` sibling when `--lang` is used. Do not create empty folders without a `README.md` explaining their purpose.

### 6.2 `AGENTS.md`

Mandatory sections, in this order:

```markdown
# AGENTS.md — {{PROJECT}}
{{One or two sentences: what it is, who it is for and what problem it solves.}}

## State
- Phase: definition | MVP | production
- Last updated: {{YYYY-MM-DD}}

## Stack and structure
- Stack: {{language, framework, versions, package manager}}
- Architecture: {{layers/features/hexagonal/monorepo}}
- Key folders: {{...}}

## Commands
- Install: `{{...}}`
- Develop: `{{...}}`
- Test: `{{...}}`
- Lint/format: `{{...}}`
- Build: `{{...}}`

## Documentation map
{{Tree or table with ALL .md paths and one line on when to read each one.}}

## Workflow (SDD)
- Read `specs/README.md` and the active spec before touching code.
- No behaviour change without spec → clarify → plan → tasks → implement → validate.
- One task at a time; tests first; stop when done.
- Update `MEMORY.md` at the end of every task or session.

## Conventions
- Code and identifiers in English.
- Documentation in English; localized copies: {{none | es, pt-BR}}.
- Naming: {{...}}
- Commits: Conventional Commits.
- No secrets in the repository; use `.env` and `.env.example`.

## Boundaries
- Always: {{...}}
- Ask first: new dependencies, structural changes, migrations, installations.
- Never: {{...}}

## Verification
- Tests: `{{...}}`
- Lint: `{{...}}`
- Build: `{{...}}`
- Done when: tests green + acceptance criteria met + no out-of-scope files.

## Memory
- On start: read `MEMORY.md`.
- On finish: update it (state, decisions, next steps, errors).
- Maximum ~60 lines; archive detail in `docs/memory/sessions/`.

## Installed harness
- Skills: {{...}}
- MCPs: {{...}}
- Commands: {{...}}
- Subagents: {{...}}

## Localized copies
{{Only with --lang. List every translation, e.g. AGENTS.es.md, and state that
English is the source of truth. Omit this section when there are no copies.}}
```

Rules:

- Keep `AGENTS.md` under ~80 lines. If you need more, move detail to `docs/` and link it.
- The map must include every `.md` path, including `specs/templates/` and localized copies.
- Do not include secrets or personal data.
- The English file is canonical; localized copies mirror it.

### 6.3 `MEMORY.md`

```markdown
# MEMORY.md — {{PROJECT}}
Working memory across sessions. Maximum ~60 lines. No secrets.

## Current state
- {{What works, what is in progress, what is blocked.}}

## Decisions (and why)
- {{YYYY-MM-DD}} — {{Decision}} — {{Reason}} — Alternatives: {{...}}

## Learnings and mistakes to avoid
- {{...}}

## Next steps
- [ ] {{...}}

## Links
- Active spec: `specs/features/{{NNN-slug}}/spec.md`
- Roadmap: `specs/constitution/roadmap.md`
- Last session: `docs/memory/sessions/{{YYYY-MM-DD}}.md`
```

### 6.4 `README.md`

```markdown
# {{PROJECT}}
{{What it is, who it is for and why.}}

## Quickstart
1. Requirements: {{...}}
2. Install: `{{...}}`
3. Develop: `{{...}}`
4. Test: `{{...}}`

## Structure
{{Short tree with one line per folder.}}

## Documentation
- Product: `specs/constitution/mission.md`
- Roadmap: `specs/constitution/roadmap.md`
- Stack: `specs/constitution/tech-stack.md`
- Architecture: `docs/architecture.md`
- SDD: `specs/README.md`
- Memory: `MEMORY.md`
- Quality: `docs/quality/testing.md`, `docs/quality/security.md`
- Harness: `docs/harness/README.md`

## Development workflow
{{SDD in 5 lines + /sdd-* commands.}}

## Languages
{{English is the source of truth. List localized copies, or "English only".}}

## Contributing
{{...}}

## License
{{...}}
```

### 6.5 `specs/README.md`

Sections:

- What SDD is and why this project uses it.
- Level: spec-anchored + spec-as-source.
- Constitution vs features.
- Artifacts per feature: `spec.md`, `clarification.md`, `plan.md`, `tasks.md`, `validation.md`.
- Reading order and writing order.
- States: `draft`, `clarifying`, `approved`, `implementing`, `implemented`, `validated`.
- Seven-step flow + maintenance.
- Golden rule: no behaviour change without a spec.
- Links to `specs/templates/` and the `/sdd-*` commands.
- Language rule: English source, localized copies in sync.

### 6.6 `specs/constitution/mission.md`

```markdown
# Mission — {{PROJECT}}

## What it is
## Who it is for
## Problem and value proposition
## What it is not (non-goals)
## Product principles
## Success metrics
## Tone and voice
```

### 6.7 `specs/constitution/roadmap.md`

```markdown
# Roadmap — {{PROJECT}}

## How to use it
{{States and priorities.}}

## Features
| ID | Feature | Status | Priority | Depends on | Spec |
|---|---|---|---|---|---|
| 001 | {{...}} | draft | high | — | `specs/features/001-.../spec.md` |

## Backlog / ideas
- {{...}}
```

### 6.8 `specs/constitution/tech-stack.md`

```markdown
# Tech stack — {{PROJECT}}

## Summary
## Languages and versions
## Frameworks and libraries
## Data and persistence
## Infrastructure and deployment
## Commands
## Allowed / forbidden dependencies
## Architecture and patterns
## Conventions
## SDD
- Level: spec-anchored + spec-as-source.
- The spec rules; code derives from it.
```

### 6.9 `specs/constitution/principles.md`

Include 6-8 non-negotiable principles, each with:

- Name.
- What it implies.
- How it is verified.

Recommended minimum:

1. Simplicity first.
2. The spec rules (spec-anchored + spec-as-source).
3. Separation of responsibilities.
4. Tests as a gate.
5. Data and secrets are sacred.
6. Security and privacy by default.
7. Accessibility and i18n when applicable.
8. Language: code and canonical docs in English; user-facing UI may be localized.

### 6.10 `specs/features/NNN-slug/spec.md`

```markdown
# Spec {{NNN}} — {{Name}}

Status: draft | clarifying | approved | implementing | implemented | validated
Priority: {{...}}
Depends on: {{...}}

## Context and goal
{{What problem it solves and why it is worth doing. One paragraph.}}

## Users / actors
{{Who uses it.}}

## User stories
- US-1. As a {{role}}, I want {{action}} so that {{benefit}}.

## Definitions
{{Only when terms are ambiguous.}}

## Functional requirements (EARS)
- FR-1: WHEN {{event}}, THE SYSTEM SHALL {{response}}.
- FR-2: IF {{undesired condition}}, THEN THE SYSTEM SHALL {{response}}.
- FR-3: WHILE {{state}}, THE SYSTEM SHALL {{response}}.
- FR-4: THE SYSTEM SHALL {{permanent behaviour}}.

## Non-functional requirements
{{Performance, security, privacy, accessibility, language, platforms. Only those that apply.}}

## Edge cases
{{Empty, duplicates, corrupt data, limits, concurrency, network errors.}}

## Out of scope
{{What is NOT done in this iteration.}}

## Completion criteria
{{All FRs with evidence + main-flow demo + no out-of-scope files.}}

## Open questions
- [NEEDS CLARIFICATION] {{...}}
```

EARS rules:

- One sentence = one verifiable behaviour.
- No "fast", "nice" or "intuitive" without a measurable criterion.
- Every FR must map to a test or an explicit manual check.
- The spec describes the **what** and **why**, not the stack or file names.

### 6.11 `specs/features/NNN-slug/clarification.md`

```markdown
# Clarification — Spec {{NNN}}

## Ambiguities
## Contradictions
## Uncovered edge cases
## Conflicts with the constitution
## Decisions taken
- {{Question}} → {{Decision}} → {{Source: user | auto}}
## Blocking questions
## Verdict
{{READY | NEEDS CHANGES}}
```

### 6.12 `specs/features/NNN-slug/plan.md`

```markdown
# Plan — Spec {{NNN}}

## Technical summary
## Files created or modified
| File | Responsibility | FR |
## Pure functions / domain
{{Functions, inputs, outputs, edge cases. "Today" as a parameter when relevant.}}
## Algorithm / flow
{{Pseudocode or diagram.}}
## Interface / API
## Technical decisions
- {{Decision}} — Reason — Discarded alternative.
## Test strategy
{{Runner, cases, fixtures, FR coverage.}}
## Risks and mitigations
## Implementation order
## Requirement coverage
| FR | Where it is covered | Test |
```

### 6.13 `specs/features/NNN-slug/tasks.md`

```markdown
# Tasks — Spec {{NNN}}

- [ ] **T1. {{Description}}.** FR-1, FR-2
  - Done when: {{verifiable check}}.
  - Estimate: {{20-30 min}}.
  - Depends on: {{—}}
```

Rules:

- Maximum 10 tasks; if there are more, propose splitting the spec.
- Each task must fit in 20-30 minutes.
- Dependency order.
- Each task references the FRs it covers.
- "Done when" must be observable.

### 6.14 `specs/features/NNN-slug/validation.md`

```markdown
# Validation — Spec {{NNN}}

## Environment
{{Commit, date, commands, versions.}}

## Requirement matrix
| FR | Test / evidence | Result | Notes |
|---|---|---|---|
| FR-1 | {{...}} | PASS / FAIL / PARTIAL | {{...}} |

## Manual checks
{{UI, accessibility, mobile, error flows.}}

## Completion criteria
- [ ] {{...}}

## Out-of-scope files
{{None | list.}}

## Verdict
{{APPROVED | CHANGES REQUIRED}}

## Pending
{{...}}
```

### 6.15 `docs/README.md`

Documentation index with one line per document and the recommended reading order. It must link to every `.md` under `docs/` and `specs/`, plus `AGENTS.md` and `MEMORY.md`, including localized copies when they exist.

### 6.16 `docs/architecture.md`

Sections:

- Context and goals.
- High-level diagram (text or Mermaid).
- Modules and responsibilities.
- Boundaries and dependencies.
- Data flow.
- Design patterns and why.
- Error handling and logging.
- Configuration and environments.
- Security and privacy.
- Observability.
- Folder map.
- Decisions and alternatives (link to ADRs).

### 6.17 `docs/quality/testing.md`

Sections:

- Test pyramid and what is tested at each level.
- Runner and exact commands.
- Naming conventions and fixtures.
- Minimum coverage and what coverage does not measure.
- Integration/E2E tests and test data.
- Definition of Done.
- How to reproduce a bug before fixing it.

### 6.18 `docs/quality/security.md`

Sections:

- Basic threat model.
- Secret management (`.env`, `{env:VAR}`, never in git).
- Authentication and authorization.
- Input and output validation.
- Dependencies and updates.
- Personal data, retention and privacy.
- Pre-deployment checklist.

### 6.19 `docs/adr/0001-record-architecture-decisions.md`

```markdown
# ADR 0001 — Record architecture decisions

## Status
Accepted

## Context
{{...}}

## Decision
{{...}}

## Alternatives considered
{{...}}

## Consequences
{{...}}
```

Create one ADR per important decision (stack, architecture, SDD, auth, data). Do not duplicate the constitution.

### 6.20 `docs/discovery/answers.md`

Interview log:

- Date and mode.
- Question → answer → source (user | suggestion | auto).
- Decisions and reasons.
- Confirmed assumptions.
- Link to `open-questions.md`.
- Language copies requested and generated.

### 6.21 `docs/discovery/open-questions.md`

```markdown
# Open questions

| ID | Question | Impact | Blocking | Owner | Status |
|---|---|---|---|---|---|
| Q-1 | {{...}} | {{...}} | yes/no | user | open |
```

### 6.22 `docs/memory/README.md`

Memory protocol:

- `MEMORY.md` is hot memory (≤60 lines).
- `docs/memory/sessions/YYYY-MM-DD.md` stores the detail of each session.
- On start: read `AGENTS.md`, `MEMORY.md` and the active spec.
- On finish: update state, decisions, next steps and errors.
- Never store secrets or personal data.
- If a decision becomes permanent, move it to `AGENTS.md` or the constitution.

Session template:

```markdown
# Session {{YYYY-MM-DD}}

## Goal
## What was done
## Decisions
## Problems and solutions
## Next steps
## Files touched
```

### 6.23 `docs/harness/README.md`

Sections:

- Installed skills: name, source, version, why, scope, how to uninstall.
- MCPs: name, type, URL/command, auth, why, how to disable.
- Commands: name, purpose, scope.
- Subagents: name, role, permissions, scope.
- How to review and update the harness.
- Date of the last review.

### 6.24 `specs/templates/*`

Copy the `spec.md`, `clarification.md`, `plan.md`, `tasks.md` and `validation.md` templates with `{{...}}` placeholders so the user can create new features without copying an existing one. If `--lang` is active, create `spec.<lang>.md`, `clarification.<lang>.md`, etc.

### 6.25 Localized copies and `docs/i18n.md`

When `--lang` is active, after all English files exist and pass validation:

1. Create the translation for every generated `.md` using the suffix rule.
2. Keep identical structure: same headings hierarchy, tables, links, code fences, IDs and paths. Translate prose and headings only.
3. Add this marker as the first line of every translated file:
   ```html
   <!-- TRANSLATION of <relative-path> · source: English · synced: YYYY-MM-DD -->
   ```
4. In each English file, add a `Languages` section or a line near the top:
   ```markdown
   Languages: English (source) · [Español](AGENTS.es.md)
   ```
   In the translated file, point back to English and to the other copies, never to itself.
5. Create `docs/i18n.md` in English only. Do not translate the index itself:
   ```markdown
   # Localized documentation

   English is the source of truth. These copies are for human readers.

   | English source | Translation | Language | Synced | Status |
   |---|---|---|---|---|
   | `AGENTS.md` | `AGENTS.es.md` | es | YYYY-MM-DD | current |
   ```
6. Add the localized copy paths to the `AGENTS.md` documentation map and to `docs/README.md`.
7. Validate that every English `.md` has its counterpart (except `docs/i18n.md`), that no counterpart is empty, and that links resolve in both languages.
8. On later updates: edit English first, update the translation, refresh the `synced` date and `status`. If not updated, set `status: outdated` and tell the user which files are stale.

If `--lang` is absent, do not create `docs/i18n.md`, language sections, markers or suffixed files.

---

## 7. Final validation

Before declaring done, check:

1. **Tree**: every expected folder and file exists.
2. **`AGENTS.md` map**: every listed `.md` path exists, including localized copies. Fix any missing path.
3. **Placeholders**: guided mode has no generic `{{...}}` or `TODO`; only justified `[NEEDS CLARIFICATION]`. Generic mode keeps intentional `TODO`s.
4. **JSON**: `opencode.json` and every `.json` file parse. Use `node -e` or `python -m json.tool`.
5. **Relative links**: Markdown links to local files resolve.
6. **Specs**: every roadmap feature has `spec.md`; the first feature has all 5 artifacts.
7. **Language**: English is present for every document. With `--lang`, every English `.md` has a non-empty translated sibling, every translation has the marker, `docs/i18n.md` lists them, and statuses are accurate.
8. **Tests**: run the available test/lint/build commands **without installing dependencies**. If they cannot run, say so and explain why.
9. **Git**: show `git status --short`; do not commit or push without permission.
10. **Secrets**: search versioned files for obvious patterns (`API_KEY=`, `SECRET=`, `TOKEN=`, `password=`) and confirm they only appear as names in `.env.example`.

If something fails, fix what you can without destructive changes and report what remains.

---

## 8. Final report

Deliver a compact report in the user's language:

```text
## Project created/adapted

Path: <...>
Mode: generic | guided | adaptation
SDD level: spec-anchored + spec-as-source
Documentation: English | English + es, pt-BR

## What was created
<Short tree or list of blocks.>

## Decisions I made
<Only [auto] decisions, with a one-line reason each.>

## Installed harness
- Skills: <...>
- MCPs: <...>
- Commands: <...>
- Subagents: <...>

## Open questions
<Links to docs/discovery/open-questions.md.>

## Language copies
<None | list and link to docs/i18n.md, with any outdated files.>

## Verification
- Tests: <...>
- Lint: <...>
- Build: <...>
- Links/paths: <...>

## Next steps
1. <...>
2. <...>
3. <...>

## Rollback
<Branch/backup and how to go back.>
```

End with a clear sentence: **no application feature has been implemented; only the structure, documentation and harness.**

---

## 9. Safety, recovery and limits

- **Never** run `rm -rf`, `git reset --hard`, `git clean -fd`, `git push --force` or destructive commands.
- Before moving or deleting: backup and approval.
- If a step fails midway, stop, report and leave the project in a comprehensible state. Do not keep writing as if nothing happened.
- If the user cancels, write nothing else and explain what remains done.
- If you find a secret in the repository, do not copy it into documentation; warn the user and propose rotation.
- If the user asks for something that contradicts these rules, explain the risk and ask for explicit confirmation; do not do it silently.
- If the project exists and has no git, create a backup before touching anything.
- If the user chooses `You choose`, you may decide, but you may not install, delete, move or change functionality without saying so and getting approval.
- Never claim a translation is current when its English source changed afterwards.

---

## 10. Completion criteria

The run ends when:

- The project has `AGENTS.md`, `MEMORY.md`, `specs/` with a constitution and at least one feature, `docs/` with architecture/quality/memory/harness, and the stack skeleton.
- `AGENTS.md` lists every `.md` path and the SDD workflow.
- `MEMORY.md` has state, decisions and next steps.
- The validation from section 7 has run and been reported.
- With `--lang`, every localized copy exists, is marked and is listed in `docs/i18n.md`.
- The user knows what was installed, what was decided automatically, which questions remain and what command to run next.
- No application feature has been implemented.
