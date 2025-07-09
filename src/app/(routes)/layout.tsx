import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/globals/header";
import { AppSidebar } from "@/components/globals/app-sidebar";
import { ThemeProvider } from "@/components/globals/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import db from "@/lib/db";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const sellers = await db.vendor.findMany();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NuqsAdapter>
        <SidebarProvider>
          <AppSidebar sellers={sellers} />
          <SidebarInset>
            <Header />
            <main className="p-5 relative">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
};

export default MainLayout;
