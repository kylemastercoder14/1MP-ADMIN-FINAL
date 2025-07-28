import React from "react";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import Client from "./_components/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
  const data = await db.news.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sections: true,
    },
  });

  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Manage News Center"
          description="Here you can manage all your news articles. You can create, edit, and delete articles that will be visible to your users."
        />
        <Link href="/marketing/news-center/create">
          <Button variant="primary" className="cursor-pointer">
            <PlusCircle />
            Add news article
          </Button>
        </Link>
      </div>
      <Tabs defaultValue="active">
        <TabsList className='w-full'>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Client data={data.filter((news) => news.status === "Active")} />
        </TabsContent>
        <TabsContent value="draft">
          <Client data={data.filter((news) => news.status === "Draft")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
