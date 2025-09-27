import React from "react";
import DashboardClient from "./client";
import { getAudiencesAnalytics, getSalesAnalytics, getStatsAnalytics } from '@/actions/dashboard';

const Page = async () => {
  const stats = await getStatsAnalytics("last3months");
  const sales = await getSalesAnalytics("last3months");
  const audiences = await getAudiencesAnalytics("last3months");
  return (
    <div>
      <DashboardClient statsCards={stats} salesData={sales} audiencesData={audiences} />
    </div>
  );
};

export default Page;
