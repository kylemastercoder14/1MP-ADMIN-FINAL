"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SettingsData } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { updatePolicyAdmin } from "@/actions";

const IntegrityComplianceSettings = ({ data }: { data: SettingsData | null }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [integrityCompliance, setIntegrityCompliance] = useState(
	data?.policies[0]?.integrityCompliance
  );

  const handleSubmitPolicy = async (e: React.FormEvent) => {
	e.preventDefault();

	setLoading(true);

	try {
	  const response = await updatePolicyAdmin(integrityCompliance!, "integrityCompliance");

	  if (response.error) {
		toast.error(response.error);
	  }

	  toast.success("Integrity compliance updated");
	  router.refresh();
	} catch (error) {
	  console.error("Error updating integrity compliance:", error);
	  toast.error(`Failed to update integrity compliance`);
	} finally {
	  setLoading(false);
	}
  };
  return (
	<div className="space-y-6">
	  <div>
		<h1 className="text-2xl font-semibold text-balance">
		  Integrity Compliance Information
		</h1>
	  </div>
	  <Card className="rounded-sm">
		<CardHeader>
		  <CardTitle>Integrity Compliance</CardTitle>
		</CardHeader>
		<CardContent>
		  <div className="space-y-6">
			<div className="space-y-2">
			  <Label>Integrity Compliance Content</Label>
			  <RichTextEditor
				disabled={loading}
				value={integrityCompliance || ""}
				onChangeAction={setIntegrityCompliance}
				placeholder="Enter your content here..."
			  />
			</div>
		  </div>
		  <Button
			onClick={handleSubmitPolicy}
			disabled={loading}
			variant="primary"
			className="mt-5 ml-auto flex items-center justify-end"
		  >
			Save Changes
		  </Button>
		</CardContent>
	  </Card>
	</div>
  );
};

export default IntegrityComplianceSettings;
