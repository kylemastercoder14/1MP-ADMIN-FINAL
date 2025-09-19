import React from "react";
import db from "@/lib/db";
import PolicyForm from "@/components/forms/policy-form";

const Page = async () => {
  const data = await db.policies.findFirst();
  return (
	<div>
	  <PolicyForm
		initialData={data}
		fieldName="intellectualPropertyProtection"
		title="Intellectual Property Protection"
	  />
	</div>
  );
};

export default Page;
