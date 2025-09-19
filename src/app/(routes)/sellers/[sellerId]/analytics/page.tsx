import React from "react";
import Client from "./_components/client";
import {
  getAgeDistribution,
  getBuyerTrendData,
  getGenderDistribution,
  getTopProducts,
  getVendorAnalytics,
  getWhetherToBuyDistribution,
} from "@/actions";
import {
  AgeDistributionPoint,
  BuyerDistributionPoint,
  BuyerTrendPoint,
  GenderDistributionPoint,
  StatCards,
  TopProductPoint,
} from "@/types";

const Page = async (props: {
  params: Promise<{
    sellerId: string;
  }>;
}) => {
  const params = await props.params;
  const statCards: StatCards = await getVendorAnalytics(
    params.sellerId,
    "last7days"
  );
  const buyerTrend: BuyerTrendPoint[] = await getBuyerTrendData(
    params.sellerId,
    "last7days"
  );
  const ageDist: AgeDistributionPoint[] = await getAgeDistribution(
    params.sellerId,
    "last7days"
  );
  const genderDist: GenderDistributionPoint[] = await getGenderDistribution(
    params.sellerId,
    "last7days"
  );
  const whetherToBuyDist: BuyerDistributionPoint[] =
    await getWhetherToBuyDistribution(params.sellerId, "last7days");
  const topProducts: TopProductPoint[] = await getTopProducts(params.sellerId, "last7days");

  return (
    <div>
      {/* TODO: Implement seller analytics page */}
      <Client
        statCards={statCards}
        vendorId={params.sellerId}
        buyerTrend={buyerTrend}
        ageDistribution={ageDist}
        genderDistribution={genderDist}
        whetherToBuyDistribution={whetherToBuyDist}
        topProducts={topProducts}
      />
    </div>
  );
};

export default Page;
