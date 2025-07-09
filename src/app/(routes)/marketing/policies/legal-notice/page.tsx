import React from "react";
import db from "@/lib/db";
import LegalNoticeForm from "@/components/forms/legal-notice-form";

const Page = async () => {
  const data = await db.policies.findFirst();
  return (
    <div>
      <LegalNoticeForm
        initialData={data}
      />
    </div>
  );
};

export default Page;
