import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/globals/header";
import { AppSidebar } from "@/components/globals/app-sidebar";
import { ThemeProvider } from "@/components/globals/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import db from "@/lib/db";
import { useAdmin } from "@/hooks/use-user";
import { redirect } from "next/navigation";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { admin } = await useAdmin();
  const sellers = await db.vendor.findMany();
  if (!admin) return redirect("/sign-in");
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
            <Header admin={admin} />
            <main className="p-5 relative">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
};

export default MainLayout;
