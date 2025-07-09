import React from "react";
import db from "@/lib/db";
import AnnouncementForm from '@/components/forms/announcement-form';

const Page = async (props: {
  params: Promise<{
	announcementId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.announcement.findUnique({
	where: {
	  id: params.announcementId,
	},
  });

  return (
	<div>
	  <AnnouncementForm initialData={data} />
	</div>
  );
};

export default Page;
