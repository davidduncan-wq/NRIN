export const revalidate = 0;
export const dynamic = "force-dynamic";

import FacilityPortalClient from "@/components/facility/FacilityPortalClient";

export default async function FacilityPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ facilityId?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawFacilityId = params.facilityId;
  const facilityId =
    typeof rawFacilityId === "string"
      ? rawFacilityId
      : Array.isArray(rawFacilityId)
        ? rawFacilityId[0] ?? null
        : null;

  return <FacilityPortalClient facilityId={facilityId} />;
}
