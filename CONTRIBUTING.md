# Contributing

Thanks for improving `new-ai-project`. This repository contains an agent command, an installer and an SDD kit; changes must preserve portability across harnesses and must not break existing projects.

## Before opening an issue

- Search for an existing issue.
- Include harness and version (OpenCode, Claude Code, Cursor, Copilot), operating system and Node.js version.
- Add the exact command you ran and the relevant output, without secrets or personal paths.
- For command failures, include the model version if it affects behaviour.

## Development environment

Requirements: Node.js 20 or higher and git.

```bash
git clone https://github.com/<YOUR_USER>/new-ia-project.git
cd new-ia-project
npm run validate
npm test
```

There are no production or development dependencies: everything uses the Node.js standard library.

## Structure to respect

```text
skills/new-ai-project/
├── SKILL.md                     # Distribution wrapper; no logic
├── command/new_ai_project.md    # Command source of truth
├── scripts/install.mjs          # Local installer, no network
├── assets/commands/             # /sdd-* commands
├── assets/agents/               # OpenCode subagents
├── assets/skills/sdd/SKILL.md   # Local SDD skill
├── assets/templates/            # Artifact templates
└── references/                  # Structure and compatibility
```

Rules:

- Command logic lives **only** in `command/new_ai_project.md`; `SKILL.md` references it.
- The installer downloads nothing and writes outside the project only with explicit `--global`.
- Assets must work without the repository: no absolute paths or external imports.
- Generated project documents are written in **English**. Localized copies are optional translations and must stay in sync with the English source.
- Code, identifiers, paths and commit messages are in English.

## How to test a change

1. Run `npm run validate` to check frontmatter, sections, links and language policy.
2. Run `npm test` for the installer and command guarantees.
3. Test a real installation in a temporary folder:

   ```bash
   mkdir /tmp/test-new-ai-project && cd /tmp/test-new-ai-project
   node <REPO_PATH>/skills/new-ai-project/scripts/install.mjs --project --target opencode --with-sdd-kit
   ```

4. Open that folder with OpenCode and run `/new_ai_project` in generic mode.
5. If you changed the guided flow, complete one full interview and review the five generated artifacts.
6. If you changed `--lang`, verify `AGENTS.es.md`, `spec.es.md` and `docs/i18n.md`.

The detailed guide is in [docs/testing.md](docs/testing.md).

## Style

- Clear Markdown, English for canonical documentation and code.
- No decorative emojis in technical documentation.
- No screenshots that expire; prefer reproducible text blocks.
- File names and slugs in `kebab-case`.
- Installer messages in English, readable in Windows terminals.

## Commits and pull requests

Use Conventional Commits:

```text
feat: add localized copies to new_ai_project
fix: preserve agent frontmatter on claude target
docs: explain skills.sh publication
test: cover --lang duplicate generation
chore: bump version to 1.0.1
```

A pull request must include:

- What problem it solves and why.
- What changes for the user.
- How you tested it (commands and result).
- Whether it affects cross-harness compatibility.
- Whether `README.md`, `README.es.md` or `CHANGELOG.md` need updates.

## Adding a harness

1. Add the target in `VALID_TARGETS` and `commandPaths()` in `install.mjs`.
2. Document paths, frontmatter and limitations in `skills/new-ai-project/references/compatibility.md`.
3. Update the compatibility table in both README files.
4. Add a test that verifies the path and generated frontmatter.
5. Verify that the command body remains portable Markdown.

## Adding an SDD command or subagent

- Commands go in `assets/commands/sdd-<name>.md`, with `description` and `agent`.
- Subagents go in `assets/agents/<name>.md`, with minimal permissions.
- If the flow changes, update `assets/skills/sdd/SKILL.md`, the templates and `docs/design.md`.
- Add the new command to the final report list in the main command and to both README files.

## Language rules

- Canonical Markdown is English.
- Translations are complete, keep the same structure and identifiers, and include the `<!-- TRANSLATION of ... -->` marker.
- Update the English source first, then the translation, and refresh `docs/i18n.md`.
- Never make a translation the source of truth.

## Security

- Do not include secrets, tokens or personal data in examples, tests or issues.
- Do not add destructive operations (`rm -rf`, `git reset --hard`, `git clean -fd`, `git push --force`).
- Do not introduce network calls in the installer.
- Third-party skills must cite their source and be justified before being recommended.

## License

By contributing you agree that your contribution is published under this repository's MIT license.
