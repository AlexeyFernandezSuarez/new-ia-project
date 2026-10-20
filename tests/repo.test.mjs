import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  exists,
  filesUnder,
  frontmatter,
  readFile,
  repoRoot,
  runNode,
} from "./support.mjs";

test("npm run validate exits successfully", () => {
  const result = runNode([path.join("scripts", "validate.mjs")], { cwd: repoRoot });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Validation passed/);
});

test("expected root files exist", () => {
  for (const file of [
    "package.json",
    "README.md",
    "README.es.md",
    "LICENSE",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    ".gitignore",
    ".github/workflows/ci.yml",
    "docs/design.md",
    "docs/testing.md",
    "docs/publishing.md",
  ]) {
    assert.ok(exists(file), `missing ${file}`);
  }
});

test("the package declares Node 20 and useful scripts", () => {
  const pkg = JSON.parse(readFile(path.join(repoRoot, "package.json")));
  assert.equal(pkg.engines.node, ">=20");
  assert.equal(pkg.type, "module");
  assert.equal(pkg.license, "MIT");
  assert.ok(pkg.bin["new-ai-project"].endsWith("install.mjs"));
  for (const script of ["test", "validate", "check", "install:project", "install:project:sdd", "install:global"]) {
    assert.ok(pkg.scripts[script], `missing script ${script}`);
  }
});

test("the nine SDD commands exist and have frontmatter", () => {
  const expected = ["change", "clarify", "constitution", "implement", "plan", "spec", "status", "tasks", "validate"];
  const dir = path.join(repoRoot, "skills", "new-ai-project", "assets", "commands");
  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".md")).sort();
  assert.deepEqual(files, expected.map((name) => `sdd-${name}.md`).sort());

  for (const file of files) {
    const relative = path.join(dir, file);
    const meta = frontmatter(readFile(relative));
    assert.ok(meta.description, `${file}: missing description`);
    assert.ok(["plan", "build"].includes(meta.agent), `${file}: invalid agent`);
  }
});

test("the four subagents have permissions and mode", () => {
  const expected = ["coordinator", "implementer", "planner", "reviewer"];
  const dir = path.join(repoRoot, "skills", "new-ai-project", "assets", "agents");
  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".md")).sort();
  assert.deepEqual(files, expected.map((name) => `${name}.md`).sort());

  for (const file of files) {
    const content = readFile(path.join(dir, file));
    const meta = frontmatter(content);
    assert.ok(meta.description, `${file}: missing description`);
    assert.ok(["primary", "subagent"].includes(meta.mode), `${file}: invalid mode`);
    assert.match(content, /permissions:/);
    assert.match(content, /effect:\s*(allow|deny|ask)/);
  }
});

test("templates and the sdd skill are usable", () => {
  const templates = filesUnder(path.join(repoRoot, "skills", "new-ai-project", "assets", "templates"));
  assert.deepEqual(templates, ["clarification.md", "plan.md", "spec.md", "tasks.md", "validation.md"]);

  for (const template of templates) {
    const content = readFile(path.join(repoRoot, "skills", "new-ai-project", "assets", "templates", template));
    assert.ok(content.length > 100, `${template}: too short`);
    assert.match(content, /# /, `${template}: missing title`);
    assert.doesNotMatch(content, /[¿¡]/, `${template}: canonical template must be English`);
  }

  const skill = readFile(path.join(repoRoot, "skills", "new-ai-project", "assets", "skills", "sdd", "SKILL.md"));
  const meta = frontmatter(skill);
  assert.equal(meta.name, "sdd");
  assert.ok(meta.description.length > 40);
  assert.match(skill, /spec-anchored|spec-as-source/);
  assert.match(skill, /All canonical Markdown is written in \*\*English\*\*/);
});

test("relative links in the documentation resolve", () => {
  const markdown = [
    "README.md",
    "README.es.md",
    "CONTRIBUTING.md",
    "CHANGELOG.md",
    ...filesUnder(path.join(repoRoot, "docs")).map((file) => `docs/${file}`),
  ];
  for (const file of markdown) {
    const content = readFile(path.join(repoRoot, file)).replace(/```[\s\S]*?```/g, "");
    for (const match of content.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const target = match[1].split("#")[0];
      if (!target || /^(https?:|mailto:)/i.test(target) || target.includes("<")) continue;
      const resolved = path.resolve(path.dirname(path.join(repoRoot, file)), target);
      assert.ok(fs.existsSync(resolved), `${file}: broken link -> ${target}`);
    }
  }
});

test("the version is coherent across package.json, SKILL.md and CHANGELOG", () => {
  const pkg = JSON.parse(readFile(path.join(repoRoot, "package.json")));
  const skill = readFile(path.join(repoRoot, "skills", "new-ai-project", "SKILL.md")).replace(/\r\n/g, "\n");
  const version = skill.match(/^\s{2}version:\s*(\d+\.\d+\.\d+)$/m);
  assert.ok(version, "SKILL.md without metadata.version");
  assert.equal(version[1], pkg.version);
  assert.match(readFile(path.join(repoRoot, "CHANGELOG.md")), new RegExp(`## \\[${pkg.version.replace(/\./g, "\\.")}\\]`));
});

test("the Spanish README is marked as a translation", () => {
  const content = readFile(path.join(repoRoot, "README.es.md"));
  assert.match(content, /^<!-- TRANSLATION of README\.md · source: English · synced: \d{4}-\d{2}-\d{2} -->/);
  assert.match(content, /--lang=<código>/);
  assert.match(content, /AGENTS\.es\.md/);
});

test("the English README documents installation, help and language copies", () => {
  const content = readFile(path.join(repoRoot, "README.md"));
  assert.match(content, /## Installation/);
  assert.match(content, /## Usage/);
  assert.match(content, /### Command help/);
  assert.match(content, /--help/);
  assert.match(content, /## What it creates/);
  assert.match(content, /--lang=<code>/);
  assert.match(content, /AGENTS\.es\.md/);
  assert.match(content, /English/);
});
