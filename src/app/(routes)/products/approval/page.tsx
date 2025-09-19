import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import Client from "./_components/client";
import { ProductWithProps, VariantAttributes } from "@/types";

const Page = async () => {
  const data = await db.product.findMany({
    where: {
      adminApprovalStatus: "Pending",
    },
    orderBy: {
      createdAt: "desc",
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

  const products: ProductWithProps[] = data.map((p) => ({
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
          title="Manage Pending Products"
          description="Here you can manage all your pending products and services of your sellers."
        />
      </div>
      <Client data={products} />
    </div>
  );
};

export default Page;
