/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { TopProductPoint } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from 'next-themes';

export const description = "A horizontal bar chart";

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-age-1)",
  },
} satisfies ChartConfig;

export function TopProductsChart({ data }: { data: TopProductPoint[] }) {
  const { theme } = useTheme();
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 mt-5 gap-5">
      {/* Top 1–5 */}
      <Card className="rounded-sm">
        <CardContent>
          <h3 className="text-black dark:text-white font-semibold text-lg tracking-tight">
            Top 1-5 Products (Sold Count)
          </h3>
          <ChartContainer
            className="mt-3 w-full max-h-[300px]"
            config={chartConfig}
          >
            <BarChart
              accessibilityLayer
              data={data.slice(0, 5)}
              layout="vertical"
              margin={{ right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="top"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={({ x, y, payload }) => {
                  const product = data.find((d) => d.top === payload.value);
                  return (
                    <foreignObject x={x - 50} y={y - 15} width={40} height={40}>
                      <img
                        src={product?.image}
                        alt={payload.value}
                        className="w-8 h-8 rounded object-cover"
                      />
                    </foreignObject>
                  );
                }}
              />
              <XAxis type="number" dataKey="count" hide />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const item = payload[0].payload; // this contains { top, count }
                    return (
                      <div className="rounded-md border bg-white p-2 shadow-md text-xs">
                        <p className="font-medium">{item.top}</p>{" "}
                        {/* full product name */}
                        <p className="text-gray-600">Sold: {item.count}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="var(--chart-age-1)" radius={4}>
                {/* Count at the right side */}
                <LabelList
                  dataKey="count"
                  position="right"
                  style={{ fill: theme === "dark" ? "white" : "black", fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top 6–10 */}
      <Card className="rounded-sm">
        <CardContent>
          <h3 className="text-black dark:text-white font-semibold text-lg tracking-tight">
            Top 6-10 Products (Sold Count)
          </h3>
          <ChartContainer
            className="mt-3 w-full max-h-[300px]"
            config={chartConfig}
          >
            <BarChart
              accessibilityLayer
              data={data.slice(5, 10)}
              layout="vertical"
              margin={{ right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="top"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={({ x, y, payload }) => {
                  const product = data.find((d) => d.top === payload.value);
                  return (
                    <foreignObject x={x - 50} y={y - 15} width={40} height={40}>
                      <img
                        src={product?.image}
                        alt={payload.value}
                        className="w-8 h-8 rounded object-cover"
                      />
                    </foreignObject>
                  );
                }}
              />
              <XAxis type="number" dataKey="count" hide />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const item = payload[0].payload; // this contains { top, count }
                    return (
                      <div className="rounded-md border bg-white p-2 shadow-md text-xs">
                        <p className="font-medium">{item.top}</p>{" "}
                        {/* full product name */}
                        <p className="text-gray-600">Sold: {item.count}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="var(--chart-age-1)" radius={4}>
                {/* Count at the right side */}
                <LabelList
                  dataKey="count"
                  position="right"
                  style={{ fill: theme === "dark" ? "white" : "black", fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
