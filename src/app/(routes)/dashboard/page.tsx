import React from "react";
import DashboardClient from "./client";
import {
  getAudiencesAnalytics,
  getSalesAnalytics,
  getStatsAnalytics,
  getRecentOrders,
  getTopSellers,
  getTopProducts
} from '@/actions/dashboard';

const Page = async () => {
  // Default to last 3 months on initial load
  const defaultEnd = new Date();
  const defaultStart = new Date();
  defaultStart.setMonth(defaultStart.getMonth() - 3);
  const defaultDateRange = { from: defaultStart, to: defaultEnd };

  const stats = await getStatsAnalytics(defaultDateRange);
  const sales = await getSalesAnalytics(defaultDateRange);
  const audiences = await getAudiencesAnalytics(defaultDateRange);
  const recentOrders = await getRecentOrders(10);
  const topSellers = await getTopSellers(defaultDateRange);
  const topProducts = await getTopProducts(5);

  return (
    <div>
      <DashboardClient
        statsCards={stats}
        salesData={sales}
        audiencesData={audiences}
        recentOrders={recentOrders}
        topSellersData={topSellers}
        topProducts={topProducts}
      />
    </div>
  );
};

export default Page;
