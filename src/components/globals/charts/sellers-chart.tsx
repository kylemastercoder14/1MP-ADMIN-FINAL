"use client";

import { LabelList, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatTimeRange } from "@/lib/utils";

export const description = "A radial chart with a label";

interface SellerChartData {
  name: string;
  revenue: number;
  fill: string;
}

interface SellersChartProps {
  chartData: SellerChartData[];
  timeRange: string;
}

export function SellersChart({ chartData, timeRange }: SellersChartProps) {
  // Build dynamic chart config based on data
  const chartConfig: ChartConfig = {
    revenue: {
      label: "Revenue",
    },
  };

  chartData.forEach((seller, index) => {
    const keys = ["seller1", "seller2", "seller3", "seller4", "seller5"];
    const colors = [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ];
    chartConfig[keys[index] as keyof ChartConfig] = {
      label: seller.name,
      color: colors[index] || "var(--chart-5)",
    };
  });

  // Calculate max revenue for percentage calculation
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  // Normalize data for chart (convert to percentage of max)
  const normalizedData = chartData.map((seller) => ({
    name: seller.name,
    revenue: seller.revenue,
    revenuePercent: (seller.revenue / maxRevenue) * 100,
    fill: seller.fill,
  }));

  return (
    <Card className="flex mt-5 rounded-sm flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 5 Sellers</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Showing top 5 sellers for {formatTimeRange(timeRange)}
          </span>
          <span className="@[540px]/card:hidden">
            Showing top 5 sellers for {formatTimeRange(timeRange)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[267px] text-muted-foreground">
            No seller data available
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[267px]"
          >
            <RadialBarChart
              data={normalizedData}
              startAngle={-90}
              endAngle={380}
              innerRadius={30}
              outerRadius={110}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="name" />}
              />
              <RadialBar dataKey="revenuePercent" background>
                <LabelList
                  position="insideStart"
                  dataKey="name"
                  className="fill-white capitalize mix-blend-luminosity"
                  fontSize={11}
                />
              </RadialBar>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        {chartData.length > 0 ? (
          <div className="flex items-center justify-center mx-auto gap-4 flex-wrap">
            {chartData.map((seller, index) => {
              const colors = [
                "var(--chart-1)",
                "var(--chart-2)",
                "var(--chart-3)",
                "var(--chart-4)",
                "var(--chart-5)",
              ];
              return (
                <div key={seller.name} className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: colors[index] || "var(--chart-5)" }}
                  ></div>
                  <span className="text-sm font-medium">{seller.name}</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
}
