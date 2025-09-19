"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BuyerTrendPoint } from "@/types";

export const description = "A multiple line chart";

const chartConfig = {
  newBuyers: { label: "New Buyers", color: "var(--chart-1)" },
  repeatBuyers: { label: "Repeat Buyers", color: "var(--chart-2)" },
  followers: { label: "Followers", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function BuyerTrendChart({ data }: { data: BuyerTrendPoint[] }) {
  return (
    <ChartContainer
      className="aspect-auto h-[250px] mt-4 w-full"
      config={chartConfig}
    >
      <LineChart
        accessibilityLayer
        className="h-[200px] min-h-[200px] max-h- w-full"
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              indicator="dot"
            />
          }
        />
        <Line
          dataKey="newBuyers"
          type="natural"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="repeatBuyers"
          type="natural"
          stroke="var(--chart-2)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="followers"
          type="natural"
          stroke="var(--chart-3)"
          strokeWidth={2}
          dot={false}
        />
        <ChartLegend content={<ChartLegendContent payload={data} />} />
      </LineChart>
    </ChartContainer>
  );
}
