import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowUp, ArrowDown } from "lucide-react";

type StatCardProps = {
  title: string;
  count: number | string;
  trend?: "up" | "down" | "neutral";
  percentage?: number;
  proportion?: number;
  sales?: string | number;
  range?: "last7days" | "last28days" | "last3months";
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  trend = "neutral",
  percentage,
  proportion,
  sales,
  range,
}) => {
  const rangeLabel =
    range === "last7days"
      ? "last 7 days"
      : range === "last28days"
        ? "last 28 days"
        : range === "last3months"
          ? "last 3 months"
          : "";

  return (
    <Card className="rounded-sm">
      <CardContent>
        <h3 className="text-black dark:text-white font-semibold text-lg tracking-tight">
          {title}
        </h3>
        <p className="text-black dark:text-white font-semibold text-3xl tracking-tight">
          {count}
        </p>

        {/* Trend + Range */}
        <div className="flex mt-2 items-center gap-2">
          <p className="text-muted-foreground font-medium text-sm">
            vs {rangeLabel}
          </p>
          {trend !== "neutral" && percentage && (
            <div className="flex items-center gap-0.5">
              {trend === "up" && <ArrowUp className="size-4 text-green-500" />}
              {trend === "down" && (
                <ArrowDown className="size-4 text-destructive" />
              )}
              <span
                className={`font-medium text-sm tracking-tight ${
                  trend === "up" ? "text-green-500" : "text-destructive"
                }`}
              >
                {percentage}%
              </span>
            </div>
          )}
        </div>

        {/* Proportion */}
        <p className="text-muted-foreground mt-1 text-sm">
          Proportion in total{" "}
          <span className="font-semibold">{proportion}%</span>
        </p>

        {/* Sales */}
        {sales && (
          <>
            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <p className="font-semibold">Sales</p>
              <p className="font-semibold">₱{sales}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
