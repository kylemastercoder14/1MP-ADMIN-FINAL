import React from "react";
import db from "@/lib/db";

const Page = async (props: {
  params: Promise<{
	sellerId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.vendor.findUnique({
	where: {
	  id: params.sellerId,
	},
  });

  return (
	<div>
	  Seller ID: {data?.id}
	  order History
	</div>
  );
};

export default Page;
