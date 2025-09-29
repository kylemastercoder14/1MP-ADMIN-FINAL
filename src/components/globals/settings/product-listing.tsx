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

const ProductListingSettings = ({ data }: { data: SettingsData | null }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productListingPolicy, setProductListingPolicy] = useState(
	data?.policies[0]?.productListingPolicy
  );

  const handleSubmitPolicy = async (e: React.FormEvent) => {
	e.preventDefault();

	setLoading(true);

	try {
	  const response = await updatePolicyAdmin(productListingPolicy!, "productListingPolicy");

	  if (response.error) {
		toast.error(response.error);
	  }

	  toast.success("Product listing policy updated");
	  router.refresh();
	} catch (error) {
	  console.error("Error updating product listing policy:", error);
	  toast.error(`Failed to update product listing policy`);
	} finally {
	  setLoading(false);
	}
  };
  return (
	<div className="space-y-6">
	  <div>
		<h1 className="text-2xl font-semibold text-balance">
		  Product Listing Information
		</h1>
	  </div>
	  <Card className="rounded-sm">
		<CardHeader>
		  <CardTitle>Product Listing</CardTitle>
		</CardHeader>
		<CardContent>
		  <div className="space-y-6">
			<div className="space-y-2">
			  <Label>Product Listing Content</Label>
			  <RichTextEditor
				disabled={loading}
				value={productListingPolicy || ""}
				onChangeAction={setProductListingPolicy}
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

export default ProductListingSettings;
