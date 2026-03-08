# NRIN — CANONICAL ENGINEERING HANDOFF

**Date:** 2026-03-06  
**Project:** National Recovery Intake Network (NRIN)  
**Owner:** David Duncan

---

## YOU ARE THE RECEIVING AI

You are receiving an engineering handoff for the NRIN project.

Do NOT create a new handoff.  
Do NOT summarize this handoff.  
Do NOT rewrite this handoff.

Your job is to:
1. Read this file completely
2. Treat it as current project context
3. Continue work from the state described below

GitHub is the canonical source of truth.

---

## 1. Current Repository State

### Canonical Internal Repo
- Repo: `NRIN`
- Visibility: Private
- GitHub: `https://github.com/davidduncan-wq/NRIN`

### Public Demo Repo
- Repo: `NRIN-demo`
- Visibility: Public
- GitHub: `https://github.com/davidduncan-wq/NRIN-demo`

The repos are intentionally separate.

`NRIN` is the canonical engineering repo.  
`NRIN-demo` is an isolated public demo repo.

---

## 2. Current Local Development State

Expected local folders:

```text
Desktop/
  NRIN
  NRIN-demo
  Current working repo is NRIN.
NRIN local Git status was confirmed clean and synced with GitHub.
Confirmed state:
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
1d79023 Add patient intake components

3. Strategic Repo Roles
NRIN
Use for:
cleaned-up architecture
internal product development
real workflows
refactoring
future production-grade implementation
NRIN-demo
Use for:
investor/stakeholder presentations
public walkthroughs
isolated demo behavior
polished visual reference points
Do not treat NRIN-demo as the engineering source of truth.
4. Design Situation
Current state:
NRIN
cleaner codebase
more canonical engineering direction
less polished visual design in some areas
NRIN-demo
better visual polish in some areas
more presentation-friendly
not the canonical engineering base
Required rule
AI may inspect NRIN-demo and selectively port visual elements into NRIN, but only surgically.
Never:

overwrite NRIN with NRIN-demo
merge repos wholesale
let demo structure dictate core engineering decisions
5. Technology Stack
Current stack:
Next.js 16
App Router
TypeScript
TailwindCSS
Supabase
Vercel
6. Major Work Themes Completed So Far
Project work across recent sessions has included:
patient intake wizard development
mobile-first intake UI refinement
reusable UI primitive development
checkmark / completion state patterns
facility referral workflow work
Supabase integration work
demo stabilization for stakeholder viewing
repo continuity hardening through GitHub
7. Current Product Reality
The public-facing demo is considered good enough for stakeholder/investor viewing for now.
Primary engineering focus should now remain on the internal NRIN repo.

That means:

continue internal development in NRIN
keep NRIN-demo isolated
borrow design selectively when useful
8. Continuity Risk Notes
Prior sessions suffered from:
browser slowdown
continuity drift across long chats
stale code snippets
confusion between demo and internal repos
This project_brain structure is intended to reduce those problems.
Future AI must rely on:

GitHub
project_brain files
confirmed local repo state
not on vague chat memory.
9. Developer Preferences
David prefers:
engineering-grade guidance
exact commands
exact file paths
low fluff
surgical edits
preservation of continuity
GitHub-centered workflow
When instructing David, be operational and precise.
10. Immediate Direction for the Next AI
Default assumption:
work in NRIN
treat it as canonical
use NRIN-demo only as selective design reference
Good next tasks include:
strengthening canonical docs in project_brain
continuing internal app development
selectively restoring visual polish from NRIN-demo into NRIN
maintaining architectural cleanliness while improving UI quality
11. Standing Non-Negotiables
GitHub is canonical after confirmed push
NRIN is the engineering source of truth
NRIN-demo is not the engineering source of truth
do not merge repos wholesale
prefer surgical edits
end major sessions with updated canonical handoff if David asks
12. One-Line Executive Summary
NRIN now has a clean two-repo structure: NRIN is the private canonical engineering repo, and NRIN-demo is the separate public demo repo; future work should continue in NRIN, with only selective design borrowing from NRIN-demo.

Save with **Cmd+S**.

---

# Terminal

After all three files are saved, run:

```bash
git status
You should see the new/modified files.
Then run:

git add project_brain/00_READ_ME_FIRST.md project_brain/NRIN_REPO_STRATEGY.md project_brain/NRIN_ENGINEERING_HANDOFF.md
git commit -m "Add canonical project brain docs"
git push
Browser
No browser step required for this slice.
Success looks like:

files exist in project_brain
commit succeeds
push succeeds
GitHub now contains the canonical docs
Next move after this
Paste me the output of:
git status
git log -1 --oneline
Then we’ll do the next three files:
NRIN_CANONICAL_STATE.md
NRIN_SURGICAL_EDIT_RULES.md
NRIN_PRODUCT_VISION.md





