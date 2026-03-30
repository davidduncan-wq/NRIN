# NRIN — QUEUE A INSURANCE ENRICHMENT HANDOFF

## CONTEXT
We are entering crawler v2 focused on insurance accuracy.

Queue A = facilities where:
- accepts_private_insurance_detected = false OR null
- confidence_score >= 75
- website exists

These rows are NOT random — they represent systemic extraction failures:
- negation misreads ("we do not accept...")
- FAQ question capture ("Do you take Medicare?")
- exclusion language misinterpreted ("excluding Medicare/Medicaid")
- shared-domain propagation across multiple facility rows

## GOAL
Fix INSURANCE TRUTH.

NOT discovery.
NOT matching.
NOT UI.

We are correcting the intelligence layer.

## TARGET BEHAVIOR
For each domain:
1. Crawl using headless browser (Playwright)
2. Prioritize:
   - /insurance
   - /admissions
   - /verify-insurance
   - /payment
3. Extract:
   - accepts_private_insurance (true/false)
   - carrier list (Aetna, Cigna, BCBS, etc.)
4. Apply RULES:
   - IGNORE questions
   - IGNORE negations unless explicitly "we do NOT accept X"
   - DO NOT treat Medicare/Medicaid presence as acceptance automatically
   - Detect phrases like:
     - "in-network with"
     - "we accept most major insurance"
     - "verify your insurance"

## OUTPUT
Update facility_intelligence:
- accepts_private_insurance_detected
- accepted_insurance_providers_detected
- confidence_score (re-evaluated)

## IMPORTANT INSIGHT
This is NOT a crawler problem.

This is an INTERPRETATION problem.

Headless browsing is only used to:
- reach JS-rendered pages
- access hidden insurance content

## PRIORITY ORDER
1. Hazelden-style domains (known broken)
2. Queue A results
3. Known high-value domains (Michael’s House, Solution Point, etc.)

## SUCCESS CRITERIA
- Hazelden flips to private insurance = true
- Medicare/Medicaid false positives removed
- carrier lists expand meaningfully
- confidence reflects correctness, not noise

