"use client";

import {
  LogOutIcon,
  MoreVerticalIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/ui/alert-modal";
import { useState } from "react";
import { Admin } from '@prisma/client';

export function UserMenu({
  user,
}: {
  user: Admin;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const response = await axios.post("/api/admin/sign-out", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      toast.success("Logged out successfully!");
      router.push("/sign-in");
    } else {
      console.error("Logout failed:", response.data);
      toast.error(
        response.data.message || "Failed to log out. Please try again."
      );
    }
  };

  return (
    <>
      <AlertModal
        title="Log out"
        description="Are you sure you want to log out?"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleLogout}
      />
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage className='object-cover' src={user.image as string} alt={"1 Market Philippines"} />
                  <AvatarFallback className="rounded-lg">O</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">1 Market Philippines</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <MoreVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "bottom"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg object-cover">
                    <AvatarImage className="object-cover" src={user.image as string} alt={"1 Market Philippines"} />
                    <AvatarFallback className="rounded-lg">O</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">1 Market Philippines</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
