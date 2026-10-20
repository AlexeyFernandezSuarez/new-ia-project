#!/usr/bin/env node
/**
 * Installer for the /new_ai_project command and the SDD kit.
 *
 * Usage:
 *   node scripts/install.mjs [options]
 *
 * Options:
 *   --project              Install into the current project (default).
 *   --global               Install into the user directory.
 *   --target <list>        opencode,claude,cursor,copilot (default: auto-detect).
 *   --with-sdd-kit         Also install the /sdd-* commands, subagents and the sdd skill.
 *   --force                Overwrite existing files (creates a .bak-<timestamp> backup).
 *   --dry-run              Show what it would do without writing.
 *   --help                 Show this help.
 *
 * Makes no network requests. Everything is installed at project scope unless
 * --global is passed explicitly.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, "..");
const commandSource = path.join(skillRoot, "command", "new_ai_project.md");
const assetsDir = path.join(skillRoot, "assets");

const VALID_TARGETS = new Set(["opencode", "claude", "cursor", "copilot"]);

function parseArgs(argv) {
  const options = {
    scope: "project",
    targets: null,
    withSddKit: false,
    force: false,
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--project") options.scope = "project";
    else if (arg === "--global" || arg === "-g") options.scope = "global";
    else if (arg === "--with-sdd-kit") options.withSddKit = true;
    else if (arg === "--force" || arg === "-f") options.force = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--target" || arg === "-a") {
      const value = argv[i + 1];
      if (!value) throw new Error("Missing value for --target");
      options.targets = value.split(",").map((t) => t.trim()).filter(Boolean);
      i += 1;
    } else if (arg.startsWith("--target=")) {
      options.targets = arg.slice("--target=".length).split(",").map((t) => t.trim()).filter(Boolean);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (options.targets) {
    for (const target of options.targets) {
      if (!VALID_TARGETS.has(target)) {
        throw new Error(`Invalid target: ${target}. Use: ${[...VALID_TARGETS].join(", ")}`);
      }
    }
  }

  return options;
}

function printHelp() {
  const text = `
new-ai-project installer

Usage:
  node scripts/install.mjs [options]

Options:
  --project              Install into the current project (default).
  --global, -g           Install into the user directory.
  --target <list>        opencode,claude,cursor,copilot (comma-separated).
  --with-sdd-kit         Install the /sdd-* commands, subagents and the sdd skill.
                         Templates are copied only at project scope.
  --force, -f            Overwrite existing files (creates a .bak-<timestamp> backup).
  --dry-run              Show what it would do without writing.
  --help, -h             Show this help.

Examples:
  node scripts/install.mjs --project --target opencode
  node scripts/install.mjs --project --target opencode,claude --with-sdd-kit
  node scripts/install.mjs --global --target opencode
`.trim();
  console.log(text);
}

function detectTargets(options) {
  if (options.targets) return options.targets;

  if (options.scope === "global") return ["opencode"];

  const cwd = process.cwd();
  const detected = [];
  if (fs.existsSync(path.join(cwd, ".opencode")) || fs.existsSync(path.join(cwd, "opencode.json")) || fs.existsSync(path.join(cwd, "opencode.jsonc"))) {
    detected.push("opencode");
  }
  if (fs.existsSync(path.join(cwd, ".claude"))) detected.push("claude");
  if (fs.existsSync(path.join(cwd, ".cursor"))) detected.push("cursor");
  if (fs.existsSync(path.join(cwd, ".github"))) detected.push("copilot");

  return detected.length > 0 ? detected : ["opencode"];
}

function baseDir(scope) {
  return scope === "global" ? os.homedir() : process.cwd();
}

function commandPaths(target, scope) {
  const base = baseDir(scope);
  switch (target) {
    case "opencode":
      return {
        commands: scope === "global"
          ? path.join(os.homedir(), ".config", "opencode", "commands")
          : path.join(base, ".opencode", "commands"),
        agents: scope === "global"
          ? path.join(os.homedir(), ".config", "opencode", "agents")
          : path.join(base, ".opencode", "agents"),
        skills: scope === "global"
          ? path.join(os.homedir(), ".config", "opencode", "skills")
          : path.join(base, ".agents", "skills"),
      };
    case "claude":
      return {
        commands: scope === "global"
          ? path.join(os.homedir(), ".claude", "commands")
          : path.join(base, ".claude", "commands"),
        agents: null,
        skills: scope === "global"
          ? path.join(os.homedir(), ".claude", "skills")
          : path.join(base, ".claude", "skills"),
      };
    case "cursor":
      return {
        commands: scope === "global"
          ? path.join(os.homedir(), ".cursor", "commands")
          : path.join(base, ".cursor", "commands"),
        agents: null,
        skills: scope === "global"
          ? path.join(os.homedir(), ".cursor", "skills")
          : path.join(base, ".agents", "skills"),
      };
    case "copilot":
      return {
        commands: path.join(base, ".github", "prompts"),
        agents: null,
        skills: path.join(base, ".agents", "skills"),
        promptMode: true,
      };
    default:
      throw new Error(`Unsupported target: ${target}`);
  }
}

function ensureDir(dir, dryRun) {
  if (dryRun) return;
  fs.mkdirSync(dir, { recursive: true });
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function backupFile(dest) {
  const backup = `${dest}.bak-${timestamp()}`;
  fs.copyFileSync(dest, backup);
  return backup;
}

function readFrontmatter(content) {
  if (!content.startsWith("---\n")) return { frontmatter: "", body: content };
  const end = content.indexOf("\n---\n", 4);
  if (end === -1) return { frontmatter: "", body: content };
  return {
    frontmatter: content.slice(4, end),
    body: content.slice(end + 5),
  };
}

function getDescription(frontmatter) {
  const match = frontmatter.match(/^description:\s*(.+)$/m);
  return match ? match[1].trim() : "Create or adapt an AI-first software project.";
}

function stripAgent(frontmatter) {
  return frontmatter
    .split("\n")
    .filter((line) => !/^agent:\s*/.test(line) && !/^subagent:\s*/.test(line))
    .join("\n")
    .trim();
}

function transformCommand(content, target) {
  if (target === "opencode") return content;

  const { frontmatter, body } = readFrontmatter(content);
  const description = getDescription(frontmatter);

  if (target === "copilot") {
    return `---\nmode: agent\ndescription: ${description}\n---\n\n${body.trimStart()}`;
  }

  const cleaned = stripAgent(frontmatter);
  return `---\n${cleaned}\n---\n\n${body.trimStart()}`;
}

function writeFile(dest, content, options) {
  const exists = fs.existsSync(dest);
  if (exists) {
    const current = fs.readFileSync(dest, "utf8");
    if (current === content) {
      console.log(`  = unchanged: ${dest}`);
      return "unchanged";
    }
    if (!options.force) {
      console.log(`  ! exists, skipping (use --force to overwrite): ${dest}`);
      return "skipped";
    }
    if (!options.dryRun) {
      const backup = backupFile(dest);
      console.log(`  ↺ backup: ${backup}`);
    }
  }

  if (options.dryRun) {
    console.log(`  + would write: ${dest}`);
    return "planned";
  }

  ensureDir(path.dirname(dest), options.dryRun);
  fs.writeFileSync(dest, content, "utf8");
  console.log(`  + written: ${dest}`);
  return exists ? "overwritten" : "created";
}

function copyFile(src, dest, options, transform = (content) => content) {
  if (!fs.existsSync(src)) {
    console.log(`  ! source does not exist: ${src}`);
    return "missing";
  }
  const content = transform(fs.readFileSync(src, "utf8"));
  return writeFile(dest, content, options);
}

function copyTree(srcDir, destDir, options) {
  if (!fs.existsSync(srcDir)) return;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyTree(src, dest, options);
    } else {
      copyFile(src, dest, options);
    }
  }
}

function installMainCommand(target, paths, options) {
  const isCopilot = target === "copilot";
  const filename = isCopilot ? "new_ai_project.prompt.md" : "new_ai_project.md";
  const dest = path.join(paths.commands, filename);
  copyFile(commandSource, dest, options, (content) => transformCommand(content, target));
}

function installSddKit(target, paths, options) {
  const commandsDir = paths.commands;
  const assetsCommands = path.join(assetsDir, "commands");
  const isCopilot = target === "copilot";

  if (fs.existsSync(assetsCommands)) {
    for (const file of fs.readdirSync(assetsCommands)) {
      if (!file.endsWith(".md")) continue;
      const src = path.join(assetsCommands, file);
      const name = isCopilot
        ? `${file.replace(/\.md$/, "")}.prompt.md`
        : file;
      const dest = path.join(commandsDir, name);
      copyFile(src, dest, options, (content) => transformCommand(content, target));
    }
  }

  if (target === "opencode" && paths.agents) {
    copyTree(path.join(assetsDir, "agents"), paths.agents, options);
  }

  if (paths.skills) {
    const skillDest = path.join(paths.skills, "sdd", "SKILL.md");
    copyFile(path.join(assetsDir, "skills", "sdd", "SKILL.md"), skillDest, options);
  }

  // Spec templates only make sense inside a project.
  // A global install skips them so it never writes to ~/specs.
  if (options.scope === "project") {
    const templatesSrc = path.join(assetsDir, "templates");
    if (fs.existsSync(templatesSrc)) {
      const templatesDest = path.join(baseDir(options.scope), "specs", "templates");
      copyTree(templatesSrc, templatesDest, options);
    }
  }
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    printHelp();
    return;
  }

  if (!fs.existsSync(commandSource)) {
    console.error(`Error: command not found at ${commandSource}`);
    process.exitCode = 1;
    return;
  }

  const targets = detectTargets(options);
  console.log(`\nnew-ai-project · ${options.scope === "global" ? "GLOBAL" : "project"} installation`);
  console.log(`Base directory: ${baseDir(options.scope)}`);
  console.log(`Targets: ${targets.join(", ")}`);
  console.log(`SDD kit: ${options.withSddKit ? "yes" : "no"}${options.dryRun ? " · dry-run" : ""}\n`);

  for (const target of targets) {
    const paths = commandPaths(target, options.scope);
    console.log(`[${target}]`);
    installMainCommand(target, paths, options);
    if (options.withSddKit) installSddKit(target, paths, options);
    console.log("");
  }

  console.log("Done.");
  if (options.scope === "global") {
    console.log("The command is available in every project: /new_ai_project");
  } else {
    console.log("Open the project with your agent and run: /new_ai_project");
  }
  if (options.withSddKit) {
    console.log("SDD kit installed: /sdd-constitution, /sdd-spec, /sdd-clarify, /sdd-plan, /sdd-tasks, /sdd-implement, /sdd-validate, /sdd-change, /sdd-status");
  }
  console.log("Remember: nothing is installed globally unless you explicitly use --global.\n");
}

main();
