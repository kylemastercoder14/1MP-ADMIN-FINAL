import React from "react";
import db from "@/lib/db";
import CategoryForm from '@/components/forms/category-form';

const Page = async (props: {
  params: Promise<{
    categoryId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
    include: {
      vendor: true,
      subCategories: true,
    },
  });

  return (
    <div>
      <CategoryForm initialData={data} />
    </div>
  );
};

export default Page;
