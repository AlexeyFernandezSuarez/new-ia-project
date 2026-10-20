# Generated structure

`/new_ai_project` creates this structure (adapting `src/` to the chosen stack):

```text
<project>/
├── AGENTS.md                     # Entry map: rules, stack, commands, .md paths
├── AGENTS.<lang>.md              # Optional localized copy (--lang)
├── MEMORY.md                     # Hot memory (≤60 lines)
├── MEMORY.<lang>.md              # Optional localized copy
├── README.md                     # Human onboarding
├── README.<lang>.md              # Optional localized copy
├── LICENSE
├── .gitignore
├── .env.example                  # Variable names, never values
├── opencode.json                 # Only with MCPs/OpenCode config
├── docs/
│   ├── README.md                 # Documentation index
│   ├── architecture.md           # Modules, boundaries, data, patterns
│   ├── i18n.md                   # Only with --lang: translation index
│   ├── discovery/
│   │   ├── README.md
│   │   ├── answers.md            # Interview log
│   │   └── open-questions.md     # Open questions
│   ├── adr/
│   │   ├── README.md
│   │   └── 0001-record-architecture-decisions.md
│   ├── memory/
│   │   ├── README.md             # Memory protocol
│   │   └── sessions/             # Per-session detail
│   ├── quality/
│   │   ├── testing.md
│   │   └── security.md
│   ├── harness/
│   │   └── README.md             # Installed skills, MCPs, commands and agents
│   └── migration/
│       └── ai-standardization.md # Only when adapting an existing project
├── specs/
│   ├── README.md                 # How the project's SDD works
│   ├── constitution/
│   │   ├── mission.md            # What it is, who it is for, non-goals
│   │   ├── roadmap.md            # Features and status
│   │   ├── tech-stack.md         # Stack, commands, constraints
│   │   └── principles.md         # 6-8 non-negotiable principles
│   ├── features/
│   │   └── 001-<slug>/
│   │       ├── spec.md           # What and why (EARS)
│   │       ├── clarification.md  # QA review
│   │       ├── plan.md           # How
│   │       ├── tasks.md          # Verifiable tasks
│   │       └── validation.md     # Evidence per FR
│   └── templates/                # Templates for new features
├── src/                          # Stack skeleton (or apps/ + packages/)
├── tests/                        # Test structure
├── scripts/                      # Project automation
└── .opencode/                    # Optional: commands and agents
    ├── commands/
    └── agents/
```

Every `.md` above gets a `.<lang>.md` sibling when `--lang` is used. The English file is canonical.

## Why this structure

- **`AGENTS.md` is small and routes**: it does not duplicate documentation. It holds what the agent needs on every turn and a path map so it only reads what is relevant.
- **`MEMORY.md` is working memory**: state, decisions and next steps. Historical detail goes to `docs/memory/sessions/` to avoid filling the context.
- **The constitution is stable**: mission, roadmap, stack and principles. If it changes with every feature, it is not a constitution.
- **Each feature has five artifacts**: spec, clarification, plan, tasks and validation. This makes the full SDD flow visible and lets you audit what was decided and what was verified.
- **`docs/` separates Architecture, Quality, Discovery, Memory and Harness**: the agent knows what to read for each task.
- **Code is created as a skeleton**: folders, placeholder files and READMEs. No features are implemented during bootstrap.
- **Localized copies are translations**: they preserve structure and traceability, but English remains the source of truth.

## SDD flow

```text
Constitution (once)
      │
      ▼
Spec → Clarification → Plan → Tasks → Implementation → Validation
 ▲                                                          │
 └──────────────── maintenance / new feature ◄──────────────┘
```

Level: **spec-anchored + spec-as-source**.

- The spec stays alive.
- Behaviour is defined in the spec; code derives from it.
- A behaviour change starts in `spec.md` and ends in code + `validation.md`.
- Manual code adjustments are reflected in the spec in the same session.

## Generic vs guided mode

| | Generic | Guided |
|---|---|---|
| Questions | None | 15-25, one at a time |
| Content | Headings + `TODO` | Real product, stack and features |
| Skills/MCPs | No | Yes, with approval |
| SDD kit | Optional | Recommended |
| Code | Minimal skeleton | Skeleton adapted to the stack |
| Gaps | `TODO` | `[NEEDS CLARIFICATION]` + `open-questions.md` |
| Language copies | With `--lang` | With `--lang` |

## Adapting an existing project

- Existing features and specs are not changed.
- Missing pieces are added and `AGENTS.md`/`MEMORY.md` are merged.
- Any folder move is proposed, approved, backed up and verified with tests.
- The migration is documented in `docs/migration/ai-standardization.md`.
- Canonical documentation is rewritten in English; existing docs in other languages are preserved as translations or legacy, never as the source of truth.
