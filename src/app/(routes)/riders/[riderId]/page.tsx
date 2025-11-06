import React from "react";
import db from "@/lib/db";
import Client from "../_components/rider-details-client";

const Page = async (props: {
  params: Promise<{
    riderId: string;
  }>;
}) => {
  const params = await props.params;

  const riderData = await db.rider.findUnique({
    where: {
      id: params.riderId,
    },
    include: {
      orders: {
        select: {
          id: true,
        },
      },
    },
  });

  // Calculate total orders count
  const totalOrders = riderData?.orders?.length ?? 0;

  return (
    <div>
      <Client rider={riderData} totalOrders={totalOrders} />
    </div>
  );
};

export default Page;


