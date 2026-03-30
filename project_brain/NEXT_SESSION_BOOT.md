# NEXT SESSION BOOT — NRIN
Updated: 2026-03-30

Read these first, in order:

1. `project_brain/00_READ_ME_FIRST.md`
2. `project_brain/NRIN_PROJECT_INDEX.md`
3. `project_brain/NRIN_CANONICAL_STATE.md`
4. `project_brain/NRIN_SYSTEM_MAP.md`
5. `project_brain/NRIN_PRODUCT_ARCHITECTURE.md`
6. `project_brain/NRIN_CRAWLER_RESULT_SCHEMA.md`
7. `project_brain/NRIN_SURGICAL_EDIT_RULES.md`
8. `project_brain/CURRENT_HANDOFF.md`
9. `project_brain/handoffs/NRIN_INSURANCE_RESOLVER_HANDOFF_2026-03-30.md`

## Session instruction
Do NOT continue broad crawler work by default.

Current engineering target:
- build a separate post-crawl insurance truth resolver over `facility_intelligence`

Do NOT:
- expand crawler scope
- let crawler confidence bleed into ranking
- treat false as equivalent to public without evidence
- revisit Groundhog Day crawler exploration

Do:
- keep crawler narrow
- keep truth resolution separate
- preserve remaining false bucket for public/community/indigent-path analysis

## Working doctrine
NRIN ranks by fit, not by website loudness.
Crawler collects evidence.
Resolver interprets evidence.
Ranking should not reward marketing intensity.

