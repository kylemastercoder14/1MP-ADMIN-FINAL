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
import { changeCustomerStatus, deleteCustomer } from "@/actions";

interface CellActionProps {
  id: string;
  isActive: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({ id, isActive }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [changeStatus, setChangeStatus] = React.useState({
    toggle: false,
    isActive: isActive,
  });
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await deleteCustomer(id);

      if (response.error) {
        toast.error(response.error);
      }

      toast.success("Customer deleted successfully");
      router.refresh();
      setOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete customer";
      toast.error(errorMessage);
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async () => {
    try {
      setLoading(true);
      const response = await changeCustomerStatus(id, changeStatus.isActive);

      if (response.error) {
        toast.error(response.error);
      }

      toast.success(
        `Customer ${changeStatus.isActive ? "activated" : "deactivated"} successfully`
      );
      router.refresh();
      setChangeStatus({ toggle: false, isActive: changeStatus.isActive });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to change customer status";
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
        title={`Customer Deletion`}
        description="Are you sure you want to delete this customer? This action can't be undone."
      />
      <AlertModal
        isOpen={changeStatus.toggle}
        onClose={() =>
          setChangeStatus({ toggle: false, isActive: changeStatus.isActive })
        }
        onConfirm={handleChangeStatus}
        loading={loading}
        title={`Customer ${changeStatus.isActive ? "Activation" : "Deactivation"}`}
        description={`Are you sure you want to ${changeStatus.isActive ? "activate" : "deactivate"} this customer?`}
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
          <DropdownMenuItem
            onClick={() => {
              setChangeStatus({ toggle: true, isActive: !isActive });
            }}
          >
            {isActive ? (
              <PowerOff className="w-4 h-4 mr-2" />
            ) : (
              <Power className="w-4 h-4 mr-2" />
            )}
            {isActive ? "Deactivate" : "Activate"} Customer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/customers/${id}`)}
          >
            <FileText className="w-4 h-4 mr-2" />
            View Customer
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
