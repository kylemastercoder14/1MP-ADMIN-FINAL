import React from "react";
import db from "@/lib/db";
import Client from "./client";
import { ProductWithProps, VariantAttributes } from '@/types';

const Page = async (props: {
  params: Promise<{
    productId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.product.findUnique({
    where: { id: params.productId },
    include: {
      vendor: true,
      category: true,
      subCategory: true,
      variants: true,
      productDiscount: true,
      newArrivalDiscount: true,
      specifications: true,
      productReview: {
        select: {
          id: true,
          rating: true,
        },
      },
    },
  });

  const product: ProductWithProps | null = data
    ? {
        ...data,
        variants: data.variants.map((v) => ({
          ...v,
          attributes: v.attributes as unknown as VariantAttributes,
        })),
      }
    : null;

  return (
    <div>
      <Client data={product} />
    </div>
  );
};

export default Page;
