"use client";

import React from "react";
import { formatTimeRange } from "@/lib/utils";
import { StatCards } from "@/types/admin";

interface PrintDashboardProps {
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
  timeRange: "last3months" | "last28days" | "last7days";
}

interface RecentOrder {
  id: string;
  orderNumber: string;
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

export const PrintDashboard = ({
  statsCards,
  salesData,
  audiencesData,
  recentOrders,
  topSellersData,
  topProducts,
  timeRange,
}: PrintDashboardProps) => {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const totalProfit = salesData.reduce((sum, day) => sum + day.profit, 0);
  const totalLoss = salesData.reduce((sum, day) => sum + day.loss, 0);
  const totalWebsite = audiencesData.reduce((sum, day) => sum + day.website, 0);
  const totalMobile = audiencesData.reduce((sum, day) => sum + day.mobile, 0);

  return (
    <div className="print-dashboard">
      <style jsx>{`
        @media print {
          @page {
            margin: 1cm;
            size: A4;
          }

          body * {
            visibility: hidden;
          }

          .print-dashboard,
          .print-dashboard * {
            visibility: visible;
          }

          .print-dashboard {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            color: black;
          }

          .no-print {
            display: none !important;
          }

          .print-break {
            page-break-after: always;
          }

          .print-avoid-break {
            page-break-inside: avoid;
          }

          table {
            border-collapse: collapse;
            width: 100%;
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
        }
      `}</style>

      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="text-center mb-6 print-avoid-break">
          <h1 className="text-3xl font-bold mb-2">Dashboard Report</h1>
          <p className="text-lg text-gray-600">
            Period: {formatTimeRange(timeRange)} | Generated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="print-avoid-break">
          <h2 className="text-2xl font-semibold mb-4">Statistics Overview</h2>
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
                <td>{statsCards.revenue.title}</td>
                <td>₱{Number(statsCards.revenue.data).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>{statsCards.revenue.trend === "up" ? "↑ Increased" : statsCards.revenue.trend === "down" ? "↓ Decreased" : "→ Neutral"}</td>
                <td>{statsCards.revenue.percentage}%</td>
              </tr>
              <tr>
                <td>{statsCards.products.title}</td>
                <td>{statsCards.products.data}</td>
                <td>{statsCards.products.trend === "up" ? "↑ Increased" : statsCards.products.trend === "down" ? "↓ Decreased" : "→ Neutral"}</td>
                <td>{statsCards.products.percentage}%</td>
              </tr>
              <tr>
                <td>{statsCards.sellers.title}</td>
                <td>{statsCards.sellers.data}</td>
                <td>{statsCards.sellers.trend === "up" ? "↑ Increased" : statsCards.sellers.trend === "down" ? "↓ Decreased" : "→ Neutral"}</td>
                <td>{statsCards.sellers.percentage}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sales Report Summary */}
        <div className="print-avoid-break">
          <h2 className="text-2xl font-semibold mb-4">Sales Report Summary</h2>
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
              {salesData.map((day) => (
                <tr key={day.date}>
                  <td>{new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td>{Number(day.profit).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{Number(day.loss).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{(day.profit - day.loss).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td>Total</td>
                <td>₱{totalProfit.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>₱{totalLoss.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>₱{(totalProfit - totalLoss).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Audience Analytics Summary */}
        <div className="print-avoid-break">
          <h2 className="text-2xl font-semibold mb-4">Audience Analytics Summary</h2>
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
              {audiencesData.map((day) => (
                <tr key={day.date}>
                  <td>{new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td>{day.website}</td>
                  <td>{day.mobile}</td>
                  <td>{day.website + day.mobile}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td>Total</td>
                <td>{totalWebsite}</td>
                <td>{totalMobile}</td>
                <td>{totalWebsite + totalMobile}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Top Sellers */}
        <div className="print-avoid-break">
          <h2 className="text-2xl font-semibold mb-4">Top 5 Sellers</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Seller Name</th>
                <th>Revenue (₱)</th>
              </tr>
            </thead>
            <tbody>
              {topSellersData.sellers.map((seller, index) => (
                <tr key={seller.id}>
                  <td>{index + 1}</td>
                  <td>{seller.name}</td>
                  <td>₱{Number(seller.revenue).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="print-avoid-break">
          <h2 className="text-2xl font-semibold mb-4">Top Reviewed Products</h2>
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
              {topProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>₱{Number(product.price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{product.averageRating.toFixed(1)} / 5.0</td>
                  <td>{product.reviewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Orders */}
        <div className="print-break print-avoid-break">
          <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
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
              {recentOrders.slice(0, 20).map((order) => (
                <tr key={order.id}>
                  <td>#{order.orderNumber}</td>
                  <td>{order.store.name}</td>
                  <td>{order.items}</td>
                  <td>₱{Number(order.price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{order.status}</td>
                  <td>{formatDate(order.createdAt)} {formatTime(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-4 border-t print-avoid-break">
          <p className="text-sm text-gray-500">
            This report was generated on {new Date().toLocaleString("en-US")}
          </p>
        </div>
      </div>
    </div>
  );
};


