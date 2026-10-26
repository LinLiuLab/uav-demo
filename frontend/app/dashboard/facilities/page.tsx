"use client";

import { ManagementList } from "@/components/ManagementList";
import { createFacility, listFacilities } from "@/lib/api/facilities";

export default function FacilitiesPage() {
  return (
    <ManagementList
      title="设施管理"
      queryKey="facilities"
      listRecords={listFacilities}
      createRecord={createFacility}
    />
  );
}
