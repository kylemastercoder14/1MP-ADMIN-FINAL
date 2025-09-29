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

const IntellectualPropertySettings = ({ data }: { data: SettingsData | null }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [intellectualProperty, setIntellectualProperty] = useState(
	data?.policies[0]?.intellectualPropertyProtection
  );

  const handleSubmitPolicy = async (e: React.FormEvent) => {
	e.preventDefault();

	setLoading(true);

	try {
	  const response = await updatePolicyAdmin(intellectualProperty!, "intellectualPropertyProtection");

	  if (response.error) {
		toast.error(response.error);
	  }

	  toast.success("Intellectual property protection updated");
	  router.refresh();
	} catch (error) {
	  console.error("Error updating intellectual property protection:", error);
	  toast.error(`Failed to update intellectual property protection`);
	} finally {
	  setLoading(false);
	}
  };
  return (
	<div className="space-y-6">
	  <div>
		<h1 className="text-2xl font-semibold text-balance">
		  Intellectual Property Information
		</h1>
	  </div>
	  <Card className="rounded-sm">
		<CardHeader>
		  <CardTitle>Intellectual Property</CardTitle>
		</CardHeader>
		<CardContent>
		  <div className="space-y-6">
			<div className="space-y-2">
			  <Label>Intellectual Property Content</Label>
			  <RichTextEditor
				disabled={loading}
				value={intellectualProperty || ""}
				onChangeAction={setIntellectualProperty}
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

export default IntellectualPropertySettings;
