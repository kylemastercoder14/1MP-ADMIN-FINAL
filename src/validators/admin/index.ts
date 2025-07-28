import { z } from "zod";

export const SigninValidators = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const CategoryValidators = z.object({
  name: z
    .string()
    .min(1, { message: "Category is required" })
    .max(50, { message: "Category should not exceed 50 characters" }),
  slug: z.string().optional(),
  subCategories: z
    .array(z.string().min(1, { message: "Subcategory name is required" }))
    .nonempty({ message: "At least one subcategory is required" }),
});

export const NewsAnnouncementValidators = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export const LegalNoticeValidators = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});

export const NewsSectionValidators = z.object({
  id: z.string().optional(),
  heading: z
    .string()
    .min(1, { message: "Section heading is required." })
    .max(200, { message: "Section heading cannot exceed 200 characters." }),
  content: z.string().min(1, { message: "Section content cannot be empty." }),
  order: z
    .number()
    .int()
    .min(0, { message: "Section order must be a non-negative integer." }),
  anchorId: z
    .string()
    .min(1, { message: "Anchor ID is required for sections." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Anchor ID must be lowercase, alphanumeric, and can use hyphens (e.g., 'my-section-id').",
    })
    .max(100, { message: "Anchor ID cannot exceed 100 characters." }),
});

export const NewsValidators = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(255, { message: "Title cannot exceed 255 characters." }),
  category: z
    .string()
    .min(1, { message: "Category is required." })
    .max(100, { message: "Category cannot exceed 100 characters." }),
  type: z
    .string()
    .min(1, { message: "Type is required." })
    .max(100, { message: "Type cannot exceed 100 characters." }),
  thumbnail: z
    .string()
    .url({ message: "Thumbnail must be a valid URL." })
    .min(1, { message: "Thumbnail is required." }),
  status: z
    .enum(["Active", "Draft", "Archived"], {
      errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) {
          return {
            message: "Status must be one of 'Active', 'Draft', or 'Archived'.",
          };
        }
        return { message: ctx.defaultError };
      },
    })
    .default("Active")
    .optional(),
  sections: z
    .array(NewsSectionValidators)
    .min(1, { message: "News must have at least one section." })
    // Optional: Add a refinement to check for unique anchorIds within the same news article
    .refine(
      (sections) => {
        const anchorIds = sections.map((section) => section.anchorId);
        return new Set(anchorIds).size === anchorIds.length;
      },
      {
        message: "All section anchor IDs within a news article must be unique.",
        path: ["sections"],
      }
    ),
});
