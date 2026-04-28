import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    const caseId = req.nextUrl.searchParams.get("caseId");

    if (!caseId) {
      return NextResponse.json(
        { error: "Missing caseId" },
        { status: 400 }
      );
    }

    // 1. load case
    const { data: caseRow, error: caseError } = await supabaseServer
      .from("cases")
      .select("id, patient_id")
      .eq("id", caseId)
      .single();

    if (caseError || !caseRow) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      );
    }

    // 2. load patient
    const { data: patient, error: patientError } = await supabaseServer
      .from("patients")
      .select("*")
      .eq("id", caseRow.patient_id)
      .single();

    if (patientError || !patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // 3. Prefer exact intake snapshot when available.
    // Fallback to DB-column mapping for older records.
    const form = patient.intake_payload ?? {
      firstName: patient.first_name ?? "",
      lastName: patient.last_name ?? "",
      phone: patient.phone ?? "",
      dob: patient.date_of_birth ?? "",
      address: patient.address_line1 ?? "",
      city: patient.city ?? "",
      state: patient.state ?? "",
      zip: patient.postal_code ?? "",
      currentLocation: patient.current_location_description ?? "",
      isCurrentlyHomeless: patient.housing_status ?? "",
      sleptLastNight: patient.homeless_last_night ?? "",
      substances: [
        patient.primary_substance,
        patient.secondary_substance,
      ].filter(Boolean),
      frequency: patient.use_frequency ?? "",
      environmentPreference: patient.environment_preference ?? "",
      workDailyLifeNotes: patient.work_daily_life_notes ?? "",
      familyRelationshipNotes: patient.family_relationship_notes ?? "",
      locationEnvironmentNotes: patient.location_environment_notes ?? "",
      treatmentGoalsNotes: patient.treatment_goals_notes ?? "",
      additionalContextNotes: patient.additional_context_notes ?? "",
    };

    return NextResponse.json({
      ok: true,
      caseId: caseRow.id,
      form,
    });
  } catch (err) {
    console.error("resume error:", err);
    return NextResponse.json(
      { error: "Unable to resume intake" },
      { status: 500 }
    );
  }
}
