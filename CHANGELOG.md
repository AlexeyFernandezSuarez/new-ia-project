# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and versioning follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.1] - 2026-10-21

### Fixed

- `/new_ai_project --help` now runs a hard help gate before preflight. The raw arguments are shown at the top of the expanded prompt and the command stops without inspecting or modifying the project.
- Removed an exclamation-mark-plus-backtick sequence that OpenCode interpreted as shell injection, which corrupted the arguments section of the expanded prompt.
- The command now contains exactly one `$ARGUMENTS` placeholder, avoiding self-referential substitutions such as "If `--help` contains `--help`".
- Added validation and regression tests for the help gate, placeholder count and shell-injection pattern.
- Documented `opencode reload` / restarting OpenCode after updating an existing global command.

## [1.0.0] - 2026-10-20

### Added

- `/new_ai_project` command with two flows: generic structure and guided build.
- One-question-at-a-time interview with `Any suggestions?` and `You choose` options.
- Non-destructive flow for existing projects: adapt, new path, new folder or cancel.
- AI-first structure: `AGENTS.md`, `MEMORY.md`, `specs/`, `docs/`, code skeleton and project-level harness.
- SDD at the spec-anchored + spec-as-source level, with five artifacts per feature.
- English documentation by default; `--lang=<code>` creates complete localized copies (`AGENTS.es.md`, `spec.es.md`, ...) and a `docs/i18n.md` index.
- `--help` / `-h` command help with modes, options, examples and language policy.
- Optional SDD kit: nine `/sdd-*` commands, four subagents and the local `sdd` skill.
- Network-free installer for OpenCode, Claude Code, Cursor and GitHub Copilot, at project scope and explicit global scope.
- Spec, clarification, plan, tasks and validation templates.
- Design, publishing and testing documentation, plus ADRs for the SDD model and project-scoped installs.
- Tests with `node --test` and static repository validation.
- Continuous integration on Linux and Windows with Node.js 20 and 22.

[Unreleased]: https://github.com/AlexeyFernandezSuarez/new-ia-project/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/AlexeyFernandezSuarez/new-ia-project/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/AlexeyFernandezSuarez/new-ai-project/releases/tag/v1.0.0
