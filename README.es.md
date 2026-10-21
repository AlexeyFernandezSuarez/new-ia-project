<!-- TRANSLATION of README.md · source: English · synced: 2026-10-21 -->

# new-ai-project

**Un comando que deja cualquier carpeta lista para desarrollar software con agentes de IA.**

`/new_ai_project` crea (o adapta) la estructura de un proyecto AI-first: `AGENTS.md`, memoria persistente, Spec-Driven Development completo, documentación viva, harness a nivel de proyecto y un esqueleto de código coherente con el stack elegido.

> La IA ejecuta. Tú diriges. Este comando prepara el arnés para que dirigir sea más fácil.

---

## Qué es y qué no es

**Es** un bootstrap de proyecto y de harness:

- Estructura de carpetas y archivos.
- `AGENTS.md` que conoce el proyecto y enruta a toda la documentación.
- `MEMORY.md` con protocolo de memoria entre sesiones.
- SDD en nivel **spec-anchored + spec-as-source**, con todos sus pasos.
- Entrevista guiada para definir producto, requisitos, stack y features.
- Documentación en inglés por defecto, con copias localizadas opcionales (`--lang=es` → `AGENTS.es.md`).
- Instalación opcional, siempre a nivel de proyecto y con permiso, de skills, MCPs, comandos y subagentes.
- Adaptación no destructiva de proyectos existentes.

**No es** un generador de la aplicación. No implementa features, no elige tu producto por ti y no instala nada global sin que lo pidas explícitamente.

---

## Instalación

Requisitos: Node.js 20 o superior. El instalador no hace peticiones de red.

### Opción A — Como skill desde skills.sh

```bash
npx skills add AlexeyFernandezSuarez/new-ai-project --skill new-ai-project -a opencode -y --copy
```

Después instala el comando en el proyecto:

```bash
node .agents/skills/new-ai-project/scripts/install.mjs --project --target opencode
```

### Opción B — Desde el repositorio, global

```bash
git clone https://github.com/AlexeyFernandezSuarez/new-ai-project.git
cd new-ai-project
node skills/new-ai-project/scripts/install.mjs --global --target opencode
```

El comando queda disponible en todos los proyectos como `/new_ai_project`.

### Opción C — Solo para un proyecto

```bash
node /ruta/a/new-ai-project/skills/new-ai-project/scripts/install.mjs --project --target opencode
```

Con el kit SDD local (comandos `/sdd-*`, subagentes y skill `sdd`):

```bash
node skills/new-ai-project/scripts/install.mjs --project --target opencode --with-sdd-kit
```

### Opciones del instalador

```text
--project              Instala en el proyecto actual (por defecto).
--global, -g           Instala en el directorio del usuario.
--target <lista>       opencode,claude,cursor,copilot (por defecto: autodetecta).
--with-sdd-kit         Instala /sdd-*, subagentes y skill sdd.
                       Las plantillas solo se copian en alcance de proyecto.
--force, -f            Sobrescribe con backup .bak-<timestamp>.
--dry-run              Muestra lo que haría sin escribir.
--help, -h             Muestra la ayuda del instalador.
```

Ejemplos:

```bash
node skills/new-ai-project/scripts/install.mjs --project --target opencode --with-sdd-kit
node skills/new-ai-project/scripts/install.mjs --project --target claude,cursor
node skills/new-ai-project/scripts/install.mjs --project --target opencode --dry-run
```

Después de actualizar una instalación existente, ejecuta `opencode reload` o reinicia OpenCode. La TUI cachea las definiciones de comandos y una sesión abierta puede seguir usando la versión anterior.

---

## Uso

Dentro de OpenCode (o del harness donde lo hayas instalado):

```text
/new_ai_project
```

### Ayuda del comando

Cualquier invocación admite `--help` o `-h`. Muestra uso, modos, opciones y ejemplos, y no escribe nada:

```text
/new_ai_project --help
```

La ayuda es:

```text
/new_ai_project — AI-first project bootstrap

Usage:
  /new_ai_project [idea] [options]
  /new_ai_project --help

What it does:
  Creates or adapts the structure, documentation and harness of a software
  project so humans and AI agents can work with Spec-Driven Development.
  It does not implement application features.

Modes:
  (no mode)           Ask which flow to use.
  generic             Create folders and Markdown skeletons with TODO markers.
                      Do not invent product, stack or features.
  guided              Interview the user one question at a time, then generate
                      the complete documents, code skeleton and harness.
  adapt               Adapt an existing project without changing its behaviour.
  --help, -h          Show this help and exit without writing anything.
  help                Same as --help.

Options:
  --path=<path>       Work in another directory (absolute or relative).
  --yes               Accept recommendations for non-destructive decisions.
  --no-install        Do not install skills or MCPs.
  --minimal           Skip subagents, ADRs and session logs.
  --lang=<code>       Also write a complete <code> translation next to every
                      generated Markdown file, e.g. AGENTS.es.md.
                      Accepts a comma-separated list: --lang=es,pt-BR.
  --secondary-lang=<code>
                      Alias of --lang.

Examples:
  /new_ai_project
  /new_ai_project I want an app to track my study sessions
  /new_ai_project generic
  /new_ai_project guided --lang=es
  /new_ai_project --path=../my-new-project --lang=es
  /new_ai_project adapt --yes --no-install
  /new_ai_project --help

Language:
  All generated Markdown is written in English. The conversation uses your
  language. --lang adds human-readable translations; English remains the
  source of truth.

Output:
  AGENTS.md, MEMORY.md, README.md, docs/, specs/ with constitution and
  features, project-scoped harness, and a code skeleton for the approved stack.

Safety:
  Nothing global by default. No destructive commands. No secrets. No changes
  to existing functionality. Backups before overwriting or moving files.
```

Otros ejemplos:

```text
/new_ai_project quiero una app para registrar mis sesiones de estudio
/new_ai_project generic
/new_ai_project guided --lang=es
/new_ai_project --path=../mi-nuevo-proyecto --lang=es
/new_ai_project adapt --yes --no-install
```

### Idioma de la documentación

- **Todo el Markdown generado se escribe en inglés.** Es lo que lee el modelo y lo que se mantiene como fuente de verdad.
- **La conversación usa tu idioma.** Preguntas, resúmenes, aprobaciones e informe final en el idioma en que hables.
- **Copias localizadas opcionales.** Pasa `--lang=<código>` para crear una traducción completa junto a cada `.md` generado:

  ```text
  AGENTS.md          AGENTS.es.md
  MEMORY.md          MEMORY.es.md
  README.md          README.es.md
  specs/features/001-checkout/spec.md
                     specs/features/001-checkout/spec.es.md
  docs/architecture.md
                     docs/architecture.es.md
  ```

  Un índice `docs/i18n.md` lista cada fuente, traducción, fecha de sincronización y estado. El inglés es siempre la fuente de verdad. El índice no se traduce.
- **Sin parámetro, sin copias.** La salida por defecto es solo inglés.
- **Varios idiomas.** `--lang=es,pt-BR` crea ambos juegos.

### Si la carpeta está vacía

El comando te ofrece dos caminos:

1. **Estructura genérica**: crea solo carpetas y `.md` con encabezados, secciones y `TODO`. No inventa tu producto ni tu stack. Ideal si quieres rellenarlo a tu ritmo.
2. **Construcción guiada**: te hace preguntas de una en una para definir producto, usuarios, MVP, datos, stack, arquitectura, features, calidad y entrega. Al final genera los documentos completos y, con tu permiso, instala lo necesario.

En el modo guiado, cada pregunta ofrece siempre:

- Responder con tus palabras.
- **¿Te sugiero alguna?** — el modelo propone 2-3 opciones con ventajas, inconvenientes y recomendación.
- **Elegido por mí** — el modelo decide, lo aplica y te informa de la decisión.
- **Para aquí** — genera un borrador con lo que haya y marca lo que falta.

### Si ya hay un proyecto

El comando no toca nada por su cuenta. Te pregunta:

1. **Adaptar** el proyecto actual a los estándares AI-first, conservando funcionalidades y specs existentes.
2. **Nueva ruta** para el proyecto nuevo.
3. **Nueva carpeta** para el proyecto nuevo.
4. Cancelar.

La adaptación es no destructiva: inventario, plan, backup, merge de `AGENTS.md`/`MEMORY.md`, cambios estructurales solo con aprobación y tests después de cada movimiento. La documentación existente en otros idiomas se conserva como traducción o legado, nunca como fuente de verdad.

---

## Qué crea

```text
<proyecto>/
├── AGENTS.md
├── AGENTS.<lang>.md        # opcional, con --lang
├── MEMORY.md
├── README.md
├── .env.example
├── docs/
│   ├── architecture.md
│   ├── i18n.md             # opcional, con --lang
│   ├── discovery/{answers,open-questions}.md
│   ├── adr/
│   ├── memory/
│   ├── quality/{testing,security}.md
│   └── harness/README.md
├── specs/
│   ├── README.md
│   ├── constitution/{mission,roadmap,tech-stack,principles}.md
│   ├── features/001-<slug>/
│   │   ├── spec.md
│   │   ├── clarification.md
│   │   ├── plan.md
│   │   ├── tasks.md
│   │   └── validation.md
│   └── templates/
├── src/            # esqueleto adaptado al stack
├── tests/
├── scripts/
└── .opencode/      # opcional: comandos y agentes
```

La estructura de `src/`, `tests/` y `scripts/` se adapta al stack aprobado: feature-based para frontend, capas o hexagonal para APIs, monorepo para fullstack, pipeline para datos/ML, etc. Cada `.md` recibe un hermano `.<lang>.md` cuando se usa `--lang`.

---

## SDD: spec-anchored + spec-as-source

El proyecto se genera con el flujo completo:

```text
Constitución → Spec → Clarificación → Plan → Tareas → Implementación → Validación
```

- **Spec-anchored**: la especificación se mantiene viva y se actualiza con cada cambio.
- **Spec-as-source**: el comportamiento se define en la spec; el código se deriva de ella.
- Cada feature vive en `specs/features/NNN-slug/` con cinco artefactos: `spec.md`, `clarification.md`, `plan.md`, `tasks.md` y `validation.md`.
- Los requisitos se escriben en **EARS** (`WHEN... THE SYSTEM SHALL...`, `IF... THEN...`, `WHILE...`, `THE SYSTEM SHALL...`).
- Ningún cambio de comportamiento se implementa sin actualizar primero la spec.

Con el kit SDD instalado:

```text
/sdd-constitution
/sdd-spec 002-nombre idea inicial
/sdd-clarify 002-nombre
/sdd-plan 002-nombre
/sdd-tasks 002-nombre
/sdd-implement 002-nombre T1
/sdd-validate 002-nombre
/sdd-change 002-nombre nuevo requisito
/sdd-status 002-nombre
```

---

## Skills, MCPs y agentes

El comando puede instalar, **siempre a nivel de proyecto y con autorización expresa**:

- **`find-skills`** (Vercel Labs, [skills.sh](https://www.skills.sh/vercel-labs/skills/find-skills)): busca e instala skills del ecosistema.
- **Skills imprescindibles del stack**: solo fuentes oficiales, ≥100k instalaciones o ≥10k estrellas, sin solapamientos, revisadas antes de instalar. Máximo 3-5.
- **MCPs**: Context7, Chrome DevTools, GitHub, bases de datos, Figma... solo si aportan. Configuración V2 en `opencode.json`, secretos con `{env:VAR}`.
- **Comandos `/sdd-*`**: el flujo SDD completo.
- **Subagentes**: `coordinator`, `planner`, `implementer`, `reviewer`, con permisos mínimos.

Nada de `-g`. Nada de instalar por instalar. Cada instalación se justifica con qué, para qué, coste, alcance y cómo se desinstala.

---

## Compatibilidad

| Harness | Comando | Skill | Notas |
|---|---|---|---|
| **OpenCode** | `.opencode/commands/` | `.opencode/skills/`, `.agents/skills/` | Soporte completo, incluido `agent: build` y subagentes |
| **Claude Code** | `.claude/commands/` | `.claude/skills/` | El instalador elimina `agent` del frontmatter |
| **Cursor** | `.cursor/commands/` | `.agents/skills/` | Comando portable; subagentes no |
| **GitHub Copilot** | `.github/prompts/*.prompt.md` | `.agents/skills/` | Modo prompt; sin subagentes |

El cuerpo del comando es Markdown portable. Si tu harness no soporta comandos por archivo, úsalo como prompt pegado en el chat.

---

## Seguridad

- Nada global por defecto.
- Nada de secretos en documentos, prompts o configuración.
- Nada de `rm -rf`, `git reset --hard`, `git clean -fd` ni `git push --force`.
- Backup antes de mover o sobrescribir.
- No se cambian funcionalidades de un proyecto existente.
- No se instala nada sin aprobación explícita.
- Las skills de terceros se leen antes de instalar.

---

## Desarrollo

Requisitos: Node.js 20 o superior.

```bash
npm run validate  # frontmatter, secciones, rutas, enlaces y política de idioma
npm test          # tests del instalador, del comando y del repositorio
npm run check     # validate + test
```

Estructura del repositorio:

```text
new-ia-project/
├── skills/new-ai-project/
│   ├── SKILL.md
│   ├── command/new_ai_project.md   # fuente de verdad
│   ├── scripts/install.mjs
│   ├── assets/{commands,agents,skills,templates}/
│   └── references/
├── tests/
├── docs/
└── .github/workflows/ci.yml
```

Ver [CONTRIBUTING.md](CONTRIBUTING.md) y [docs/testing.md](docs/testing.md).

---

## Publicación

### GitHub

```bash
git init
git add .
git commit -m "feat: new_ai_project command and SDD toolkit"
git branch -M main
git remote add origin https://github.com/AlexeyFernandezSuarez/new-ai-project.git
git push -u origin main
```

### skills.sh

El repositorio ya contiene `skills/new-ai-project/SKILL.md`, así que el CLI puede descubrirlo:

```bash
npx skills add AlexeyFernandezSuarez/new-ai-project --skill new-ai-project --list
```

La ficha está disponible en `https://www.skills.sh/AlexeyFernandezSuarez/new-ia-project`. Instrucciones completas: [docs/publishing.md](docs/publishing.md).

---

## Licencia

MIT. Ver [LICENSE](LICENSE).
