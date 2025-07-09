"use client";

import React from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SearchCommand from "@/components/globals/search-command";
import QuickLinks from "@/components/globals/quick-links";
import { Button } from "@/components/ui/button";
import { Chrome } from "@/components/animated-icons/chrome";
import { Expand } from "@/components/animated-icons/expand";
import { BellRing } from "@/components/animated-icons/bell-ring";
import { ToggleMode } from "@/components/globals/toggle-mode";
import { useTheme } from "next-themes";
import { UserMenu } from "@/components/globals/user-menu";
import { useAdminDetails } from "@/hooks/use-admin-details";
import { useFullscreen } from "@/hooks/use-full-screen";
import { Minimize } from "lucide-react";

const Header = () => {
  const { admin, loading, user } = useAdminDetails();
  const { theme } = useTheme();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  return (
    <header className="flex sticky inset-x-0 top-0 z-50 rounded-t-lg bg-white dark:bg-zinc-800 h-16 border-b shadow-sm shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <SearchCommand />
      </div>
      <div className="flex ml-auto items-center gap-2 pr-5">
        <QuickLinks />
        <Button title="View Site" size="icon" variant="ghost">
          <Chrome stroke={theme === "dark" ? "#fff" : "#111"} />
          <span className="sr-only">View Site</span>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit full screen" : "Enter full screen"}
        >
          {isFullscreen ? (
            <Minimize stroke={theme === "dark" ? "#fff" : "#111"} />
          ) : (
            <Expand stroke={theme === "dark" ? "#fff" : "#111"} />
          )}
        </Button>
        <Button size="icon" variant="ghost">
          <BellRing stroke={theme === "dark" ? "#fff" : "#111"} />
          <span className="sr-only">Notification</span>
        </Button>
        <ToggleMode />
        <UserMenu
          loading={loading}
          user={{
            name: "1 Market Philippines",
            email: admin?.email || "",
            avatar:
              admin?.image ||
              user?.user_metadata?.avatar_url ||
              "https://static.vecteezy.com/system/resources/previews/009/636/683/original/admin-3d-illustration-icon-png.png",
          }}
        />
      </div>
    </header>
  );
};

export default Header;
