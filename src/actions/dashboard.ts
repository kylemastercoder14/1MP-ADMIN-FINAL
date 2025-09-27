"use server";

import { StatCards, StatMetric } from "@/types/admin";
import { getDateRanges } from "@/lib/utils";
import db from "@/lib/db";

export const getStatsAnalytics = async (range: string): Promise<StatCards> => {
  const { start, prevStart, prevEnd } = getDateRanges(range);

  // ---- Revenue ----
  const currentRevenue = await db.revenue.findMany({
    where: { createdAt: { gte: start } },
    select: { amount: true },
  });

  const prevRevenue = await db.revenue.findMany({
    where: { createdAt: { gte: prevStart, lt: prevEnd } },
    select: { amount: true },
  });

  const currentRevenueTotal = currentRevenue.reduce(
    (acc: number, r: { amount: number }) => acc + r.amount,
    0
  );

  const prevRevenueTotal = prevRevenue.reduce(
    (acc: number, r: { amount: number }) => acc + r.amount,
    0
  );

  // ---- Products ----
  const newProducts = await db.product.count({
    where: { adminApprovalStatus: "Approved", createdAt: { gte: start } },
  });

  const prevNewProducts = await db.product.count({
    where: {
      adminApprovalStatus: "Approved",
      createdAt: { gte: prevStart, lt: prevEnd },
    },
  });

  const totalProducts = await db.product.count({
    where: { adminApprovalStatus: "Approved" },
  });

  // ---- Sellers ----
  const newSellers = await db.vendor.count({
    where: { adminApproval: "Approved", createdAt: { gte: start } },
  });

  const prevNewSellers = await db.vendor.count({
    where: {
      adminApproval: "Approved",
      createdAt: { gte: prevStart, lt: prevEnd },
    },
  });

  const totalSellers = await db.vendor.count({
    where: { adminApproval: "Approved" },
  });

  // ---- Builder ----
  const buildMetric = (
    current: number,
    prev: number,
    total: number,
    title: string
  ): StatMetric => {
    const percentage =
      prev === 0 ? (current > 0 ? 100 : 0) : ((current - prev) / prev) * 100;

    const trend = percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const proportion = total > 0 ? (current / total) * 100 : 0;

    return {
      data: current, // keep raw number
      title,
      percentage: Number(percentage.toFixed(2)),
      trend,
    };
  };

  return {
    revenue: buildMetric(
      currentRevenueTotal,
      prevRevenueTotal,
      currentRevenueTotal,
      "Revenue"
    ),
    products: buildMetric(
      newProducts,
      prevNewProducts,
      totalProducts,
      "Products"
    ),
    sellers: buildMetric(newSellers, prevNewSellers, totalSellers, "Sellers"),
  };
};

export const getSalesAnalytics = async (range: string) => {
  const { start } = getDateRanges(range);

  const orders = await db.order.findMany({
    where: {
      createdAt: { gte: start },
    },
    select: {
      createdAt: true,
      paymentStatus: true,
      status: true,
      totalAmount: true,
    },
  });

  // group by day
  const dailyMap: Record<string, { profit: number; loss: number }> = {};

  orders.forEach((order) => {
    const dateKey = order.createdAt.toISOString().split("T")[0];
    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = { profit: 0, loss: 0 };
    }

    if (order.paymentStatus === "Paid" && order.status === "Completed") {
      dailyMap[dateKey].profit += Number(order.totalAmount ?? 0); // sum pesos
    } else if (
      order.paymentStatus === "Awaiting Payment" &&
      order.status === "Cancelled"
    ) {
      dailyMap[dateKey].loss += Number(order.totalAmount ?? 0); // sum pesos
    }
  });

  const chartData = Object.entries(dailyMap).map(([date, values]) => ({
    date,
    profit: values.profit,
    loss: values.loss,
  }));

  return chartData;
};

export const getAudiencesAnalytics = async (range: string) => {
  const { start } = getDateRanges(range);

  const audience = await db.pageView.findMany({
    where: {
      createdAt: { gte: start },
    },
  });

  // group by day
  const dailyMap: Record<string, { website: number; mobile: number }> = {};

  audience.forEach((aud) => {
    const dateKey = aud.createdAt.toISOString().split("T")[0];
    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = { website: 0, mobile: 0 };
    }

    if (aud.platform === "Desktop") {
      dailyMap[dateKey].website++;
    } else if (aud.platform === "Mobile") {
      dailyMap[dateKey].mobile++;
    }
  });

  const chartData = Object.entries(dailyMap).map(([date, values]) => ({
    date,
    website: values.website,
    mobile: values.mobile,
  }));

  return chartData;
};
