"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TicketWithProps } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export const columns: ColumnDef<TicketWithProps>[] = [
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
    accessorKey: "ticket",
    header: "Ticket",
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.topic}</div>
          <div className="text-xs text-muted-foreground">
            Ticket #: {row.original.id}
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
        String(category.topic || "").toLowerCase(),
      ];

      return searchFields.some((field) => field.includes(searchText));
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      switch (status) {
        case "Open":
          return (
            <div className="bg-green-200/30 inline-block text-green-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              {status}
            </div>
          );
        case "Resolved":
          return (
            <div className="bg-gray-200/30 inline-block text-gray-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              {status}
            </div>
          );
        case "Closed":
          return (
            <div className="bg-orange-200/30 inline-block text-orange-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              {status}
            </div>
          );
        default:
          return (
            <div className="bg-gray-200/30 inline-block text-gray-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              {status}
            </div>
          );
      }
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
    accessorKey: "updatedAt",
    header: "Date Updated",
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt);
      const formattedDate = date.toLocaleDateString("en-GB");
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const details = row.original.details;
      return <div>{details}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Link
        className="text-[#800020] font-medium"
        href={`/help-center/${row.original.id}`}
      >
        Check details
      </Link>
    ),
  },
];
