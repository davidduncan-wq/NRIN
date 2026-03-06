# NRIN — SURGICAL EDIT RULES

## Purpose

This file defines how future AI agents must provide instructions when assisting with the NRIN project.

David is not a programmer and relies on clear, precise instructions.  
AI responses must therefore be structured, operational, and explicit.

The goal is to eliminate ambiguity and prevent broken edits.

---

# Core Instruction Format

Every task should follow this structure.

**Goal:** One sentence describing the objective.

**Micro-Plan:**  
3–6 bullets explaining the approach before actions begin.

---

# Action Sections

Actions must always be grouped by location.

## Terminal

Only raw commands should be placed in copy blocks.

Never include prompts such as:

davidduncan@Davids-MacBook-Pro %

Never include explanatory text inside command blocks.

Example:
git status
git add .
git commit -m "message"
git push


---

## VS Code

Always specify:

- exact file path
- whether to **replace the entire file** or **edit specific lines**
- instructions to save

Example:

Open:

src/app/patient/page.tsx

Action:

REPLACE ENTIRE FILE with the code provided.

Save:

Cmd+S

---

## Browser

Always specify:

- the exact URL
- what the expected result should be

Example:

Visit:

http://localhost:3000/patient

Expected:

Patient intake page renders with Step 1 visible.

---

## Supabase

If database changes are required, instructions must specify:

- exact dashboard location
- exact SQL query
- expected result

Example:

Supabase Dashboard → SQL Editor

Run:

SELECT * FROM patients;

---

# Editing Rules

Future AI must follow these rules:

1. Prefer **small incremental edits** over large rewrites.
2. Never restructure the project unless David explicitly asks.
3. When editing files, clearly indicate:
   - REPLACE ENTIRE FILE
   - EDIT ONLY THESE LINES
4. Do not modify unrelated files.
5. Preserve the existing architecture whenever possible.

---

# Git Rules

Before committing changes:

Run:

git status

Then commit using clear messages.

Example:

git commit -m "Improve intake step layout"

Push after commits unless David asks otherwise.

---

# Repo Context

Two repositories exist:

NRIN (private)
Canonical engineering codebase.

NRIN-demo (public)
Investor / stakeholder demo.

Rules:

- Work primarily in NRIN.
- Use NRIN-demo only as visual reference.
- Never merge repos wholesale.
- Port design elements surgically if needed.

---

# Communication Style

AI responses should be:

- concise
- precise
- operational
- free of unnecessary commentary

Avoid:

- vague instructions
- speculative architecture changes
- large unsolicited rewrites.

---

# Core Principle

Help David move forward with **clear, minimal friction instructions** while preserving architectural stability.