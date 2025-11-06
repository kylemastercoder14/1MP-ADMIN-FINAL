"use client";

import React, { useMemo, useState } from "react";
import { CampaignProductsTable } from "./campaign-products-table";
import { columns } from "./campaign-products-columns";
import TableTabs from "./campaign-products-table-tabs";
import { ProductVariant } from '@prisma/client';

type CampaignProductWithRelations = {
  id: string;
  campaignPrice: number | null;
  discountPercentage: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  campaign: {
    id: string;
    title: string;
    campaignStartDate: Date;
    campaignEndDate: Date;
  };
  product: {
    id: string;
    name: string;
    images: string[];
    price: number | null;   // ✅ allow null
    vendor: {
      id: string;
      name: string | null;
      email: string;
    };
    category: {
      id: string;
      name: string;
    } | null;
    subCategory: {
      id: string;
      name: string;
    } | null;
    variants: Array<{
      id: string;
      price: number;
      quantity: number;
      sku: string | null;
      image: string | null;
      attributes: unknown;
    }>;
  };
  variantStocks: Array<{
    id: string;
    campaignStock: number;
    soldCount: number;
    productVariant: ProductVariant | null;
  }>;
};

const CampaignProductsClient = ({
  data,
}: {
  data: CampaignProductWithRelations[];
}) => {
  const [activeTab, setActiveTab] = useState<
    "all" | "Pending" | "Approved" | "Rejected"
  >("all");

  // Filter data based on status
  const filteredData = useMemo(() => {
    if (activeTab === "all") return data;
    return data.filter((item) => item.status === activeTab);
  }, [data, activeTab]);

  // Count products by tab status
  const tabCounts = useMemo(() => {
    const counts: Record<
      "all" | "Pending" | "Approved" | "Rejected",
      number
    > = {
      all: data.length,
      Pending: 0,
      Approved: 0,
      Rejected: 0,
    };

    for (const item of data) {
      const key = item.status as "Pending" | "Approved" | "Rejected";
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
      <CampaignProductsTable columns={columns} data={filteredData} />
    </>
  );
};

export default CampaignProductsClient;


