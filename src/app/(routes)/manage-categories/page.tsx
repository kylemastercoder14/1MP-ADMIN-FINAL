import React from "react";
import db from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Heading from "@/components/ui/heading";
import Client from './_components/client';

const Page = async () => {
  const data = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: true,
      vendor: true,
    },
  });
  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Manage Categories"
          description="Easily manage your product or service categories with this intuitive interface."
        />
        <Link href="/manage-categories/create">
          <Button variant="primary" className='cursor-pointer'>
            <PlusCircle />
            Add category
          </Button>
        </Link>
      </div>
	  <Client data={data} />
    </div>
  );
};

export default Page;
