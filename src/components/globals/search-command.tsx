"use client";

import * as React from "react";
import {
  Search,
  Settings,
  LifeBuoy,
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Wallet,
  Package,
  Percent,
  ShoppingCart,
  ArrowLeftRight,
  WalletCards,
  UserCog,
  MessageSquare,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

const SearchCommand = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigationItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Manage Products",
      icon: ShoppingBag,
      path: "/products",
    },
    {
      name: "Product Rating",
      icon: ShoppingBag,
      path: "/products/ratings",
    },
    {
      name: "Promotions",
      icon: Percent,
      path: "/marketing/promotions",
    },
    {
      name: "Campaigns",
      icon: Tag,
      path: "/marketing/campaigns",
    },
    {
      name: "Manage Orders",
      icon: ShoppingCart,
      path: "/orders",
    },
    {
      name: "Cancellation",
      icon: ArrowLeftRight,
      path: "/orders/cancellation",
    },
    {
      name: "Return & Refund",
      icon: ArrowLeftRight,
      path: "/orders/return-refund",
    },
    {
      name: "Withdrawals",
      icon: WalletCards,
      path: "/finance/withdrawals",
    },
    {
      name: "My Subscriptions",
      icon: Wallet,
      path: "/finance/subscriptions",
    },
    {
      name: "Account Settings",
      icon: UserCog,
      path: "/settings/account",
    },
    {
      name: "Chat Assistant",
      icon: MessageSquare,
      path: "/settings/chat-assistant",
    },
    {
      name: "Help Center",
      icon: LifeBuoy,
      path: "/help-center",
    },
  ];

  const quickActions = [
    {
      name: "Create New Product",
      icon: Package,
      action: () => router.push("/products/create"),
    },
    {
      name: "Check Balance",
      icon: Wallet,
      action: () => router.push("/finance/withdrawals"),
    },
  ];

  return (
    <>
      <Button
        title="Press CTRL + J to open."
        variant="outline"
        onClick={() => setOpen(true)}
        className="text-sm w-[300px] flex items-center justify-start"
      >
        <Search className="size-4 mr-2" />
        Search anything...{" "}
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for pages, products, or actions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem
                key={action.name}
                onSelect={() => {
                  action.action();
                  setOpen(false);
                }}
              >
                <action.icon className="mr-2 h-4 w-4" />
                <span>{action.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.path}
                onSelect={() => {
                  router.push(item.path);
                  setOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Account">
            <CommandItem
              onSelect={() => {
                router.push("/settings/account");
                setOpen(false);
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/settings");
                setOpen(false);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchCommand;
