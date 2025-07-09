import React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import { useTheme } from 'next-themes';

const AppLogo = () => {
  const {theme} = useTheme();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <a href="/dashboard">
            <div className="relative size-10">
              <Image
                src={theme === 'dark' ? "/main/logo-light.png" : "/main/logo-dark.png"}
                alt="Logo"
                className="w-full h-full"
                fill
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                1 Market Philippines
              </span>
              <span className="truncate text-xs">Admin Portal</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default AppLogo;
