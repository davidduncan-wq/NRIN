"use client";

import { useSearchParams } from "next/navigation";
import FacilityPortalClient from "@/components/facility/FacilityPortalClient";

export default function FacilityPortalPageClient() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facilityId");

  return <FacilityPortalClient facilityId={facilityId} />;
}
