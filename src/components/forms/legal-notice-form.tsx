/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Pencil, Save, X } from "lucide-react";
import { Policies } from "@prisma/client";
import { LegalNoticeValidators } from "@/validators/admin";
import { updateLegalNotice } from "@/actions";

const LegalNoticeForm = ({ initialData }: { initialData: Policies | null }) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const form = useForm<z.infer<typeof LegalNoticeValidators>>({
    resolver: zodResolver(LegalNoticeValidators),
    defaultValues: {
      content: initialData?.legalNotice || "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    form.reset({
      content: initialData?.legalNotice || "",
    });
  };

  async function onSubmit(values: z.infer<typeof LegalNoticeValidators>) {
    try {
      const { error } = await updateLegalNotice(values.content);

      if (error) {
        toast.error(error);
      }

      toast.success("Legal notice updated successfully");
      setEditing(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update legal notice");
    }
  }

  return (
    <div className="mt-5">
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Legal Notice
            </CardTitle>

            {!editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
          <CardDescription>
            Date Updated:{" "}
            {initialData?.updatedAt
              ? new Date(initialData.updatedAt).toLocaleDateString()
              : "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {editing ? (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Content <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <RichTextEditor
                              value={field.value ?? ""}
                              onChangeAction={field.onChange}
                              placeholder="Enter the legal notice content"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2"
                        variant="primary"
                      >
                        <Save className="w-4 h-4" />
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm gap-5 max-w-none dark:prose-invert">
                    {initialData?.legalNotice ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: initialData.legalNotice,
                        }}
                      />
                    ) : (
                      <div className="text-muted-foreground italic">
                        No legal notice provided.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalNoticeForm;
