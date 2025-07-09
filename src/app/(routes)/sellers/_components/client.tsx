"use client";

import React, { useMemo, useState } from "react";
import { SellerTable } from "./seller-table";
import { columns } from "./columns";
import TableTabs, { IItem } from "./table-tabs";
import { SellerWithProps } from "@/types";

const Client = ({ data }: { data: SellerWithProps[] }) => {
  const [activeTab, setActiveTab] = useState<IItem["value"]>("all");

  // ✅ Filter data based on status
  const filteredData = useMemo(() => {
	if (activeTab === "all") return data;
	return data.filter((item) => item.adminApproval === activeTab);
  }, [data, activeTab]);

  // ✅ Count products by tab status
  const tabCounts = useMemo(() => {
	const counts: Record<IItem["value"], number> = {
	  all: data.length,
	  Approved: 0,
	  "Under Review": 0,
	  Pending: 0,
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
	  <SellerTable columns={columns} data={filteredData} />
	</>
  );
};

export default Client;
