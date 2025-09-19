"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  CheckIcon,
  ChevronsUpDown,
  CopyIcon,
  EyeIcon,
  HelpCircle,
} from "lucide-react";
import { CellAction } from "./cell-action";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductWithProps } from "@/types";
import { formatPrice } from "@/lib/utils";

export const columns: ColumnDef<ProductWithProps>[] = [
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
      return (
        <div className="flex items-center group gap-2">
          <div className="relative w-[40px] h-[40px]">
            <Image
              className="w-full h-full rounded-md object-contain"
              fill
              alt={row.original.name}
              src={row.original.images[0]}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="w-[300px] truncate">{row.original.name}</h3>
            </div>
            <div
              title={row.original.id}
              className="text-xs cursor-pointer text-primary gap-2 flex items-center"
            >
              <span className="w-[190px] hover:underline truncate overflow-hidden whitespace-nowrap">
                {row.original.id}
              </span>
              {copied ? (
                <CheckIcon className="size-3 text-green-600" />
              ) : (
                <CopyIcon
                  onClick={() => {
                    navigator.clipboard.writeText(row.original.id);
                    toast.success("Product ID copied to clipboard");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="size-3 text-muted-foreground cursor-pointer"
                />
              )}
            </div>
          </div>
          {/* Eye button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              window.open(`/products/${row.original.slug}`, "_blank")
            }
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <EyeIcon className="size-4 text-primary" />
          </Button>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
    const name = row.original.name.toLowerCase();
    const id = row.original.id.toLowerCase();
    const search = filterValue.toLowerCase();

    return name.includes(search) || id.includes(search);
  },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {row.original.vendor?.name || "Unassigned"}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="size-3 ml-2 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="w-52">
              <p className="text-xs">
                This is the total stock available across all variations of this
                product. If the product has no variations, this is the total
                stock for the product itself.
              </p>
            </TooltipContent>
          </Tooltip>
        </span>
      );
    },
    cell: ({ row }) => {
      let quantity;
      const isThereVariants = row.original.isThereVariants;
      if(isThereVariants && row.original.variants?.length > 0) {
        quantity = row.original.variants.reduce(
          (total, variant) => total + (variant.quantity || 0),
          0
        );
      }else {
        quantity = row.original.stock || 0;
      }
      return <div>{quantity}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "subCategory",
    header: "Category",
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {row.original.subCategory?.name || "Uncategorized"}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Price
          <ChevronsUpDown className="size-4 ml-2" />
        </span>
      );
    },
    cell: ({ row }) => {
      let priceDisplay = "";
      if (row.original.variants?.length > 0) {
        const prices = row.original.variants.map((v) => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        priceDisplay =
          minPrice === maxPrice
            ? `₱${formatPrice(minPrice)}`
            : `₱${formatPrice(minPrice)} - ₱${formatPrice(maxPrice)}`;
      } else if (row.original.price) {
        priceDisplay = `₱${formatPrice(row.original.price)}`;
      }

      return <div className="text-sm">{priceDisplay}</div>;
    },
  },
  {
    accessorKey: "variations",
    header: "Variations",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      const formattedVariations =
        row.original.variants?.length > 0
          ? row.original.variants.map((variant) => ({
              sku: variant.sku ?? "",
              price: `₱${formatPrice(variant.price)}`,
              stock: variant.quantity,
              attributes: Object.entries(variant.attributes || {})
                .map(([key, value]) => `${key}: ${value}`)
                .join(", "),
              image: variant.image || row.original.images[0] || "",
            }))
          : undefined;

      const variationCount = row.original.variants?.length || 0;

      if (!formattedVariations || variationCount === 0) {
        return <span className="text-muted-foreground">None</span>;
      }

      return (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
          >
            <EyeIcon className="size-4 mr-1" />
            {variationCount} variant(s)
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="!max-w-7xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Variations for {row.original.name}</DialogTitle>
              </DialogHeader>

              <div className="mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attributes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formattedVariations.map((variant, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {variant.image ? (
                            <div className="relative w-10 h-10">
                              <Image
                                src={variant.image}
                                alt="Variant"
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded"></div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {variant.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.attributes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {variant.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {variant.stock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    filterFn: (row, columnId, filterValue) => {
      const rowDate = new Date(row.getValue(columnId));
      const [from, to] = filterValue || [];

      if (from && to) {
        return rowDate >= new Date(from) && rowDate <= new Date(to);
      }

      if (from) {
        return rowDate >= new Date(from);
      }

      if (to) {
        return rowDate <= new Date(to);
      }

      return true;
    },
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt);
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
    accessorKey: "adminApprovalStatus",
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
      switch (row.original.adminApprovalStatus) {
        case "Approved":
          return (
            <div className="bg-green-200/30 inline-block text-green-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              Live
            </div>
          );
        case "Pending":
          return (
            <div className="bg-blue-200/30 inline-block text-blue-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              Under Review
            </div>
          );
        case "Rejected":
          return (
            <div className="bg-red-200/30 inline-block text-red-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              Rejected
            </div>
          );
        case "Deactivated":
          return (
            <div className="bg-orange-200/30 inline-block text-orange-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              Deactivated
            </div>
          );
        default:
          return (
            <div className="bg-gray-200/30 inline-block text-gray-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              {row.original.adminApprovalStatus}
            </div>
          );
      }
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <CellAction status={row.original.adminApprovalStatus} id={row.original.id} />,
  },
];
