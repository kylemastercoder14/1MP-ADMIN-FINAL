import React from "react";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import Client from "./_components/client";

const Page = async () => {
  const data = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      order: true,
      address: true,
    },
  });

  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Customer Records"
          description="View and manage a comprehensive list of all registered customers in the system. This provides key details such as names, email addresses, account types and order history ensuring efficient customer tracking and management."
        />
      </div>
      <Client data={data} />
    </div>
  );
};

export default Page;
