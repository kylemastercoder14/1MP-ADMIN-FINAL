import React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useTheme } from "next-themes";

const AppLogo = ({
  initialData,
}: {
  initialData: {
    name: string;
    lightLogo: string;
    darkLogo: string;
  };
}) => {
  const { theme } = useTheme();
  const lightLogo = initialData.lightLogo || "/main/logo-light.png";
  const darkLogo = initialData.darkLogo || "/main/logo-dark.png";
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <a href="/dashboard">
            <div className="relative size-10">
              <Image
                src={
                  theme === "dark"
                    ? lightLogo
                    : darkLogo
                }
                alt="Logo"
                className="w-full h-full"
                fill
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {initialData.name || "1 Market Philippines"}
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
