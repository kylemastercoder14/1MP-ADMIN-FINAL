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
import { XCircleIcon, CheckCircle, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import AlertModal from "@/components/ui/alert-modal";
import { toast } from "sonner";
import { approveProduct, rejectProduct } from '@/actions';

interface CellActionProps {
  id: string;
}

export const CellAction: React.FC<CellActionProps> = ({ id }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      toast.success("Product and all associated files deleted successfully");
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      toast.error(errorMessage);
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      const response = await approveProduct(id)

      if (response.error) {
        toast.error(response.error);
      }

      toast.success("Product approved successfully");
      router.refresh();
      setApproveOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to approve product";
      toast.error(errorMessage);
      console.error("Approve error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      const response = await rejectProduct(id)

      if (response.error) {
        toast.error(response.error);
      }

      toast.success("Product rejected successfully");
      router.refresh();
      setRejectOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject product";
      toast.error(errorMessage);
      console.error("Reject error:", error);
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
        isOpen={approveOpen}
        onClose={() => setApproveOpen(false)}
        onConfirm={handleApprove}
        loading={loading}
        title={`Product Approval`}
        description="Are you sure you want to approve this product?"
      />
      <AlertModal
        isOpen={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        loading={loading}
        title={`Product Rejection`}
        description="Are you sure you want to reject this product?"
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
          <DropdownMenuItem onClick={() => setApproveOpen(true)}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve Product
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRejectOpen(true)}>
            <XCircleIcon className="w-4 h-4 mr-2" />
            Reject Product
          </DropdownMenuItem>
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
