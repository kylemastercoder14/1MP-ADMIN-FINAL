import { clsx, type ClassValue } from "clsx";
import { subDays, subMonths } from "date-fns";
import { twMerge } from "tailwind-merge";
import { DiscountInfo, ProductWithProps } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(
      /\/storage\/v1\/object\/public\/[^\/]+\/(.+)/
    );
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const ensureBlob = async (file: File | Blob): Promise<Blob> => {
  // If it's already a Blob, return it directly
  if (file instanceof Blob) {
    return file;
  }

  // Convert File to Blob
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const blob = new Blob([reader.result as ArrayBuffer], {
        type: (file as File).type,
      });
      resolve(blob);
    };
    reader.readAsArrayBuffer(file);
  });
};

export function getDateRanges(range: string) {
  const now = new Date();

  switch (range) {
    case "last7days": {
      const start = subDays(now, 7);
      const prevStart = subDays(start, 7);
      return { start, prevStart, prevEnd: start };
    }
    case "last28days": {
      const start = subDays(now, 28);
      const prevStart = subDays(start, 28);
      return { start, prevStart, prevEnd: start };
    }
    case "last3months": {
      const start = subMonths(now, 3);
      const prevStart = subMonths(start, 3);
      return { start, prevStart, prevEnd: start };
    }
    default: {
      const start = subDays(now, 7);
      const prevStart = subDays(start, 7);
      return { start, prevStart, prevEnd: start };
    }
  }
}

export const calculateDiscountPrice = (
  originalPrice: number,
  discounts: DiscountInfo[]
) => {
  let finalPrice = originalPrice;
  let totalPercentageDiscount = 0;
  let totalFixedDiscount = 0;

  discounts.forEach((discount) => {
    if (discount.discountType === "Percentage Off") {
      totalPercentageDiscount += discount.value;
    } else if (discount.discountType === "Fixed Price") {
      totalFixedDiscount += discount.value;
    }
  });

  // Apply percentage discount first
  if (totalPercentageDiscount > 0) {
    finalPrice = finalPrice * (1 - totalPercentageDiscount / 100);
  }

  // Then apply fixed discount
  if (totalFixedDiscount > 0) {
    finalPrice = Math.max(0, finalPrice - totalFixedDiscount);
  }

  return finalPrice;
};

export const getDiscountInfo = (product: ProductWithProps) => {
  const discounts: DiscountInfo[] = [];
  // Check new arrival discount
  if (
    product.newArrivalDiscount &&
    product.newArrivalDiscount.status === "Ongoing"
  ) {
    discounts.push({
      type: "new-arrival",
      value: product.newArrivalDiscount.value,
      text: product.newArrivalDiscount.discount,
      discountType: product.newArrivalDiscount.type, // 'percentage' or 'fixed'
    });
  }

  // Check product discount
  if (product.productDiscount && product.productDiscount.status === "Ongoing") {
    discounts.push({
      type: "product",
      value: product.productDiscount.value,
      text: product.productDiscount.discount,
      discountType: product.productDiscount.type, // 'percentage' or 'fixed'
    });
  }

  return discounts;
};

export const formatText = (text: string | undefined | null): string => {
  if (!text) return "";

  return text
    .replace(/-/g, " ") // Replace all hyphens with spaces
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function formatDiscountDateRange(
  startDate: string,
  endDate: string
): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }

    // Check if dates are in the same month
    if (
      start.getMonth() !== end.getMonth() ||
      start.getFullYear() !== end.getFullYear()
    ) {
      // If different months, show full date range
      return `${start.toLocaleString("default", { month: "long" })} ${start.getDate()} - ${end.toLocaleString("default", { month: "long" })} ${end.getDate()}`;
    }

    // Same month - format as "MONTH DD-DD"
    return `${start.toLocaleString("default", { month: "long" }).toUpperCase()} ${start.getDate()}-${end.getDate()}`;
  } catch (error) {
    console.error("Error formatting date range:", error);
    return "Discount Period";
  }
}

export function formatTimeRange(range: string) {
  switch (range) {
    case "last7days":
      return "last 7 days";
    case "last28days":
      return "last 28 days";
    case "last3months":
      return "last 3 months";
    default:
      return range;
  }
}

export function formatToPeso(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}
