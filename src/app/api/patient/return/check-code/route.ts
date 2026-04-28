import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { supabaseServer } from "@/lib/supabaseServer";
import { normalizePhone } from "@/lib/patient/normalizePhone";

type CheckCodeBody = {
  phone?: string;
  code?: string;
};

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

const twilioClient = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckCodeBody;
    const normalizedPhone = normalizePhone(body.phone ?? "");
    const code = (body.code ?? "").trim();

    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "Please enter a valid U.S. mobile number." },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: "Please enter the verification code." },
        { status: 400 }
      );
    }

    const isTestMode = process.env.NRIN_RETURN_TEST_MODE === "true";

    let approved = false;

    if (isTestMode) {
      approved = code === "111111";
    } else {
      const verificationCheck = await twilioClient.verify.v2
        .services(verifyServiceSid)
        .verificationChecks.create({
          to: normalizedPhone,
          code,
        });

      approved = verificationCheck.status === "approved";
    }

    if (!approved) {
      return NextResponse.json(
        { error: "That code was not accepted." },
        { status: 400 }
      );
    }

    const digitsOnly = normalizedPhone.replace(/^\+1/, "");

    const phoneVariants = [
      digitsOnly,
      `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`,
      `1${digitsOnly}`,
      normalizedPhone,
    ];

    const { data: patientRows, error: patientError } = await supabaseServer
      .from("patients")
      .select("id, phone, created_at")
      .in("phone", phoneVariants)
      .order("created_at", { ascending: false });

    if (patientError) {
      console.error("return check-code patient lookup error:", patientError);
      return NextResponse.json(
        { error: "Unable to look up your intake right now." },
        { status: 500 }
      );
    }

    const patientIds = (patientRows ?? []).map((row) => row.id).filter(Boolean);

    if (patientIds.length === 0) {
      return NextResponse.json(
        { error: "We couldn't find an active intake for that phone number." },
        { status: 404 }
      );
    }

    const { data: caseRows, error: caseError } = await supabaseServer
      .from("cases")
      .select("id, patient_id, state, created_at, updated_at")
      .in("patient_id", patientIds)
      .in("state", ["NEW_INTAKE", "IN_PROGRESS", "MATCH_SELECTED"])
      .order("updated_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (caseError) {
      console.error("return check-code case lookup error:", caseError);
      return NextResponse.json(
        { error: "Unable to look up your intake right now." },
        { status: 500 }
      );
    }

    const selectedCase = caseRows?.[0];

    if (!selectedCase) {
      return NextResponse.json(
        { error: "We couldn't find an active intake for that phone number." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      caseId: selectedCase.id,
      redirectTo: `/patient?caseId=${selectedCase.id}&returnStep=5`,
    });
  } catch (error) {
    console.error("return check-code unexpected error:", error);
    return NextResponse.json(
      { error: "Unable to verify that code right now." },
      { status: 500 }
    );
  }
}
