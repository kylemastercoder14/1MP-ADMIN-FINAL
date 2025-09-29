"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsData } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateRefundPolicy } from "@/actions";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const RefundPolicySettings = ({ data }: { data: SettingsData | null }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refundableDays, setRefundableDays] = useState(data?.admin?.refundableDays);
  const [refundPolicy, setRefundPolicy] = useState(data?.policies[0]?.refundPolicy);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await updateRefundPolicy(
        refundableDays!,
        refundPolicy!,
        data?.admin?.id as string
      );

      if (response.error) {
        toast.error(response.error);
      }

      toast.success("Refund policy updated");
      router.refresh();
    } catch (error) {
      console.error("Error updating refund policy:", error);
      toast.error(`Failed to update refund policy`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-balance">
          Refund Policy Information
        </h1>
      </div>
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Refund Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Refundable Days</Label>
              <Input
                disabled={loading}
                value={refundableDays || ""}
                onChange={(e) => setRefundableDays(e.target.value)}
                placeholder="7 days"
              />
            </div>
            <div className="space-y-2">
              <Label>Refund Policy Content</Label>
              <RichTextEditor
                disabled={loading}
                value={refundPolicy || ""}
                onChangeAction={setRefundPolicy}
                placeholder="Enter your content here..."
              />
            </div>
          </div>
          <Button
            onClick={handleSubmitEmail}
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

export default RefundPolicySettings;
