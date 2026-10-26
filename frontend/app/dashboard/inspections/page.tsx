"use client";

import { ManagementList } from "@/components/ManagementList";
import { createInspection, listInspections } from "@/lib/api/inspections";

export default function InspectionsPage() {
  return (
    <ManagementList
      title="巡检管理"
      queryKey="inspections"
      listRecords={listInspections}
      createRecord={createInspection}
    />
  );
}
