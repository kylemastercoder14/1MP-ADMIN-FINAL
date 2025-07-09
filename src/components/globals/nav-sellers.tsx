"use client";

import {
  ArrowUpRight,
  ChartSpline,
  MoreHorizontal,
  ShoppingBag,
  Wallet,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Vendor } from "@prisma/client";
import { generateSellerIcon } from "@/lib/generate-seller-icon";
import { useRouter } from "next/navigation";

export function NavSellers({ sellers }: { sellers: Vendor[] }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Sellers</SidebarGroupLabel>
      <SidebarMenu>
        {sellers.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <div className="cursor-pointer">
                <span>
                  {generateSellerIcon(item.categorySlug as string)}
                </span>
                <span>{item.name}</span>
              </div>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onClick={() => router.push(`/sellers/${item.id}`)}
                >
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>View Store</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/sellers/${item.id}/products`)
                  }
                >
                  <ShoppingBag className="text-muted-foreground" />
                  <span>Store&apos;s Product</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/sellers/${item.id}/orders`)
                  }
                >
                  <Wallet className="text-muted-foreground" />
                  <span>Order History</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push(`/sellers/${item.id}/analytics`)}
                >
                  <ChartSpline className="text-muted-foreground" />
                  <span>Analytics</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
