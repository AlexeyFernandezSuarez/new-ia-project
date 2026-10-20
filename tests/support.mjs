import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const installer = path.join(repoRoot, "skills", "new-ai-project", "scripts", "install.mjs");
export const commandSource = path.join(repoRoot, "skills", "new-ai-project", "command", "new_ai_project.md");

export function makeTempDir(prefix = "new-ai-project-test-") {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function removeDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

export function runInstaller(args, options = {}) {
  return spawnSync(process.execPath, [installer, ...args], {
    cwd: options.cwd ?? repoRoot,
    env: { ...process.env, ...options.env },
    encoding: "utf8",
    timeout: 30000,
  });
}

export function runNode(args, options = {}) {
  return spawnSync(process.execPath, args, {
    cwd: options.cwd ?? repoRoot,
    env: { ...process.env, ...options.env },
    encoding: "utf8",
    timeout: 60000,
  });
}

export function readFile(file) {
  return fs.readFileSync(file, "utf8");
}

export function exists(file) {
  return fs.existsSync(file);
}

export function readCanonicalCommand() {
  return readFile(commandSource);
}

/** Devuelve rutas relativas con separador "/" para comparar en cualquier SO. */
export function filesUnder(dir) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else result.push(path.relative(dir, absolute).split(path.sep).join("/"));
    }
  };
  walk(dir);
  return result.sort();
}

export function frontmatter(content) {
  const normalized = content.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return {};
  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) return {};
  const data = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    if (!line.trim() || /^\s/.test(line)) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) data[match[1]] = match[2].trim();
  }
  return data;
}
