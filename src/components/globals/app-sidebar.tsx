"use client";

import * as React from "react";
import {
  LifeBuoy,
  LayoutDashboard,
  ShoppingBag,
  Tag,
  ChartColumnStacked,
  Users,
  FileText,
  Store,
} from "lucide-react";

import { NavMain } from "@/components/globals/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavSellers } from "@/components/globals/nav-sellers";
import { Vendor } from "@prisma/client";
import AppLogo from '@/components/globals/app-logo';

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Categories",
      url: "/manage-categories",
      icon: ChartColumnStacked,
    },
    {
      title: "Products",
      url: "#",
      icon: ShoppingBag,
      items: [
        {
          title: "Manage Products",
          url: "/products",
        },
        {
          title: "Products Approval",
          url: "/products/approval",
        },
        {
          title: "Product Rating",
          url: "/products/ratings",
        },
      ],
    },
    {
      title: "Manage Sellers",
      url: "/sellers",
      icon: Store,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: Users,
    },
    {
      title: "Marketing Tools",
      url: "#",
      icon: Tag,
      items: [
        {
          title: "Announcements",
          url: "/marketing/announcements",
        },
        {
          title: "News Center",
          url: "/marketing/news-center",
        },
        {
          title: "Campaigns",
          url: "/marketing/campaigns",
        },
        {
          title: "Policies",
          url: "/marketing/policies",
        },
      ],
    },
    {
      title: "Help Center",
      url: "/help-center",
      icon: LifeBuoy,
    },
    {
      title: "Feedbacks",
      url: "/feedbacks",
      icon: FileText,
    },
  ],
};

export function AppSidebar({
  sellers,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  sellers: Vendor[];
}) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <AppLogo />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavSellers sellers={sellers} />
      </SidebarContent>
    </Sidebar>
  );
}
