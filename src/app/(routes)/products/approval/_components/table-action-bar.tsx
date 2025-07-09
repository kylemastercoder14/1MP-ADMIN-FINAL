"use client";

import { SelectTrigger } from "@radix-ui/react-select";
import type { Table } from "@tanstack/react-table";
import { CheckCircle2, Download, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { exportTableToCSV } from "@/lib/export";
import { deleteProducts, updateProducts } from "@/actions";
import { Product } from "@prisma/client";
import { ProductWithProps } from "@/types";
import AlertModal from "@/components/ui/alert-modal";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = ["update-status", "export", "delete"] as const;

type Action = (typeof actions)[number];

interface ProductsTableActionBarProps {
  table: Table<ProductWithProps>;
}

export function ProductsTableActionBar({ table }: ProductsTableActionBarProps) {
  const router = useRouter();
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  );

  const onProductUpdate = React.useCallback(
    ({
      field,
      value,
    }: {
      field: "status";
      value: Product["adminApprovalStatus"];
    }) => {
      setCurrentAction("update-status");
      startTransition(async () => {
        const { error } = await updateProducts({
          ids: rows.map((row) => row.original.id),
          [field]: value,
        });

        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Product status updated");
        router.refresh();
      });
    },
    [router, rows]
  );

  const onProductExport = React.useCallback(() => {
    setCurrentAction("export");
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true,
      });
    });
  }, [table]);

  const onProductDelete = React.useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      const { error } = await deleteProducts({
        ids: rows.map((row) => row.original.id),
      });

      if (error) {
        toast.error(error);
        return;
      }
      table.toggleAllRowsSelected(false);
    });
  }, [rows, table]);

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onProductDelete}
        title="Delete Products"
        description={`Are you sure you want to delete ${rows.length} product(s)? This action cannot be undone.`}
      />
      <DataTableActionBar table={table} visible={rows.length > 0}>
        <DataTableActionBarSelection table={table} />
        <Separator
          orientation="vertical"
          className="hidden data-[orientation=vertical]:h-5 sm:block"
        />
        <div className="flex items-center gap-1.5">
          <Select
            onValueChange={(value: Product["adminApprovalStatus"]) =>
              onProductUpdate({ field: "status", value })
            }
          >
            <SelectTrigger asChild>
              <DataTableActionBarAction
                size="icon"
                tooltip="Update status"
                isPending={getIsActionPending("update-status")}
              >
                <CheckCircle2 />
              </DataTableActionBarAction>
            </SelectTrigger>
            <SelectContent align="center">
              <SelectGroup>
                {rows.some(
                  (row) => row.original.adminApprovalStatus === "Approved"
                ) && (
                  <SelectItem value={"Deactivated"} className="capitalize">
                    Deactivate
                  </SelectItem>
                )}
                {rows.some(
                  (row) => row.original.adminApprovalStatus === "Deactivated"
                ) && (
                  <SelectItem value={"Re-activate"} className="capitalize">
                    Re-activate
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <DataTableActionBarAction
            size="icon"
            tooltip="Export products"
            isPending={getIsActionPending("export")}
            onClick={onProductExport}
          >
            <Download />
          </DataTableActionBarAction>
          <DataTableActionBarAction
            size="icon"
            tooltip="Delete products"
            isPending={getIsActionPending("delete")}
            onClick={() => setIsOpen(true)}
          >
            <Trash2 />
          </DataTableActionBarAction>
        </div>
      </DataTableActionBar>
    </>
  );
}
