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

export const description = "A radial chart with a label";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function SellersChart() {
  return (
    <Card className="flex mt-5 rounded-sm flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 5 Sellers</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Showing top 5 sellers for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">
            Showing top 5 sellers for the last 3 months
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[267px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="visitors" background>
              <LabelList
                position="insideStart"
                dataKey="browser"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-center mx-auto gap-4">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--chart-1)]"></div>
            <span className="text-sm font-medium">Chrome</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--chart-2)]"></div>
            <span className="text-sm font-medium">Safari</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--chart-3)]"></div>
            <span className="text-sm font-medium">Firefox</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--chart-4)]"></div>
            <span className="text-sm font-medium">Edge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--chart-5)]"></div>
            <span className="text-sm font-medium">Other</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
