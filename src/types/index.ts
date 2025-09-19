import {
  Category,
  Product,
  ProductVariant as PrismaProductVariant,
  Specification as PrismaSpecification,
  SubCategory,
  Vendor,
  User,
  Order,
  Address,
  News,
  NewsSection,
  FollowStore,
  Like,
  OrderItem,
  Campaign,
  Ticket,
  Coupon,
  VendorPolicies,
  VendorFaqs,
  NewArrivalDiscount,
  ProductDiscount,
  Specification,
  NutritionalFact,
  PromoCode,
} from "@prisma/client";

export interface CategoryWithProps extends Category {
  subCategories: SubCategory[];
  vendor: Vendor[];
}

export interface VendorWithPromotions extends Vendor {
  promoCode?: PromoCode[];
  coupon?: Coupon[];
  followStore?: FollowStore[];
}
export interface ProductWithProps extends Product {
  vendor: VendorWithPromotions;
  specifications: Specification[];
  variants: ProductVariant[];
  newArrivalDiscount?: NewArrivalDiscount | null;
  productDiscount?: ProductDiscount | null;
  category: Category | null;
  subCategory: SubCategory | null;
  nutritionalFacts?: NutritionalFact[];
}

export interface SellerWithProps extends Vendor {
  product: ProductWithProps[];
  orderItem?: OrderItem[] | null;
  coupon?: Coupon[] | null;
  vendorPolicies?: VendorPolicies[] | null;
  vendorFaqs?: VendorFaqs[] | null;
}

export interface CustomerWithOrder extends User {
  order: Order[];
  address?: Address[];
}

export interface NewsWithSections extends News {
  sections: NewsSection[];
}

export interface FollowStoreProps extends FollowStore {
  vendor: Vendor;
}

export interface LikeProps extends Like {
  product: Product;
}

export interface OrderItemWithProps extends OrderItem {
  product: Product;
}

export interface OrderWithProps extends Order {
  orderItem: OrderItemWithProps[];
}

export interface CustomerWithProps extends User {
  order?: OrderWithProps[];
  address?: Address[];
  followStore?: FollowStoreProps[];
  like?: LikeProps[];
}

export interface CampaignProps extends Campaign {
  products: ProductWithProps[];
  vendors: Vendor[];
}

export interface TicketWithProps extends Ticket {
  user?: User | null;
  vendor?: Vendor | null;
}

export type StatMetric = {
  count: number;
  trend: "up" | "down" | "neutral";
  percentage: number; // % change vs previous period
  proportion: number; // % share in total
  sales: number; // total ₱ sales
};

export type StatCards = {
  newBuyer: StatMetric;
  repeatBuyer: StatMetric;
  newFollowers: StatMetric;
  activeFollowers: StatMetric;
};

export type BuyerTrendPoint = {
  date: string;
  newBuyers: number;
  repeatBuyers: number;
  followers: number;
};

export type AgeDistributionPoint = {
  ageGroup: string;
  percentage: number;
};

export type GenderDistributionPoint = {
  gender: string;
  percentage: number;
};

export type BuyerDistributionPoint = {
  followers: "New Buyers" | "Repeat Buyers" | "No Buyers";
  percentage: number;
};

export type TopProductPoint = {
  top: string;
  count: number;
  image: string;
};

export type ChatPerformanceData = {
  chatPerformance: string;
  performancePercentage: number;
};

export interface DiscountInfo {
  type: string;
  value: number;
  text?: string;
  discountType: string;
}

export type VariantAttributes = Record<string, string> | null;

// Extend the Prisma ProductVariant with proper attributes typing
export interface ProductVariant
  extends Omit<PrismaProductVariant, "attributes"> {
  attributes: VariantAttributes;
}

// Type for specifications
export interface ProductSpecification
  extends Omit<PrismaSpecification, "values"> {
  values: string[];
}

export interface ProductVariantsProps {
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  onVariantSelect?: (variant: ProductVariant | null) => void;
  selectedVariantId?: string | null;
  sizeGuide?: string | null;
}
