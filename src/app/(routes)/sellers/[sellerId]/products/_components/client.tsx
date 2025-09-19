"use client";

import React, { useMemo, useState } from "react";
import { ProductTable } from "./product-table";
import { columns } from "./columns";
import TableTabs, { IItem } from "./table-tabs";
import { ProductWithProps } from "@/types";

const Client = ({ data }: { data: ProductWithProps[] }) => {
  const [activeTab, setActiveTab] = useState<IItem["value"]>("all");

  // ✅ Filter data based on status
  const filteredData = useMemo(() => {
	if (activeTab === "all") return data;
	return data.filter((item) => item.adminApprovalStatus === activeTab);
  }, [data, activeTab]);

  // ✅ Count products by tab status
  const tabCounts = useMemo(() => {
	const counts: Record<IItem["value"], number> = {
	  all: data.length,
	  Approved: 0,
	  Pending: 0,
	  Deactivated: 0,
	  Rejected: 0,
	};

	for (const item of data) {
	  const key = item.adminApprovalStatus as IItem["value"];
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
	  <ProductTable columns={columns} data={filteredData} />
	</>
  );
};

export default Client;
