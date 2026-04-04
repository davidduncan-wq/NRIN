export const dynamic = "force-dynamic";
export const revalidate = 0;

import PreScreenPageClient from "./PreScreenPageClient";

export default async function PreScreenPage({
  searchParams,
}: {
  searchParams: Promise<{
    facilityId?: string | string[];
    facilityName?: string | string[];
    facilityLocation?: string | string[];
    patientId?: string | string[];
    caseId?: string | string[];
    matchScore?: string | string[];
    recommendedProgramType?: string | string[];
    insuranceStatus?: string | string[];
    insuranceType?: string | string[];
    selfPayIntent?: string | string[];
  }>;
}) {
  const params = await searchParams;

  function getParam(value?: string | string[]) {
    return typeof value === "string"
      ? value
      : Array.isArray(value)
        ? value[0] ?? ""
        : "";
  }

  return (
    <PreScreenPageClient
      facilityId={getParam(params.facilityId)}
      facilityName={getParam(params.facilityName)}
      facilityLocation={getParam(params.facilityLocation)}
      patientId={getParam(params.patientId)}
      caseId={getParam(params.caseId)}
      matchScore={getParam(params.matchScore)}
      recommendedProgramType={getParam(params.recommendedProgramType)}
      insuranceStatus={getParam(params.insuranceStatus)}
      insuranceType={getParam(params.insuranceType)}
      selfPayIntent={getParam(params.selfPayIntent)}
    />
  );
}
