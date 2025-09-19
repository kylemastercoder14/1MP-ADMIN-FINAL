"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal, Power, PowerOff, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import AlertModal from "@/components/ui/alert-modal";
import { toast } from "sonner";
import { changeProductStatus, deleteProduct } from '@/actions';

interface CellActionProps {
  id: string;
  status: string;
}

export const CellAction: React.FC<CellActionProps> = ({ id, status }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [changeStatus, setChangeStatus] = React.useState({
    toggle: false,
    status: status,
  });

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await deleteProduct(id);

      if (response.error) {
        toast.error(response.error);
      }

      toast.success("Product and all associated files deleted successfully");
      router.refresh();
      setOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      toast.error(errorMessage);
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      setLoading(true);
      const response = await changeProductStatus(id, changeStatus.status);

      if (response.error) {
        toast.error(response.error);
      }

      toast.success(`Product ${changeStatus.status.toLowerCase()} successfully`);
      router.refresh();
      setChangeStatus({ toggle: false, status: changeStatus.status });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change product status";
      toast.error(errorMessage);
      console.error("Status change error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
        title={`Product Deletion`}
        description="Are you sure you want to delete this product? This will delete also all associated data such as variants, specifications, and files."
      />

      <AlertModal
        isOpen={changeStatus.toggle}
        onClose={() =>
          setChangeStatus({ toggle: false, status: changeStatus.status })
        }
        onConfirm={handleStatusChange}
        loading={loading}
        title={`${changeStatus.status} product`}
        description={`Are you sure you want to ${changeStatus.status === "Approved" ? "activate" : "deactivate"} this product?`}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="no-print" asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/products/${id}/details`)}>
            <FileText className="w-4 h-4 mr-2" />
            View Product
          </DropdownMenuItem>
          {status === "Deactivated" ? (
            <DropdownMenuItem
              onClick={() =>
                setChangeStatus({ toggle: true, status: "Approved" })
              }
            >
              <Power className="w-4 h-4 mr-2" />
              Activate Product
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() =>
                setChangeStatus({ toggle: true, status: "Deactivated" })
              }
            >
              <PowerOff className="w-4 h-4 mr-2" />
              Deactivate Product
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
