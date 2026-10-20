#!/usr/bin/env node
/**
 * Static validation of the repository.
 *
 * Checks frontmatter, command guarantees, assets, relative links and installer
 * constraints. It does not run the installer: tests cover that.
 *
 * Usage: node scripts/validate.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const groups = [];

function check(condition, message) {
  if (!condition) errors.push(message);
  return condition;
}

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

function exists(relative) {
  return fs.existsSync(path.join(root, relative));
}

function group(name, fn) {
  const before = errors.length;
  try {
    fn();
  } catch (error) {
    errors.push(`${name}: unexpected exception: ${error.message}`);
  }
  groups.push({ name, ok: errors.length === before, added: errors.length - before });
}

function parseFrontmatter(content, relative) {
  const normalized = content.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    errors.push(`${relative}: missing frontmatter`);
    return {};
  }
  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) {
    errors.push(`${relative}: unclosed frontmatter`);
    return {};
  }
  const data = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    if (!line.trim() || /^\s/.test(line)) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) data[match[1]] = match[2].trim();
  }
  return data;
}

function listFiles(dir) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return [];
  const result = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...listFiles(relative));
    else result.push(relative);
  }
  return result;
}

function stripCodeFences(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
}

function checkLinks(relative) {
  const content = stripCodeFences(read(relative));
  const pattern = /\[[^\]]*\]\(([^)\s]+)\)/g;
  for (const match of content.matchAll(pattern)) {
    let target = match[1].trim();
    if (!target || target.startsWith("#")) continue;
    if (/^(https?:|mailto:|tel:)/i.test(target)) continue;
    if (target.startsWith("<") || target.includes("<")) continue;
    target = target.split("#")[0];
    if (!target) continue;
    const resolved = path.resolve(path.dirname(path.join(root, relative)), target);
    if (!fs.existsSync(resolved)) {
      errors.push(`${relative}: broken link -> ${target}`);
    }
  }
}

function isEnglishCanonical(relative) {
  const content = read(relative);
  check(!/[¿¡]/.test(content), `${relative}: canonical document contains Spanish punctuation; expected English`);
}

group("package.json", () => {
  check(exists("package.json"), "package.json: missing");
  const pkg = JSON.parse(read("package.json"));
  check(pkg.name === "new-ai-project", "package.json: name must be new-ai-project");
  check(/^\d+\.\d+\.\d+$/.test(pkg.version), "package.json: version must be semver");
  check(pkg.type === "module", "package.json: type must be module");
  check(pkg.license === "MIT", "package.json: license must be MIT");
  check(pkg.engines?.node === ">=20", "package.json: engines.node must be >=20");
  for (const script of ["test", "validate", "install:global"]) {
    check(Boolean(pkg.scripts?.[script]), `package.json: missing script ${script}`);
  }
  for (const [name, command] of Object.entries(pkg.scripts ?? {})) {
    const match = command.match(/^node\s+([^-\s][^\s]*)/);
    if (match) check(exists(match[1]), `package.json: script ${name} points to ${match[1]}, which does not exist`);
  }
  for (const file of ["README.md", "README.es.md", "LICENSE"]) {
    check(pkg.files?.includes(file), `package.json: files must include ${file}`);
  }
});

group("root files", () => {
  for (const file of ["README.md", "README.es.md", "LICENSE", "CHANGELOG.md", "CONTRIBUTING.md", ".gitignore"]) {
    check(exists(file), `${file}: missing`);
  }
  check(read("LICENSE").includes("MIT License"), "LICENSE: not an MIT license");
  check(read("README.md").includes("/new_ai_project"), "README.md: does not mention /new_ai_project");
  check(read("README.es.md").includes("/new_ai_project"), "README.es.md: does not mention /new_ai_project");
  check(
    /^<!-- TRANSLATION of README\.md · source: English · synced: \d{4}-\d{2}-\d{2} -->/.test(read("README.es.md")),
    "README.es.md: missing translation marker",
  );
});

group("main command", () => {
  const relative = "skills/new-ai-project/command/new_ai_project.md";
  check(exists(relative), `${relative}: missing`);
  const content = read(relative);
  const frontmatter = parseFrontmatter(content, relative);
  check(Boolean(frontmatter.description), `${relative}: missing description`);
  check(frontmatter.agent === "build", `${relative}: agent must be build`);
  check(content.length > 20000, `${relative}: content is suspiciously short`);
  check(!/[¿¡]/.test(content), `${relative}: command must be written in English`);
  isEnglishCanonical(relative);

  for (let index = 0; index <= 10; index += 1) {
    check(content.includes(`## ${index}.`), `${relative}: missing section ${index}`);
  }

  const required = [
    ["One question at a time", "does not require one question at a time"],
    ["Any suggestions?", "missing the Any suggestions? option"],
    ["You choose", "missing the You choose option"],
    ["new path", "missing the new path option"],
    ["new folder", "missing the new folder option"],
    ["https://www.skills.sh/vercel-labs/skills/find-skills", "missing the find-skills reference"],
    ["npx skills add https://github.com/vercel-labs/skills --skill find-skills -a opencode -y --copy", "missing the find-skills install command"],
    ["AGENTS.md", "does not mention AGENTS.md"],
    ["MEMORY.md", "does not mention MEMORY.md"],
    ["specs/constitution/", "does not mention the constitution"],
    ["clarification.md", "does not mention clarification.md"],
    ["validation.md", "does not mention validation.md"],
    ["spec-anchored", "does not mention spec-anchored"],
    ["spec-as-source", "does not mention spec-as-source"],
    ["EARS", "does not mention EARS"],
    ["$ARGUMENTS", "does not use $ARGUMENTS"],
    ["Nothing global", "does not forbid global installs"],
    ["Do not change functionality", "does not protect existing functionality"],
    ["--minimal", "missing --minimal"],
    ["--help", "missing --help"],
    ["### Help mode", "missing the help section"],
    ["All Markdown artifacts are written in English", "missing the English artifact policy"],
    ["Default: English only", "missing the default language policy"],
    ["--lang=<code>", "missing the --lang parameter"],
    ["--secondary-lang=<code>", "missing the --secondary-lang alias"],
    ["AGENTS.<code>.md", "missing the localized copy naming rule"],
    ["AGENTS.es.md", "missing the AGENTS.es.md example"],
    ["translations, not summaries", "localized copies are not defined as translations"],
    ["English is updated first", "missing the update order for translations"],
    ["docs/i18n.md", "missing the translation index"],
    ["BCP-47", "missing the language tag format"],
    ["Never double-suffix", "missing the double-suffix guard"],
    ["Reject `en`", "missing the English secondary-language guard"],
    ["MEMORY.md", "missing MEMORY.md"],
    ["≤60 lines", "missing the MEMORY.md size limit"],
  ];
  for (const [needle, message] of required) {
    check(content.includes(needle), `${relative}: ${message}`);
  }
});

group("SKILL.md", () => {
  const relative = "skills/new-ai-project/SKILL.md";
  check(exists(relative), `${relative}: missing`);
  const content = read(relative);
  const frontmatter = parseFrontmatter(content, relative);
  check(frontmatter.name === "new-ai-project", `${relative}: name must be new-ai-project`);
  check((frontmatter.description ?? "").length > 80, `${relative}: description is too short`);
  check(frontmatter.license === "MIT", `${relative}: license must be MIT`);
  check(/^\s{2}version:\s*\d+\.\d+\.\d+$/m.test(content.replace(/\r\n/g, "\n")), `${relative}: missing metadata.version`);
  check(content.includes("command/new_ai_project.md"), `${relative}: does not reference the canonical command`);
  check(content.includes("find-skills"), `${relative}: does not mention find-skills`);
  check(content.includes("--lang=<code>"), `${relative}: does not document --lang`);
  check(content.toLowerCase().includes("english"), `${relative}: does not document the English policy`);
  isEnglishCanonical(relative);
});

group("SDD commands", () => {
  const expected = ["change", "clarify", "constitution", "implement", "plan", "spec", "status", "tasks", "validate"];
  const files = listFiles("skills/new-ai-project/assets/commands").filter((file) => file.endsWith(".md"));
  check(files.length === expected.length, `assets/commands: expected ${expected.length} commands, found ${files.length}`);
  for (const name of expected) {
    const relative = `skills/new-ai-project/assets/commands/sdd-${name}.md`;
    if (!check(exists(relative), `${relative}: missing`)) continue;
    const content = read(relative);
    const frontmatter = parseFrontmatter(content, relative);
    check(Boolean(frontmatter.description), `${relative}: missing description`);
    check(["plan", "build"].includes(frontmatter.agent), `${relative}: agent must be plan or build`);
    check(content.length > 80, `${relative}: content is too short`);
    isEnglishCanonical(relative);
  }
});

group("subagents", () => {
  const expected = ["coordinator", "implementer", "planner", "reviewer"];
  const files = listFiles("skills/new-ai-project/assets/agents").filter((file) => file.endsWith(".md"));
  check(files.length === expected.length, `assets/agents: expected ${expected.length} agents, found ${files.length}`);
  for (const name of expected) {
    const relative = `skills/new-ai-project/assets/agents/${name}.md`;
    if (!check(exists(relative), `${relative}: missing`)) continue;
    const content = read(relative);
    const frontmatter = parseFrontmatter(content, relative);
    check(Boolean(frontmatter.description), `${relative}: missing description`);
    check(["primary", "subagent"].includes(frontmatter.mode), `${relative}: mode must be primary or subagent`);
    check(content.includes("permissions:"), `${relative}: missing permissions block`);
    isEnglishCanonical(relative);
  }
});

group("sdd skill and templates", () => {
  const skillRelative = "skills/new-ai-project/assets/skills/sdd/SKILL.md";
  check(exists(skillRelative), `${skillRelative}: missing`);
  const frontmatter = parseFrontmatter(read(skillRelative), skillRelative);
  check(frontmatter.name === "sdd", `${skillRelative}: name must be sdd`);
  check((frontmatter.description ?? "").length > 40, `${skillRelative}: description is too short`);
  check(read(skillRelative).includes("All canonical Markdown is written in **English**"), `${skillRelative}: missing English policy`);
  isEnglishCanonical(skillRelative);

  const templates = ["spec", "clarification", "plan", "tasks", "validation"];
  for (const name of templates) {
    const relative = `skills/new-ai-project/assets/templates/${name}.md`;
    if (!check(exists(relative), `${relative}: missing`)) continue;
    const content = read(relative);
    check(content.length > 100, `${relative}: template is too short`);
    check(content.includes("# "), `${relative}: template has no title`);
    isEnglishCanonical(relative);
  }
});

group("installer", () => {
  const relative = "skills/new-ai-project/scripts/install.mjs";
  check(exists(relative), `${relative}: missing`);
  const content = read(relative);
  check(content.startsWith("#!/usr/bin/env node"), `${relative}: missing shebang`);
  for (const option of ["--project", "--global", "--target", "--with-sdd-kit", "--force", "--dry-run", "--help"]) {
    check(content.includes(option), `${relative}: missing option ${option}`);
  }
  check(content.includes("VALID_TARGETS"), `${relative}: missing target list`);
  check(/Makes no network requests/i.test(content), `${relative}: does not document that it is network-free`);
  for (const forbidden of ["fetch(", "node:http", "node:https", "axios", "got("]) {
    check(!content.includes(forbidden), `${relative}: contains ${forbidden}; the installer must not use the network`);
  }
  for (const message of ["Invalid target:", "Unknown option:", "would write", "unchanged"]) {
    check(content.includes(message), `${relative}: missing English message ${message}`);
  }
});

group("references and documentation", () => {
  for (const file of ["skills/new-ai-project/references/structure.md", "skills/new-ai-project/references/compatibility.md"]) {
    check(exists(file), `${file}: missing`);
    check(read(file).length > 400, `${file}: content is too short`);
    isEnglishCanonical(file);
  }
  for (const file of ["docs/design.md", "docs/testing.md", "docs/publishing.md", "CONTRIBUTING.md", "CHANGELOG.md"]) {
    check(exists(file), `${file}: missing`);
    check(read(file).length > 500, `${file}: content is too short`);
    isEnglishCanonical(file);
  }
  const adrDir = "docs/decisions";
  const adrs = listFiles(adrDir).filter((file) => file.endsWith(".md"));
  check(adrs.length >= 2, `${adrDir}: expected at least 2 ADRs, found ${adrs.length}`);
  for (const adr of adrs) isEnglishCanonical(adr);
});

group("relative links", () => {
  const files = [
    "README.md",
    "README.es.md",
    "CONTRIBUTING.md",
    "CHANGELOG.md",
    ...listFiles("docs").filter((file) => file.endsWith(".md")),
  ];
  for (const file of files) checkLinks(file);
});

group("version coherence", () => {
  const pkg = JSON.parse(read("package.json"));
  const skill = read("skills/new-ai-project/SKILL.md").replace(/\r\n/g, "\n");
  const version = skill.match(/^\s{2}version:\s*(\d+\.\d+\.\d+)$/m);
  check(Boolean(version), "SKILL.md: unable to read metadata.version");
  if (version) check(version[1] === pkg.version, `SKILL.md: version ${version[1]} differs from package.json ${pkg.version}`);
  check(read("CHANGELOG.md").includes(`## [${pkg.version}]`), `CHANGELOG.md: missing entry ${pkg.version}`);
});

const width = Math.max(...groups.map((item) => item.name.length));
for (const item of groups) {
  const label = item.ok ? "OK  " : "FAIL";
  console.log(`${label} ${item.name.padEnd(width)} ${item.ok ? "" : `(${item.added} problem(s))`}`.trimEnd());
}

if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s):\n`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const files = listFiles("skills").length;
  console.log(`\nValidation passed: ${groups.length} groups, ${files} skill files.`);
}
