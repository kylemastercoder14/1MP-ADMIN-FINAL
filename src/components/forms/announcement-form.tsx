"use client";

import React from "react";
import Heading from "@/components/ui/heading";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import MultipleImageUpload from "@/components/ui/multiple-image-upload";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  createNewsAnnouncement,
  deleteNewsAnnouncement,
  updateNewsAnnouncement,
} from "@/actions";
import { NewsAnnouncementValidators } from "@/validators/admin";
import { Announcement } from "@prisma/client";
import AlertModal from "@/components/ui/alert-modal";

const NewsAnnouncementForm = ({
  initialData,
}: {
  initialData: Announcement | null;
}) => {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = React.useState(false);
  const title = initialData
    ? "Edit News & Announcement"
    : "Add New News & Announcement";
  const description = initialData
    ? "Please fill all required fields to edit the news & announcement details"
    : "Please fill all required fields to add news & announcement";
  const action = initialData ? "Save Changes" : "Create News & Announcement";

  const form = useForm<z.infer<typeof NewsAnnouncementValidators>>({
    resolver: zodResolver(NewsAnnouncementValidators),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      images: Array.isArray(initialData?.images)
        ? initialData.images
        : initialData?.images
        ? [initialData.images]
        : [],
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof NewsAnnouncementValidators>) {
    try {
      if (initialData) {
        const res = await updateNewsAnnouncement(values, initialData.id);

        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success);
          router.push("/marketing/announcements");
        }
      } else {
        const res = await createNewsAnnouncement(values);

        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success);
          router.push("/marketing/announcements");
        }
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  const handleDelete = async () => {
    try {
      if (initialData) {
        const res = await deleteNewsAnnouncement(initialData.id);

        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success);
          router.push("/marketing/announcements");
        }
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleteModal(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
      />
      <Heading title={title} description={description} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the title of your announcement"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      placeholder="Enter the content of your announcement"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Images <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <MultipleImageUpload
                      maxImages={2}
                      onImageUpload={(urls: string[]) => field.onChange(urls)}
                      disabled={isSubmitting}
                      defaultValues={field.value
                        ?.map((file: File | string) => {
                          if (typeof file === "string") return file;
                          if (file instanceof File)
                            return URL.createObjectURL(file);
                          return ""; // or skip
                        })
                        .filter(Boolean)}
                      bucket="assets"
                    />
                  </FormControl>
                  <FormDescription>
                    Upload 1 to 2 images in .png, .jpg, .jpeg, .webp format with
                    a resolution of at least 100*100 px. The file must not be
                    bigger than 2 MB and the aspect ratio should be 1:1.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="mt-3"
            variant="primary"
            disabled={isSubmitting}
            type="submit"
          >
            {action}
          </Button>

          {initialData && (
            <Button
              variant="destructive"
              className="mt-3 mx-2"
              disabled={isSubmitting}
              onClick={() => setDeleteModal(true)}
              type="button"
            >
              Delete
            </Button>
          )}
          <Button
            variant="ghost"
            className="mt-3 mx-2"
            disabled={isSubmitting}
            onClick={() => router.back()}
            type="button"
          >
            Cancel
          </Button>
        </form>
      </Form>
    </>
  );
};

export default NewsAnnouncementForm;
