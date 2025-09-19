import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import Client from "./_components/client";
import { ProductWithProps, VariantAttributes } from "@/types";

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
      vendor: true,
      category: true,
      subCategory: true,
      variants: true,
      productDiscount: true,
      newArrivalDiscount: true,
      specifications: true,
    },
  });

  const transformedData: ProductWithProps[] = products.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({
      ...v,
      attributes: v.attributes as unknown as VariantAttributes,
    })),
  }));

  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Manage Products"
          description={`Here you can manage all the products and services of ${data?.name}.`}
        />
      </div>
      <Client data={transformedData} />
    </div>
  );
};

export default Page;
