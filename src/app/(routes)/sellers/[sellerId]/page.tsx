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
          productReview: {
            select: {
              id: true,
              rating: true,
            },
          },
        },
      },
      orderItem: true,
      coupon: true,
      vendorPolicies: true,
      vendorFaqs: true,
      followStore: {
        select: {
          id: true,
        },
      },
      vendorReview: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // Calculate followers count
  const followersCount = vendorData?.followStore?.length ?? 0;

  // Calculate total sold items (sum of quantities from orderItems)
  const totalSold = vendorData?.orderItem?.reduce((sum, item) => {
    const quantity = Number(item?.quantity) || 0;
    return sum + quantity;
  }, 0) ?? 0;

  // Calculate vendor rating from all products
  let totalRating = 0;
  let totalReviews = 0;
  let averageRating = 0;

  if (vendorData?.product) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vendorData.product.forEach((product: any) => {
      if (product.productReview && product.productReview.length > 0) {
        const productReviews = product.productReview.length;
        totalReviews += productReviews;
        // Sum all ratings from reviews
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        product.productReview.forEach((review: any) => {
          totalRating += review.rating;
        });
      }
    });

    if (totalReviews > 0) {
      averageRating = totalRating / totalReviews;
    }
  }

  // transform JsonValue → VariantAttributes
  const vendor: SellerWithProps | null = vendorData
    ? {
        ...vendorData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        product: vendorData.product.map((p: any) => ({
          ...p,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          variants: p.variants.map((v: any) => ({
            ...v,
            attributes: v.attributes as unknown as VariantAttributes,
          })),
        })),
      }
    : null;

  return (
    <div>
      <Client
        vendor={vendor}
        followersCount={followersCount}
        averageRating={averageRating}
        totalReviews={totalReviews}
        totalSold={totalSold}
      />
    </div>
  );
};

export default Page;
