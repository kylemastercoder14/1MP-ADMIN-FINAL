"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeCheck, CheckIcon, ChevronsUpDown, CopyIcon } from "lucide-react";
import { CellAction } from "./cell-action";
import { toast } from "sonner";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomerWithOrder } from "@/types";

export const columns: ColumnDef<CustomerWithOrder>[] = [
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
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false);
      const fullName =
        `${row.original.firstName || ""} ${
          row.original.lastName || ""
        }`.trim() || "Unknown";
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={row.original.image || ""}
              className="object-cover"
            />
            <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-[200px] truncate flex items-center gap-1">
                {fullName}
                {row.original.isEmailVerified && (
                  <BadgeCheck className="size-3 text-white" fill="green" />
                )}
              </div>
            </div>
            <div
              title={row.original.id}
              className="text-xs cursor-pointer text-primary gap-2 flex items-center"
            >
              <span className="w-[145px] truncate overflow-hidden whitespace-nowrap">
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
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const fullName =
        `${row.original.firstName || ""} ${
          row.original.lastName || ""
        }`.trim() || "Unknown";
      const name = fullName.toLowerCase();
      const id = row.original.id.toLowerCase();
      const search = filterValue.toLowerCase();

      return name.includes(search) || id.includes(search);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      // Get the addresses array or empty array if undefined
      const addresses = row.original.address || [];

      // Find the default address (first address or marked as default)
      const defaultAddress =
        addresses.find((addr) => addr.isDefault) || addresses[0];

      if (!defaultAddress) {
        return <p>No Address</p>;
      }

      // Format the address components
      const formattedAddress = [
        defaultAddress.homeAddress,
        defaultAddress.barangay,
        defaultAddress.city,
        defaultAddress.province,
        defaultAddress.region,
        defaultAddress.zipCode,
      ]
        .filter(Boolean) // Remove empty/null/undefined components
        .join(", ");

      return <p>{formattedAddress}</p>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const maskEmail = (email: string) => {
        if (!email) return "No Email";

        const [username, domain] = email.split("@");
        if (!username || !domain) return email; // fallback for invalid emails

        // Keep first 2 chars, mask the rest of username (min 4 asterisks)
        const maskedUsername =
          username.slice(0, 2) + "*".repeat(Math.max(4, username.length - 2));
        return `${maskedUsername}@${domain}`;
      };

      return (
        <div>
          <p>{maskEmail(row.original.email)}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "ordersCount",
    header: "Orders",
    cell: ({ row }) => {
      return <div>{row.original.order.length || 0} item(s)</div>;
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
    accessorKey: "isActive",
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
      switch (row.original.isActive) {
        case true:
          return (
            <div className="bg-green-200/30 inline-block text-green-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              Active
            </div>
          );
        case false:
          return (
            <div className="bg-red-200/30 inline-block text-red-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              Not Active
            </div>
          );
        default:
          return (
            <div className="bg-gray-200/30 inline-block text-gray-600 text-xs py-0.5 font-semibold rounded-sm px-2.5">
              {row.original.isActive}
            </div>
          );
      }
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <CellAction isActive={row.original.isActive} id={row.original.id} />
    ),
  },
];
