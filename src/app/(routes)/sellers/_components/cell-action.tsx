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
import {
  CheckCircle,
  FileText,
  MoreHorizontal,
  Trash,
  XCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import AlertModal from "@/components/ui/alert-modal";
import { toast } from "sonner";
import { changeSellerStatus, deleteSeller } from "@/actions";
import { Modal } from "@/components/globals/modal";
import { Input } from "@/components/ui/input";

interface CellActionProps {
  id: string;
  status: string;
}

export const CellAction: React.FC<CellActionProps> = ({ id, status }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState({
    toggle: false,
    status: status,
  });
  const [reason, setReason] = React.useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await deleteSeller(id)

      if (response.error) {
        toast.error(response.error);
      }

      toast.success("Seller deleted successfully");
      router.refresh();
      setOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete seller";
      toast.error(errorMessage);
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      setLoading(true);
      const response = await changeSellerStatus(id, statusOpen.status, reason);

      if (response.error) {
        toast.error(response.error);
      }

      toast.success(`Seller ${statusOpen.status.toLowerCase()} successfully`);
      router.refresh();
      setStatusOpen({ toggle: false, status: statusOpen.status });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to change seller status";
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
        title={`Seller Deletion`}
        description="Are you sure you want to delete this seller? This will delete also all associated data such as products, addresses, and payment accounts."
      />
      <Modal
        isOpen={statusOpen.toggle}
        onClose={() =>
          setStatusOpen({ toggle: false, status: statusOpen.status })
        }
        title={`Seller Status Change`}
        description={`Are you sure you want to ${statusOpen.status === "Approved" ? "approve" : "reject"} this seller?`}
      >
        {statusOpen.status === "Rejected" && (
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection (.e.g. Not meeting requirements)"
            className='mb-4'
          />
        )}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() =>
              setStatusOpen({ toggle: false, status: statusOpen.status })
            }
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleStatusChange}
            disabled={loading}
          >
            Confirm
          </Button>
        </div>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger className="no-print" asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/sellers/${id}`)}>
            <FileText className="w-4 h-4 mr-2" />
            View Seller
          </DropdownMenuItem>
          {status === "Under Review" && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setStatusOpen({ toggle: true, status: "Approved" });
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Seller
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStatusOpen({ toggle: true, status: "Rejected" });
                }}
              >
                <XCircleIcon className="w-4 h-4 mr-2" />
                Reject Seller
              </DropdownMenuItem>
            </>
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
