export type StatMetric = {
  data: number;
  trend: "up" | "down" | "neutral";
  percentage: number; // % change vs previous period
  title: string;
};

export type StatCards = {
  revenue: StatMetric;
  products: StatMetric;
  sellers: StatMetric;
};
