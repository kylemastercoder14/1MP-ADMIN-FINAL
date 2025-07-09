import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import Client from "./_components/client";

const Page = async () => {
  const data = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      variants: true,
      subCategory: true,
      vendor: true,
    },
  });
  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Manage Products"
          description="Here you can manage all your products and services of your sellers."
        />
      </div>
      <Client data={data} />
    </div>
  );
};

export default Page;
