"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { CampaignProps } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<CampaignProps>[] = [
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
    accessorKey: "campaign",
    header: "Campaign",
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-xs text-muted-foreground">
            ID: {row.original.id}
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
        String(category.title || "").toLowerCase(),
      ];

      return searchFields.some((field) => field.includes(searchText));
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const campaignStart = new Date(row.original.campaignStartDate);
      const campaignEnd = new Date(row.original.campaignEndDate);

      // Check if the campaign is Ongoing, Upcoming, or Ended
      let status = "Ended";
      if (campaignStart <= new Date() && campaignEnd >= new Date()) {
        status = "Ongoing";
      } else if (campaignStart > new Date()) {
        status = "Upcoming";
      }
      switch (status) {
        case "Ongoing":
          return (
            <div className="bg-green-200/30 inline-block text-green-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              {status}
            </div>
          );
        case "Upcoming":
          return (
            <div className="bg-blue-200/30 inline-block text-blue-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              {status}
            </div>
          );
        case "Ended":
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
    accessorKey: "campaignDate",
    header: "Campaign Date",
    cell: ({ row }) => {
      const startDate = new Date(row.original.campaignStartDate);
      const endDate = new Date(row.original.campaignEndDate);

      return (
        <div>
          <span>
            {startDate.toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            -{" "}
            {endDate.toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "registrationDate",
    header: "Registration Date",
    cell: ({ row }) => {
      const startDate = new Date(row.original.registrationStartDate);
      const endDate = new Date(row.original.registrationEndDate);

      return (
        <div>
          <span>
            {startDate.toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            -{" "}
            {endDate.toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.type} (
          {row.original.type === "Percentage Off" ? "" : "₱"}
          {row.original.value}
          {row.original.type === "Percentage Off" ? "%" : ""})
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <CellAction id={row.original.id} />,
  },
];
