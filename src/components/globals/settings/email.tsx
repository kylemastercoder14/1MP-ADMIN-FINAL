"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsData } from "@/types";
import { useRouter } from "next/navigation";
import { AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { updateEmailConfig } from "@/actions";

const EmailSettings = ({ data }: { data: SettingsData | null }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(data?.admin?.gmailSmtp);
  const [appPassword, setAppPassword] = useState(data?.admin?.appPasswordSmtp);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await updateEmailConfig(
        email!,
        appPassword!,
        data?.admin?.id as string
      );

      if (response.error) {
        toast.error(response.error);
      }

      toast.success("Email configuration updated");
      router.refresh();
    } catch (error) {
      console.error("Error updating email configuration:", error);
      toast.error(`Failed to update email configuration`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-balance">
          Email Configuration
        </h1>
      </div>
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Credentials</CardTitle>
          <CardDescription>
            <Alert className="mt-3" variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Take Note!</AlertTitle>
              <AlertDescription>
                <p>
                  When setting up your email system (SMTP), make sure to do it
                  carefully. If it&apos;s not done right, you&apos;ll encounter
                  errors when placing orders, registering new users, or sending
                  newsletters.
                </p>
              </AlertDescription>
            </Alert>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Mailer</Label>
              <Input disabled value="SMTP" />
            </div>
            <div className="space-y-2">
              <Label>Host</Label>
              <Input disabled value="smtp.gmail.com" />
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>Port</Label>
                <Input disabled value="465" />
              </div>
              <div className="space-y-2">
                <Label>Encryption</Label>
                <Input disabled value="SSL" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                disabled={loading}
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="support.onemarketphilippines@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label>App Password</Label>
              <Input
                disabled={loading}
                value={appPassword || ""}
                onChange={(e) => setAppPassword(e.target.value)}
                placeholder="jfgh458gkfdf230o8"
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

export default EmailSettings;
