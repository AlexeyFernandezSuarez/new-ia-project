import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

import { commandSource, frontmatter, readFile, repoRoot } from "./support.mjs";

const content = readFile(commandSource);
const normalized = content.replace(/\r\n/g, "\n");
const meta = frontmatter(content);

test("the command has valid OpenCode frontmatter", () => {
  assert.equal(meta.agent, "build");
  assert.ok(meta.description.length > 40);
  assert.match(meta.description, /AI-first/i);
  assert.match(meta.description, /English/);
});

test("the body starts with the title and contains all eleven sections", () => {
  assert.match(normalized, /\n# \/new_ai_project/);
  for (let index = 0; index <= 10; index += 1) {
    assert.ok(normalized.includes(`## ${index}.`), `missing section ${index}`);
  }
});

test("requires one question at a time and forbids questionnaires", () => {
  assert.match(normalized, /One question at a time/);
  assert.match(normalized, /Never dump a questionnaire/);
});

test("every question offers suggestions and delegated choice", () => {
  assert.ok(normalized.includes("Any suggestions?"));
  assert.ok(normalized.includes("You choose"));
  assert.match(normalized, /2-3 concrete options/);
  assert.match(normalized, /\[auto\]/);
});

test("the existing-project flow offers the four options", () => {
  const section = normalized.slice(normalized.indexOf("## 4. Flow B"));
  assert.match(section, /Adapt or adjust this project/);
  assert.match(section, /new path/i);
  assert.match(section, /new folder/i);
  assert.match(section, /4\. Cancel/);
});

test("adaptation protects existing functionality and specs", () => {
  assert.match(normalized, /Do not change functionality/i);
  assert.match(normalized, /preserve existing features, behaviour and specs/i);
  assert.match(normalized, /non-destructive/i);
  assert.match(normalized, /backup/i);
  assert.match(normalized, /revert that move/i);
});

test("generic mode does not invent product or stack", () => {
  assert.match(normalized, /Generic structure/);
  assert.match(normalized, /do not describe your product, stack or features/i);
  assert.match(normalized, /TODO/);
  assert.match(normalized, /do not\s+install skills or MCPs/i);
});

test("references find-skills with its source and a project-scoped install", () => {
  assert.ok(normalized.includes("https://www.skills.sh/vercel-labs/skills/find-skills"));
  const installLine = normalized
    .split("\n")
    .find((line) => line.includes("npx skills add") && line.includes("find-skills"));
  assert.ok(installLine, "missing find-skills install command");
  assert.match(installLine, /--copy/);
  assert.match(installLine, /-a opencode/);
  assert.doesNotMatch(installLine, /(^|\s)(-g|--global)(\s|$)/);
});

test("forbids global installations", () => {
  assert.match(normalized, /Nothing global/);
  assert.match(normalized, /`-g` and `--global` are forbidden/);
});

test("defines the complete AI-first structure", () => {
  for (const artifact of ["AGENTS.md", "MEMORY.md", "specs/README.md", "specs/constitution/", "docs/architecture.md"]) {
    assert.ok(normalized.includes(artifact), `missing ${artifact}`);
  }
  for (const featureFile of ["spec.md", "clarification.md", "plan.md", "tasks.md", "validation.md"]) {
    assert.ok(normalized.includes(featureFile), `missing ${featureFile}`);
  }
  assert.match(normalized, /Documentation map/);
});

test("keeps SDD spec-anchored and spec-as-source", () => {
  assert.match(normalized, /spec-anchored \+ spec-as-source/);
  assert.match(normalized, /The spec rules/);
  assert.match(normalized, /EARS/);
  assert.match(normalized, /Constitution → Spec → Clarification → Plan → Tasks → Implementation → Validation/);
});

test("writes English artifacts and supports localized copies", () => {
  assert.match(normalized, /All Markdown artifacts are written in English/);
  assert.match(normalized, /Default: English only/);
  assert.match(normalized, /--lang=<code>/);
  assert.match(normalized, /--secondary-lang=<code>/);
  assert.ok(normalized.includes("AGENTS.<code>.md"));
  assert.ok(normalized.includes("AGENTS.es.md"));
  assert.match(normalized, /translations, not summaries/i);
  assert.match(normalized, /English is updated first/);
  assert.match(normalized, /docs\/i18n\.md/);
  assert.match(normalized, /BCP-47/);
  assert.match(normalized, /Reject `en`/);
  assert.match(normalized, /Never double-suffix/);
});

test("has a help mode that writes nothing", () => {
  assert.match(normalized, /### Help mode/);
  assert.match(normalized, /If `\$ARGUMENTS` contains `--help` or `-h`/);
  assert.match(normalized, /Create or modify nothing/);
  const help = normalized.slice(normalized.indexOf("### Help mode"), normalized.indexOf("## 1. Preflight"));
  for (const item of ["Usage:", "Modes:", "Options:", "Examples:", "Language:", "Safety:"]) {
    assert.ok(help.includes(item), `help is missing ${item}`);
  }
  assert.match(help, /generic/);
  assert.match(help, /guided/);
  assert.match(help, /adapt/);
  assert.match(help, /--lang=<code>/);
});

test("includes safety, verification and rollback", () => {
  assert.match(normalized, /No secrets/);
  assert.match(normalized, /rm -rf/);
  assert.match(normalized, /git reset --hard/);
  assert.match(normalized, /Verify before declaring done/);
  assert.match(normalized, /Rollback/);
});

test("the final report and completion criteria exist", () => {
  const tail = normalized.slice(normalized.indexOf("## 8. Final report"));
  for (const item of [
    "Project created/adapted",
    "What was created",
    "Decisions I made",
    "Installed harness",
    "Open questions",
    "Language copies",
    "Verification",
    "Next steps",
    "Rollback",
  ]) {
    assert.ok(tail.includes(item), `final report is missing ${item}`);
  }
  assert.match(normalized, /## 10\. Completion criteria/);
  assert.match(normalized, /MEMORY\.md.*≤60 lines/s);
});

test("supports arguments and minimal mode", () => {
  assert.ok(normalized.includes("$ARGUMENTS"));
  assert.match(normalized, /--minimal/);
  assert.match(normalized, /--path/);
  assert.match(normalized, /--yes/);
  assert.match(normalized, /--no-install/);
});

test("does not depend on the repository or external templates", () => {
  assert.doesNotMatch(normalized, /<REPO_PATH>/);
  assert.doesNotMatch(normalized, /assets\/templates/);
  assert.doesNotMatch(normalized, new RegExp(repoRoot.replace(/\\/g, "\\\\")));
  const sddCommands = normalized.match(/\/sdd-[a-z]+/g) ?? [];
  assert.ok(new Set(sddCommands).size >= 9, "must cover the nine SDD commands");
  assert.ok(path.isAbsolute(commandSource));
});
