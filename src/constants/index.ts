import {
  Box,
  BrainCog,
  Clock,
  FileText,
  HelpCircle,
  Mail,
  Scale,
  ShieldUser,
  ShoppingBag,
  Store,
  TriangleAlert,
} from "lucide-react";

export const paymentMethods = [
  {
    name: "Visa",
    src: "https://assets.xendit.co/payment-channels/logos/visa-logo.svg",
  },
  {
    name: "Mastercard",
    src: "https://assets.xendit.co/payment-channels/logos/mastercard-logo.svg",
  },
  {
    name: "JCB",
    src: "https://s.alicdn.com/@img/imgextra/i3/O1CN01tkTNhl1ZaEMHoGWsA_!!6000000003210-2-tps-137-112.png",
  },
  {
    name: "GCash",
    src: "https://assets.xendit.co/payment-channels/logos/gcash-logo.svg",
  },
  {
    name: "GrabPay",
    src: "https://assets.xendit.co/payment-channels/logos/grabpay-logo.svg",
  },
  {
    name: "7 Eleven",
    src: "https://assets.xendit.co/payment-channels/logos/7eleven-logo.svg",
  },
  {
    name: "Cebuana",
    src: "https://assets.xendit.co/payment-channels/logos/cebuana-logo.svg",
  },
  {
    name: "M Lhuillier",
    src: "https://assets.xendit.co/payment-channels/logos/mlhuillier-logo.svg",
  },
  {
    name: "ECPay Loans",
    src: "https://assets.xendit.co/payment-channels/logos/ecpay-logo.svg",
  },
  {
    name: "Palawan Express",
    src: "https://assets.xendit.co/payment-channels/logos/palawan-logo.svg",
  },
  {
    name: "LBC",
    src: "https://assets.xendit.co/payment-channels/logos/lbc-logo.svg",
  },
  {
    name: "ShopeePay",
    src: "https://assets.xendit.co/payment-channels/logos/shopeepay-logo.svg",
  },
  {
    name: "Maya",
    src: "https://assets.xendit.co/payment-channels/logos/paymaya-logo.svg",
  },
  {
    name: "QRPH",
    src: "https://assets.xendit.co/payment-channels/logos/qrph-c567ff0f-ab6d-4662-86bf-24c6c731d8a8-logo.svg",
  },
  {
    name: "RCBC",
    src: "https://assets.xendit.co/payment-channels/logos/rcbc-logo.svg",
  },
  {
    name: "Chinabank",
    src: "https://assets.xendit.co/payment-channels/logos/chinabank-logo.svg",
  },
  {
    name: "Unionbank",
    src: "https://assets.xendit.co/payment-channels/logos/ubp-logo.svg",
  },
  {
    name: "BPI",
    src: "https://assets.xendit.co/payment-channels/logos/bpi-logo.svg",
  },
  {
    name: "BDO",
    src: "https://assets.xendit.co/payment-channels/logos/bdo-logo.svg",
  },
];

export const isAllowedFileType = (file: File): boolean => {
  // List of allowed MIME types
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    "text/csv",
    "application/json",
    "application/xml",
  ];

  // List of disallowed file extensions (images, audio, video)
  const disallowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".mp3",
    ".wav",
    ".ogg",
    ".m4a",
    ".flac",
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
  ];

  // Check MIME type
  if (allowedTypes.includes(file.type)) {
    return true;
  }

  // Check file extension as fallback
  const fileName = file.name.toLowerCase();
  return !disallowedExtensions.some((ext) => fileName.endsWith(ext));
};

export const isVideoFile = (file: File): boolean => {
  const allowedVideoTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo",
  ];

  const allowedExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
  const fileName = file.name.toLowerCase();

  return (
    allowedVideoTypes.includes(file.type) ||
    allowedExtensions.some((ext) => fileName.endsWith(ext))
  );
};

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const MAX_VIDEO_SIZE_MB = 5;
export const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

export const sidebarItems = [
  { id: "general", label: "General", icon: Store },
  { id: "email", label: "Email Configuration", icon: Mail },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
  { id: "officeHours", label: "Office Hours", icon: Clock },
  { id: "refund", label: "Refund Policy", icon: Box },
  { id: "legalNotice", label: "Legal Notice", icon: Scale },
  { id: "productListingPolicy", label: "Product Listing", icon: ShoppingBag },
  {
    id: "intellectualPropertyProtection",
    label: "Intellectual Property",
    icon: BrainCog,
  },
  {
    id: "privacyPolicy",
    label: "Privacy Policy",
    icon: ShieldUser,
  },
  {
    id: "termsOfUse",
    label: "Terms of Use",
    icon: FileText,
  },
  {
    id: "integrityCompliance",
    label: "Integrity Compliance",
    icon: TriangleAlert,
  },
];

export * from "./barangay";
export * from "./region";
export * from "./municipality";
export * from "./province";
