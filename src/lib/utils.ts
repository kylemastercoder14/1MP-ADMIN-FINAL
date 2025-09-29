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

type OfficeHour = {
  day: string;
  timeStart: string | null;
  timeEnd: string | null;
  isOpen: boolean;
};

export const parseTimeToMinutes = (time?: string | null): number | null => {
  if (!time) return null;
  const t = time.trim().toLowerCase();

  // Accept forms like:
  // "08:00", "8:00", "08:00:00", "08:00:00 am", "8:00 am", "08:00am", "8:00pm"
  const m = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?$/);
  if (!m) return null;

  let hour = Number(m[1]);
  const minute = Number(m[2]);
  const ampm = m[3];

  if (ampm) {
    if (ampm === "pm" && hour !== 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
  }

  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
};

// normalize various inputs into canonical "HH:mm" (24h) used for inputs & comparisons
export const normalizeToHHMM = (time?: string | null): string => {
  const mins = parseTimeToMinutes(time);
  if (mins === null) return "";
  const hh = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const mm = (mins % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

// formatted display "h:mm AM/PM"
export const formatTimeDisplay = (time?: string | null): string => {
  const mins = parseTimeToMinutes(time);
  if (mins === null) return "--:--";
  let hour = Math.floor(mins / 60);
  const minute = mins % 60;
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

// group consecutive days (Mon->Sun order), using normalized comparison.
// Accepts OfficeHour[] (times may be null/empty) and returns grouped string.
export const formatWorkingHours = (hours: OfficeHour[]) => {
  if (!hours || hours.length === 0) return "";

  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // ensure Mon->Sun order
  const sorted = [...hours].sort(
    (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  );

  const result: string[] = [];
  let startDay = sorted[0].day;
  let prev = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    const current = sorted[i];

    const prevStart = normalizeToHHMM(prev.timeStart);
    const prevEnd = normalizeToHHMM(prev.timeEnd);
    const currStart = current ? normalizeToHHMM(current.timeStart) : null;
    const currEnd = current ? normalizeToHHMM(current.timeEnd) : null;

    const sameSchedule =
      current &&
      prev.isOpen === current.isOpen &&
      (!prev.isOpen || (prevStart === currStart && prevEnd === currEnd));

    if (sameSchedule) {
      // continue grouping
      continue;
    }

    // finalize prev group
    if (prev.isOpen) {
      const dispStart = formatTimeDisplay(prevStart || prev.timeStart);
      const dispEnd = formatTimeDisplay(prevEnd || prev.timeEnd);

      if (startDay === prev.day) {
        result.push(`${prev.day} (${dispStart} - ${dispEnd})`);
      } else {
        result.push(`${startDay} - ${prev.day} (${dispStart} - ${dispEnd})`);
      }
    } else {
      if (startDay === prev.day) {
        result.push(`${prev.day} (Closed)`);
      } else {
        result.push(`${startDay} - ${prev.day} (Closed)`);
      }
    }

    // start new group from current
    if (current) {
      startDay = current.day;
      prev = current;
    }
  }

  return result.join(", ");
};
