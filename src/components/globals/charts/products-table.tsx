"use client";

import { IconStarFilled, IconStarHalfFilled, IconStar } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";

interface TopProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  averageRating: number;
  reviewCount: number;
}

interface TopProductsTableProps {
  products: TopProduct[];
}

const TopProductsTable = ({ products }: TopProductsTableProps) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <IconStarFilled key={`full-${i}`} className="size-4 text-yellow-500" />
        ))}
        {hasHalfStar && (
          <IconStarHalfFilled className="size-4 text-yellow-500" />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <IconStar key={`empty-${i}`} className="size-4 text-yellow-500 fill-yellow-500/20" />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h3 className="leading-none font-semibold mb-5">Top Reviewed Products</h3>
      <div className="space-y-[18px]">
        {products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No products found
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative size-12 rounded-sm overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="rounded-sm object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No Image</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-base line-clamp-1 truncate max-w-[300px]">{product.name}</h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    ₱{Number(product.price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div>
                {renderStars(product.averageRating)}
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  {product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopProductsTable;
