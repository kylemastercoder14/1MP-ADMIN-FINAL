"use client";

import React from "react";
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
import { createCampaign, updateCampaign } from "@/actions";
import { CampaignValidators } from "@/validators/admin";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HelpCircle } from "lucide-react";
import { SmartDatetimeInput } from "@/components/globals/smart-date-time-input";
import SingleImageUpload from "@/components/ui/single-image-upload";
import { Modal } from "@/components/globals/modal";
import Image from "next/image";
import { CampaignProps } from "@/types";

const CampaignForm = ({
  initialData,
}: {
  initialData: CampaignProps | null;
}) => {
  const router = useRouter();
  const [isOpenSample, setIsOpenSample] = React.useState(false);
  const action = initialData ? "Save Changes" : "Create Campaign";

  const form = useForm<z.infer<typeof CampaignValidators>>({
    resolver: zodResolver(CampaignValidators),
    defaultValues: {
      title: initialData?.title || "",
      details: initialData?.details || "",
      criteria: initialData?.criteria || "",
      campaignStartDate: initialData?.campaignStartDate || undefined,
      campaignEndDate: initialData?.campaignEndDate || undefined,
      registrationStartDate: initialData?.registrationStartDate || undefined,
      registrationEndDate: initialData?.registrationEndDate || undefined,
      type: initialData?.type || "Percentage Off",
      value: initialData?.value || 0,
      images: Array.isArray(initialData?.images)
        ? initialData.images
        : initialData?.images
          ? [initialData.images]
          : [],
      banner: initialData?.banner || "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof CampaignValidators>) {
    try {
      if (initialData) {
        const res = await updateCampaign(initialData.id, values);

        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success);
          router.refresh();
        }
      } else {
        const res = await createCampaign(values);

        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success);
          router.push("/marketing/campaigns");
        }
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpenSample}
        onClose={() => setIsOpenSample(false)}
        title="Sample Campaign Banner"
        className="!max-w-7xl"
      >
        <div className="relative w-full h-36">
          <Image
            src="/main/sample-campaign-banner.png"
            fill
            alt="Sample Campaign Banner"
            className="size-full"
          />
        </div>
      </Modal>

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
                      placeholder="Enter the title of your campaign"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <FormLabel className="flex items-center gap-2">
                <div>
                  Campaign period <span className="text-red-600">*</span>
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="size-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-96">
                    <p>
                      The campaign period defines the overall duration of your
                      campaign. Participants can engage only between the
                      selected start and end dates. Make sure this timeframe
                      covers the entire campaign lifecycle, including
                      registration, activities, and closing.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <div className="flex items-center gap-3 w-full">
                <FormField
                  control={form.control}
                  name="campaignStartDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <SmartDatetimeInput
                          onValueChange={field.onChange}
                          value={field.value}
                          placeholder="e.g. tomorrow at 3pm"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-lg">-</p>
                <FormField
                  control={form.control}
                  name="campaignEndDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <SmartDatetimeInput
                          onValueChange={field.onChange}
                          value={field.value}
                          placeholder="e.g. one week from now"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3">
              <FormLabel className="flex items-center gap-2">
                <div>
                  Registration period <span className="text-red-600">*</span>
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="size-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-96">
                    <p>
                      The registration period is the window during which
                      participants can sign up for the campaign. This period
                      must last at least 10 minutes and no longer than 30 days.
                      Once the registration deadline passes, no new participants
                      will be allowed to join.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <div className="flex items-center gap-3 w-full">
                <FormField
                  control={form.control}
                  name="registrationStartDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <SmartDatetimeInput
                          onValueChange={field.onChange}
                          value={field.value}
                          placeholder="e.g. tomorrow at 3pm"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-lg">-</p>
                <FormField
                  control={form.control}
                  name="registrationEndDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <SmartDatetimeInput
                          onValueChange={field.onChange}
                          value={field.value}
                          placeholder="e.g. one week from now"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-3">
              <FormLabel className="flex items-center gap-2">
                <div>
                  Type <span className="text-red-600">*</span>
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="size-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-72">
                    <p>
                      <b>Percentage Off</b>: Reduce the price by setting a
                      percentage (e.g. 20% off)
                    </p>
                    <p className="mt-1">
                      <b>Fixed Price</b>: Reduce the price by setting the
                      discounted price (e.g. ₱20)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center gap-8"
                        disabled={isSubmitting}
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="Percentage Off" />
                          </FormControl>
                          <div>
                            <FormLabel className="">Percentage Off</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              The price is reduced by a set percentage
                            </p>
                          </div>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="Fixed Price" />
                          </FormControl>
                          <div>
                            <FormLabel className="">Fixed Price</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              The price is a set discounted price
                            </p>
                          </div>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Discount details{" "}
                    <span className="text-muted-foreground">
                      ({form.watch("type") === "Percentage Off" ? "%" : "₱"})
                    </span>
                    <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the discount details"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    For percentage off, enter the percentage (e.g. 20). For
                    fixed price, enter the discounted price (e.g. ₱20).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Details <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value ?? ""}
                      onChangeAction={field.onChange}
                      placeholder="Enter the details of your campaign"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the details of your campaign. You can include
                    information such as the campaign objectives, key dates,
                    activities, and any other relevant details that participants
                    should know.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Criteria <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value ?? ""}
                      onChangeAction={field.onChange}
                      placeholder="Enter the criteria of your campaign"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the criteria of your campaign. You can include the
                    guidelines for participation, eligibility requirements, and
                    any other relevant details that participants should know.
                  </FormDescription>
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
                      maxImages={3}
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
                    Upload 1 to 3 images in .png, .jpg, .jpeg, .webp format with
                    a resolution of at least 100*100 px. The file must not be
                    bigger than 2 MB and the aspect ratio should be 1:1.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Banner <span className="text-red-600">*</span>
                    <button
                      className="text-xs text-muted-foreground hover:underline cursor-pointer"
                      onClick={() => setIsOpenSample(true)}
                      type="button"
                    >
                      (Sample)
                    </button>
                  </FormLabel>
                  <FormControl>
                    <SingleImageUpload
                      onImageUpload={(url: string) => field.onChange(url)}
                      disabled={isSubmitting}
                      defaultValue={field.value || ""}
                      bucket="assets"
                    />
                  </FormControl>
                  <FormDescription>
                    Upload 1 image in .png, .jpg, .jpeg, or .webp format with a
                    resolution of at least 600×200 px. The file must not be
                    bigger than 2 MB and the recommended aspect ratio is 3:1
                    (wide rectangle, e.g. 1200×400 px).
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
    </>
  );
};

export default CampaignForm;
