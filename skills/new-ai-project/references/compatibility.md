# Harness compatibility

The canonical command is Markdown with YAML frontmatter. OpenCode runs it as a prompt template; the other harnesses use it as a command or prompt.

## Command paths

| Harness | Project | Global |
|---|---|---|
| OpenCode | `.opencode/commands/<name>.md` | `~/.config/opencode/commands/<name>.md` |
| Claude Code | `.claude/commands/<name>.md` | `~/.claude/commands/<name>.md` |
| Cursor | `.cursor/commands/<name>.md` | `~/.cursor/commands/<name>.md` |
| GitHub Copilot (VS Code) | `.github/prompts/<name>.prompt.md` | Not installed by this script |

OpenCode also discovers the legacy `command/` (singular) directory, but the installer uses `commands/` (plural), which is recommended in V2.

## Frontmatter

OpenCode accepts `description`, `agent`, `model`, `subagent` and `subtask`.

Claude Code accepts `description`, `argument-hint`, `allowed-tools` and `model`. The installer removes `agent` to avoid unknown keys.

Cursor and Copilot accept `description`; Copilot uses `mode: agent` in `.prompt.md` files.

The canonical command uses `agent: build` to ensure OpenCode has edit permissions. The other harnesses strip it.

## Skills

| Harness | Project | Global |
|---|---|---|
| OpenCode | `.opencode/skills/`, `.agents/skills/`, `.claude/skills/` | `~/.config/opencode/skills/`, `~/.agents/skills/`, `~/.claude/skills/` |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Cursor | `.agents/skills/`, `.cursor/skills/`, `.claude/skills/` | `~/.cursor/skills/`, `~/.agents/skills/` |
| Copilot (VS Code) | `.agents/skills/`, `.github/skills/`, `.claude/skills/` | `~/.agents/skills/` |

This project's installer copies the `sdd` skill to `.agents/skills/sdd/` and, for Claude Code, also to `.claude/skills/sdd/`.

## Third-party skill installation

The skills.sh CLI installs at project scope by default:

```bash
npx skills add <owner/repo> --skill <skill> -a opencode -y --copy
```

- `-g` / `--global` installs into the user directory. **This project does not use it.**
- `--copy` avoids symlink issues on Windows.
- Add `-a claude-code`, `-a cursor` or the corresponding agent when the project uses several.
- Always review the `SKILL.md` and scripts before installing a skill from an unknown author.

## MCPs

OpenCode V2 uses `mcp.servers`:

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

Do not use the V1 `mcp.<name>` shape in OpenCode V2. For other harnesses, document the equivalent configuration in `docs/harness/README.md`; do not install it globally.

## Command portability

The command body is Markdown text. It depends on no OpenCode-specific API except:

- `$ARGUMENTS` (OpenCode and Claude Code substitute it; other harnesses pass it as text).
- The instruction to use a question tool when one exists; otherwise it asks in chat.
- Skill/MCP paths are detected at runtime.

If a harness does not support file-based commands, use the command as a prompt pasted into the chat or copy the body into its prompt system.

## Language copies

`--lang=<code>` is a command argument, not an installer flag. The command writes `*.md` in English and a complete `*.<code>.md` translation next to each one. The installer only copies the canonical command, the kit and the English templates; feature and project documents are generated later by the command.

The naming rule is independent of the harness: `AGENTS.md` → `AGENTS.es.md`, `spec.md` → `spec.es.md`. Keep the English file as the source of truth and list every translation in `docs/i18n.md`.
