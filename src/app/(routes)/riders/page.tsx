import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import RiderClient from "./_components/rider-client";

const Page = async () => {
  const data = await db.rider.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Riders"
          description="Manage your riders and their delivery status."
        />
      </div>
      <div className="mt-5">
        <RiderClient data={data} />
      </div>
    </div>
  );
};

export default Page;
