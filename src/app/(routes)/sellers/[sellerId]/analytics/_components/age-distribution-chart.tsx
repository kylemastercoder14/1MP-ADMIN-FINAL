/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Pie, PieChart, Cell } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AgeDistributionPoint } from "@/types";

export const description = "A donut chart";

const chartConfig = {
  percentage: {
    label: "Percentage",
  },
  "15-": {
    label: "15-",
    color: "var(--chart-age-1)",
  },
  Unknown: {
    label: "Unknown",
    color: "var(--chart-age-2)",
  },
  "35+": {
    label: "35+",
    color: "var(--chart-age-3)",
  },
  "25-34": {
    label: "25-34",
    color: "var(--chart-age-4)",
  },
  "18-24": {
    label: "18-24",
    color: "var(--chart-age-5)",
  },
  "15-17": {
    label: "15-17",
    color: "var(--chart-age-6)",
  },
} satisfies ChartConfig;

// Custom label for Pie
const renderLabel = (props: any) => {
  const { percent, name, cx, cy, midAngle, outerRadius } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30; // position label slightly outside
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black" // make label text black
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="500"
    >
      {`${(percent * 100).toFixed(1)}%`}
      <tspan x={x} dy="1.2em" fontSize={11} fill="gray">
        {name}
      </tspan>
    </text>
  );
};

export function AgeDistributionChart({
  data,
}: {
  data: AgeDistributionPoint[];
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto mt-3 aspect-square max-h-[350px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey="percentage"
          nameKey="ageGroup"
          innerRadius={50}
          label={renderLabel}
          labelLine
        >
          {data.map((entry, index) => {
            const config =
              chartConfig[entry.ageGroup as keyof typeof chartConfig];
            return (
              <Cell
                key={`cell-${index}`}
                fill={config && "color" in config ? config.color : "gray"}
              />
            );
          })}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent payload={data} nameKey="ageGroup" />}
          className="-translate-y-2 mt-10 flex-wrap gap-2 *:basis-1/4 *:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
