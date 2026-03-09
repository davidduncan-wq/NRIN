"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FacilityTestPage() {
  const [message, setMessage] = useState("Testing...");

  useEffect(() => {
    const run = async () => {
      const { data, error } = await supabase
        .from("facility_sites")
        .select("id, name")
        .limit(5);

      if (error) {
        console.error("facility_sites test error:", error);
        setMessage(`ERROR: ${error.message}`);
        return;
      }

      console.log("facility_sites test data:", data);
      setMessage(`SUCCESS: loaded ${data?.length ?? 0} rows`);
    };

    void run();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-xl font-semibold">Facility Sites Test</h1>
      <p className="mt-4 text-sm">{message}</p>
    </main>
  );
}