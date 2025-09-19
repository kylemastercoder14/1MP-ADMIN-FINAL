import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CampaignForm from "@/components/forms/campaign-form";
import Client from "./_components/client";
import db from "@/lib/db";

const Page = async () => {
  const data = await db.campaign.findMany({
    orderBy: {
      createdAt: "desc",
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
              <CampaignForm initialData={null} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage" className="mt-5">
          <Card className="rounded-sm">
            <CardContent>
              <Client data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
