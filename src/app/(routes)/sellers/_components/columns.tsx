"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon, ChevronsUpDown, CopyIcon, EyeIcon } from "lucide-react";
import { CellAction } from "./cell-action";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SellerWithProps } from "@/types";

export const columns: ColumnDef<SellerWithProps>[] = [
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
    accessorKey: "vendor",
    header: "Seller",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false);
      return (
        <div className="flex items-center group gap-2">
          <Avatar>
            <AvatarImage
              src={row.original.image || ""}
              className="object-cover"
            />
            <AvatarFallback>{row.original.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-[200px] truncate flex items-center gap-1">
                {row.original.name}{" "}
                <p
                  className={`${
                    row.original.isPremium
                      ? "bg-green-200/30 text-green-600"
                      : "bg-zinc-200/30 text-zinc-600"
                  } inline-block text-[10px] py-0.5 font-semibold rounded-sm px-1.5`}
                >
                  {row.original.isPremium === true ? "Premium" : "Basic"}
                </p>
              </div>
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
    accessorKey: "businessType",
    header: "Business Type",
    cell: ({ row }) => {
      const owner =
        `${row.original.givenName || ""} ${
          row.original.familyName || ""
        }`.trim() || "Unknown";
      return (
        <div>
          <p>{row.original.type}</p>
          <div>
            <span className="text-sm text-muted-foreground">
              Owner: {owner}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "productsCount",
    header: "Products",
    cell: ({ row }) => {
      return <div>{row.original.product.length || 0} item(s)</div>;
    },
  },
  {
    accessorKey: "subCategory",
    header: "Category",
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          {row.original.categorySlug?.replace(/-/g, " ") || "Uncategorized"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Joined",
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
    accessorKey: "adminApproval",
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
      switch (row.original.adminApproval) {
        case "Approved":
          return (
            <div className="bg-green-200/30 inline-block text-green-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              Approved
            </div>
          );
        case "Under Review":
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
        case "Pending":
          return (
            <div className="bg-orange-200/30 inline-block text-orange-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              Pending
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
    cell: ({ row }) => <CellAction id={row.original.id} />,
  },
];
