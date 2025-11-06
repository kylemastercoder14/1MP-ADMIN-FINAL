/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { CustomerWithProps } from "@/types";
import { ChevronLeft, Heart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CustomerInfo = ({
  initialData,
}: {
  initialData: CustomerWithProps | null;
}) => {
  const router = useRouter();

  const getStatusColor = (
    status: "Pending" | "Delivered" | "Cancelled" | "Awaiting Payment" | "Returned" | "Paid" | "Failed" | string
  ) => {
    const colors: Record<
      "Pending" | "Delivered" | "Cancelled" | "Awaiting Payment" | "Returned" | "Paid" | "Failed" | string,
      string
    > = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Delivered: "bg-green-100 text-green-800 border-green-300",
      Paid: "bg-green-100 text-green-800 border-green-300",
      Cancelled: "bg-red-100 text-red-800 border-red-300",
      "Awaiting Payment": "bg-orange-100 text-orange-800 border-orange-300",
      Returned: "bg-gray-100 text-gray-800 border-gray-300",
      Failed: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-300"
    );
  };
  return (
    <div>
      <Button type="button" onClick={() => router.back()} variant="ghost">
        <ChevronLeft className="size-4" />
        Back to customers page
      </Button>
      <div className="grid mt-5 lg:grid-cols-5 grid-cols-1 gap-5">
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold">
                  {initialData?.firstName || "N/A"}{" "}
                  {initialData?.lastName || "N/A"}
                </h1>
                <p className="text-muted-foreground text-lg">
                  @{initialData?.username || "no username yet"}
                </p>
                <Avatar className="size-[230px] bg-gradient-to-tr from-red-800 via-red-200 to-red-800 p-3 mt-3">
                  <AvatarImage
                    src={initialData?.image || ""}
                    className="rounded-full object-cover"
                  />
                  <AvatarFallback className="text-6xl font-semibold">
                    {initialData?.firstName?.charAt(0) || "N/A"}
                    {initialData?.lastName?.charAt(0) || "N/A"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">Bio & other details</h3>
              <div className="grid mt-5 px-5 lg:grid-cols-2 grid-cols-1 gap-x-20 gap-y-5">
                <div>
                  <h4 className="text-md text-muted-foreground font-semibold">
                    Email
                  </h4>
                  <p className="font-medium">{initialData?.email}</p>
                </div>
                <div>
                  <h4 className="text-md text-muted-foreground font-semibold">
                    Phone Number
                  </h4>
                  <p className="font-medium">
                    {initialData?.phoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-md text-muted-foreground font-semibold">
                    Gender
                  </h4>
                  <p className="font-medium">{initialData?.gender || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-md text-muted-foreground font-semibold">
                    Date of Birth
                  </h4>
                  <p className="font-medium">
                    {initialData?.dateOfBirth
                      ? format(
                          new Date(initialData.dateOfBirth),
                          "MMMM dd, yyyy"
                        )
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-md text-muted-foreground font-semibold">
                    Account Status
                  </h4>
                  <div className="flex items-center mt-1 space-x-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        initialData?.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {initialData?.isActive ? "Active" : "Inactive"}
                    </span>
                    {initialData?.isEmailVerified && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-md text-muted-foreground font-semibold">
                    Member Since
                  </h4>
                  <p className="font-medium">
                    {initialData?.createdAt
                      ? format(new Date(initialData.createdAt), "MMMM dd, yyyy")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="px-5 mt-5">
                <h4 className="text-md text-muted-foreground font-semibold">
                  Default Address
                </h4>
                <p className="font-medium">
                  {initialData?.address?.find((addr) => addr.isDefault)
                    ? `${initialData?.address?.find((addr) => addr.isDefault)?.homeAddress || ""},
                       ${initialData?.address?.find((addr) => addr.isDefault)?.barangay || ""},
                       ${initialData?.address?.find((addr) => addr.isDefault)?.city || ""}
                       ${initialData?.address?.find((addr) => addr.isDefault)?.province || ""},
                       ${initialData?.address?.find((addr) => addr.isDefault)?.zipCode || ""}`
                    : "Not assigned"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-5">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold">Addresses</h3>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-5">
              {initialData?.address?.length ? (
                initialData.address
                  .sort((a, b) =>
                    a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
                  )
                  .map((addr) => (
                    <div
                      key={addr.id}
                      className={`border border-gray-200 ${
                        addr.isDefault ? "bg-accent" : "bg-white"
                      } rounded-lg p-6 relative`}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-semibold text-lg">
                            {addr.fullName || "N/A"}
                            {addr.isDefault && (
                              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-gray-600 mt-1">
                            {addr.contactNumber || "N/A"}
                          </div>
                          <div className="mt-3 text-sm text-gray-500">
                            <div>{addr.homeAddress || "N/A"}</div>
                            <div>
                              {addr.barangay || "N/A"}, {addr.city || "N/A"}
                            </div>
                            <div>
                              {addr.province || "N/A"}, {addr.region || "N/A"}{" "}
                              {addr.zipCode || ""}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {addr.type || "N/A"}
                          </span>
                          <div className="mt-4 text-xs text-gray-500">
                            Added{" "}
                            {addr.createdAt
                              ? format(addr.createdAt, "MMMM dd, yyyy")
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-muted-foreground text-lg">
                  No addresses found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-5">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold">Orders</h3>
            {initialData?.order?.length ? (
              <Table className="mt-5">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order No.</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Delivery Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialData.order.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        #{order.orderNumber?.slice(0, 8) || "N/A"}
                      </TableCell>
                      <TableCell>
                        ₱{order.totalAmount?.toLocaleString() || 0} (Delivery
                        Fee: ₱{(order.deliveryFee ?? 0).toLocaleString()})
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status || "N/A"
                          )}`}
                        >
                          {order.status || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.paymentStatus || "N/A"
                          )}`}
                        >
                          {order.paymentStatus || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>{order.paymentMethod || "N/A"}</TableCell>
                      <TableCell>
                        {order.createdAt
                          ? format(order.createdAt, "MMMM dd, yyyy")
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-lg mt-3">
                No orders found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="mt-5">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <div className="grid grid-cols-2 mt-5 gap-8">
              {/* Liked Products */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <Heart className="size-4 mr-2" />
                  Liked Products ({initialData?.like?.length || 0})
                </h3>
                <div className="space-y-3">
                  {initialData?.like?.length ? (
                    initialData.like.map((like) => (
                      <div
                        key={like.id}
                        className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4"
                      >
                        <img
                          src={like.product?.images?.[0] || "/placeholder.png"}
                          alt={like.product?.name || "Product"}
                          className="w-14 h-14 rounded-md object-cover border"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium line-clamp-1">
                            {like.product?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            ₱{like.product?.price?.toLocaleString() || "N/A"}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Liked on{" "}
                            {like.createdAt
                              ? format(like.createdAt, "MMMM dd, yyyy")
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-lg">No liked products.</p>
                  )}
                </div>
              </div>

              {/* Following Stores */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <Store className="size-4 mr-2" />
                  Following Stores ({initialData?.followStore?.length || 0})
                </h3>
                <div className="space-y-3">
                  {initialData?.followStore?.length ? (
                    initialData.followStore.map((follow) => (
                      <div
                        key={follow.id}
                        className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4"
                      >
                        <Avatar className="size-14">
                          <AvatarImage
                            className="object-cover"
                            src={
                              follow.vendor?.image || "/store-placeholder.png"
                            }
                            alt={follow.vendor?.name || "Vendor"}
                          />
                          <AvatarFallback>
                            {(follow.vendor?.name ?? "N/A").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {follow.vendor?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Following since{" "}
                            {follow.createdAt
                              ? format(follow.createdAt, "MMMM dd, yyyy")
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-lg">Not following any stores.</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerInfo;
