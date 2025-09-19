import React from "react";
import db from "@/lib/db";
import CustomerInfo from "./customer-info";

const Page = async (props: {
  params: Promise<{
    customerId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.user.findUnique({
    where: {
      id: params.customerId,
    },
    include: {
      address: true,
      followStore: {
        include: {
          vendor: true,
        },
      },
      like: {
        include: {
          product: true,
        },
      },
      order: {
        include: {
          orderItem: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <CustomerInfo initialData={data} />
    </div>
  );
};

export default Page;
