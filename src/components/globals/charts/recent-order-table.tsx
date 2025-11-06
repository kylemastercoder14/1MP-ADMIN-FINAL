"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface RecentOrderTableProps {
  orders: RecentOrder[];
}

const RecentOrderTable = ({ orders }: RecentOrderTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-600";
      case "processing":
      case "shipped":
      case "out for delivery":
        return "bg-blue-600";
      case "pending":
        return "bg-yellow-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

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

  return (
    <div>
      <h3 className="leading-none font-semibold mb-4">Recent Orders</h3>
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Ordered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No recent orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className='truncate max-w-40'>#{order.orderNumber}</TableCell>
                <TableCell>
                  <div>
                    <h3 className="font-medium text-sm">{order.store.name}</h3>
                    <p className="text-xs text-muted-foreground">{order.store.businessType}</p>
                  </div>
                </TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>₱{Number(order.price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${getStatusColor(order.status)}`}></div>
                    <span className={`text-sm ${getStatusColor(order.status).replace("bg-", "text-")}`}>
                      {order.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <h3 className="text-sm font-medium">{formatDate(order.createdAt)}</h3>
                    <p className="text-xs text-muted-foreground">{formatTime(order.createdAt)}</p>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentOrderTable;
