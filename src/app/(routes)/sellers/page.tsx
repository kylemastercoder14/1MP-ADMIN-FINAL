import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import { SellerWithProps, VariantAttributes } from "@/types";
import SellerClient from './_components/seller-client';

const Page = async () => {
  const data = await db.vendor.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: {
        include: {
          vendor: true,
          category: true,
          subCategory: true,
          variants: true,
          productDiscount: true,
          newArrivalDiscount: true,
          specifications: true,
        },
      },
      orderItem: true,
      coupon: true,
      vendorPolicies: true,
      vendorFaqs: true,
    },
  });

  // transform JsonValue → VariantAttributes
  const vendors: SellerWithProps[] = data.map((vendor) => ({
    ...vendor,
    product: vendor.product.map((p) => ({
      ...p,
      variants: p.variants.map((v) => ({
        ...v,
        attributes: v.attributes as unknown as VariantAttributes,
      })),
    })),
  }));

  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Sellers"
          description="Manage your sellers and their products."
        />
      </div>
      <div className="mt-5">
		<SellerClient data={vendors} />
      </div>
    </div>
  );
};

export default Page;
