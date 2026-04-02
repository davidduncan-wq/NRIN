export const dynamic = "force-dynamic";

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FacilityPortalClient from "@/components/facility/FacilityPortalClient";

function FacilityPortalPageInner() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facilityId");

  return <FacilityPortalClient facilityId={facilityId} />;
}

export default function FacilityPortalPage() {
  return (
    <Suspense fallback={null}>
      <FacilityPortalPageInner />
    </Suspense>
  );
}
