# Publishing

How to publish the repository on GitHub and make the command discoverable and installable through skills.sh.

## Before publishing

1. Replace `<YOUR_USER>` in `README.md` and `README.es.md`.
2. Replace `OWNER` in the links in `CHANGELOG.md`.
3. If you publish to npm, add `repository`, `homepage` and `bugs` to `package.json`.
4. Run the full validation:

   ```bash
   npm run check
   ```

5. Test a clean installation in a temporary folder (see [testing.md](testing.md)).
6. Check for secrets and personal paths:

   ```bash
   git grep -n -I -E "(api[_-]?key|secret|token|password)" -- . ':!package-lock.json'
   ```

   The only acceptable results are environment variable names and documentation text.

## GitHub

### Create the repository

With GitHub CLI:

```bash
gh auth status
gh repo create <YOUR_USER>/new-ai-project --public --source=. --remote=origin --description "Slash command and SDD toolkit for AI-first projects"
```

Without GitHub CLI: create an empty repository on the web, without README or license, and add the remote manually.

### First commit and push

```bash
git init
git add .
git commit -m "feat: new_ai_project command and SDD toolkit"
git branch -M main
git remote add origin https://github.com/<YOUR_USER>/new-ai-project.git
git push -u origin main
```

### Recommended settings

- Description: `Slash command and SDD toolkit that prepares any repository for AI-assisted development.`
- Topics: `ai`, `agents`, `opencode`, `spec-driven-development`, `sdd`, `scaffolding`, `agents-md`, `skills`, `i18n`.
- Enable Issues and Discussions if you want harness or SDD command proposals.
- Protect `main`: required CI and review before merge.
- Create a `v1.0.0` release pointing to the initial commit. Attach a note with the `CHANGELOG.md` entries.

### Verification

```bash
gh repo view <YOUR_USER>/new-ai-project --web
git ls-remote --heads origin
```

Check that the CI action appears in the Actions tab and finishes green on Ubuntu and Windows.

## skills.sh

skills.sh indexes public repositories that contain a skill with `SKILL.md`. In this repository the skill is at:

```text
skills/new-ai-project/SKILL.md
```

The frontmatter `name` is `new-ai-project`, so the identifier is `new-ai-project`.

### Check that the CLI discovers it

```bash
npx skills add <YOUR_USER>/new-ai-project --list
```

It must list `new-ai-project`. If it does not:

- Confirm the repository is public.
- Confirm `SKILL.md` is at `skills/<name>/SKILL.md` and has `name` and `description`.
- Check that the frontmatter is valid YAML and has no tabs.
- Run from an empty folder to rule out local configuration.

### Test installation

```bash
mkdir /tmp/skills-test && cd /tmp/skills-test
npx skills add <YOUR_USER>/new-ai-project --skill new-ai-project -a opencode -y --copy
ls .agents/skills/new-ai-project
```

On Windows, use a temporary folder and keep `--copy` to avoid symlink issues.

### Public listing

Once indexed, the listing is at:

```text
https://www.skills.sh/<YOUR_USER>/new-ai-project
```

The skill page depends on `SKILL.md`: name, description, license, metadata and content. Keep the description to one sentence with the words someone would search for (`AI project`, `SDD`, `AGENTS.md`, `scaffold`, `i18n`).

## Installing from the repository

While the listing propagates, direct installation works the same:

```bash
git clone https://github.com/<YOUR_USER>/new-ai-project.git
cd new-ai-project
node skills/new-ai-project/scripts/install.mjs --global --target opencode
```

And per project:

```bash
node skills/new-ai-project/scripts/install.mjs --project --target opencode --with-sdd-kit
```

## Versioning

- `1.0.x`: fixes without contract changes.
- `1.x.0`: new harnesses, SDD commands, installer options or command sections.
- `2.0.0`: changes that break existing installations or the generated document format.

Release checklist:

1. Update `CHANGELOG.md` and `package.json`.
2. Update the version in `skills/new-ai-project/SKILL.md` (`metadata.version`).
3. Run `npm run check`.
4. Test installation and the command in a clean folder.
5. Test `/new_ai_project --help`.
6. Test `/new_ai_project guided --lang=es` and verify `AGENTS.es.md` and `docs/i18n.md`.
7. Commit `chore: release vX.Y.Z`, tag `vX.Y.Z`, push branch and tag.
8. Create the GitHub release with the changelog notes.
9. Verify that skills.sh still resolves the skill after the tag.

## npm (optional)

The repository is ready to be published as a package, but it is not required for skills.sh:

```bash
npm pack --dry-run
npm publish --access public
```

The `new-ai-project` binary points to the installer. If you publish to npm, add `repository`, `homepage` and `bugs` first, and verify that `files` includes `skills/` and `docs/`.

Do not publish with `--access public` if the package contains examples with real data. Review `npm pack --dry-run` first.

## Troubleshooting

| Symptom | Likely cause | Solution |
|---|---|---|
| `npx skills add` cannot find the skill | Private repository, wrong path or invalid frontmatter | Check visibility and `skills/<name>/SKILL.md` |
| The skill installs but the command does not appear | The installer was not run | `node .agents/skills/new-ai-project/scripts/install.mjs --project --target opencode` |
| The command appears twice | Global and project installation at the same time | Keep one; delete the other path and restart the session |
| Windows does not create the files | Symlinks or permissions | Use `--copy`, run from a folder with permissions and Node 20+ |
| CI fails only on Windows | Paths or line endings | Use `path.join` and avoid comparing absolute paths |
| skills.sh shows an old description | Index cache | Wait for reindexing or run `npx skills add ... --list` again |
| `--lang` copies are missing | The parameter was not passed or the tag is invalid | Use `--lang=es` with a valid BCP-47-like tag |
| A translation is outdated | English changed afterwards | Update the translation and `docs/i18n.md` |

## Rollback

If a publication goes wrong:

- Revert a commit: `git revert <sha>` and push normally. Never `git push --force` on `main`.
- Remove a release: delete it on GitHub and create a new one with the corrected version.
- Remove a skill: delete `skills/new-ai-project/` from the repository and publish the version that replaces it. Announce it in the changelog.
- npm: `npm unpublish new-ai-project@X.Y.Z` only if the version is less than 72 hours old and contains a serious problem; otherwise publish a patch version.
