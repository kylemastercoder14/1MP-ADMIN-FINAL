import {
  Category,
  Product,
  ProductVariant,
  SubCategory,
  Vendor,
  User,
  Order,
  Address,
} from "@prisma/client";

export interface CategoryWithProps extends Category {
  subCategories: SubCategory[];
  vendor: Vendor[];
}

export interface ProductWithProps extends Product {
  variants: ProductVariant[];
  subCategory?: SubCategory;
  vendor: Vendor;
}

export interface SellerWithProps extends Vendor {
  product: Product[];
}

export interface CustomerWithOrder extends User {
  order: Order[];
  address?: Address[];
}
