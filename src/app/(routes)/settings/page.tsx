import React from "react";
import Heading from "@/components/ui/heading";
import SettingsClient from "./client";
import db from "@/lib/db";
import { SettingsData } from '@/types';

const Page = async () => {
  const admin = await db.admin.findFirst();
  const officeHours = await db.companyHours.findMany();
  const faqs = await db.faqs.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const policies = await db.policies.findMany();
  const data: SettingsData = {
    admin,
    officeHours,
    faqs,
    policies,
  };
  return (
    <div>
      <Heading
        title="Settings"
        description="Manage and customize your app preferences."
      />
      <SettingsClient data={data} />
    </div>
  );
};

export default Page;
