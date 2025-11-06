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
  MoreHorizontal,
  XCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { changeCampaignProductStatus } from "@/actions/campaign-products";
import { Modal } from "@/components/globals/modal";
import { Input } from "@/components/ui/input";

interface CellActionProps {
  id: string;
  status: string;
}

export const CellAction: React.FC<CellActionProps> = ({ id, status }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState({
    toggle: false,
    status: status,
  });
  const [reason, setReason] = React.useState("");

  const handleStatusChange = async () => {
    try {
      setLoading(true);
      const response = await changeCampaignProductStatus(
        id,
        statusOpen.status,
        reason
      );

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(`Campaign product ${statusOpen.status.toLowerCase()} successfully`);
      router.refresh();
      setStatusOpen({ toggle: false, status: statusOpen.status });
      setReason("");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to change campaign product status";
      toast.error(errorMessage);
      console.error("Status change error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={statusOpen.toggle}
        onClose={() =>
          setStatusOpen({ toggle: false, status: statusOpen.status })
        }
        title="Campaign Product Status Change"
        description={`Are you sure you want to ${
          statusOpen.status === "Approved" ? "approve" : "reject"
        } this campaign product?`}
      >
        {statusOpen.status === "Rejected" && (
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection (e.g. Does not meet campaign criteria)"
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
          {status === "Pending" && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setStatusOpen({ toggle: true, status: "Approved" });
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Product
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStatusOpen({ toggle: true, status: "Rejected" });
                }}
              >
                <XCircleIcon className="w-4 h-4 mr-2" />
                Reject Product
              </DropdownMenuItem>
            </>
          )}
          {status === "Rejected" && (
            <DropdownMenuItem
              onClick={() => {
                setStatusOpen({ toggle: true, status: "Approved" });
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Product
            </DropdownMenuItem>
          )}
          {status === "Approved" && (
            <DropdownMenuItem
              onClick={() => {
                setStatusOpen({ toggle: true, status: "Rejected" });
              }}
            >
              <XCircleIcon className="w-4 h-4 mr-2" />
              Reject Product
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};


