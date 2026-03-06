# NRIN — REPO STRATEGY

## Canonical Repository Structure

The NRIN project is intentionally split across two GitHub repositories.

### 1. Internal Engineering Repo

- Name: `NRIN`
- Visibility: Private
- GitHub: `https://github.com/davidduncan-wq/NRIN`

Purpose:
- canonical engineering source of truth
- internal product development
- cleaned-up architecture
- refactoring
- real workflows
- future production foundation

### 2. Public Demo Repo

- Name: `NRIN-demo`
- Visibility: Public
- GitHub: `https://github.com/davidduncan-wq/NRIN-demo`

Purpose:
- investor/stakeholder walkthroughs
- presentation-safe demo flows
- isolated public-facing prototype

## Source-of-Truth Rule

`NRIN` is the canonical engineering codebase.

`NRIN-demo` is NOT the canonical engineering codebase.

All architecture decisions, refactors, internal workflows, and real product development should occur in `NRIN`.

## Design Porting Rule

The AI may inspect `NRIN-demo` and selectively port specific design elements into `NRIN`.

Allowed:
- porting a specific UI pattern
- porting a styling pattern
- porting a small presentational component
- recreating a visual treatment in `NRIN`

Not allowed:
- copying the entire repo into `NRIN`
- merging repos wholesale
- overwriting `NRIN` architecture with `NRIN-demo`
- treating `NRIN-demo` as canonical for engineering decisions

## Correct Direction of Influence

Preferred direction:

`NRIN-demo` → visual inspiration only  
`NRIN` → canonical implementation

This means visual polish may move from `NRIN-demo` into `NRIN`, but architecture and product logic must remain governed by `NRIN`.

## Local Development Structure

Expected local folders:

```text
Desktop/
  NRIN
  NRIN-demo

  Local Folder Roles
NRIN
private repo
internal working build
primary VS Code workspace for real development
NRIN-demo
public repo
demo/presentation environment
separate from internal development
Deployment Intent
Expected deployment separation:
NRIN-demo → public-facing demo deployment
NRIN → internal development / validation deployment
These deployments should remain isolated.
Operating Rule for Future AI
Before doing any work, determine:
Which repo is being edited
Whether the task is internal engineering or demo polish
Whether a requested design change should be ported surgically rather than copied wholesale
If in doubt, default to NRIN as the working repo.