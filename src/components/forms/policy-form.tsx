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
import { PolicyValidators } from "@/validators/admin";
import { updatePolicy } from "@/actions";

const PolicyForm = ({
  initialData,
  fieldName,
  title,
}: {
  initialData: Policies | null;
  fieldName: keyof Policies;
  title: string;
}) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const form = useForm<z.infer<typeof PolicyValidators>>({
    resolver: zodResolver(PolicyValidators),
    defaultValues: {
      content: initialData ? (initialData[fieldName] as string) || "" : "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    form.reset({
      content: initialData ? (initialData[fieldName] as string) || "" : "",
    });
  };

  async function onSubmit(values: z.infer<typeof PolicyValidators>) {
    try {
      const { error } = await updatePolicy(fieldName, values.content);

      if (error) {
        toast.error(error);
      }

      toast.success(`${title} updated successfully`);
      setEditing(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || `Failed to update ${title}`);
    }
  }

  return (
    <div className="mt-5">
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>

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
                              placeholder={`Enter ${title} content...`}
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
                    {initialData?.[fieldName] ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: initialData[fieldName] as string,
                        }}
                      />
                    ) : (
                      <div className="text-muted-foreground italic">
                        No {title} provided.
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

export default PolicyForm;
