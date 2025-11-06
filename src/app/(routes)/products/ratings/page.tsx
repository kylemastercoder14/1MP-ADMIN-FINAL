import React from "react";
import Heading from "@/components/ui/heading";
import Client from "./_components/client";
import db from "@/lib/db";

const Page = async () => {
  // Fetch products that have reviews (at least one review)
  const products = await db.product.findMany({
    where: {
      productReview: {
        some: {}, // At least one review exists
      },
    },
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
        },
      },
      subCategory: {
        select: {
          id: true,
          name: true,
        },
      },
      productReview: {
        select: {
          id: true,
          rating: true,
        },
      },
    },
    orderBy: {
      averageRating: "desc", // Order by highest rated first
    },
  });

  // Transform the data to match the expected format with rating field
  const productsWithRating = products.map((product) => ({
    ...product,
    rating: product.averageRating || 0, // Use averageRating as rating field
  }));

  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Manage Reviews"
          description="Here you can manage all reviewed products for each sellers."
        />
      </div>
      <Client data={productsWithRating} />
    </div>
  );
};

export default Page;
