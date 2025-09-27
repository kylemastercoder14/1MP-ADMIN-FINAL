"use client";
import React from "react";
import Greetings from "@/components/globals/greetings";
import { Button } from "@/components/ui/button";
import { Printer, ShoppingBag, Store, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { IconStackPop, IconStackPush } from "@tabler/icons-react";
import { SalesChart } from "@/components/globals/charts/sales-chart";
import { AudienceChart } from "@/components/globals/charts/audience-chart";
import { SellersChart } from "@/components/globals/charts/sellers-chart";
import RecentOrderTable from "@/components/globals/charts/recent-order-table";
import { FeedbackChart } from "@/components/globals/charts/feedback-chart";
import TopProductsTable from "@/components/globals/charts/products-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { StatCards } from "@/types/admin";
import { formatTimeRange } from "@/lib/utils";
import {
  getAudiencesAnalytics,
  getSalesAnalytics,
  getStatsAnalytics,
} from "@/actions/dashboard";

const DashboardClient = ({
  statsCards,
  salesData,
  audiencesData,
}: {
  statsCards: StatCards;
  salesData: { date: string; profit: number; loss: number }[];
  audiencesData: { date: string; website: number; mobile: number }[];
}) => {
  const isMobile = useIsMobile();
  const [statData, setStatData] = React.useState(statsCards);
  const [salesStateData, setSalesStateData] = React.useState(salesData);
  const [audiencesStateDate, setAudiencesStateData] =
    React.useState(audiencesData);
  const [timeRange, setTimeRange] = React.useState<
    "last3months" | "last28days" | "last7days"
  >("last3months");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("last7days");
    }
  }, [isMobile]);

  React.useEffect(() => {
    const fetchStatsCard = async () => {
      const response = await getStatsAnalytics(timeRange);
      setStatData(response);
    };
    const fetchSalesData = async () => {
      const response = await getSalesAnalytics(timeRange);
      setSalesStateData(response);
    };
    const fetchAudiencesData = async () => {
      const response = await getAudiencesAnalytics(timeRange);
      setAudiencesStateData(response);
    };

    fetchStatsCard();
    fetchSalesData();
    fetchAudiencesData();
  }, [timeRange]);
  return (
    <div>
      <div className="flex items-center justify-between">
        <Greetings />
        <div className="flex items-center gap-3">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) =>
              setTimeRange(value as "last3months" | "last28days" | "last7days")
            }
            variant="outline"
          >
            <ToggleGroupItem value="last3months" className="!px-5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="last28days" className="!px-5">
              Last 28 days
            </ToggleGroupItem>
            <ToggleGroupItem value="last7days">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Button variant="primary">
            <Printer className="size-4" />
            Print Report
          </Button>
        </div>
      </div>
      <div className="mt-10 grid lg:grid-cols-10 grid-cols-1 gap-5">
        <div className="lg:col-span-6">
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
            <div className="p-5 border shadow-sm rounded-sm">
              <div className="flex items-center gap-3">
                <div className="bg-[#800020] size-10 rounded-sm flex items-center justify-center">
                  <Wallet className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    ₱{Number(statData.revenue.data).toLocaleString()}
                  </h3>
                  <p className="text-muted-foreground">
                    {statData.revenue.title}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center font-medium text-sm gap-2">
                {statData.revenue.trend === "up" ? (
                  <IconStackPop className="size-5 text-green-600" />
                ) : (
                  <IconStackPush className="size-5 text-red-600" />
                )}
                <span
                  className={
                    statData.revenue.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {statData.revenue.percentage}%
                </span>
                <span className="text-muted-foreground">
                  {statData.revenue.trend === "up" ? "Increased" : "Decreased"}{" "}
                  {formatTimeRange(timeRange)}
                </span>
              </div>
            </div>
            <div className="p-5 border shadow-sm rounded-sm">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 size-10 rounded-sm flex items-center justify-center">
                  <ShoppingBag className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {statData.products.data}
                  </h3>
                  <p className="text-muted-foreground">
                    {statData.products.title}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center font-medium text-sm gap-2">
                {statData.products.trend === "up" ? (
                  <IconStackPop className="size-5 text-green-600" />
                ) : (
                  <IconStackPush className="size-5 text-red-600" />
                )}
                <span
                  className={
                    statData.products.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {statData.products.percentage}%
                </span>
                <span className="text-muted-foreground">
                  {statData.products.trend === "up" ? "Increased" : "Decreased"}{" "}
                  {formatTimeRange(timeRange)}
                </span>
              </div>
            </div>
            <div className="p-5 border shadow-sm rounded-sm">
              <div className="flex items-center gap-3">
                <div className="bg-orange-600 size-10 rounded-sm flex items-center justify-center">
                  <Store className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {statData.sellers.data}
                  </h3>
                  <p className="text-muted-foreground">
                    {statData.sellers.title}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center font-medium text-sm gap-2">
                {statData.sellers.trend === "up" ? (
                  <IconStackPop className="size-5 text-green-600" />
                ) : (
                  <IconStackPush className="size-5 text-red-600" />
                )}
                <span
                  className={
                    statData.sellers.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {statData.sellers.percentage}%
                </span>
                <span className="text-muted-foreground">
                  {statData.sellers.trend === "up" ? "Increased" : "Decreased"}{" "}
                  {formatTimeRange(timeRange)}
                </span>
              </div>
            </div>
          </div>
          <SalesChart salesData={salesStateData} />
          <div className="p-5 mt-5 border shadow rounded-sm">
            <RecentOrderTable />
          </div>
          <FeedbackChart />
        </div>
        <div className="lg:col-span-4">
          <AudienceChart audiencesData={audiencesStateDate} />
          <SellersChart />
          <div className="p-5 mt-5 border shadow rounded-sm">
            <TopProductsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
