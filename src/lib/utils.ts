import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
