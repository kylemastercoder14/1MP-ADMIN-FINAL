"use client";

import React, { useEffect, useState } from "react";
import Heading from "@/components/ui/heading";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import StatCard from "@/components/globals/sellers/stat-card";
import { BuyerTrendChart } from "./buyer-trend-chart";
import { AgeDistributionChart } from "./age-distribution-chart";
import { GenderCategoryChart } from "./gender-category-chart";
import { WhetherToBuyChart } from "./whether-buy-chart";
import { TopProductsChart } from "./top-products-chart";
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
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const Client = ({
  vendorId,
  statCards,
  buyerTrend,
  ageDistribution,
  genderDistribution,
  whetherToBuyDistribution,
  topProducts,
}: {
  vendorId: string;
  statCards: StatCards;
  buyerTrend: BuyerTrendPoint[];
  ageDistribution: AgeDistributionPoint[];
  genderDistribution: GenderDistributionPoint[];
  whetherToBuyDistribution: BuyerDistributionPoint[];
  topProducts: TopProductPoint[];
}) => {
  const dateNow = new Date();
  const [range, setRange] = useState<
    "last7days" | "last28days" | "last3months"
  >("last7days");
  const [statData, setStatData] = useState(statCards);
  const [buyerTrendData, setBuyerTrendData] = useState(buyerTrend);
  const [ageDistributionData, setAgeDistributionData] =
    useState(ageDistribution);
  const [genderDistributionData, setGenderDistributionData] =
    useState(genderDistribution);
  const [whetherToBuyDistributionData, setWhetherToBuyDistributionData] =
    useState(whetherToBuyDistribution);
  const [topProductsData, setTopProductsData] = useState(topProducts);
  const [loadingStatCards, setLoadingStatCards] = useState(false);

  useEffect(() => {
    const fetchStatCard = async () => {
      if (!vendorId) return;
      setLoadingStatCards(true);
      const response = await getVendorAnalytics(vendorId, range);
      setStatData(response);
      setLoadingStatCards(false);
    };
    fetchStatCard();

    const fetchBuyerTrend = async () => {
      if (!vendorId) return;
      const response = await getBuyerTrendData(vendorId, range);
      setBuyerTrendData(response);
    };
    fetchBuyerTrend();

    const fetchAgeDistribution = async () => {
      if (!vendorId) return;
      const response = await getAgeDistribution(vendorId, range);
      setAgeDistributionData(response);
    };
    fetchAgeDistribution();

    const fetchGenderDistribution = async () => {
      if (!vendorId) return;
      const response = await getGenderDistribution(vendorId, range);
      setGenderDistributionData(response);
    };
    fetchGenderDistribution();

    const fetchWhetherToBuyDistribution = async () => {
      if (!vendorId) return;
      const response = await getWhetherToBuyDistribution(vendorId, range);
      setWhetherToBuyDistributionData(response);
    };
    fetchWhetherToBuyDistribution();

    const fetchTopProducts = async () => {
      if (!vendorId) return;
      const response = await getTopProducts(vendorId, range);
      setTopProductsData(response);
    };
    fetchTopProducts();
  }, [range, vendorId]);
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Seller Analytics"
          description={`Updated: ${format(dateNow, "MMM dd, yyyy")} (GMT+08:00)`}
        />
        <ToggleGroup
          variant="outline"
          type="single"
          value={range}
          onValueChange={(value) => {
            if (
              value === "last7days" ||
              value === "last28days" ||
              value === "last3months"
            ) {
              setRange(value);
            }
          }}
        >
          <ToggleGroupItem value="last7days" aria-label="Toggle last 7 days">
            Last 7 days
          </ToggleGroupItem>
          <ToggleGroupItem value="last28days" aria-label="Toggle last 28 days">
            Last 28 days
          </ToggleGroupItem>
          <ToggleGroupItem
            value="last3months"
            aria-label="Toggle last 3 months"
          >
            Last 3 months
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {loadingStatCards ? (
        <div className="grid lg:grid-cols-4 mt-5 grid-cols-1 gap-5">
          <Skeleton className="h-[200px] w-full rounded-sm" />
          <Skeleton className="h-[200px] w-full rounded-sm" />
          <Skeleton className="h-[200px] w-full rounded-sm" />
          <Skeleton className="h-[200px] w-full rounded-sm" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 mt-5 grid-cols-1 gap-5">
          <StatCard
            title="New Buyer"
            count={statData.newBuyer.count}
            percentage={statData.newBuyer.percentage}
            proportion={statData.newBuyer.proportion}
            range={range}
            sales={statData.newBuyer.sales}
            trend={statData.newBuyer.trend}
          />
          <StatCard
            title="Repeat Buyer"
            count={statData.repeatBuyer.count}
            percentage={statData.repeatBuyer.percentage}
            proportion={statData.repeatBuyer.proportion}
            range={range}
            sales={statData.repeatBuyer.sales}
            trend={statData.repeatBuyer.trend}
          />
          <StatCard
            title="New Followers"
            count={statData.newFollowers.count}
            percentage={statData.newFollowers.percentage}
            proportion={statData.newFollowers.proportion}
            range={range}
            sales={statData.newFollowers.sales}
            trend={statData.newFollowers.trend}
          />
          <StatCard
            title="Active Followers"
            count={statData.activeFollowers.count}
            percentage={statData.activeFollowers.percentage}
            proportion={statData.activeFollowers.proportion}
            range={range}
            sales={statData.activeFollowers.sales}
            trend={statData.activeFollowers.trend}
          />
        </div>
      )}
      {loadingStatCards ? (
        <Skeleton className="h-[250px] mt-5 w-full rounded-sm" />
      ) : (
        <Card className="rounded-sm mt-5">
          <CardContent>
            <h3 className="text-black dark:text-white font-semibold text-lg tracking-tight">
              Buyers Trend
            </h3>
            <BuyerTrendChart data={buyerTrendData} />
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 mt-5">
        {loadingStatCards ? (
          <Skeleton className="h-[400px] w-full rounded-sm" />
        ) : (
          <Card className="rounded-sm">
            <CardContent>
              <h3 className="text-black dark:text-white font-semibold text-lg tracking-tight">
                Age Distribution
              </h3>
              <AgeDistributionChart data={ageDistributionData} />
            </CardContent>
          </Card>
        )}
        {loadingStatCards ? (
          <Skeleton className="h-[400px] w-full rounded-sm" />
        ) : (
          <Card className="rounded-sm">
            <CardContent>
              <h3 className="text-black dark:text-white font-semibold text-lg tracking-tight">
                Gender Category
              </h3>
              <GenderCategoryChart data={genderDistributionData} />
            </CardContent>
          </Card>
        )}
        {loadingStatCards ? (
          <Skeleton className="h-[400px] w-full rounded-sm" />
        ) : (
          <Card className="rounded-sm">
            <CardContent>
              <h3 className="text-black dark:text-white font-semibold text-lg tracking-tight">
                Whether to Buy
              </h3>
              <WhetherToBuyChart data={whetherToBuyDistributionData} />
            </CardContent>
          </Card>
        )}
      </div>
      {loadingStatCards ? (
        <div className="grid mt-5 lg:grid-cols-2 grid-cols-1 gap-5">
          <Skeleton className="h-[300px] w-full rounded-sm" />
          <Skeleton className="h-[300px] w-full rounded-sm" />
        </div>
      ) : (
        <TopProductsChart data={topProductsData} />
      )}
    </div>
  );
};

export default Client;
