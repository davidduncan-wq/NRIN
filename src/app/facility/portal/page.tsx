export const dynamic = "force-dynamic";

import { Suspense } from "react";
import FacilityPortalPageClient from "./FacilityPortalPageClient";

export default function FacilityPortalPage() {
  return (
    <Suspense fallback={null}>
      <FacilityPortalPageClient />
    </Suspense>
  );
}
