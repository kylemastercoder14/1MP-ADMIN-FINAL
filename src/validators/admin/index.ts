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
