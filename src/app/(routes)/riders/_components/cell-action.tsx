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
import { changeRiderStatus, deleteRider } from "@/actions/riders";
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
      const response = await deleteRider(id);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success("Rider deleted successfully");
      router.refresh();
      setOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete rider";
      toast.error(errorMessage);
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      setLoading(true);
      const response = await changeRiderStatus(
        id,
        statusOpen.status,
        reason
      );

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(`Rider ${statusOpen.status.toLowerCase()} successfully`);
      router.refresh();
      setStatusOpen({ toggle: false, status: statusOpen.status });
      setReason("");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to change rider status";
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
        title="Rider Deletion"
        description="Are you sure you want to delete this rider? This will delete all associated data such as orders and delivery records."
      />
      <Modal
        isOpen={statusOpen.toggle}
        onClose={() =>
          setStatusOpen({ toggle: false, status: statusOpen.status })
        }
        title="Rider Status Change"
        description={`Are you sure you want to ${
          statusOpen.status === "Approved" ? "approve" : "reject"
        } this rider?`}
      >
        {statusOpen.status === "Rejected" && (
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection (e.g. Not meeting requirements)"
            className="mb-4"
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
          <DropdownMenuItem onClick={() => router.push(`/riders/${id}`)}>
            <FileText className="w-4 h-4 mr-2" />
            View Rider
          </DropdownMenuItem>
          {status === "Under Review" && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setStatusOpen({ toggle: true, status: "Approved" });
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Rider
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStatusOpen({ toggle: true, status: "Rejected" });
                }}
              >
                <XCircleIcon className="w-4 h-4 mr-2" />
                Reject Rider
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


