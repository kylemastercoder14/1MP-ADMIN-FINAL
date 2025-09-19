import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";
import Client from "./_components/client";

const Page = async () => {
  const data = await db.ticket.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      vendor: true,
    },
  });
  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Help Center"
          description="Manage all the issues coming from your vendors and customers."
        />
      </div>
      <Card className="rounded-sm">
        <CardContent>
          <h3 className="text-lg font-semibold mb-3">Tickets</h3>
          <Client data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
