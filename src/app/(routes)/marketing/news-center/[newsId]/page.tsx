import React from "react";
import db from "@/lib/db";
import NewsForm from "@/components/forms/news-form";

const Page = async (props: {
  params: Promise<{
    newsId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.news.findUnique({
    where: {
      id: params.newsId,
    },
    include: {
      sections: true,
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <NewsForm initialData={data} categories={categories} />
    </div>
  );
};

export default Page;
