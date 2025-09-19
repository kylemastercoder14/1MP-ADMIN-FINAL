import React from "react";
import db from "@/lib/db";
import CampaignForm from "@/components/forms/campaign-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Heading from "@/components/ui/heading";
import { CampaignProps, VariantAttributes } from '@/types';

const Page = async (props: {
  params: Promise<{
    campaignId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.campaign.findUnique({
    where: {
      id: params.campaignId,
    },
    include: {
      products: {
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
      vendors: true,
    },
  });

  const transformed: CampaignProps | null = data
    ? {
        ...data,
        products: data.products.map((p) => ({
          ...p,
          variants: p.variants.map((v) => ({
            ...v,
            attributes: (v.attributes ?? {}) as VariantAttributes, // cast JsonValue → VariantAttributes
          })),
        })),
      }
    : null;

  return (
    <div>
      <div className="flex items-start gap-2">
        <Link href="/marketing/campaigns">
          <Button type="button" variant="ghost">
            <ChevronLeft className="size-4" />
          </Button>
        </Link>
        <Heading
          title="Edit campaign"
          description="Make changes to your campaign"
        />
      </div>

      <CampaignForm initialData={transformed} />
    </div>
  );
};

export default Page;
