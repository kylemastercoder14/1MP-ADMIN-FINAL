/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CampaignForm from "@/components/forms/campaign-form";
import Client from "./_components/client";
import db from "@/lib/db";
import { CampaignProps, ProductWithProps, ProductVariant } from "@/types"; // make sure these types exist

const Page = async () => {
  const campaigns = await db.campaign.findMany({
    orderBy: {
      createdAt: "desc",
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

  // 🔹 Transform Prisma data into your typed structure
  const transformedData: CampaignProps[] = campaigns.map((campaign) => ({
    ...campaign,
    products: campaign.products.map((product): ProductWithProps => ({
      ...product,
      variants: product.variants.map(
        (variant): ProductVariant => ({
          ...variant,
          attributes:
            typeof variant.attributes === "string"
              ? JSON.parse(variant.attributes)
              : (variant.attributes as any), // safely cast if already JSON
        })
      ),
    })),
  }));

  return (
    <div>
      <h3 className="text-2xl tracking-tight font-bold mb-3">Campaigns</h3>
      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">Register for campaigns</TabsTrigger>
          <TabsTrigger value="manage">Manage your campaigns</TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="mt-5">
          <Card className="rounded-sm">
            <CardContent>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Campaign registration</h3>
                <Link
                  href="#"
                  className="flex hover:underline text-sm text-muted-foreground font-medium items-center gap-2"
                >
                  View campaign calendar
                  <ChevronRight className="size-4" />
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Product Campaigns are promotional events, organized by 1 Market
                Philippines, that help sellers to effectively promote products
                in your store.
              </p>
              {/* Creating a campaign → no initial data */}
              <CampaignForm initialData={null} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage" className="mt-5">
          <Card className="rounded-sm">
            <CardContent>
              {/* Managing campaigns → use transformed data */}
              <Client data={transformedData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
