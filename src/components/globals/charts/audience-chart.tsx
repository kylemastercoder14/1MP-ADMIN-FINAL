"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

export const description = "An interactive line chart";

const mockData = [
  { date: "2025-04-01", website: 222, mobile: 150 },
  { date: "2025-04-02", website: 97, mobile: 180 },
  { date: "2025-04-03", website: 167, mobile: 120 },
  { date: "2025-04-04", website: 242, mobile: 260 },
  { date: "2025-04-05", website: 373, mobile: 290 },
  { date: "2025-04-06", website: 301, mobile: 340 },
  { date: "2025-04-07", website: 245, mobile: 180 },
  { date: "2025-04-08", website: 409, mobile: 320 },
  { date: "2025-04-09", website: 59, mobile: 110 },
  { date: "2025-04-10", website: 261, mobile: 190 },
  { date: "2025-04-11", website: 327, mobile: 350 },
  { date: "2025-04-12", website: 292, mobile: 210 },
  { date: "2025-04-13", website: 342, mobile: 380 },
  { date: "2025-04-14", website: 137, mobile: 220 },
  { date: "2025-04-15", website: 120, mobile: 170 },
  { date: "2025-04-16", website: 138, mobile: 190 },
  { date: "2025-04-17", website: 446, mobile: 360 },
  { date: "2025-04-18", website: 364, mobile: 410 },
  { date: "2025-04-19", website: 243, mobile: 180 },
  { date: "2025-04-20", website: 89, mobile: 150 },
  { date: "2025-04-21", website: 137, mobile: 200 },
  { date: "2025-04-22", website: 224, mobile: 170 },
  { date: "2025-04-23", website: 138, mobile: 230 },
  { date: "2025-04-24", website: 387, mobile: 290 },
  { date: "2025-04-25", website: 215, mobile: 250 },
  { date: "2025-04-26", website: 75, mobile: 130 },
  { date: "2025-04-27", website: 383, mobile: 420 },
  { date: "2025-04-28", website: 122, mobile: 180 },
  { date: "2025-04-29", website: 315, mobile: 240 },
  { date: "2025-04-30", website: 454, mobile: 380 },
  { date: "2025-05-01", website: 165, mobile: 220 },
  { date: "2025-05-02", website: 293, mobile: 310 },
  { date: "2025-05-03", website: 247, mobile: 190 },
  { date: "2025-05-04", website: 385, mobile: 420 },
  { date: "2025-05-05", website: 481, mobile: 390 },
  { date: "2025-05-06", website: 498, mobile: 520 },
  { date: "2025-05-07", website: 388, mobile: 300 },
  { date: "2025-05-08", website: 149, mobile: 210 },
  { date: "2025-05-09", website: 227, mobile: 180 },
  { date: "2025-05-10", website: 293, mobile: 330 },
  { date: "2025-05-11", website: 335, mobile: 270 },
  { date: "2025-05-12", website: 197, mobile: 240 },
  { date: "2025-05-13", website: 197, mobile: 160 },
  { date: "2025-05-14", website: 448, mobile: 490 },
  { date: "2025-05-15", website: 473, mobile: 380 },
  { date: "2025-05-16", website: 338, mobile: 400 },
  { date: "2025-05-17", website: 499, mobile: 420 },
  { date: "2025-05-18", website: 315, mobile: 350 },
  { date: "2025-05-19", website: 235, mobile: 180 },
  { date: "2025-05-20", website: 177, mobile: 230 },
  { date: "2025-05-21", website: 82, mobile: 140 },
  { date: "2025-05-22", website: 81, mobile: 120 },
  { date: "2025-05-23", website: 252, mobile: 290 },
  { date: "2025-05-24", website: 294, mobile: 220 },
  { date: "2025-05-25", website: 201, mobile: 250 },
  { date: "2025-05-26", website: 213, mobile: 170 },
  { date: "2025-05-27", website: 420, mobile: 460 },
  { date: "2025-05-28", website: 233, mobile: 190 },
  { date: "2025-05-29", website: 78, mobile: 130 },
  { date: "2025-05-30", website: 340, mobile: 280 },
  { date: "2025-05-31", website: 178, mobile: 230 },
  { date: "2025-06-01", website: 178, mobile: 200 },
  { date: "2025-06-02", website: 470, mobile: 410 },
  { date: "2025-06-03", website: 103, mobile: 160 },
  { date: "2025-06-04", website: 439, mobile: 380 },
  { date: "2025-06-05", website: 88, mobile: 140 },
  { date: "2025-06-06", website: 294, mobile: 250 },
  { date: "2025-06-07", website: 323, mobile: 370 },
  { date: "2025-06-08", website: 385, mobile: 320 },
  { date: "2025-06-09", website: 438, mobile: 480 },
  { date: "2025-06-10", website: 155, mobile: 200 },
  { date: "2025-06-11", website: 92, mobile: 150 },
  { date: "2025-06-12", website: 492, mobile: 420 },
  { date: "2025-06-13", website: 81, mobile: 130 },
  { date: "2025-06-14", website: 426, mobile: 380 },
  { date: "2025-06-15", website: 307, mobile: 350 },
  { date: "2025-06-16", website: 371, mobile: 310 },
  { date: "2025-06-17", website: 475, mobile: 520 },
  { date: "2025-06-18", website: 107, mobile: 170 },
  { date: "2025-06-19", website: 341, mobile: 290 },
  { date: "2025-06-20", website: 408, mobile: 450 },
  { date: "2025-06-21", website: 169, mobile: 210 },
  { date: "2025-06-22", website: 317, mobile: 270 },
  { date: "2025-06-23", website: 480, mobile: 530 },
  { date: "2025-06-24", website: 132, mobile: 180 },
  { date: "2025-06-25", website: 141, mobile: 190 },
  { date: "2025-06-26", website: 434, mobile: 380 },
  { date: "2025-06-27", website: 448, mobile: 490 },
  { date: "2025-06-28", website: 149, mobile: 200 },
  { date: "2025-06-29", website: 103, mobile: 160 },
  { date: "2025-06-30", website: 446, mobile: 400 },
];

const chartConfig = {
  website: {
    label: "Website",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function AudienceChart({
  audiencesData,
}: {
  audiencesData: { date: string; website: number; mobile: number }[];
}) {
  const chartData =
    audiencesData && audiencesData.length > 0 ? audiencesData : mockData;

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("website");

  const total = React.useMemo(
    () => ({
      website: chartData.reduce((acc, curr) => acc + curr.website, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    [chartData]
  );

  return (
    <Card className="rounded-sm !p-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Audiences Report</CardTitle>
        </div>
        <div className="flex">
          {Object.keys(chartConfig).map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-4 py-3 text-left even:border-l sm:border-t-0 sm:border-l sm:px-4 sm:py-3"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-2xl">
                  {total[chart].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
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
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pb-5">
        <div className="flex items-center justify-center mx-auto gap-4">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--chart-1)]"></div>
            <span className="text-sm font-medium">Website</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--chart-3)]"></div>
            <span className="text-sm font-medium">Mobile App</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
