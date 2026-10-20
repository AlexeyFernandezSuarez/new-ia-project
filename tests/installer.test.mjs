import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  commandSource,
  exists,
  filesUnder,
  makeTempDir,
  readCanonicalCommand,
  readFile,
  removeDir,
  repoRoot,
  runInstaller,
  runNode,
} from "./support.mjs";

function tempProject(t) {
  const dir = makeTempDir();
  t.after(() => removeDir(dir));
  return dir;
}

function commandPath(cwd, harness = "opencode") {
  switch (harness) {
    case "claude":
      return path.join(cwd, ".claude", "commands", "new_ai_project.md");
    case "cursor":
      return path.join(cwd, ".cursor", "commands", "new_ai_project.md");
    case "copilot":
      return path.join(cwd, ".github", "prompts", "new_ai_project.prompt.md");
    default:
      return path.join(cwd, ".opencode", "commands", "new_ai_project.md");
  }
}

test("--dry-run no escribe nada", (t) => {
  const cwd = tempProject(t);
  const result = runInstaller(["--dry-run", "--project", "--target", "opencode", "--with-sdd-kit"], { cwd });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(filesUnder(cwd), []);
  assert.match(result.stdout, /would write/);
  assert.match(result.stdout, /dry-run/);
});

test("instala el comando canónico en un proyecto OpenCode", (t) => {
  const cwd = tempProject(t);
  const result = runInstaller(["--project", "--target", "opencode"], { cwd });

  assert.equal(result.status, 0, result.stderr);
  const destination = commandPath(cwd);
  assert.ok(exists(destination), "no se creó el comando");
  assert.equal(readFile(destination), readCanonicalCommand());
  assert.match(result.stdout, /written/);
});

test("es idempotente: una segunda ejecución no modifica el archivo", (t) => {
  const cwd = tempProject(t);
  const first = runInstaller(["--project", "--target", "opencode"], { cwd });
  assert.equal(first.status, 0, first.stderr);

  const destination = commandPath(cwd);
  const before = fs.statSync(destination).mtimeMs;
  const original = readFile(destination);

  const second = runInstaller(["--project", "--target", "opencode"], { cwd });
  assert.equal(second.status, 0, second.stderr);
  assert.match(second.stdout, /unchanged/);
  assert.equal(readFile(destination), original);
  assert.equal(fs.statSync(destination).mtimeMs, before);
});

test("sin --force conserva el archivo y con --force crea un backup", (t) => {
  const cwd = tempProject(t);
  assert.equal(runInstaller(["--project", "--target", "opencode"], { cwd }).status, 0);

  const destination = commandPath(cwd);
  fs.writeFileSync(destination, "contenido local\n", "utf8");

  const skipped = runInstaller(["--project", "--target", "opencode"], { cwd });
  assert.equal(skipped.status, 0, skipped.stderr);
  assert.match(skipped.stdout, /skipping/);
  assert.equal(readFile(destination), "contenido local\n");

  const forced = runInstaller(["--project", "--target", "opencode", "--force"], { cwd });
  assert.equal(forced.status, 0, forced.stderr);
  assert.equal(readFile(destination), readCanonicalCommand());

  const backups = filesUnder(cwd).filter((file) => file.includes(".bak-"));
  assert.equal(backups.length, 1, `backups encontrados: ${backups.join(", ")}`);
  assert.equal(readFile(path.join(cwd, backups[0])), "contenido local\n");
});

test("el target claude elimina agent del frontmatter", (t) => {
  const cwd = tempProject(t);
  const result = runInstaller(["--project", "--target", "claude"], { cwd });

  assert.equal(result.status, 0, result.stderr);
  const content = readFile(commandPath(cwd, "claude"));
  const frontmatter = content.slice(0, content.indexOf("\n---\n", 4));
  assert.match(frontmatter, /description:/);
  assert.doesNotMatch(frontmatter, /^agent:/m);
  assert.match(content, /# \/new_ai_project/);
});

test("el target cursor instala el comando portable", (t) => {
  const cwd = tempProject(t);
  const result = runInstaller(["--project", "--target", "cursor"], { cwd });

  assert.equal(result.status, 0, result.stderr);
  const content = readFile(commandPath(cwd, "cursor"));
  assert.doesNotMatch(content.slice(0, 200), /^agent:/m);
  assert.match(content, /Execution contract/);
});

test("el target copilot usa modo prompt", (t) => {
  const cwd = tempProject(t);
  const result = runInstaller(["--project", "--target", "copilot"], { cwd });

  assert.equal(result.status, 0, result.stderr);
  const destination = commandPath(cwd, "copilot");
  assert.ok(exists(destination));
  const content = readFile(destination);
  assert.match(content, /^---\nmode: agent\ndescription: /);
  assert.ok(content.endsWith("\n"), "el archivo debe terminar en salto de línea");
});

test("acepta varios targets separados por comas", (t) => {
  const cwd = tempProject(t);
  const result = runInstaller(["--project", "--target=opencode,claude"], { cwd });

  assert.equal(result.status, 0, result.stderr);
  assert.ok(exists(commandPath(cwd, "opencode")));
  assert.ok(exists(commandPath(cwd, "claude")));
});

test("el kit SDD instala comandos, agentes, skill y plantillas", (t) => {
  const cwd = tempProject(t);
  const result = runInstaller(["--project", "--target", "opencode", "--with-sdd-kit"], { cwd });

  assert.equal(result.status, 0, result.stderr);

  const commands = ["change", "clarify", "constitution", "implement", "plan", "spec", "status", "tasks", "validate"];
  for (const name of commands) {
    assert.ok(exists(path.join(cwd, ".opencode", "commands", `sdd-${name}.md`)), `falta sdd-${name}.md`);
  }

  for (const agent of ["coordinator", "implementer", "planner", "reviewer"]) {
    assert.ok(exists(path.join(cwd, ".opencode", "agents", `${agent}.md`)), `falta el agente ${agent}`);
  }

  assert.ok(exists(path.join(cwd, ".agents", "skills", "sdd", "SKILL.md")));

  const templates = filesUnder(path.join(cwd, "specs", "templates"));
  assert.deepEqual(templates, ["clarification.md", "plan.md", "spec.md", "tasks.md", "validation.md"]);

  const files = filesUnder(cwd);
  assert.equal(files.filter((file) => file.startsWith(".opencode/commands/sdd-")).length, 9);
  assert.equal(files.filter((file) => file.startsWith(".opencode/agents/")).length, 4);
});

test("handles a command source with CRLF line endings", (t) => {
  const root = tempProject(t);
  const skillDir = path.join(root, "skills", "new-ai-project");
  fs.cpSync(path.join(repoRoot, "skills", "new-ai-project"), skillDir, { recursive: true });

  const source = path.join(skillDir, "command", "new_ai_project.md");
  fs.writeFileSync(source, readFile(source).replace(/\r?\n/g, "\r\n"), "utf8");

  const result = runNode([path.join(skillDir, "scripts", "install.mjs"), "--project", "--target", "claude"], { cwd: root });
  assert.equal(result.status, 0, result.stderr);

  const content = readFile(path.join(root, ".claude", "commands", "new_ai_project.md"));
  const frontmatter = content.slice(0, content.indexOf("\n---\n", 4));
  assert.match(frontmatter, /description:/);
  assert.doesNotMatch(frontmatter, /^agent:/m);
  assert.match(content, /Execution contract/);
});

test("--global is written to the given home and not to the project", (t) => {
  const cwd = tempProject(t);
  const home = tempProject(t);
  const result = runInstaller(["--global", "--target", "opencode"], {
    cwd,
    env: { HOME: home, USERPROFILE: home },
  });

  assert.equal(result.status, 0, result.stderr);
  const destination = path.join(home, ".config", "opencode", "commands", "new_ai_project.md");
  assert.ok(exists(destination), `no se creó ${destination}`);
  assert.deepEqual(filesUnder(cwd), []);
  assert.match(result.stdout, /GLOBAL/);
});

test("el kit global no escribe plantillas ni nada en el proyecto", (t) => {
  const cwd = tempProject(t);
  const home = tempProject(t);
  const result = runInstaller(["--global", "--target", "opencode", "--with-sdd-kit"], {
    cwd,
    env: { HOME: home, USERPROFILE: home },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.ok(exists(path.join(home, ".config", "opencode", "commands", "sdd-spec.md")));
  assert.ok(exists(path.join(home, ".config", "opencode", "agents", "planner.md")));
  assert.ok(exists(path.join(home, ".config", "opencode", "skills", "sdd", "SKILL.md")));
  assert.ok(!exists(path.join(home, "specs")), "no debe crear ~/specs en una instalación global");
  assert.deepEqual(filesUnder(cwd), []);
});

test("un target inválido falla con código 1 y explica los válidos", (t) => {
  const cwd = tempProject(t);
  const result = runInstaller(["--project", "--target", "vim"], { cwd });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid target: vim/);
  assert.match(result.stderr, /opencode, claude, cursor, copilot/);
  assert.deepEqual(filesUnder(cwd), []);
});

test("una opción desconocida falla con código 1", (t) => {
  const cwd = tempProject(t);
  const result = runInstaller(["--project", "--inventada"], { cwd });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown option: --inventada/);
  assert.deepEqual(filesUnder(cwd), []);
});

test("--help muestra el uso y termina con código 0", (t) => {
  const cwd = tempProject(t);
  const result = runInstaller(["--help"], { cwd });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /new-ai-project installer/);
  assert.match(result.stdout, /--with-sdd-kit/);
  assert.match(result.stdout, /--global/);
  assert.deepEqual(filesUnder(cwd), []);
});

test("el instalador no contiene llamadas de red", () => {
  const content = readFile(path.join(repoRoot, "skills", "new-ai-project", "scripts", "install.mjs"));
  for (const forbidden of ["fetch(", "node:http", "node:https", "axios"]) {
    assert.ok(!content.includes(forbidden), `no debe contener ${forbidden}`);
  }
  assert.ok(exists(commandSource));
});

test("--project es el alcance por defecto", (t) => {
  const cwd = tempProject(t);
  const result = runInstaller(["--target", "opencode"], { cwd });

  assert.equal(result.status, 0, result.stderr);
  assert.ok(exists(commandPath(cwd)));
  assert.match(result.stdout, /project installation/);
});
