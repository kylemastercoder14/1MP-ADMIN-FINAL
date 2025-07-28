import React from "react";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import Client from "./_components/client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Page = async () => {
  const data = await db.announcement.findMany({
	orderBy: {
	  createdAt: "desc",
	},
  });

  return (
	<div>
	  <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
		<Heading
		  title="Manage Announcements"
		  description="Here you can manage all your announcements. You can create, edit, and delete announcements that will be visible to your users."
		/>
		<Link href="/marketing/announcements/create">
          <Button variant="primary" className='cursor-pointer'>
            <PlusCircle />
            Add announcement
          </Button>
        </Link>
	  </div>
	  <Client data={data} />
	</div>
  );
};

export default Page;
