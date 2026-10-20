# Testing

The repository has no dependencies: tests use `node:test` and `node:assert/strict`, and the installer is tested the way a person would use it, by running it in temporary folders.

## Commands

```bash
npm run validate   # frontmatter, sections, paths, links and language policy
npm test           # installer, command and repository
npm run check      # validate + test
```

Requirements: Node.js 20 or higher.

## What validation covers

`scripts/validate.mjs` checks:

- `package.json` parses and its scripts point to existing files.
- The canonical command has frontmatter with `description` and `agent`, and sections 0 to 10.
- The command keeps its key guarantees: one question at a time, `Any suggestions?`, `You choose`, the four existing-project options, `find-skills`, spec-anchored SDD, English artifacts, `--lang`, `--help` and the prohibition on global installs.
- `SKILL.md` has `name`, `description`, `license` and version.
- Every `/sdd-*` command has `description` and `agent`.
- Every subagent has `description` and `mode`.
- The `sdd` skill has `name` and `description`.
- Templates exist and have titles.
- The installer contains no network calls and supports the documented options.
- Relative links in `README.md`, `README.es.md`, `CONTRIBUTING.md` and `docs/` resolve.
- The version is coherent across `package.json`, `SKILL.md` and `CHANGELOG.md`.

Validation exits with code 1 and lists every problem with its file.

## What tests cover

### Installer (`tests/installer.test.mjs`)

Each test creates a temporary folder and runs the installer with `cwd` inside it. It never writes to the repository or the real home directory.

| Case | What it verifies |
|---|---|
| `--dry-run` | Creates no files |
| Project + OpenCode | Creates `.opencode/commands/new_ai_project.md` with the canonical content |
| Idempotency | A second run does not change the file |
| `--force` | Overwrites and leaves a `.bak-<timestamp>` |
| Claude | Removes `agent` from frontmatter |
| Copilot | Creates `.github/prompts/new_ai_project.prompt.md` with `mode: agent` |
| SDD kit | Installs 9 commands, 4 subagents, the `sdd` skill and 5 templates |
| Global SDD kit | Writes to the temporary home and never creates `~/specs` |
| Invalid target | Exits with code 1 and explains valid targets |
| Unknown option | Exits with code 1 and shows help |
| `--help` | Exits with code 0 and shows usage |
| `--global` | With a temporary home, writes to `.config/opencode/commands/` |
| CRLF source | Parses frontmatter and transforms Claude commands on Windows checkouts |

### Command (`tests/command.test.mjs`)

- Correct frontmatter and non-empty body.
- Section structure and phrases that must not disappear.
- Both help options in every question (`Any suggestions?`, `You choose`).
- The four options for existing projects.
- `find-skills` with its URL and project-scoped install command.
- `AGENTS.md`, `MEMORY.md`, constitution, features and the five artifacts.
- English-by-default policy and `--lang` duplicates (`AGENTS.es.md`).
- `--help` mode.
- Safety and scope prohibitions.

### Repository (`tests/repo.test.mjs`)

- Expected assets exist and are not empty.
- The SDD command names are the nine documented ones.
- README links resolve.
- `scripts/validate.mjs` exits with code 0.

## Manual command test

Automated tests cannot evaluate interview quality. Before publishing a version, run this test:

1. Create an empty folder and open it with OpenCode.
2. Install the command:

   ```bash
   node <REPO_PATH>/skills/new-ai-project/scripts/install.mjs --project --target opencode --with-sdd-kit
   ```

3. Run `/new_ai_project --help`.
   - It must print usage and write nothing.
4. Run `/new_ai_project generic`.
   - It must create only folders and `.md` files with headings and `TODO`.
   - It must not invent product, stack or features.
   - It must not install skills or MCPs.
   - Every document must be English.
5. Delete the folder and repeat with `/new_ai_project` in guided mode.
   - One question per message.
   - Every question offers `Any suggestions?` and `You choose`.
   - The structure plan is approved before writing.
   - At the end, `AGENTS.md`, `MEMORY.md`, `specs/constitution/`, a feature with five artifacts and `docs/` exist.
   - The final report lists decisions, questions, verification and rollback.
6. Run `/new_ai_project guided --lang=es`.
   - Every English `.md` has a `.es.md` sibling, except `docs/i18n.md`.
   - Each translation starts with the `TRANSLATION of` marker.
   - `docs/i18n.md` lists source, translation, language, date and status.
   - `AGENTS.md` and `docs/README.md` link to the copies.
7. Test adaptation in a sample repository with code and a `README.md`.
   - It must ask before touching anything.
   - It must offer adapt, new path, new folder or cancel.
   - It must preserve existing code and tests.
8. Test `/sdd-spec`, `/sdd-clarify`, `/sdd-plan`, `/sdd-tasks`, `/sdd-implement` and `/sdd-validate` on the created feature.
   - New feature documents must be English and, with `--lang`, have localized copies.

## Compatibility matrix

Test at least once per version:

| Harness | Installation | Check |
|---|---|---|
| OpenCode | `--target opencode` | `/new_ai_project` appears and runs |
| Claude Code | `--target claude` | The command appears without `agent` in frontmatter |
| Cursor | `--target cursor` | The command appears in `.cursor/commands/` |
| Copilot | `--target copilot` | `.github/prompts/new_ai_project.prompt.md` with `mode: agent` |

## Debugging

- **The command does not appear**: check the harness path, restart the session and verify the file ends in `.md` (or `.prompt.md` in Copilot).
- **A file is skipped**: that is the default; use `--force` and review the backup.
- **The installer fails on Windows**: run `node --version`; Node 20+ is required. Use `path.join`, never manual concatenation.
- **A skill does not install**: `npx skills` needs network. The command installer does not; skill installation is a separate, authorized step.
- **OpenCode JSON does not parse**: validate with `node -e "JSON.parse(require('fs').readFileSync('opencode.json','utf8'))"` before continuing.
- **Translations look stale**: compare the English source, the marker date and `docs/i18n.md`; update the source first.

## CI

`.github/workflows/ci.yml` runs `npm run validate` and `npm test` on Ubuntu and Windows with Node.js 20 and 22. A pull request does not merge with red CI.
