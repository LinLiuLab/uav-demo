"use client";

import { ManagementList } from "@/components/ManagementList";
import { createUAV, listUAVs } from "@/lib/api/uavs";

export default function UAVsPage() {
  return (
    <ManagementList
      title="无人机管理"
      queryKey="uavs"
      listRecords={listUAVs}
      createRecord={createUAV}
    />
  );
}
