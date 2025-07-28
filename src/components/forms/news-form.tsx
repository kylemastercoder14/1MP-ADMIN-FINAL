/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Heading from "@/components/ui/heading";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconGripVertical,
  IconPlus,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { NewsValidators, NewsSectionValidators } from "@/validators/admin";
import AlertModal from "@/components/ui/alert-modal";
import { NewsWithSections } from "@/types";
import SingleImageUpload from "@/components/ui/single-image-upload";
import { Category } from "@prisma/client";
import { createNews, deleteNews, updateNews } from "@/actions";

const NewsForm = ({
  initialData,
  categories,
}: {
  initialData: NewsWithSections | null;
  categories: Category[];
}) => {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [sectionDialog, setSectionDialog] = React.useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = React.useState<
    number | null
  >(null);
  const [deletingSectionIndex, setDeletingSectionIndex] = React.useState<
    number | null
  >(null);
  const [isSavingAsDraft, setIsSavingAsDraft] = React.useState(false);

  const title = initialData ? "Edit News Article" : "Add New News Article";
  const description = initialData
    ? "Please fill all required fields to edit the news article details"
    : "Please fill all required fields to add a news article";
  const action = initialData ? "Save Changes" : "Create News Article";

  const form = useForm<z.infer<typeof NewsValidators>>({
    resolver: zodResolver(NewsValidators),
    defaultValues: {
      title: initialData?.title || "",
      thumbnail: initialData?.thumbnail || "",
      category: initialData?.category || "",
      type: initialData?.type || "",
      status: ["Active", "Draft", "Archived"].includes(
        initialData?.status as string
      )
        ? (initialData?.status as "Active" | "Draft" | "Archived")
        : "Active",
      sections:
        initialData?.sections?.map((section, index) => ({
          ...section,
          order: index,
        })) || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const sectionForm = useForm<z.infer<typeof NewsSectionValidators>>({
    resolver: zodResolver(NewsSectionValidators),
    defaultValues: {
      heading: "",
      content: "",
      order: 0,
      anchorId: "",
    },
  });

  const { isSubmitting } = form.formState;

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  async function onSubmit(values: z.infer<typeof NewsValidators>) {
    // Update the order of sections based on their current position
    const sectionsWithUpdatedOrder = values.sections.map((section, index) => ({
      ...section,
      order: index,
    }));

    const finalValues = {
      ...values,
      sections: sectionsWithUpdatedOrder,
      status: "Active" as const,
    };

    try {
      if (initialData) {
        const res = await updateNews(finalValues, initialData.id);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success);
          router.push("/marketing/news-center");
        }
      } else {
        const res = await createNews(finalValues);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success);
          router.push("/marketing/news-center");
        }
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  const onSubmitAsDraft = async () => {
    setIsSavingAsDraft(true);
    const currentValues = form.getValues();

    // Update the order of sections based on their current position
    const sectionsWithUpdatedOrder = currentValues.sections.map(
      (section, index) => ({
        ...section,
        order: index,
      })
    );

    const finalValues = {
      ...currentValues,
      sections: sectionsWithUpdatedOrder,
      status: "Draft" as const,
    };

    try {
      let res;
      if (initialData) {
        res = await updateNews(finalValues, initialData.id);
      } else {
        res = await createNews(finalValues);
      }

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success);
        router.push("/marketing/news-center");
      }
    } catch (error) {
      console.error("Error in onSubmitAsDraft:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSavingAsDraft(false); // Reset state
    }
  };

  const handleDelete = async () => {
    try {
      if (initialData) {
        const res = await deleteNews(initialData.id);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success);
          router.push("/marketing/news-center");
        }
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleteModal(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeIndex = fields.findIndex((field) => field.id === active.id);
    const overIndex = fields.findIndex((field) => field.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      move(activeIndex, overIndex);
    }
  };

  const generateAnchorId = (heading: string): string => {
    return heading
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const headingValue = sectionForm.watch("heading");

  React.useEffect(() => {
    if (headingValue) {
      sectionForm.setValue("anchorId", generateAnchorId(headingValue));
    }
  }, [headingValue, sectionForm]);

  const openSectionDialog = (index: number | null = null) => {
    if (index !== null) {
      const section = form.getValues(`sections.${index}`);
      sectionForm.reset(section);
      setEditingSectionIndex(index);
    } else {
      sectionForm.reset({
        heading: "",
        content: "",
        order: fields.length,
        anchorId: "",
      });
      setEditingSectionIndex(null);
    }
    setSectionDialog(true);
  };

  const handleSectionSubmit = (
    values: z.infer<typeof NewsSectionValidators>
  ) => {
    const anchorId = values.anchorId || generateAnchorId(values.heading);
    const sectionData = { ...values, anchorId };

    if (editingSectionIndex !== null) {
      form.setValue(`sections.${editingSectionIndex}`, sectionData);
      toast.success("Section updated successfully");
    } else {
      append(sectionData);
      toast.success("Section added successfully");
    }

    setSectionDialog(false);
    sectionForm.reset();
  };

  const handleSectionDelete = (index: number) => {
    remove(index);
    toast.success("Section deleted successfully");
    setDeletingSectionIndex(null);
  };

  function DragHandle({ id }: { id: string }) {
    const { attributes, listeners } = useSortable({ id });

    return (
      <Button
        {...attributes}
        {...listeners}
        variant="ghost"
        size="icon"
        className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
      >
        <IconGripVertical className="text-muted-foreground size-4" />
        <span className="sr-only">Drag to reorder</span>
      </Button>
    );
  }

  function SortableTableRow({ field, index }: { field: any; index: number }) {
    const { setNodeRef, transform, transition, isDragging } = useSortable({
      id: field.id,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <TableRow
        ref={setNodeRef}
        style={style}
        className={isDragging ? "bg-muted/50" : ""}
      >
        <TableCell className="w-12">
          <DragHandle id={field.id} />
        </TableCell>
        <TableCell className="font-medium">{field.heading}</TableCell>
        <TableCell className="max-w-md">
          <div
            className="text-sm text-muted-foreground truncate"
            dangerouslySetInnerHTML={{
              __html:
                field.content?.substring(0, 100) +
                (field.content?.length > 100 ? "..." : ""),
            }}
          />
        </TableCell>
        <TableCell>
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            {field.anchorId}
          </code>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openSectionDialog(index)}
              className="h-8 w-8"
            >
              <IconEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeletingSectionIndex(index)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      <AlertModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
      />

      <AlertModal
        isOpen={deletingSectionIndex !== null}
        onClose={() => setDeletingSectionIndex(null)}
        onConfirm={() =>
          deletingSectionIndex !== null &&
          handleSectionDelete(deletingSectionIndex)
        }
        title="Delete Section"
        description="Are you sure you want to delete this section? This action cannot be undone."
      />

      <Dialog open={sectionDialog} onOpenChange={setSectionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSectionIndex !== null
                ? "Edit Section"
                : "Add New Section"}
            </DialogTitle>
            <DialogDescription>
              {editingSectionIndex !== null
                ? "Update the section details below."
                : "Fill in the details for the new section."}
            </DialogDescription>
          </DialogHeader>

          <Form {...sectionForm}>
            <form
              onSubmit={sectionForm.handleSubmit(handleSectionSubmit)}
              className="space-y-4"
            >
              <FormField
                control={sectionForm.control}
                name="heading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Heading</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter section heading" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={sectionForm.control}
                name="anchorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anchor ID</FormLabel>
                    <FormControl>
                      <Input placeholder="section-anchor-id" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used for navigation links. Auto-generated
                      from heading if left empty.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={sectionForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value ?? ""}
                        onChangeAction={field.onChange}
                        placeholder="Enter the section content"
                        disabled={sectionForm.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSectionDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={sectionForm.formState.isSubmitting}
                >
                  {editingSectionIndex !== null
                    ? "Update Section"
                    : "Add Section"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSubmitAsDraft}
            disabled={isSubmitting || isSavingAsDraft}
          >
            Save as draft
          </Button>
          {initialData && (
            <Button
              variant="destructive"
              disabled={isSubmitting}
              onClick={() => setDeleteModal(true)}
              type="button"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-6">
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

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category <span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type <span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sales & Marketing">
                          Sales & Marketing
                        </SelectItem>
                        <SelectItem value="Product Update">
                          Product Update
                        </SelectItem>
                        <SelectItem value="Company News">
                          Company News
                        </SelectItem>
                        <SelectItem value="Campaign">Campaign</SelectItem>
                        <SelectItem value="Policies Update">
                          Policies Update
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Thumbnail <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <SingleImageUpload
                      onImageUpload={(url: string) => field.onChange(url)}
                      disabled={isSubmitting}
                      defaultValue={field.value ?? ""}
                      bucket="assets"
                    />
                  </FormControl>
                  <FormDescription>
                    Upload 1 image in .png, .jpg, .jpeg, .webp format with a
                    resolution of at least 100*100 px. The file must not be
                    bigger than 2 MB and the aspect ratio should be 1:1.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sections Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Article Sections</h3>
                <p className="text-sm text-muted-foreground">
                  Add and organize sections for your news article. Drag to
                  reorder.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => openSectionDialog()}
                className="flex items-center gap-2"
              >
                <IconPlus className="h-4 w-4" />
                Add Section
              </Button>
            </div>

            {fields.length > 0 ? (
              <div className="border rounded-lg">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Heading</TableHead>
                        <TableHead>Content Preview</TableHead>
                        <TableHead>Anchor ID</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SortableContext
                        items={fields.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {fields.map((field, index) => (
                          <SortableTableRow
                            key={field.id}
                            field={field}
                            index={index}
                          />
                        ))}
                      </SortableContext>
                    </TableBody>
                  </Table>
                </DndContext>
              </div>
            ) : (
              <div className="text-center flex items-center justify-center flex-col py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  No sections added yet
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => openSectionDialog()}
                  className="flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Add Your First Section
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" disabled={isSubmitting} type="submit">
              {action}
            </Button>

            <Button
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => router.back()}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default NewsForm;
