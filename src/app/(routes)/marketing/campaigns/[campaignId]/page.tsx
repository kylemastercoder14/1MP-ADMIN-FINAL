import React from "react";
import db from "@/lib/db";
import CampaignForm from "@/components/forms/campaign-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Heading from "@/components/ui/heading";

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
          variants: true,
          subCategory: true,
          vendor: true,
        },
      },
      vendors: true,
    },
  });

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

      <CampaignForm initialData={data} />
    </div>
  );
};

export default Page;
