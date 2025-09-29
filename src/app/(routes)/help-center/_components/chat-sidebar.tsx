"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatContactProps {
  id: string;
  name: string;
  topic: string;
  avatarSrc: string;
  lastMessage: string;
  timestamp: string;
  hasUnread: boolean;
  isActive: boolean;
  onClick: (id: string) => void;
}

const ChatContact = ({
  id,
  name,
  avatarSrc,
  lastMessage,
  timestamp,
  hasUnread,
  isActive,
  onClick,
}: ChatContactProps) => (
  <div
    className={cn(
      "hover:bg-muted flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors",
      isActive && "bg-muted"
    )}
    onClick={() => onClick(id)}
  >
    <Avatar>
      <AvatarImage src={avatarSrc} alt={name} />
      <AvatarFallback className="bg-[#800020]/60 text-white">
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground text-xs">{timestamp}</span>
      </div>
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <p className="truncate w-60">{lastMessage}</p>
        {hasUnread && <div className="ml-2 h-2 w-2 rounded-full bg-blue-500" />}
      </div>
    </div>
  </div>
);

export function ChatSidebar() {
  const [activeChatId, setActiveChatId] = useState("1"); // Default active chat

  const chatContacts = [
    {
      id: "1",
      name: "Juan Dela Cruz",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      topic: "System Error",
      lastMessage:
        "Why can't I log in to my account? It says my password is incorrect even after resetting.",
      timestamp: "07:39 AM",
      hasUnread: true,
    },
    {
      id: "2",
      name: "Jessica Alvarez",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      topic: "Billing Issue",
      lastMessage:
        "I was charged twice this month for my subscription. How can I request a refund?",
      timestamp: "08:15 AM",
      hasUnread: false,
    },
    {
      id: "3",
      name: "Arlene Reyes",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      topic: "Feature Request",
      lastMessage: "Can you add dark mode support in the mobile app?",
      timestamp: "10:22 AM",
      hasUnread: false,
    },
    {
      id: "4",
      name: "Max Santos",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      topic: "Account Settings",
      lastMessage: "How do I change my email address linked to the account?",
      timestamp: "12:47 PM",
      hasUnread: true,
    },
    {
      id: "5",
      name: "Jeremiah Ramos",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      topic: "Mobile App Issue",
      lastMessage:
        "The app crashes whenever I try to upload a profile picture.",
      timestamp: "01:59 PM",
      hasUnread: false,
    },
    {
      id: "6",
      name: "Camila Gamboa",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      topic: "Refund Request",
      lastMessage:
        "I canceled my plan but haven’t received my refund yet. Please assist.",
      timestamp: "02:59 PM",
      hasUnread: false,
    },
    {
      id: "7",
      name: "David Lopez",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      topic: "Order Tracking",
      lastMessage: "Where can I find the tracking number for my recent order?",
      timestamp: "04:12 PM",
      hasUnread: false,
    },
    {
      id: "8",
      name: "Evelyn Bautista",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      topic: "Technical Support",
      lastMessage:
        "I keep getting an error code 502 when trying to access the dashboard.",
      timestamp: "06:25 PM",
      hasUnread: true,
    },
    {
      id: "9",
      name: "Sophia Ramirez",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      topic: "Subscription Plan",
      lastMessage: "What’s the difference between the Basic and Premium plans?",
      timestamp: "08:10 PM",
      hasUnread: false,
    },
    {
      id: "10",
      name: "Liam Villanueva",
      avatarSrc: "/placeholder.svg?height=40&width=40",
      topic: "Password Reset",
      lastMessage:
        "I didn’t receive the password reset email. Can you resend it?",
      timestamp: "09:45 PM",
      hasUnread: true,
    },
  ];

  return (
    <div className="flex w-96 flex-col border rounded-sm border-r p-4">
      <div className="mb-6 flex items-center justify-between">
        <ToggleGroup type="single" defaultValue="Open" variant="outline">
          <ToggleGroupItem value="Open">Open</ToggleGroupItem>
          <ToggleGroupItem value="closed">Closed</ToggleGroupItem>
        </ToggleGroup>
        <Select>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Newest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-2">
        {chatContacts.map((contact) => (
          <ChatContact
            key={contact.id}
            {...contact}
            isActive={contact.id === activeChatId}
            onClick={setActiveChatId}
          />
        ))}
      </div>
    </div>
  );
}
