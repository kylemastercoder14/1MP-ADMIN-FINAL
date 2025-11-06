import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import CampaignProductsClient from "../_components/campaign-products-client";
import { VariantAttributes } from "@/types";

const Page = async () => {
  const campaignProducts = await db.campaignProduct.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      campaign: {
        select: {
          id: true,
          title: true,
          campaignStartDate: true,
          campaignEndDate: true,
        },
      },
      product: {
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          subCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          variants: true,
        },
      },
      variantStocks: {
        include: {
          productVariant: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              attributes: true,
            },
          },
        },
      },
    },
  });

  // Transform the data to include variant stocks properly
  const transformedData = campaignProducts.map((cp) => {
    return {
      ...cp,
      product: {
        ...cp.product,
        variants: cp.product.variants.map((v) => ({
          ...v,
          attributes:
            typeof v.attributes === "string"
              ? JSON.parse(v.attributes)
              : (v.attributes as VariantAttributes),
        })),
      },
      variantStocks: cp.variantStocks.map((vs) => ({
        ...vs,
        productVariant: vs.productVariant
          ? {
              ...vs.productVariant,
              attributes:
                typeof vs.productVariant.attributes === "string"
                  ? JSON.parse(vs.productVariant.attributes)
                  : (vs.productVariant.attributes as VariantAttributes),
            }
          : null,
      })),
    };
  });

  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Campaign Product Submissions"
          description="Manage product submissions for campaigns. Approve or reject products submitted by vendors."
        />
      </div>
      <div className="mt-5">
        <CampaignProductsClient data={transformedData} />
      </div>
    </div>
  );
};

export default Page;

