"use client";

import React, { useMemo, useState } from "react";
import { RiderTable } from "./rider-table";
import { columns } from "./columns";
import TableTabs, { IItem } from "./rider-table-tabs";
import { Rider } from "@prisma/client";

const RiderClient = ({ data }: { data: Rider[] }) => {
  const [activeTab, setActiveTab] = useState<IItem["value"]>("all");

  // ✅ Filter data based on status
  const filteredData = useMemo(() => {
    if (activeTab === "all") return data;
    return data.filter((item) => item.adminApproval === activeTab);
  }, [data, activeTab]);

  // ✅ Count riders by tab status
  const tabCounts = useMemo(() => {
    const counts: Record<IItem["value"], number> = {
      all: data.length,
      Pending: 0,
      "Under Review": 0,
      Approved: 0,
      Rejected: 0,
    };

    for (const item of data) {
      const key = item.adminApproval as IItem["value"];
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    }

    return counts;
  }, [data]);

  return (
    <>
      <TableTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabCounts={tabCounts}
      />
      <RiderTable columns={columns} data={filteredData} />
    </>
  );
};

export default RiderClient;


