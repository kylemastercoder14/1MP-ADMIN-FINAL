"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

export const description = "A multiple bar chart";

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
  { month: "Jul", desktop: 214, mobile: 140 },
  { month: "Aug", desktop: 214, mobile: 140 },
  { month: "Sept", desktop: 214, mobile: 140 },
  { month: "Oct", desktop: 214, mobile: 140 },
  { month: "Nov", desktop: 214, mobile: 140 },
  { month: "Dec", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Positive",
    color: "var(--success)",
  },
  mobile: {
    label: "Negative",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

export function FeedbackChart() {
  return (
    <Card className="mt-5 rounded-sm">
      <CardHeader>
        <CardTitle>Feedbacks Report</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-center mx-auto gap-4">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--success)]"></div>
            <span className="text-sm font-medium">Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--destructive)]"></div>
            <span className="text-sm font-medium">Negative</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
