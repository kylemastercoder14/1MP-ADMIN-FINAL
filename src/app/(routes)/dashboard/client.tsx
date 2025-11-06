"use client";
import React from "react";
import Greetings from "@/components/globals/greetings";
import { Button } from "@/components/ui/button";
import { Printer, ShoppingBag, Store, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { IconStackPop, IconStackPush } from "@tabler/icons-react";
import { SalesChart } from "@/components/globals/charts/sales-chart";
import { AudienceChart } from "@/components/globals/charts/audience-chart";
import { SellersChart } from "@/components/globals/charts/sellers-chart";
import RecentOrderTable from "@/components/globals/charts/recent-order-table";
import { FeedbackChart } from "@/components/globals/charts/feedback-chart";
import TopProductsTable from "@/components/globals/charts/products-table";
import { StatCards } from "@/types/admin";
import { DateRangePicker } from "@/components/globals/date-range-picker";
import {
  getAudiencesAnalytics,
  getSalesAnalytics,
  getStatsAnalytics,
  getRecentOrders,
  getTopSellers,
} from "@/actions/dashboard";

interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    image: string | null;
  };
  store: {
    name: string;
    businessType: string;
  };
  items: number;
  price: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}

const DashboardClient = ({
  statsCards,
  salesData,
  audiencesData,
  recentOrders,
  topSellersData,
  topProducts,
}: {
  statsCards: StatCards;
  salesData: { date: string; profit: number; loss: number }[];
  audiencesData: { date: string; website: number; mobile: number }[];
  recentOrders: RecentOrder[];
  topSellersData: {
    chartData: { name: string; revenue: number; fill: string }[];
    sellers: { id: string; name: string; revenue: number }[];
  };
  topProducts: {
    id: string;
    name: string;
    price: number;
    image: string;
    averageRating: number;
    reviewCount: number;
  }[];
}) => {
  const [statData, setStatData] = React.useState(statsCards);
  const [salesStateData, setSalesStateData] = React.useState(salesData);
  const [audiencesStateDate, setAudiencesStateData] =
    React.useState(audiencesData);

  // Initialize date range to last 3 months
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date } | null>(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    return { from: start, to: end };
  });

  const [recentOrdersState, setRecentOrdersState] = React.useState(recentOrders);
  const [topSellersState, setTopSellersState] = React.useState(topSellersData);

  React.useEffect(() => {
    const fetchStatsCard = async () => {
      const response = await getStatsAnalytics(dateRange);
      setStatData(response);
    };
    const fetchSalesData = async () => {
      const response = await getSalesAnalytics(dateRange);
      setSalesStateData(response);
    };
    const fetchAudiencesData = async () => {
      const response = await getAudiencesAnalytics(dateRange);
      setAudiencesStateData(response);
    };
    const fetchTopSellers = async () => {
      const response = await getTopSellers(dateRange);
      setTopSellersState(response);
    };
    const fetchRecentOrders = async () => {
      const response = await getRecentOrders(10);
      setRecentOrdersState(response);
    };

    fetchStatsCard();
    fetchSalesData();
    fetchAudiencesData();
    fetchTopSellers();
    fetchRecentOrders();
  }, [dateRange]);

  const handleDateRangeChange = (range: { from: Date; to: Date } | undefined) => {
    if (range?.from && range?.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };

  const handleDateRangeReset = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    setDateRange({ from: start, to: end });
  };

  const formatDateRange = (range: { from: Date; to: Date } | null) => {
    if (!range) return "All Time";
    const fromStr = range.from.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const toStr = range.to.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${fromStr} - ${toStr}`;
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    // Generate print content with all dashboard data
    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Dashboard Report</title>
  <meta charset="utf-8">
  <style>
    @page {
      margin: 1cm;
      size: A4;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #000;
      background: #fff;
      padding: 20px;
      line-height: 1.5;
    }
    .print-container {
      max-width: 100%;
    }
    h1 {
      font-size: 28px;
      margin-bottom: 10px;
      text-align: center;
      font-weight: bold;
    }
    h2 {
      font-size: 20px;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 2px solid #000;
      padding-bottom: 5px;
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 12px;
    }
    table th,
    table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    table th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .text-center {
      text-align: center;
    }
    .font-bold {
      font-weight: bold;
    }
    .mb-2 {
      margin-bottom: 8px;
    }
    .mb-4 {
      margin-bottom: 16px;
    }
    .mt-8 {
      margin-top: 32px;
    }
    .pt-4 {
      padding-top: 16px;
    }
    .border-t {
      border-top: 1px solid #ddd;
    }
    .text-sm {
      font-size: 12px;
    }
    .text-gray-600 {
      color: #666;
    }
    .text-gray-500 {
      color: #999;
    }
    .p-8 {
      padding: 32px;
    }
    .space-y-6 > * + * {
      margin-top: 24px;
    }
    @media print {
      .page-break {
        page-break-after: always;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="print-container">
    <div class="p-8 space-y-6">
      <div class="text-center mb-6">
        <h1>Dashboard Report</h1>
        <p class="text-lg text-gray-600">
          Period: ${formatDateRange(dateRange)} | Generated: ${new Date().toLocaleDateString()}
        </p>
      </div>

      <div>
        <h2>Statistics Overview</h2>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Trend</th>
              <th>Percentage Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${statData.revenue.title}</td>
              <td>₱${Number(statData.revenue.data).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>${statData.revenue.trend === "up" ? "↑ Increased" : statData.revenue.trend === "down" ? "↓ Decreased" : "→ Neutral"}</td>
              <td>${statData.revenue.percentage}%</td>
            </tr>
            <tr>
              <td>${statData.products.title}</td>
              <td>${statData.products.data}</td>
              <td>${statData.products.trend === "up" ? "↑ Increased" : statData.products.trend === "down" ? "↓ Decreased" : "→ Neutral"}</td>
              <td>${statData.products.percentage}%</td>
            </tr>
            <tr>
              <td>${statData.sellers.title}</td>
              <td>${statData.sellers.data}</td>
              <td>${statData.sellers.trend === "up" ? "↑ Increased" : statData.sellers.trend === "down" ? "↓ Decreased" : "→ Neutral"}</td>
              <td>${statData.sellers.percentage}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>Sales Report Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Profit (₱)</th>
              <th>Loss (₱)</th>
              <th>Net (₱)</th>
            </tr>
          </thead>
          <tbody>
            ${salesStateData.map((day) => `
              <tr>
                <td>${new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td>${Number(day.profit).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>${Number(day.loss).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>${(day.profit - day.loss).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            `).join("")}
            <tr class="font-bold">
              <td>Total</td>
              <td>₱${salesStateData.reduce((sum, day) => sum + day.profit, 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>₱${salesStateData.reduce((sum, day) => sum + day.loss, 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>₱${(salesStateData.reduce((sum, day) => sum + day.profit, 0) - salesStateData.reduce((sum, day) => sum + day.loss, 0)).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>Audience Analytics Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Website</th>
              <th>Mobile</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${audiencesStateDate.map((day) => `
              <tr>
                <td>${new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td>${day.website}</td>
                <td>${day.mobile}</td>
                <td>${day.website + day.mobile}</td>
              </tr>
            `).join("")}
            <tr class="font-bold">
              <td>Total</td>
              <td>${audiencesStateDate.reduce((sum, day) => sum + day.website, 0)}</td>
              <td>${audiencesStateDate.reduce((sum, day) => sum + day.mobile, 0)}</td>
              <td>${audiencesStateDate.reduce((sum, day) => sum + day.website + day.mobile, 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>Top 5 Sellers</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Seller Name</th>
              <th>Revenue (₱)</th>
            </tr>
          </thead>
          <tbody>
            ${topSellersState.sellers.map((seller, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${seller.name}</td>
                <td>₱${Number(seller.revenue).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Top Reviewed Products</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price (₱)</th>
              <th>Rating</th>
              <th>Reviews</th>
            </tr>
          </thead>
          <tbody>
            ${topProducts.map((product) => `
              <tr>
                <td>${product.name}</td>
                <td>₱${Number(product.price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>${product.averageRating.toFixed(1)} / 5.0</td>
                <td>${product.reviewCount}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="page-break">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Store</th>
              <th>Items</th>
              <th>Price (₱)</th>
              <th>Status</th>
              <th>Date Ordered</th>
            </tr>
          </thead>
          <tbody>
            ${recentOrdersState.slice(0, 20).map((order) => {
              const date = new Date(order.createdAt);
              return `
                <tr>
                  <td>#${order.orderNumber}</td>
                  <td>${order.store.name}</td>
                  <td>${order.items}</td>
                  <td>₱${Number(order.price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${order.status}</td>
                  <td>${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>

      <div class="text-center mt-8 pt-4 border-t">
        <p class="text-sm text-gray-500">
          This report was generated on ${new Date().toLocaleString("en-US")}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Greetings />
        <div className="flex items-center gap-3">
          <DateRangePicker
            multiple={true}
            selectedDates={dateRange}
            onSelect={handleDateRangeChange}
            onReset={handleDateRangeReset}
          />
          <Button variant="primary" onClick={handlePrint}>
            <Printer className="size-4" />
            Print Report
          </Button>
        </div>
      </div>
      <div className="mt-10 grid lg:grid-cols-10 grid-cols-1 gap-5">
        <div className="lg:col-span-6">
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
            <div className="p-5 border shadow-sm rounded-sm">
              <div className="flex items-center gap-3">
                <div className="bg-[#800020] size-10 rounded-sm flex items-center justify-center">
                  <Wallet className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    ₱{Number(statData.revenue.data).toLocaleString()}
                  </h3>
                  <p className="text-muted-foreground">
                    {statData.revenue.title}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center font-medium text-sm gap-2">
                {statData.revenue.trend === "up" ? (
                  <IconStackPop className="size-5 text-green-600" />
                ) : (
                  <IconStackPush className="size-5 text-red-600" />
                )}
                <span
                  className={
                    statData.revenue.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {statData.revenue.percentage}%
                </span>
                <span className="text-muted-foreground">
                  {statData.revenue.trend === "up" ? "Increased" : "Decreased"}{" "}
                  {formatDateRange(dateRange)}
                </span>
              </div>
            </div>
            <div className="p-5 border shadow-sm rounded-sm">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 size-10 rounded-sm flex items-center justify-center">
                  <ShoppingBag className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {statData.products.data}
                  </h3>
                  <p className="text-muted-foreground">
                    {statData.products.title}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center font-medium text-sm gap-2">
                {statData.products.trend === "up" ? (
                  <IconStackPop className="size-5 text-green-600" />
                ) : (
                  <IconStackPush className="size-5 text-red-600" />
                )}
                <span
                  className={
                    statData.products.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {statData.products.percentage}%
                </span>
                <span className="text-muted-foreground">
                  {statData.products.trend === "up" ? "Increased" : "Decreased"}{" "}
                  {formatDateRange(dateRange)}
                </span>
              </div>
            </div>
            <div className="p-5 border shadow-sm rounded-sm">
              <div className="flex items-center gap-3">
                <div className="bg-orange-600 size-10 rounded-sm flex items-center justify-center">
                  <Store className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {statData.sellers.data}
                  </h3>
                  <p className="text-muted-foreground">
                    {statData.sellers.title}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center font-medium text-sm gap-2">
                {statData.sellers.trend === "up" ? (
                  <IconStackPop className="size-5 text-green-600" />
                ) : (
                  <IconStackPush className="size-5 text-red-600" />
                )}
                <span
                  className={
                    statData.sellers.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {statData.sellers.percentage}%
                </span>
                <span className="text-muted-foreground">
                  {statData.sellers.trend === "up" ? "Increased" : "Decreased"}{" "}
                  {formatDateRange(dateRange)}
                </span>
              </div>
            </div>
          </div>
          <SalesChart salesData={salesStateData} />
          <div className="p-5 mt-5 border shadow rounded-sm">
            <RecentOrderTable orders={recentOrdersState} />
          </div>
          <FeedbackChart />
        </div>
        <div className="lg:col-span-4">
          <AudienceChart audiencesData={audiencesStateDate} />
          <SellersChart chartData={topSellersState.chartData} timeRange={formatDateRange(dateRange)} />
          <div className="p-5 mt-5 border shadow rounded-sm">
            <TopProductsTable products={topProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
