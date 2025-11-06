"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon, ChevronsUpDown, CopyIcon } from "lucide-react";
import { CellAction } from "./campaign-products-cell-action";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductVariant } from "@prisma/client";

type CampaignProductWithRelations = {
  id: string;
  campaignPrice: number | null;
  discountPercentage: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  campaign: {
    id: string;
    title: string;
    campaignStartDate: Date;
    campaignEndDate: Date;
  };
  product: {
    id: string;
    name: string;
    images: string[];
    price: number | null; // ✅ allow null
    vendor: {
      id: string;
      name: string | null;
      email: string;
    };
    category: {
      id: string;
      name: string;
    } | null;
    subCategory: {
      id: string;
      name: string;
    } | null;
    variants: Array<{
      id: string;
      price: number;
      quantity: number;
      sku: string | null;
      image: string | null;
      attributes: unknown;
    }>;
  };
  variantStocks: Array<{
    id: string;
    campaignStock: number;
    soldCount: number;
    productVariant: ProductVariant | null;
  }>;
};

export const columns: ColumnDef<CampaignProductWithRelations>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center w-8 h-8">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center w-8 h-8">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false);
      const product = row.original.product;
      return (
        <div className="flex items-center gap-3">
          {product.images && product.images.length > 0 && (
            <div className="relative h-12 w-12 rounded-md overflow-hidden border flex-shrink-0">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{product.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="truncate">ID: {product.id}</span>
              {copied ? (
                <CheckIcon className="size-3 text-green-600" />
              ) : (
                <CopyIcon
                  onClick={() => {
                    navigator.clipboard.writeText(product.id);
                    toast.success("Product ID copied to clipboard");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="size-3 text-muted-foreground cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const product = row.original.product;
      const search = String(filterValue || "").toLowerCase();
      const name = (product.name || "").toLowerCase();
      const id = product.id.toLowerCase();
      return name.includes(search) || id.includes(search);
    },
    enableSorting: false,
  },
  {
    accessorKey: "campaign",
    header: "Campaign",
    cell: ({ row }) => {
      const campaign = row.original.campaign;
      return (
        <div>
          <div className="font-medium">{campaign.title}</div>
          <div className="text-xs text-muted-foreground">ID: {campaign.id}</div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => {
      const vendor = row.original.product.vendor;
      return (
        <div>
          <div className="font-medium">{vendor.name || "N/A"}</div>
          <div className="text-xs text-muted-foreground">{vendor.email}</div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "pricing",
    header: "Pricing",
    cell: ({ row }) => {
      const original = row.original;
      const regularPrice = original.product.price;
      const campaignPrice = original.campaignPrice || regularPrice;
      const discount = original.discountPercentage || 0;

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Regular:</span>
            <span className="font-medium">₱{regularPrice?.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Campaign:</span>
            <span className="font-medium text-[#800020]">
              ₱{campaignPrice?.toFixed(2)}
            </span>
          </div>
          {discount > 0 && (
            <div className="text-xs text-green-600 font-medium">
              {discount.toFixed(1)}% OFF
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "variantStocks",
    header: "Variant Stocks",
    cell: ({ row }) => {
      const variantStocks = row.original.variantStocks;
      const product = row.original.product;

      if (variantStocks.length === 0 && product.variants.length === 0) {
        return <div className="text-sm text-muted-foreground">No variants</div>;
      }

      if (variantStocks.length === 0) {
        return (
          <div className="text-sm text-orange-600 font-medium">
            No stock allocated
          </div>
        );
      }

      return (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="variants" className="border-none">
            <AccordionTrigger className="py-1 text-sm">
              View {variantStocks.length} variant
              {variantStocks.length > 1 ? "s" : ""}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {variantStocks.map((vs) => {
                  const variant = vs.productVariant;
                  if (!variant) return null;

                  const attributes =
                    typeof variant.attributes === "string"
                      ? JSON.parse(variant.attributes)
                      : variant.attributes || {};

                  const variantName =
                    Object.values(attributes)
                      .map((val) => String(val))
                      .join(" / ") || "Default";

                  return (
                    <div
                      key={vs.id}
                      className="border rounded-md p-2 text-xs space-y-1"
                    >
                      <div className="font-medium truncate">{variantName}</div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">
                          Campaign Stock:
                        </span>
                        <span className="font-medium">{vs.campaignStock}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Sold:</span>
                        <span className="font-medium">{vs.soldCount}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">
                          Available:
                        </span>
                        <span className="font-medium text-green-600">
                          {vs.campaignStock - vs.soldCount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">
                          Regular Stock:
                        </span>
                        <span className="font-medium">{variant.quantity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Status
          <ChevronsUpDown className="size-4 ml-2" />
        </span>
      );
    },
    cell: ({ row }) => {
      switch (row.original.status) {
        case "Approved":
          return (
            <div className="bg-green-200/30 inline-block text-green-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              Approved
            </div>
          );
        case "Rejected":
          return (
            <div className="bg-red-200/30 inline-block text-red-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              Rejected
            </div>
          );
        case "Pending":
          return (
            <div className="bg-orange-200/30 inline-block text-orange-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              Pending
            </div>
          );
        default:
          return (
            <div className="bg-gray-200/30 inline-block text-gray-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              {row.original.status}
            </div>
          );
      }
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Submitted
          <ChevronsUpDown className="size-4 ml-2" />
        </span>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      const formattedDate = date.toLocaleDateString("en-GB");
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return (
        <div>
          {formattedDate}
          <br />
          {formattedTime}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <CellAction status={row.original.status} id={row.original.id} />
    ),
  },
];
