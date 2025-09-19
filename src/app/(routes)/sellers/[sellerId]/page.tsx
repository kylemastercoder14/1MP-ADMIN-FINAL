import React from "react";
import db from "@/lib/db";
import Client from "../_components/client";
import { SellerWithProps, VariantAttributes } from "@/types";

const Page = async (props: {
  params: Promise<{
    sellerId: string;
  }>;
}) => {
  const params = await props.params;

  const vendorData = await db.vendor.findUnique({
    where: {
      id: params.sellerId,
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
  const vendor: SellerWithProps | null = vendorData
    ? {
        ...vendorData,
        product: vendorData.product.map((p) => ({
          ...p,
          variants: p.variants.map((v) => ({
            ...v,
            attributes: v.attributes as unknown as VariantAttributes,
          })),
        })),
      }
    : null;

  return (
    <div>
      <Client vendor={vendor} />
    </div>
  );
};

export default Page;
