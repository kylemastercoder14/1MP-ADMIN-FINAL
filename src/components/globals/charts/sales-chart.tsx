"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
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
import { formatToPeso } from "@/lib/utils";

export const description = "An interactive area chart";

const chartConfig = {
  profit: {
    label: "Profit",
    color: "hsl(var(--success))",
  },
  loss: {
    label: "Loss",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

const mockData: { date: string; profit: number; loss: number }[] = [];

for (let i = 0; i < 90; i++) {
  const date = new Date();
  date.setDate(date.getDate() - i);

  mockData.unshift({
    date: date.toISOString().split("T")[0],
    profit: Math.floor(Math.random() * 5000) + 1000, // ₱1k - ₱6k
    loss: Math.floor(Math.random() * 2000), // ₱0 - ₱2k
  });
}

export function SalesChart({
  salesData,
}: {
  salesData: { date: string; profit: number; loss: number }[];
}) {
  const dataToRender =
    salesData && salesData.length > 0 ? salesData : mockData;

  return (
    <Card className="rounded-sm mt-5">
      <CardHeader>
        <CardTitle>Sales Report</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={dataToRender}>
            <defs>
              <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--success)" stopOpacity={1} />
                <stop
                  offset="95%"
                  stopColor="var(--success)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillLoss" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--destructive)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--destructive)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  formatter={(value, name) => [
                    formatToPeso(Number(value)),
                    chartConfig[name as keyof typeof chartConfig].label,
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="profit"
              type="natural"
              fill="url(#fillProfit)"
              stroke="var(--success)"
            />
            <Area
              dataKey="loss"
              type="natural"
              fill="url(#fillLoss)"
              stroke="var(--destructive)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-7">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-[var(--success)]"></div>
          <span className="text-sm font-medium">
            Profit:{" "}
            {formatToPeso(dataToRender.reduce((sum, d) => sum + d.profit, 0))}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-[var(--destructive)]"></div>
          <span className="text-sm font-medium">
            Loss:{" "}
            {formatToPeso(dataToRender.reduce((sum, d) => sum + d.loss, 0))}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-blue-600"></div>
          <span className="text-sm font-semibold">
            Net Profit:{" "}
            {formatToPeso(
              dataToRender.reduce((sum, d) => sum + d.profit, 0) -
                dataToRender.reduce((sum, d) => sum + d.loss, 0)
            )}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
