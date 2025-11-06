"use server";

import { StatCards, StatMetric } from "@/types/admin";
import { subDays } from "date-fns";
import db from "@/lib/db";

export interface DateRange {
  from: Date;
  to: Date;
}

export const getStatsAnalytics = async (
  dateRange: DateRange | null
): Promise<StatCards> => {
  const now = new Date();

  // Default to last 3 months if no date range provided
  const start =
    dateRange?.from ||
    (() => {
      const defaultStart = new Date();
      defaultStart.setMonth(defaultStart.getMonth() - 3);
      return defaultStart;
    })();
  const end = dateRange?.to || now;

  // Calculate previous period (same duration before the start date)
  const duration = end.getTime() - start.getTime();
  const prevEnd = start;
  const prevStart = new Date(prevEnd.getTime() - duration);

  // ---- Revenue ----
  // Get revenue from orders where status is "Delivered" and paymentStatus is "Paid"
  const currentRevenueOrders = await db.order.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
      status: "Delivered",
      paymentStatus: "Paid",
    },
    select: { totalAmount: true },
  });

  const prevRevenueOrders = await db.order.findMany({
    where: {
      createdAt: {
        gte: prevStart,
        lt: prevEnd,
      },
      status: "Delivered",
      paymentStatus: "Paid",
    },
    select: { totalAmount: true },
  });

  const currentRevenueTotal = currentRevenueOrders.reduce(
    (acc: number, order: { totalAmount: number }) =>
      acc + Number(order.totalAmount ?? 0),
    0
  );

  const prevRevenueTotal = prevRevenueOrders.reduce(
    (acc: number, order: { totalAmount: number }) =>
      acc + Number(order.totalAmount ?? 0),
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

export const getSalesAnalytics = async (dateRange: DateRange | null) => {
  const now = new Date();

  // Default to last 3 months if no date range provided
  const start =
    dateRange?.from ||
    (() => {
      const defaultStart = new Date();
      defaultStart.setMonth(defaultStart.getMonth() - 3);
      return defaultStart;
    })();
  const end = dateRange?.to || now;

  const orders = await db.order.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
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

    // Profit: status "Delivered" AND paymentStatus "Paid"
    if (order.status === "Delivered" && order.paymentStatus === "Paid") {
      dailyMap[dateKey].profit += Number(order.totalAmount ?? 0); // sum pesos
    }
    // Loss: status "Cancelled" AND paymentStatus "Failed"
    else if (order.status === "Cancelled" && order.paymentStatus === "Failed") {
      dailyMap[dateKey].loss += Number(order.totalAmount ?? 0); // sum pesos
    }
  });

  // Sort by date to ensure chronological order
  const chartData = Object.entries(dailyMap)
    .map(([date, values]) => ({
      date,
      profit: values.profit,
      loss: values.loss,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return chartData;
};

export const getAudiencesAnalytics = async (dateRange: DateRange | null) => {
  const now = new Date();

  // Default to last 3 months if no date range provided
  const start =
    dateRange?.from ||
    (() => {
      const defaultStart = new Date();
      defaultStart.setMonth(defaultStart.getMonth() - 3);
      return defaultStart;
    })();
  const end = dateRange?.to || now;

  const audience = await db.pageView.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
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

export const getRecentOrders = async (limit: number = 10) => {
  const orders = await db.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      },
      orderItem: {
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              businessType: true,
            },
          },
        },
        take: 1, // Get first order item for vendor info
      },
    },
  });

  return orders.map((order) => {
    const vendor = order.orderItem[0]?.vendor;
    const itemCount = order.orderItem.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        name:
          `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() ||
          "Unknown",
        email: order.user.email,
        image: order.user.image,
      },
      store: {
        name: vendor?.name || "Unknown Store",
        businessType: vendor?.businessType || "Unknown",
      },
      items: itemCount,
      price: Number(order.totalAmount),
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    };
  });
};

export const getTopSellers = async (dateRange: DateRange | null) => {
  const now = new Date();

  // Default to last 3 months if no date range provided
  const start =
    dateRange?.from ||
    (() => {
      const defaultStart = new Date();
      defaultStart.setMonth(defaultStart.getMonth() - 3);
      return defaultStart;
    })();
  const end = dateRange?.to || now;

  // Get order items with vendor info and calculate total revenue per vendor
  const orderItems = await db.orderItem.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
      order: {
        paymentStatus: "Paid",
        status: { not: "Cancelled" },
      },
    },
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
        },
      },
      order: {
        select: {
          paymentStatus: true,
          status: true,
        },
      },
    },
  });

  // Group by vendor and calculate total revenue
  const vendorRevenue: Record<string, { name: string; revenue: number }> = {};

  orderItems.forEach((item) => {
    const vendorId = item.vendorId;
    const revenue = Number(item.price) * item.quantity;

    if (!vendorRevenue[vendorId]) {
      vendorRevenue[vendorId] = {
        name: item.vendor.name || "Unknown Vendor",
        revenue: 0,
      };
    }

    vendorRevenue[vendorId].revenue += revenue;
  });

  // Sort by revenue and get top 5
  const topSellers = Object.entries(vendorRevenue)
    .map(([id, data]) => ({
      id,
      name: data.name,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Format for chart (using chart colors)
  const chartData = topSellers.map((seller, index) => {
    const colors = [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ];
    return {
      name:
        seller.name.length > 15
          ? seller.name.substring(0, 15) + "..."
          : seller.name,
      revenue: seller.revenue,
      fill: colors[index] || "var(--chart-5)",
    };
  });

  return {
    chartData,
    sellers: topSellers,
  };
};

export const getTopProducts = async (limit: number = 5) => {
  const products = await db.product.findMany({
    where: {
      adminApprovalStatus: "Approved",
    },
    include: {
      productReview: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      averageRating: "desc",
    },
    take: limit,
  });

  return products.map((product) => {
    const reviewCount = product.productReview.length;
    const averageRating = product.averageRating || 0;

    return {
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.images[0] || "",
      averageRating,
      reviewCount,
    };
  });
};
