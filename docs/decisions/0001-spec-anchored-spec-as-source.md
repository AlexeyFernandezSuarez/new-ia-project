# ADR 0001 — Spec-anchored and spec-as-source SDD

- **Status**: accepted
- **Date**: 2026-10-20
- **Deciders**: `new-ai-project` maintainers
- **Affects**: `command/new_ai_project.md`, `assets/`, templates, generated documentation

## Context

The command generates documentation for projects developed with agents. There are three common ways to relate the specification to code:

1. **Spec-first**: a spec is written at the start and abandoned when implementation begins.
2. **Spec-anchored**: the spec stays alive and is updated with every change; code and spec must match.
3. **Spec-as-source**: the spec is the source of truth for behaviour; code derives from it and is validated against it.

In agent-assisted projects, spec-first produces dead documentation: the agent reads a description that no longer matches the code and makes incorrect decisions. The absence of a spec produces the opposite: every session reinvents behaviour and decisions are buried in chat history.

The command needs a model that is demanding but sustainable for a small team.

## Decision

The generated project uses **spec-anchored + spec-as-source**:

- Each feature has a spec with EARS requirements and verifiable acceptance criteria.
- The spec is updated **before** behaviour changes. Code changes without a spec change are a process error.
- `plan.md`, `tasks.md` and `validation.md` derive from the spec and reference it requirement by requirement.
- `validation.md` shows which requirements are covered by tests and which by manual checks.
- The constitution (`specs/constitution/`) prevails over any feature spec. A conflict is documented in `clarification.md`, never resolved silently.
- `MEMORY.md` is working state, not a second spec. It cannot contradict `specs/`.
- English is canonical. Localized copies are translations and cannot override the English source.

Mandatory flow:

```text
Constitution → Spec → Clarification → Plan → Tasks → Implementation → Validation
```

## Alternatives considered

### Spec-first only

- **Advantage**: less daily discipline; it is written once.
- **Disadvantage**: documentation goes stale and the agent loses the source of truth.
- **Reason for rejection**: this is exactly the failure the command aims to prevent.

### Spec-as-source only, without anchoring

- **Advantage**: maximum rigour; code is a projection of the spec.
- **Disadvantage**: requires full regeneration or automated verification, unrealistic for heterogeneous stacks and small projects.
- **Reason for rejection**: without anchoring, the spec becomes theory disconnected from the repository.

### Free documentation without SDD

- **Advantage**: zero friction.
- **Disadvantage**: no criterion for knowing whether a change is complete and no traceability between requirement, task and test.
- **Reason for rejection**: the agent cannot verify anything.

### SDD with a single spec per project

- **Advantage**: fewer files.
- **Disadvantage**: mixes constitution, product requirements and technical details; grows without control and becomes unreadable.
- **Reason for rejection**: per-feature separation enables incremental work and scoped review.

## Consequences

### Positive

- The agent has a stable source of truth and can cite specific requirements.
- Tasks and tests are justified against requirements, not intuition.
- Decisions and their reasons are versioned.
- Adapting existing projects can preserve specs and add the standard without rewriting product.

### Negative

- More writing before code. The command mitigates this with templates and guided questions.
- Constant discipline: if the team does not update the spec, the model degenerates into spec-first.
- Very small projects may find the flow bureaucratic; `--minimal` keeps the spec but skips subagents, ADRs and session logs.
- Optional localized copies add maintenance; `docs/i18n.md` and validation make drift visible.

### Neutral

- The EARS format is a convention, not a technical dependency.
- The five artifacts per feature are mandatory in the standard, but their depth adapts to the size of the change.

## Compliance

`npm run validate` checks that the command keeps the model references. Review of a repository change must reject:

- Behaviour changes without an updated spec.
- Requirements without verifiable acceptance criteria.
- `validation.md` without a requirement matrix.
- Relevant technical decisions without an ADR.

## References

- `skills/new-ai-project/command/new_ai_project.md`, section 5.
- `skills/new-ai-project/assets/templates/`.
- `skills/new-ai-project/assets/skills/sdd/SKILL.md`.
