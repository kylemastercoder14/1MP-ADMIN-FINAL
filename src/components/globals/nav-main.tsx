"use client";

import { Minus, Plus, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          // Only make collapsible if it has sub-items
          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`${
                    pathname === item.url
                      ? "border-l-[3px] border-[#800020] rounded-none bg-sidebar-accent hover:bg-sidebar-accent"
                      : "rounded-none hover:bg-sidebar-accent"
                  }`}
                >
                  <a href={item.url}>
                    <item.icon />
                    {item.title}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // Check if current path matches parent URL or any child URL
          const shouldBeOpen =
            pathname.includes(item.url) ||
            (item.items?.some((child) => pathname.includes(child.url)) ??
              false);

          return (
            <Collapsible
              key={item.title}
              defaultOpen={shouldBeOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={`${
                      pathname === item.url
                        ? "border-l-[3px] border-[#800020] rounded-none bg-sidebar-accent hover:bg-sidebar-accent"
                        : "rounded-none hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon />
                    {item.title}{" "}
                    <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.url === pathname}
                        >
                          <a href={subItem.url}>{subItem.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
