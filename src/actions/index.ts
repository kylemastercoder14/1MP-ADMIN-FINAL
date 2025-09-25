/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { Policies, Product } from "@prisma/client";
import { extractPathFromUrl, getDateRanges } from "@/lib/utils";
import z from "zod";
import {
  CampaignValidators,
  NewsAnnouncementValidators,
  NewsValidators,
} from "@/validators/admin";
import { ProductStatusHTML } from "@/components/email-template/product-status";
import nodemailer from "nodemailer";
import { SellerStatusHTML } from "@/components/email-template/seller-status";
import {
  AgeDistributionPoint,
  BuyerDistributionPoint,
  BuyerTrendPoint,
  GenderDistributionPoint,
  StatCards,
  StatMetric,
  TopProductPoint,
} from "@/types";
import { cookies } from "next/headers";
import * as jose from "jose";

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

    if (!admin) {
      return {
        success: false,
        message: "Admin not found.",
      };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(admin.id.toString())
      .sign(secret);

    (
      await // Set the cookie with the JWT
      cookies()
    ).set("1MP-Authorization", jwt, {
      httpOnly: true, // Set to true for security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 3, // Cookie expiration (3 days in seconds)
      sameSite: "strict", // Adjust according to your needs
      path: "/", // Adjust path as needed
    });

    return {
      success: true,
      message: "Login successful.",
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

export const signOut = async () => {
  (await cookies()).set("1MP-Authorization", "", { maxAge: 0, path: "/" });
};

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

export const updatePolicy = async (
  fieldName: keyof Policies,
  content: string
) => {
  try {
    const existingPolicy = await db.policies.findFirst();

    if (existingPolicy) {
      await db.policies.update({
        where: { id: existingPolicy.id },
        data: { [fieldName]: content },
      });
    } else {
      await db.policies.create({
        data: { [fieldName]: content },
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error(`Error updating ${fieldName}:`, error);
    return { error: `Failed to update ${fieldName}` };
  }
};

export const createNews = async (values: z.infer<typeof NewsValidators>) => {
  const safeValues = NewsValidators.safeParse(values);

  if (!safeValues.success) {
    return { error: "Please fill all the required fields" };
  }

  const { title, category, thumbnail, type, sections, status } =
    safeValues.data;

  try {
    const data = await db.news.create({
      data: {
        title,
        category,
        thumbnail,
        type,
        status,
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
  } catch (error: any) {
    console.error("Error deleting news article:", error.message || error);
    return {
      error:
        error.message || "An error occurred while deleting the news article.",
    };
  }
};

export const approveProduct = async (id: string) => {
  try {
    const existingProduct = await db.product.findUnique({
      where: { id },
      include: { vendor: true },
    });

    if (!existingProduct) {
      return { error: "Product not found." };
    }

    const data = await db.product.update({
      where: { id },
      data: { adminApprovalStatus: "Approved" },
    });

    await sendStatusProductEmail(
      existingProduct.vendor.name as string,
      existingProduct.vendor.email,
      "Approved",
      existingProduct.images[0],
      existingProduct.name
    );

    return { success: "Product approved successfully", data };
  } catch (error) {
    console.error("Error approving product:", error);
    return { error: "An error occurred while approving the product." };
  }
};

export const rejectProduct = async (id: string) => {
  try {
    const existingProduct = await db.product.findUnique({
      where: { id },
      include: { vendor: true },
    });

    if (!existingProduct) {
      return { error: "Product not found." };
    }

    const data = await db.product.update({
      where: { id },
      data: { adminApprovalStatus: "Rejected" },
    });

    await sendStatusProductEmail(
      existingProduct.vendor.name as string,
      existingProduct.vendor.email,
      "Rejected",
      existingProduct.images[0],
      existingProduct.name
    );

    return { success: "Product rejected successfully", data };
  } catch (error) {
    console.error("Error rejecting product:", error);
    return { error: "An error occurred while rejecting the product." };
  }
};

export const changeProductStatus = async (id: string, status: string) => {
  try {
    const existingProduct = await db.product.findUnique({
      where: { id },
      include: { vendor: true },
    });

    if (!existingProduct) {
      return { error: "Product not found." };
    }

    const data = await db.product.update({
      where: { id },
      data: { adminApprovalStatus: status },
    });

    // Ensure status is one of the allowed values
    const allowedStatuses = [
      "Approved",
      "Rejected",
      "Deactivated",
      "Activated",
    ] as const;
    type AllowedStatus = (typeof allowedStatuses)[number];
    const statusToSend: AllowedStatus = allowedStatuses.includes(
      status as AllowedStatus
    )
      ? (status as AllowedStatus)
      : "Approved"; // fallback or handle error as needed

    await sendStatusProductEmail(
      existingProduct.vendor.name as string,
      existingProduct.vendor.email,
      statusToSend,
      existingProduct.images[0],
      existingProduct.name
    );

    return { success: `Product ${status.toLowerCase()} successfully`, data };
  } catch (error) {
    console.error("Error changing product status:", error);
    return { error: "An error occurred while changing the product status." };
  }
};

export const sendStatusProductEmail = async (
  storeName: string,
  email: string,
  status: "Approved" | "Rejected" | "Deactivated" | "Activated",
  productImage: string,
  productName: string
) => {
  const htmlContent = await ProductStatusHTML({
    status: status as "Approved" | "Rejected" | "Deactivated" | "Activated",
    storeName,
    productImage,
    productName,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "onemarketphilippines2025@gmail.com",
      pass: "vrbscailgpflucvn",
    },
  });

  const message = {
    from: "onemarketphilippines2025@gmail.com",
    to: email,
    subject: `Your product has been ${status}`,
    text: `Your product has been ${status}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);

    return { success: "Email has been sent." };
  } catch (error) {
    console.error("Error sending notification", error);
    return { message: "An error occurred. Please try again." };
  }
};

export const changeSellerStatus = async (
  id: string,
  status: string,
  reason: string
) => {
  try {
    const existingVendor = await db.vendor.findUnique({
      where: { id },
    });

    if (!existingVendor) {
      return { error: "Vendor not found." };
    }

    const data = await db.vendor.update({
      where: { id },
      data: { adminApproval: status },
    });

    // Ensure status is one of the allowed values
    const allowedStatuses = ["Approved", "Rejected"] as const;
    type AllowedStatus = (typeof allowedStatuses)[number];
    const statusToSend: AllowedStatus = allowedStatuses.includes(
      status as AllowedStatus
    )
      ? (status as AllowedStatus)
      : "Approved"; // fallback or handle error as needed

    await sendVerificationReasonEmail(
      existingVendor.id as string,
      existingVendor.name as string,
      existingVendor.email,
      reason,
      statusToSend
    );

    return { success: `Vendor ${status.toLowerCase()} successfully`, data };
  } catch (error) {
    console.error("Error changing vendor status:", error);
    return { error: "An error occurred while changing the vendor status." };
  }
};

export const sendVerificationReasonEmail = async (
  sellerId: string,
  storeName: string,
  email: string,
  reason: string,
  status: "Approved" | "Rejected"
) => {
  const htmlContent = await SellerStatusHTML({
    sellerId,
    storeName,
    status: status as "Approved" | "Rejected",
    reason,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "onemarketphilippines2025@gmail.com",
      pass: "vrbscailgpflucvn",
    },
  });

  const message = {
    from: "onemarketphilippines2025@gmail.com",
    to: email,
    subject: `Your application has been ${status} | 1 Market Philippines`,
    text: `Your application has been ${status} | 1 Market Philippines`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);

    return { success: "Email has been sent." };
  } catch (error) {
    console.error("Error sending notification", error);
    return { message: "An error occurred. Please try again." };
  }
};

export const deleteSeller = async (id: string) => {
  try {
    const response = await db.vendor.delete({
      where: { id },
    });

    return { success: "Vendor deleted successfully", data: response };
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return { error: "An error occurred while deleting the vendor." };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await db.product.delete({
      where: { id },
    });

    return { success: "Product deleted successfully", data: response };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "An error occurred while deleting the product." };
  }
};

export const changeCustomerStatus = async (id: string, isActive: boolean) => {
  try {
    const response = await db.user.update({
      where: { id },
      data: { isActive },
    });

    return {
      success: `Customer ${isActive ? "activated" : "deactivated"} successfully`,
      data: response,
    };
  } catch (error) {
    console.error("Error changing customer status:", error);
    return { error: "An error occurred while changing the customer status." };
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    const response = await db.user.delete({
      where: { id },
    });

    return { success: "Customer deleted successfully", data: response };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { error: "An error occurred while deleting the customer." };
  }
};

export const createCampaign = async (
  values: z.infer<typeof CampaignValidators>
) => {
  const safeValues = CampaignValidators.safeParse(values);

  if (!safeValues.success) {
    return { error: "Please fill all the required fields" };
  }

  const {
    title,
    details,
    criteria,
    type,
    value,
    campaignStartDate,
    campaignEndDate,
    registrationStartDate,
    registrationEndDate,
    images,
    banner,
  } = safeValues.data;

  try {
    const existingCampaign = await db.campaign.findFirst({
      where: { title },
    });

    if (existingCampaign) {
      return { error: "A campaign with this title already exists." };
    }

    const campaign = await db.campaign.create({
      data: {
        title,
        details,
        criteria,
        type,
        value,
        campaignStartDate,
        campaignEndDate,
        registrationStartDate,
        registrationEndDate,
        images,
        banner,
      },
    });

    return { success: "Campaign created successfully", data: campaign };
  } catch (error) {
    console.error("Error creating campaign:", error);
    return { error: "An error occurred while creating the campaign." };
  }
};

export const updateCampaign = async (
  id: string,
  values: z.infer<typeof CampaignValidators>
) => {
  const safeValues = CampaignValidators.safeParse(values);

  if (!safeValues.success) {
    return { error: "Please fill all the required fields" };
  }

  const {
    title,
    details,
    criteria,
    type,
    value,
    campaignStartDate,
    campaignEndDate,
    registrationStartDate,
    registrationEndDate,
    images,
    banner,
  } = safeValues.data;

  try {
    const existingCampaign = await db.campaign.findFirst({
      where: { title },
    });

    if (existingCampaign && existingCampaign.id !== id) {
      return { error: "A campaign with this title already exists." };
    }

    const campaign = await db.campaign.update({
      where: { id },
      data: {
        title,
        details,
        criteria,
        type,
        value,
        campaignStartDate,
        campaignEndDate,
        registrationStartDate,
        registrationEndDate,
        images,
        banner,
      },
    });

    return { success: "Campaign updated successfully", data: campaign };
  } catch (error) {
    console.error("Error updating campaign:", error);
    return { error: "An error occurred while updating the campaign." };
  }
};

export const getVendorAnalytics = async (
  vendorId: string,
  range: string
): Promise<StatCards> => {
  const { start, prevStart, prevEnd } = getDateRanges(range);

  // Current period orders
  const currentOrders = await db.orderItem.findMany({
    where: {
      vendorId,
      createdAt: { gte: start },
    },
    include: { order: true },
  });

  // Previous period orders
  const prevOrders = await db.orderItem.findMany({
    where: {
      vendorId,
      createdAt: { gte: prevStart, lt: prevEnd },
    },
    include: { order: true },
  });

  // Helpers
  const calcSales = (orders: typeof currentOrders) =>
    orders.reduce((acc, o) => acc + o.price * o.quantity, 0);

  // Buyers
  const buyersInRange = Array.from(
    new Set(currentOrders.map((o) => o.order.userId))
  );
  const prevBuyers = Array.from(new Set(prevOrders.map((o) => o.order.userId)));

  // First-time buyers
  const newBuyers = await Promise.all(
    buyersInRange.map(async (userId) => {
      const firstOrder = await db.order.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });
      return firstOrder && firstOrder.createdAt >= start ? userId : null;
    })
  );
  const newBuyerCount = newBuyers.filter(Boolean).length;

  const repeatBuyerCount = buyersInRange.length - newBuyerCount;

  // Previous period new/repeat
  const prevNewBuyers = await Promise.all(
    prevBuyers.map(async (userId) => {
      const firstOrder = await db.order.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });
      return firstOrder &&
        firstOrder.createdAt >= prevStart &&
        firstOrder.createdAt < prevEnd
        ? userId
        : null;
    })
  );
  const prevNewBuyerCount = prevNewBuyers.filter(Boolean).length;
  const prevRepeatBuyerCount = prevBuyers.length - prevNewBuyerCount;

  // Followers
  const newFollowers = await db.followStore.count({
    where: { vendorId, createdAt: { gte: start } },
  });
  const prevNewFollowers = await db.followStore.count({
    where: { vendorId, createdAt: { gte: prevStart, lt: prevEnd } },
  });

  const activeFollowers = new Set(currentOrders.map((o) => o.order.userId))
    .size;
  const prevActiveFollowers = new Set(prevOrders.map((o) => o.order.userId))
    .size;

  // ---- Builders ----
  const buildMetric = (
    currentCount: number,
    prevCount: number,
    total: number,
    currentSales: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    prevSales: number
  ): StatMetric => {
    const percentage =
      prevCount === 0
        ? currentCount > 0
          ? 100
          : 0
        : ((currentCount - prevCount) / prevCount) * 100;
    const trend = percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral";
    const proportion = total > 0 ? (currentCount / total) * 100 : 0;
    return {
      count: currentCount,
      trend,
      percentage: Number(percentage.toFixed(2)),
      proportion: Number(proportion.toFixed(2)),
      sales: currentSales,
    };
  };

  const totalBuyers = buyersInRange.length || 1; // avoid /0
  const totalFollowers = newFollowers + activeFollowers || 1;

  return {
    newBuyer: buildMetric(
      newBuyerCount,
      prevNewBuyerCount,
      totalBuyers,
      calcSales(currentOrders),
      calcSales(prevOrders)
    ),
    repeatBuyer: buildMetric(
      repeatBuyerCount,
      prevRepeatBuyerCount,
      totalBuyers,
      calcSales(currentOrders),
      calcSales(prevOrders)
    ),
    newFollowers: buildMetric(
      newFollowers,
      prevNewFollowers,
      totalFollowers,
      0,
      0
    ),
    activeFollowers: buildMetric(
      activeFollowers,
      prevActiveFollowers,
      totalFollowers,
      calcSales(currentOrders),
      calcSales(prevOrders)
    ),
  };
};

export const getBuyerTrendData = async (
  vendorId: string,
  range: "last7days" | "last28days" | "last3months"
): Promise<BuyerTrendPoint[]> => {
  const { start } = getDateRanges(range); // we only need start
  const now = new Date();

  // Fetch orders in range
  const orders = await db.order.findMany({
    where: {
      orderItem: {
        some: {
          vendorId,
        },
      },
      createdAt: { gte: start, lte: now },
    },
    include: { orderItem: true },
    orderBy: { createdAt: "asc" },
  });

  // Fetch followers in range
  const followers = await db.followStore.findMany({
    where: {
      vendorId,
      createdAt: { gte: start, lte: now },
    },
  });

  // Group data per day
  const trendMap: Record<string, BuyerTrendPoint> = {};

  for (const order of orders) {
    const dateKey = order.createdAt.toISOString().split("T")[0];
    if (!trendMap[dateKey]) {
      trendMap[dateKey] = {
        date: dateKey,
        newBuyers: 0,
        repeatBuyers: 0,
        followers: 0,
      };
    }

    // New or repeat buyer check
    const firstOrder = await db.order.findFirst({
      where: { userId: order.userId },
      orderBy: { createdAt: "asc" },
    });

    if (firstOrder && firstOrder.id === order.id) {
      trendMap[dateKey].newBuyers += 1;
    } else {
      trendMap[dateKey].repeatBuyers += 1;
    }
  }

  for (const f of followers) {
    const dateKey = f.createdAt.toISOString().split("T")[0];
    if (!trendMap[dateKey]) {
      trendMap[dateKey] = {
        date: dateKey,
        newBuyers: 0,
        repeatBuyers: 0,
        followers: 0,
      };
    }
    trendMap[dateKey].followers += 1;
  }

  return Object.values(trendMap).sort((a, b) => a.date.localeCompare(b.date));
};

export const getAgeDistribution = async (
  vendorId: string,
  range: "last7days" | "last28days" | "last3months"
): Promise<AgeDistributionPoint[]> => {
  const { start } = getDateRanges(range);
  const now = new Date();

  // Fetch unique buyers for this vendor within the date range
  const buyers = await db.order.findMany({
    where: {
      orderItem: { some: { vendorId } },
      createdAt: { gte: start, lte: now },
    },
    select: {
      user: { select: { dateOfBirth: true } },
    },
  });

  // Count age groups
  const groups: Record<string, number> = {
    "15-": 0,
    "15-17": 0,
    "18-24": 0,
    "25-34": 0,
    "35+": 0,
    Unknown: 0,
  };

  const today = new Date();

  for (const b of buyers) {
    const dobStr = b.user?.dateOfBirth;
    if (!dobStr) {
      groups.Unknown++;
      continue;
    }

    const dob = new Date(dobStr);
    if (isNaN(dob.getTime())) {
      groups.Unknown++;
      continue;
    }

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 15) {
      groups["15-"]++;
    } else if (age >= 15 && age <= 17) {
      groups["15-17"]++;
    } else if (age >= 18 && age <= 24) {
      groups["18-24"]++;
    } else if (age >= 25 && age <= 34) {
      groups["25-34"]++;
    } else if (age >= 35) {
      groups["35+"]++;
    } else {
      groups.Unknown++;
    }
  }

  const total = Object.values(groups).reduce((a, b) => a + b, 0) || 1;

  return Object.entries(groups).map(([ageGroup, count]) => ({
    ageGroup,
    percentage: (count / total) * 100,
  }));
};

export const getGenderDistribution = async (
  vendorId: string,
  range: "last7days" | "last28days" | "last3months"
): Promise<GenderDistributionPoint[]> => {
  const { start } = getDateRanges(range);
  const now = new Date();

  // Fetch unique buyers for this vendor within the date range
  const buyers = await db.order.findMany({
    where: {
      orderItem: { some: { vendorId } },
      createdAt: { gte: start, lte: now },
    },
    select: {
      user: { select: { gender: true } },
    },
  });

  // Count gender groups
  const groups: Record<string, number> = {
    Male: 0,
    Female: 0,
    Unknown: 0,
  };

  for (const b of buyers) {
    const gender = b.user?.gender;
    if (!gender) {
      groups.Unknown++;
      continue;
    }

    if (gender === "Male") {
      groups.Male++;
    } else if (gender === "Female") {
      groups.Female++;
    } else {
      groups.Other++;
    }
  }

  const total = Object.values(groups).reduce((a, b) => a + b, 0) || 1;

  return Object.entries(groups).map(([gender, count]) => ({
    gender,
    percentage: (count / total) * 100,
  }));
};

export const getWhetherToBuyDistribution = async (
  vendorId: string,
  range: "last7days" | "last28days" | "last3months"
): Promise<BuyerDistributionPoint[]> => {
  const { start } = getDateRanges(range);
  const now = new Date();

  // Step 1: Get all followers of this vendor
  const followers = await db.followStore.findMany({
    where: { vendorId },
    select: { userId: true },
  });
  const followerIds = followers.map((f) => f.userId);

  if (followerIds.length === 0) {
    return [
      { followers: "New Buyers", percentage: 0 },
      { followers: "Repeat Buyers", percentage: 0 },
      { followers: "No Buyers", percentage: 100 },
    ];
  }

  // Step 2: Find all orders from these followers within the range
  const orders = await db.order.findMany({
    where: {
      userId: { in: followerIds },
      orderItem: { some: { vendorId } },
      createdAt: { gte: start, lte: now },
    },
    select: { userId: true },
  });

  // Step 3: Count how many times each follower bought
  const buyerMap: Record<string, number> = {};
  for (const o of orders) {
    buyerMap[o.userId] = (buyerMap[o.userId] || 0) + 1;
  }

  let newBuyers = 0;
  let repeatBuyers = 0;
  let noBuyers = 0;

  for (const uid of followerIds) {
    const count = buyerMap[uid] || 0;
    if (count === 0) {
      noBuyers++;
    } else if (count === 1) {
      newBuyers++;
    } else {
      repeatBuyers++;
    }
  }

  const total = followerIds.length || 1;

  return [
    { followers: "New Buyers", percentage: (newBuyers / total) * 100 },
    { followers: "Repeat Buyers", percentage: (repeatBuyers / total) * 100 },
    { followers: "No Buyers", percentage: (noBuyers / total) * 100 },
  ];
};

export const getTopProducts = async (
  vendorId: string,
  range: "last7days" | "last28days" | "last3months"
): Promise<TopProductPoint[]> => {
  const { start } = getDateRanges(range);
  const now = new Date();

  const products = await db.product.findMany({
    where: { vendorId, createdAt: { gte: start, lte: now } },
    orderBy: { soldCount: "desc" },
    take: 10,
    select: { name: true, soldCount: true, images: true },
  });

  return products.map((p) => ({
    top: p.name,
    count: p.soldCount,
    image: p.images[0],
  }));
};

export const deleteCategory = async (id: string) => {
  try {
    await db.category.delete({
      where: { id },
    });

    return { success: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "An error occurred while deleting the category." };
  }
};

export const deleteCampaign = async (id: string) => {
  try {
    await db.campaign.delete({
      where: { id },
    });

    return { success: "Campaign deleted successfully" };
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return { error: "An error occurred while deleting the campaign." };
  }
};
