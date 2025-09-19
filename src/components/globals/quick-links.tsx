"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Store,
  LaptopMinimalCheck,
  TicketPercent,
  Scale,
  LifeBuoy,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

const quickLinks = [
  { label: "Sellers", icon: Store, href: "/sellers" },
  { label: "Product Approval", icon: LaptopMinimalCheck, href: "/products/approval" },
  {
    label: "Campaigns",
    icon: TicketPercent,
    href: "/marketing/campaigns",
  },
  {
    label: "Policies",
    icon: Scale,
    href: "/marketing/policies",
  },
  { label: "Help Center", icon: LifeBuoy, href: "/marketing/help-center" },
  { label: "Site Settings", icon: Settings, href: "/settings" },
];

const QuickLinks = () => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-[150px] items-center justify-start"
        >
          Quick Links
          <ChevronDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="center"
        className="grid w-[250px] grid-cols-2 gap-2 p-4"
      >
        {quickLinks.map(({ label, icon: Icon }) => (
          <div
            role="button"
            onClick={() =>
              router.push(
                quickLinks.find((link) => link.label === label)?.href || "#"
              )
            }
            key={label}
            className="flex flex-col items-center justify-center gap-1 rounded-md p-3 text-sm hover:bg-muted cursor-pointer"
          >
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-center text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuickLinks;
