import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, ImageIcon, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconMoodHappy } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MessageBubbleProps {
  message: string;
  isUserMessage: boolean;
  avatarSrc?: string;
}

const MessageBubble = ({
  message,
  isUserMessage,
  avatarSrc,
}: MessageBubbleProps) => (
  <div
    className={cn("flex items-start gap-3", isUserMessage ? "justify-end" : "")}
  >
    {!isUserMessage && (
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarSrc || "/placeholder.svg"} alt="User Avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    )}
    <div
      className={cn(
        "max-w-[70%] rounded-lg p-3",
        isUserMessage
          ? "bg-[#800020] text-primary-foreground rounded-br-none"
          : "rounded-bl-none bg-accent"
      )}
    >
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

export function ChatMain() {
  const currentChatUser = {
    name: "Juan Dela Cruz",
    avatarSrc: "/placeholder.svg?height=40&width=40",
    status: "System Error",
  };

  const messages = [
    {
      id: "m1",
      sender: "user",
      content:
        "Hi, I can't log in to my account. It says my password is incorrect even though I just reset it.",
    },
    {
      id: "m2",
      sender: "other",
      avatarSrc: "/placeholder.svg?height=32&width=32",
      content:
        "Hello Juan! Thanks for reaching out. Can you confirm if you received the password reset email and followed the link?",
    },
    {
      id: "m3",
      sender: "user",
      content:
        "Yes, I received the email and reset my password, but I still can't log in.",
    },
    {
      id: "m4",
      sender: "other",
      avatarSrc: "/placeholder.svg?height=32&width=32",
      content:
        "Understood. Let's try clearing your browser cache and cookies, then attempt logging in again. Did that work?",
    },
    {
      id: "m5",
      sender: "user",
      content:
        "I cleared the cache but I’m still getting the same error message.",
    },
    {
      id: "m6",
      sender: "other",
      avatarSrc: "/placeholder.svg?height=32&width=32",
      content:
        "Thank you for trying that. We will escalate this issue to our technical team. You should receive an update within 24 hours.",
    },
    {
      id: "m7",
      sender: "user",
      content: "Got it. Thank you for the help!",
    },
  ];

  return (
    <div className="mx-4 flex flex-1 flex-col rounded-sm shadow-sm">
      <div className="flex items-center justify-between border border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={currentChatUser.avatarSrc || "/placeholder.svg"}
              alt={currentChatUser.name}
            />
            <AvatarFallback>{currentChatUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{currentChatUser.name}</h2>
            <Badge
              variant="outline"
              className="text-destructive border border-destructive text-xs"
            >
              {currentChatUser.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Set Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div className="flex items-center text-success gap-2">
                  <div className="size-2 rounded-full bg-success"></div>
                  Low
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center text-yellow-600 gap-2">
                  <div className="size-2 rounded-full bg-yellow-600"></div>
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center text-destructive gap-2">
                  <div className="size-2 rounded-full bg-destructive"></div>
                  High
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="success" size="sm"><CheckCircle className='size-4' />Mark as Closed</Button>
          <MoreVertical className="text-muted-foreground h-5 w-5 cursor-pointer" />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg.content}
            isUserMessage={msg.sender === "user"}
            avatarSrc={msg.avatarSrc}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 border border-t p-4">
        <ImageIcon className="text-muted-foreground h-5 w-5 cursor-pointer" />
        <IconMoodHappy className="text-muted-foreground h-5 w-5 cursor-pointer" />
        <Input
          placeholder="Enter a prompt here"
          className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button size="icon" variant="primary" className="rounded-full">
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
