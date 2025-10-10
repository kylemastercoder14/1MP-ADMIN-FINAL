"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailDisplay } from "./mail-display";
import { MailList } from "./mail-list";
import { type Mail } from "../data";
import { useMailStore } from "./use-mail";
import { MailDisplayMobile } from "./mail-display-mobile";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface MailProps {
  mails: Mail[];
}

export function Mail({ mails }: MailProps) {
  const isMobile = useIsMobile();
  const { selectedMail } = useMailStore();
  const [filter, setFilter] = React.useState("all");

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full">
        {/* Sidebar (Mail List) */}
        <div className="w-[500px] border-r flex flex-col">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Inbox</h1>
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(val) => val && setFilter(val)}
              className="ml-auto"
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <Separator />
          <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-4 backdrop-blur">
            <form>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </form>
          </div>
          <div className="flex-1 min-h-0">
            <MailList
              items={
                filter === "all"
                  ? mails
                  : mails.filter((item) => !item.read) // only unread
              }
            />
          </div>
        </div>

        {/* Main Display */}
        <div className="flex-1">
          {isMobile ? (
            <MailDisplayMobile
              mail={mails.find((item) => item.id === selectedMail?.id) || null}
            />
          ) : (
            <MailDisplay
              mail={mails.find((item) => item.id === selectedMail?.id) || null}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
