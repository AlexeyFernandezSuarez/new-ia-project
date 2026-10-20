# new-ai-project

**A slash command that gets any folder ready for AI-assisted software development.**

`/new_ai_project` creates (or adapts) an AI-first project structure: `AGENTS.md`, persistent memory, full Spec-Driven Development, living documentation, a project-level harness, and a code skeleton that matches the chosen stack.

> The AI executes. You direct. This command builds the harness so directing is easier.

---

## What it is and what it is not

**It is** a project and harness bootstrap:

- Folder and file structure.
- An `AGENTS.md` that knows the project and routes to every document.
- A `MEMORY.md` with a memory protocol across sessions.
- SDD at the **spec-anchored + spec-as-source** level, with every step included.
- A guided interview to define product, requirements, stack and features.
- English documentation by default, with optional localized copies (`--lang=es` → `AGENTS.es.md`).
- Optional, project-level, permission-based installation of skills, MCPs, commands and subagents.
- Non-destructive adaptation of existing projects.

**It is not** an application generator. It does not implement features, does not pick your product for you, and never installs anything globally unless you explicitly ask for it.

---

## Installation

Requirements: Node.js 20 or higher. The installer makes no network requests.

### Option A — As a skill from skills.sh

```bash
npx skills add AlexeyFernandezSuarez/new-ai-project --skill new-ai-project -a opencode -y --copy
```

Then install the slash command into the project:

```bash
node .agents/skills/new-ai-project/scripts/install.mjs --project --target opencode
```

### Option B — From the repository, globally

```bash
git clone https://github.com/AlexeyFernandezSuarez/new-ai-project.git
cd new-ai-project
node skills/new-ai-project/scripts/install.mjs --global --target opencode
```

The command is then available in every project as `/new_ai_project`.

### Option C — For a single project only

```bash
node /path/to/new-ai-project/skills/new-ai-project/scripts/install.mjs --project --target opencode
```

With the local SDD kit (`/sdd-*` commands, subagents and the `sdd` skill):

```bash
node skills/new-ai-project/scripts/install.mjs --project --target opencode --with-sdd-kit
```

### Installer options

```text
--project              Install into the current project (default).
--global, -g           Install into the user directory.
--target <list>        opencode,claude,cursor,copilot (default: auto-detect).
--with-sdd-kit         Install /sdd-*, subagents and the sdd skill.
                       Templates are copied only at project scope.
--force, -f            Overwrite with a .bak-<timestamp> backup.
--dry-run              Show what it would do without writing.
--help, -h             Show installer help.
```

Examples:

```bash
# OpenCode, current project, with the SDD kit
node skills/new-ai-project/scripts/install.mjs --project --target opencode --with-sdd-kit

# Claude Code and Cursor, without the kit
node skills/new-ai-project/scripts/install.mjs --project --target claude,cursor

# Preview without writing
node skills/new-ai-project/scripts/install.mjs --project --target opencode --dry-run
```

---

## Usage

Inside OpenCode (or whichever harness you installed it into):

```text
/new_ai_project
```

### Command help

Every invocation supports `--help` or `-h`. It prints usage, modes, options and examples, and writes nothing:

```text
/new_ai_project --help
```

The help output is:

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

Other examples:

```text
/new_ai_project I want an app to track my study sessions
/new_ai_project generic
/new_ai_project guided --lang=es
/new_ai_project --path=../my-new-project --lang=es
/new_ai_project adapt --yes --no-install
```

### Documentation language

- **All generated Markdown is written in English.** This is what the model reads and what stays canonical.
- **The conversation uses your language.** Questions, summaries, approvals and the final report are in the language you speak.
- **Optional localized copies.** Pass `--lang=<code>` to create a complete translation next to every generated `.md`:

  ```text
  AGENTS.md          AGENTS.es.md
  MEMORY.md          MEMORY.es.md
  README.md          README.es.md
  specs/features/001-checkout/spec.md
                     specs/features/001-checkout/spec.es.md
  docs/architecture.md
                     docs/architecture.es.md
  ```

  A `docs/i18n.md` index lists every source, translation, sync date and status. English is always the source of truth. The index itself is not translated.
- **No parameter, no copies.** Default output is English only.
- **Multiple languages.** `--lang=es,pt-BR` creates both sets.

### If the folder is empty

The command offers two paths:

1. **Generic structure**: creates only folders and `.md` files with headings, sections and `TODO`s. It does not invent your product or stack. Ideal if you want to fill it in at your own pace.
2. **Guided build**: asks one question at a time to define product, users, MVP, data, stack, architecture, features, quality and delivery. At the end it generates the full documents and, with your permission, installs what is needed.

In guided mode, every question always offers:

- Answer in your own words.
- **Any suggestions?** — the model proposes 2-3 options with pros, cons and a recommendation.
- **You choose** — the model decides, applies it and tells you the decision.
- **Stop here** — generates a draft with what exists and marks what is missing.

### If a project already exists

The command does not touch anything on its own. It asks:

1. **Adapt** the current project to AI-first standards, preserving existing features and specs.
2. **New path** for the new project.
3. **New folder** for the new project.
4. Cancel.

Adaptation is non-destructive: inventory, plan, backup, merge of `AGENTS.md`/`MEMORY.md`, structural changes only with approval, and tests after every move. Existing docs in other languages are preserved as translations or legacy, never as the source of truth.

---

## What it creates

```text
<project>/
├── AGENTS.md
├── AGENTS.<lang>.md        # optional, with --lang
├── MEMORY.md
├── README.md
├── .env.example
├── docs/
│   ├── architecture.md
│   ├── i18n.md             # optional, with --lang
│   ├── discovery/{answers,open-questions}.md
│   ├── adr/
│   ├── memory/
│   ├── quality/{testing,security}.md
│   └── harness/README.md
├── specs/
│   ├── README.md
│   ├── constitution/{mission,roadmap,tech-stack,principles}.md
│   ├── features/001-<slug>/
│   │   ├── spec.md
│   │   ├── clarification.md
│   │   ├── plan.md
│   │   ├── tasks.md
│   │   └── validation.md
│   └── templates/
├── src/            # skeleton adapted to the stack
├── tests/
├── scripts/
└── .opencode/      # optional: commands and agents
```

The `src/`, `tests/` and `scripts/` layout adapts to the approved stack: feature-based for frontend, layers or hexagonal for APIs, monorepo for fullstack, pipeline for data/ML, and so on. Every `.md` gets a `.<lang>.md` sibling when `--lang` is used.

---

## SDD: spec-anchored + spec-as-source

The project is generated with the full flow:

```text
Constitution → Spec → Clarification → Plan → Tasks → Implementation → Validation
```

- **Spec-anchored**: the specification stays alive and is updated with every change.
- **Spec-as-source**: behaviour is defined in the spec; code derives from it.
- Each feature lives in `specs/features/NNN-slug/` with five artifacts: `spec.md`, `clarification.md`, `plan.md`, `tasks.md` and `validation.md`.
- Requirements are written in **EARS** (`WHEN... THE SYSTEM SHALL...`, `IF... THEN...`, `WHILE...`, `THE SYSTEM SHALL...`).
- No behaviour change is implemented without updating the spec first.

With the SDD kit installed:

```text
/sdd-constitution
/sdd-spec 002-name initial idea
/sdd-clarify 002-name
/sdd-plan 002-name
/sdd-tasks 002-name
/sdd-implement 002-name T1
/sdd-validate 002-name
/sdd-change 002-name new requirement
/sdd-status 002-name
```

---

## Skills, MCPs and agents

The command can install, **always at project scope and with explicit authorization**:

- **`find-skills`** (Vercel Labs, [skills.sh](https://www.skills.sh/vercel-labs/skills/find-skills)): searches and installs skills from the ecosystem.
- **Essential stack skills**: official sources only, ≥100k installs or ≥10k stars, no overlaps, reviewed before installing. Maximum 3-5.
- **MCPs**: Context7, Chrome DevTools, GitHub, databases, Figma... only if they add value. V2 configuration in `opencode.json`, secrets via `{env:VAR}`.
- **`/sdd-*` commands**: the full SDD flow.
- **Subagents**: `coordinator`, `planner`, `implementer`, `reviewer`, with minimal permissions.

No `-g`. No installing for the sake of installing. Every installation is justified with what, why, cost, scope and how to uninstall it.

---

## Compatibility

| Harness | Command | Skill | Notes |
|---|---|---|---|
| **OpenCode** | `.opencode/commands/` | `.opencode/skills/`, `.agents/skills/` | Full support, including `agent: build` and subagents |
| **Claude Code** | `.claude/commands/` | `.claude/skills/` | The installer removes `agent` from the frontmatter |
| **Cursor** | `.cursor/commands/` | `.agents/skills/` | Portable command; no subagents |
| **GitHub Copilot** | `.github/prompts/*.prompt.md` | `.agents/skills/` | Prompt mode; no subagents |

The command body is portable Markdown. If your harness does not support file-based commands, use it as a prompt pasted into the chat.

---

## Security

- Nothing global by default.
- No secrets in documents, prompts or configuration.
- No `rm -rf`, `git reset --hard`, `git clean -fd` or `git push --force`.
- Backup before moving or overwriting.
- Existing project features are never changed.
- Nothing is installed without explicit approval.
- Third-party skills are read before installing.

---

## Development

Requirements: Node.js 20 or higher.

```bash
npm run validate  # frontmatter, sections, paths, links and language policy
npm test          # installer, command and repository tests
npm run check     # validate + test
```

Repository layout:

```text
new-ia-project/
├── skills/new-ai-project/
│   ├── SKILL.md
│   ├── command/new_ai_project.md   # source of truth
│   ├── scripts/install.mjs
│   ├── assets/{commands,agents,skills,templates}/
│   └── references/
├── tests/
├── docs/
└── .github/workflows/ci.yml
```

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/testing.md](docs/testing.md).

---

## Publishing

### GitHub

```bash
git init
git add .
git commit -m "feat: new_ai_project command and SDD toolkit"
git branch -M main
git remote add origin https://github.com/AlexeyFernandezSuarez/new-ai-project.git
git push -u origin main
```

### skills.sh

The repository already contains `skills/new-ai-project/SKILL.md`, so the CLI can discover it:

```bash
npx skills add AlexeyFernandezSuarez/new-ai-project --skill new-ai-project --list
```

Once published, the listing appears at `https://www.skills.sh/AlexeyFernandezSuarez/new-ai-project`. Full instructions: [docs/publishing.md](docs/publishing.md).

---

## License

MIT. See [LICENSE](LICENSE).

---

**Español:** [README.es.md](README.es.md)
