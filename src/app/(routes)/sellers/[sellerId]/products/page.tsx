import React from "react";
import db from "@/lib/db";
import Heading from '@/components/ui/heading';
import Client from './_components/client';

const Page = async (props: {
  params: Promise<{
    sellerId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.vendor.findUnique({
    where: {
      id: params.sellerId,
    },
  });

  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      vendorId: params.sellerId,
    },
    include: {
      variants: true,
      subCategory: true,
      vendor: true,
    },
  });

  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Manage Products"
          description={`Here you can manage all the products and services of ${data?.name}.`}
        />
      </div>
      <Client data={products} />
    </div>
  );
};

export default Page;
