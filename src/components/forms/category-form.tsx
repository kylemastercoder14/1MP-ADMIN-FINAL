/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect } from "react";
import Heading from "@/components/ui/heading";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createCategory, updateCategory } from "@/actions";
import { CategoryValidators } from "@/validators/admin";
import { CategoryWithProps } from "@/types";
import { TagsInput } from "@/components/ui/tags-input";

const CategoryForm = ({
  initialData,
}: {
  initialData: CategoryWithProps | null;
}) => {
  const router = useRouter();
  const title = initialData ? "Edit Category" : "Add New Category";
  const description = initialData
    ? "Please fill all required fields to edit the category details"
    : "Please fill all required fields to add a new category";
  const action = initialData ? "Save Changes" : "Create Category";

  const form = useForm<z.infer<typeof CategoryValidators>>({
    resolver: zodResolver(CategoryValidators),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      subCategories:
        initialData?.subCategories.map((subCategory) => subCategory.name) || [],
    },
  });

  const { isSubmitting } = form.formState;

  // Watch the `name` field for changes
  const nameValue = useWatch({
    control: form.control,
    name: "name",
  });

  useEffect(() => {
    if (!initialData) {
      // Only generate slug if creating new category
      const slug = nameValue
        ? nameValue
            .trim()
            .toLowerCase()
            .replace(/&/g, "-") // replace & with hyphen
            .replace(/,/g, "-") // replace commas with hyphen
            .replace(/\s+/g, "-") // replace spaces with hyphen
            .replace(/-+/g, "-") // replace multiple hyphens with single
            .replace(/^-|-$/g, "") // remove leading/trailing hyphen
        : "";
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [nameValue, form, initialData]);

  async function onSubmit(values: z.infer<typeof CategoryValidators>) {
    try {
      if (initialData) {
        const res = await updateCategory({
          id: initialData.id,
          name: values.name,
          slug: values.slug || "",
          subCategories: values.subCategories.filter(Boolean), // Remove empty values
        });

        if (!res.success) {
          toast.error(res.message || "Something went wrong");
          return;
        }

        toast.success(res.message || "Category updated successfully");
        router.push("/manage-categories");
      } else {
        const res = await createCategory({
          ...values,
          slug: values.slug || "",
          subCategories: values.subCategories.filter(Boolean), // Remove empty values
        });

        if (!res.success) {
          toast.error(res.message || "Something went wrong");
          return;
        }

        toast.success(res.message || "Category created successfully");
        router.push("/manage-categories");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <Heading title={title} description={description} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category name <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g 'Food and Beverages'" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be displayed on the seller's account if they want
                    to create a store.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Slug <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g 'food-and-beverages'" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the unique identifier of a category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subCategories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Sub-categories <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <TagsInput
                      onValueChange={field.onChange}
                      value={field.value}
                      placeholder="e.g 'Cafe', 'Restaurant', 'Bar'"
                    />
                  </FormControl>
                  <FormDescription>
                    This will be displayed on the seller's account if they want
                    to create a product or services under this category.
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
    </div>
  );
};

export default CategoryForm;
