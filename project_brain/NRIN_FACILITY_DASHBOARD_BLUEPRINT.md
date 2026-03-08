NRIN Facility Dashboard Blueprint
Purpose
The Facility Dashboard is the operational interface where treatment centers:
review crawler-imported data
edit their facility profile
upload verification documents
control admissions availability
manage incoming referrals
This dashboard converts unstructured website data and facility input into the structured attributes defined in:
NRIN_FACILITY_ATTRIBUTE_SCHEMA.md
Dashboard Sections
The dashboard is composed of four panels.
1. Facility Profile Panel
Purpose: manage the public and matching-facing facility description.
Editable fields include:
facility_name
website_url
phone_number
admissions_contact
Program levels:
offers_detox
offers_residential
offers_php
offers_iop
offers_outpatient
offers_aftercare
Clinical specialties:
dual_diagnosis_support
trauma_informed_care
mat_supported
medical_detox_capability
Populations served:
young_adults_program
women_only_program
men_only_program
lgbtq_affirming
veterans_program
executive_program
professional_program
Insurance:
accepted_insurance_providers
insurance_verification_required
Marketing summary:
website_raw_copy
ai_generated_summary
facility_override_summary
admin_verified_summary
Summary precedence:
admin_verified
→ facility_override
→ ai_generated
2. Verification & Documents Panel
Purpose: allow facilities to upload certification documents and track verification.
Fields:
joint_commission_accredited
carf_accredited
state_licensed
legitscript_certified
nr_in_verified
verification_status
verification_notes
verification_documents
Verification states:
pending
under_review
verified
rejected
needs_resubmission
3. Operational Status Panel
Purpose: indicate real-time admissions availability.
Fields:
accepting_patients_now
accepting_patients_later
accepting_date
not_accepting_patients
current_capacity_status
Status options:
Accepting now
Accepting later
Not accepting
This data directly affects matching rankings.
4. Admissions / Pre-Screen Panel
Purpose: allow facilities to review matched patients and perform initial triage.
Capabilities:
view incoming referrals
review patient summary
view AI-generated context summary
add notes
accept patient
decline patient
request more information
escalate internally
Patient summaries should show structured signals such as:
family context
career context
housing status
motivation signals
clinical indicators
Example summary:
Primary motivation: reunification with children
Professional context: nurse on probation
Preference: treatment close to home
Data Source Precedence
Facility data can come from three sources.
imported_from_website
facility_edited
admin_verified
Recommendation cards should prioritize:
admin_verified
→ facility_edited
→ imported
Implementation Location
Dashboard page:
src/app/facility/dashboard/page.tsx
Components:
src/components/facility/
Planned components:
FacilityDashboardClient.tsx
FacilityProfilePanel.tsx
FacilityVerificationPanel.tsx
FacilityOperationsPanel.tsx
FacilityAdmissionsQueue.tsx
