"use server";

import db from "@/lib/db";

// Get vendor reviews
export const getVendorReviews = async (vendorId: string) => {
  try {
    const reviews = await db.vendorReview.findMany({
      where: {
        vendorId: vendorId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { reviews };
  } catch (error) {
    console.error("Error getting vendor reviews:", error);
    return { error: "Failed to get vendor reviews" };
  }
};


