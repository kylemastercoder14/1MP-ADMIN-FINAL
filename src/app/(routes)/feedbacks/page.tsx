import React from "react";
import db from "@/lib/db";

const Page = async () => {
  const data = await db.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      subCategories: true,
    },
  });
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
};

export default Page;
