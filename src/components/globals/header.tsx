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
import { useFullscreen } from "@/hooks/use-full-screen";
import { Minimize } from "lucide-react";
import { Admin } from "@prisma/client";

const Header = ({ admin }: { admin: Admin }) => {
  const { theme } = useTheme();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <header className="flex sticky inset-x-0 top-0 z-50 rounded-t-lg bg-white dark:bg-zinc-800 h-16 border-b shadow-sm shrink-0 items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="hidden sm:block h-4" />

        {/* Hide search on very small screens */}
        <div className="hidden sm:block">
          <SearchCommand />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Hide QuickLinks on mobile */}
        <div className="hidden md:block">
          <QuickLinks />
        </div>

        <Button
          title="View Site"
          size="icon"
          variant="ghost"
          className="hidden sm:flex"
        >
          <Chrome stroke={theme === "dark" ? "#fff" : "#111"} />
          <span className="sr-only">View Site</span>
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit full screen" : "Enter full screen"}
          className="hidden sm:flex"
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
          user={{
            ...admin,
            email: admin.email,
            image:
              admin.image ||
              "https://static.vecteezy.com/system/resources/previews/009/636/683/original/admin-3d-illustration-icon-png.png",
          }}
        />
      </div>
    </header>
  );
};

export default Header;
