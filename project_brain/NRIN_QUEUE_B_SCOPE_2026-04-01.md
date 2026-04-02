✅ QUEUE B — OFFICIAL DEFINITION

Purpose:
Correct and enrich facility-level truth where crawler signals are incomplete, distorted, or misleading.

Scope:
Facilities where:

signal completeness is low OR suspicious
known real-world quality is not reflected
geo relevance is high (local markets)
admissions-critical signals are weak or missing

Inputs:

facility_sites
facility_intelligence
crawler evidence (v1 + Queue A)
known anomalies (like what you just found)

Outputs (updates to facility_intelligence):

program truth (detox/residential/etc)
MAT truth
insurance truth (refined)
narrative summary (cleaned)
confidence normalization (not inflated by noise)
🎯 What Queue B is NOT

This is critical:

Queue B is not:

discovery
ranking logic
UI
brute-force recrawling

It is:

precision correction of the truth layer