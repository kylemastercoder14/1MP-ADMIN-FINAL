"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { CategoryWithProps } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

export const columns: ColumnDef<CategoryWithProps>[] = [
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
    cell: ({ row }) => (
      <div className="flex items-center justify-center w-8 h-8">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <div className="relative size-10">
            <Image
              src={row.original.image || ""}
              alt="Category Image"
              fill
              className="rounded-md object-cover size-full"
            />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.slug}
            </div>
          </div>
        </div>
      );
    },
    filterFn: (row, _, filterValue) => {
      // Handle cases where filterValue isn't a string
      const searchText = String(filterValue || "").toLowerCase();

      const category = row.original;
      const searchFields = [
        String(category.id || "").toLowerCase(),
        String(category.name || "").toLowerCase(),
        String(category.slug || "").toLowerCase(),
      ];

      return searchFields.some((field) => field.includes(searchText));
    },
  },
  {
    accessorKey: "subCategoryCount",
    header: "Sub-Categories",
    cell: ({ row }) => {
      return (
        <div>
          <span>{row.original.subCategories.length} item(s)</span>
        </div>
      );
    },
  },
  {
    accessorKey: "vendorCount",
    header: "Vendors",
    cell: ({ row }) => {
      return (
        <div>
          <span>{row.original.vendor.length} store(s)</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      const formattedDate = date.toLocaleDateString("en-GB");
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <CellAction id={row.original.id} />,
  },
];
