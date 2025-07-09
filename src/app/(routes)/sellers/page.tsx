import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import Client from "./_components/client";

const Page = async () => {
  const data = await db.vendor.findMany({
	orderBy: {
	  createdAt: "desc",
	},
	include: {
	  product: true
	},
  });
  return (
	<div>
	  <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
		<Heading
		  title="Sellers"
		  description="Manage your sellers and their products."
		/>
	  </div>
	  <Client data={data} />
	</div>
  );
};

export default Page;
