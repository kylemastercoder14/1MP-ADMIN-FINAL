"use server";

import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@prisma/client";
import { extractPathFromUrl } from "@/lib/utils";
import z from "zod";
import { NewsAnnouncementValidators, NewsValidators } from "@/validators/admin";

export async function signIn(email: string, password: string) {
  try {
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    // Check if admin exists in your database
    const admin = await db.admin.findFirst({ where: { email } });

    const supabase = createClient();
    const {
      data: { session },
      error: supabaseError,
    } = await (
      await supabase
    ).auth.signInWithPassword({
      email,
      password,
    });

    if (supabaseError) {
      return {
        success: false,
        message: supabaseError.message,
      };
    }

    if (!admin) {
      return {
        success: false,
        message: "Admin not found.",
      };
    }

    return {
      success: true,
      message: "Login successful.",
      session,
      admin,
    };
  } catch (error) {
    console.error("Login failed:", error);
    let errorMessage = "Login failed. Please check your credentials.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function createCategory(data: {
  name: string;
  slug: string;
  subCategories: string[];
}) {
  if (!data || !data.name || !data.slug || !data.subCategories?.length) {
    return { success: false, message: "Please fill all required fields" };
  }

  try {
    const existingCategory = await db.category.findFirst({
      where: {
        OR: [
          {
            name: data.name,
          },
          {
            slug: data.slug,
          },
        ],
      },
    });

    if (existingCategory) {
      return {
        success: false,
        message: "Category name or slug already exists",
      };
    }

    // Create the main category
    const category = await db.category.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    // Loop through subcategories
    for (const subCategory of data.subCategories) {
      if (!subCategory?.trim()) continue;

      // Create a new subcategory linked to this category, even if the name already exists elsewhere
      await db.subCategory.create({
        data: {
          name: subCategory.trim(),
          slug: `${data.slug}-${subCategory
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
          categorySlug: category.slug,
        },
      });
    }

    return { success: true, message: "Category created successfully" };
  } catch (error) {
    console.error("Category failed:", error);
    let errorMessage = "Category failed.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function updateCategory(data: {
  id: string;
  name: string;
  slug: string;
  subCategories: string[];
}) {
  if (!data.name || !data.slug || !data.subCategories.length) {
    return { success: false, message: "Please fill all required fields" };
  }

  try {
    const res = await db.category.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    if (!res) {
      return {
        success: false,
        message: "Category not found or could not be updated",
      };
    }

    await db.subCategory.deleteMany({
      where: {
        categorySlug: data.slug,
      },
    });

    await Promise.all(
      data.subCategories.map(async (subCategory) => {
        await db.subCategory.create({
          data: {
            name: subCategory,
            categorySlug: data.slug,
            slug: subCategory.trim().toLowerCase().replace(/\s+/g, "-"),
          },
        });
      })
    );

    return { success: true, message: "Category updated successfully" };
  } catch (error) {
    console.error("Category failed:", error);
    let errorMessage = "Category failed.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

type UpdateProductsInput = {
  ids: string[];
  status?: Product["adminApprovalStatus"];
};

type DeleteProductsInput = {
  ids: string[];
};

export const updateProducts = async ({
  ids,
  status,
}: UpdateProductsInput): Promise<{ error?: string }> => {
  try {
    if (!status) {
      return { error: "No fields to update provided" };
    }

    if (!ids || ids.length === 0) {
      return { error: "No product IDs provided" };
    }

    let statusPassed;

    if (status === "Deactivated") {
      statusPassed = "Deactivated";
    } else if (status === "Re-activate") {
      statusPassed = "Approved";
    }

    await db.product.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        adminApprovalStatus: statusPassed,
      },
    });

    return {};
  } catch (error) {
    console.error("Failed to update products:", error);
    return { error: "Failed to update products" };
  }
};

export const deleteProducts = async ({
  ids,
}: DeleteProductsInput): Promise<{ error?: string }> => {
  try {
    if (!ids || ids.length === 0) {
      return { error: "No product IDs provided" };
    }

    // Verify products exist (optional)
    const existingCount = await db.product.count({
      where: { id: { in: ids } },
    });

    if (existingCount === 0) {
      return { error: "No matching products found" };
    }

    // Handle file deletions (Supabase storage)
    const supabase = createClient();
    const client = await supabase;
    const filesToDelete: string[] = [];

    // Only need product images/sizeChart since variants will cascade
    const products = await db.product.findMany({
      where: { id: { in: ids } },
      select: {
        images: true,
        sizeChart: true,
        variants: {
          select: { image: true },
        },
      },
    });

    products.forEach((product) => {
      // Main images
      product.images?.forEach((image) => {
        const path = extractPathFromUrl(image);
        if (path) filesToDelete.push(path);
      });

      // Size chart
      if (product.sizeChart) {
        const path = extractPathFromUrl(product.sizeChart);
        if (path) filesToDelete.push(path);
      }

      // Variant images (if needed)
      product.variants?.forEach((variant) => {
        if (variant.image) {
          const path = extractPathFromUrl(variant.image);
          if (path) filesToDelete.push(path);
        }
      });
    });

    // Delete files from storage
    if (filesToDelete.length > 0) {
      const { error } = await client.storage
        .from("products")
        .remove(filesToDelete);

      if (error) {
        console.error("File deletion error", error);
      }
    }

    // Single delete operation - cascades will handle the rest
    await db.product.deleteMany({
      where: { id: { in: ids } },
    });

    return {};
  } catch (error) {
    console.error("Deletion failed:", error);
    return { error: "Failed to delete products" };
  }
};

export const createNewsAnnouncement = async (
  values: z.infer<typeof NewsAnnouncementValidators>
) => {
  const safeValues = NewsAnnouncementValidators.safeParse(values);

  if (!safeValues.success) {
    return { error: "Please fill all the required fields" };
  }

  const { title, content, images } = safeValues.data;

  try {
    const data = await db.announcement.create({
      data: {
        title,
        content,
        images,
      },
    });

    return { success: "Announcement created successfully", data };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const updateNewsAnnouncement = async (
  values: z.infer<typeof NewsAnnouncementValidators>,
  id: string
) => {
  const safeValues = NewsAnnouncementValidators.safeParse(values);

  if (!safeValues.success) {
    return { error: "Please fill all the required fields" };
  }

  const { title, content, images } = safeValues.data;

  try {
    const data = await db.announcement.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        images,
      },
    });

    return { success: "Announcement updated successfully", data };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const deleteNewsAnnouncement = async (id: string) => {
  try {
    await db.announcement.delete({
      where: {
        id,
      },
    });

    return { success: "Announcement deleted successfully" };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const updateLegalNotice = async (content: string) => {
  try {
    // Check if a policy record already exists
    const existingPolicy = await db.policies.findFirst();

    if (existingPolicy) {
      // Update existing record
      await db.policies.update({
        where: { id: existingPolicy.id },
        data: { legalNotice: content },
      });
    } else {
      // Create new record
      await db.policies.create({
        data: { legalNotice: content },
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating legal notice:", error);
    return { error: "Failed to update legal notice" };
  }
};

export const createNews = async (values: z.infer<typeof NewsValidators>) => {
  const safeValues = NewsValidators.safeParse(values);

  if (!safeValues.success) {
    return { error: "Please fill all the required fields" };
  }

  const { title, category, thumbnail, type, sections } = safeValues.data;

  try {
    const data = await db.news.create({
      data: {
        title,
        category,
        thumbnail,
        type,
        sections: {
          create: sections.map((section) => ({
            heading: section.heading,
            content: section.content,
            anchorId: section.anchorId,
            order: section.order,
          })),
        },
      },
    });

    return { success: "News article created successfully", data };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const updateNews = async (
  values: z.infer<typeof NewsValidators>,
  newsId: string
) => {
  const safeValues = NewsValidators.safeParse(values);

  if (!safeValues.success) {
    console.error("Validation error during news update:", safeValues.error);
    // You might want to return safeValues.error.issues for more detailed client-side validation messages
    return { error: "Invalid data provided. Please check all fields." };
  }

  const { title, category, thumbnail, type, status, sections } =
    safeValues.data;

  try {
    const existingNews = await db.news.findUnique({
      where: { id: newsId },
      include: { sections: true },
    });

    if (!existingNews) {
      return { error: "News article not found." };
    }

    // Prepare for batch operations on sections
    const sectionsToCreate = sections.filter((section) => !section.id);

    // Get IDs of sections that are in the incoming data
    const incomingSectionIds = new Set(
      sections.map((section) => section.id).filter(Boolean) // Filter out undefined/null for new sections
    );

    // Sections to delete: those in existingNews but not in incomingSectionIds
    const sectionsToDeleteIds = existingNews.sections
      .filter((existingSec) => !incomingSectionIds.has(existingSec.id))
      .map((sec) => sec.id);

    // Sections to update: those in the incoming data that also have an ID (i.e., are existing)
    const sectionsToUpdate = sections.filter((section) => section.id);

    const data = await db.news.update({
      where: { id: newsId },
      data: {
        title,
        category,
        thumbnail,
        type,
        status,
        sections: {
          // Delete sections that are no longer present
          deleteMany: {
            id: {
              in: sectionsToDeleteIds,
            },
          },
          // Update existing sections
          // Ensure that the id is always a string for the 'where' clause
          updateMany: sectionsToUpdate.map((section) => ({
            where: { id: section.id! }, // Use non-null assertion as we filtered for sections with IDs
            data: {
              heading: section.heading,
              content: section.content,
              order: section.order,
              anchorId: section.anchorId,
            },
          })),
          // Create new sections
          create: sectionsToCreate.map((section) => ({
            heading: section.heading,
            content: section.content,
            order: section.order,
            anchorId: section.anchorId,
          })),
        },
      },
      include: { sections: true }, // Include sections in the response if needed
    });

    return { success: "News article updated successfully", data };
  } catch (error) {
    console.error("Error updating news article:", error);
    // More specific error handling could be added here based on Prisma errors
    return { error: "An error occurred while updating the news article." };
  }
};

export const deleteNews = async (newsId: string) => {
  try {
    const existingNews = await db.news.findUnique({
      where: { id: newsId },
    });

    if (!existingNews) {
      return { error: "News article not found." };
    }

    const data = await db.news.delete({
      where: { id: newsId },
    });

    return { success: "News article deleted successfully", data };
  } catch (error) {
    console.error("Error deleting news article:", error);
    return { error: "An error occurred while deleting the news article." };
  }
};
