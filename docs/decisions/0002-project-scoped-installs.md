# ADR 0002 — Project-scoped installation by default

- **Status**: accepted
- **Date**: 2026-10-20
- **Deciders**: `new-ai-project` maintainers
- **Affects**: `scripts/install.mjs`, `command/new_ai_project.md`, `SKILL.md`

## Context

The command can install skills, MCPs, commands and subagents. The convenient option is to install everything into the user directory (`~/.config/opencode`, `~/.claude`, etc.), but that has effects that are hard to audit:

- A global skill changes the behaviour of every project, including those that do not need it.
- A global MCP can expose credentials or tools to unrelated repositories.
- A global subagent with broad permissions runs where the user does not expect it.
- Uninstalling requires remembering what was installed and where.
- In teams, global configuration is not versioned and not shared.

At the same time, the user may want the command available everywhere without installing it project by project.

## Decision

1. **The command always installs at project scope.** Skills, MCPs, commands and subagents go into the repository and are versioned with it. The command forbids `-g` and `--global`.
2. **Every installation requires explicit authorization** and is justified with what, why, cost, scope and how to uninstall it.
3. **The installer uses project scope by default.** `--global` exists only as an explicit opt-in for the command itself and the SDD kit, never for third-party skills or MCPs.
4. **Secrets are never written into configuration.** Use environment variables and `{env:VAR}`.
5. **Uninstalling is local**: delete the installed folder and the configuration entry. No hidden state remains in the user directory.

## Alternatives considered

### Everything global for convenience

- **Advantage**: a single installation.
- **Disadvantage**: cross-contamination, broad permissions and difficult auditing.
- **Reason for rejection**: contradicts the "no surprises" principle and least privilege.

### Always ask project or global

- **Advantage**: maximum flexibility.
- **Disadvantage**: adds a decision to every installation and pushes the user toward global for speed.
- **Reason for rejection**: the default should be the safe option.

### No installer, documentation only

- **Advantage**: zero risk.
- **Disadvantage**: the user copies files by hand and makes path or frontmatter mistakes.
- **Reason for rejection**: the installer solves a real problem and is auditable.

## Consequences

### Positive

- The harness travels with the repository and every team member gets the same behaviour.
- Permissions and skills are reviewed in the pull request.
- Rollback is deleting versioned files.
- A legacy project does not inherit tools it did not ask for.
- Localized documentation copies are versioned with the project and reviewed like source.

### Negative

- Installation must be repeated for each new project. The command does it in one step.
- A user who wants the command in every project must run `--global` once.
- Harness files add noise to the repository; this is mitigated with a single documented folder.
- Translation copies add review surface; `docs/i18n.md` makes the cost visible.

### Neutral

- Some harnesses have no portable equivalent for subagents; the installer omits them instead of inventing a translation.

## Compliance

- `npm test` verifies that the default installation writes inside the project.
- The `--global` test uses a temporary home and confirms that it only writes there when requested.
- Command validation checks that it still forbids global installations.
- A pull request that adds an implicit global installation must be rejected.

## References

- `scripts/install.mjs`.
- `skills/new-ai-project/references/compatibility.md`.
- `command/new_ai_project.md`, sections 0, 3.3.5 and 4.2.
