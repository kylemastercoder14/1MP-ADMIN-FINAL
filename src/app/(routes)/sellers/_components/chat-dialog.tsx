"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { sendAdminMessage, getAdminVendorMessages } from "@/actions/chat";
import { toast } from "sonner";

interface Message {
  id: string;
  body: string | null;
  createdAt: Date;
  senderUser: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
  } | null;
  senderVendor: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
  vendorImage?: string | null;
}

export function ChatDialog({
  isOpen,
  onClose,
  vendorId,
  vendorName,
  vendorImage,
}: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when dialog opens
  useEffect(() => {
    if (isOpen && vendorId) {
      fetchMessages();
    }
  }, [isOpen, vendorId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const result = await getAdminVendorMessages(vendorId);
      if (result.error) {
        toast.error(result.error);
      } else if (result.messages) {
        setMessages(result.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    const messageText = message;
    setMessage("");
    setIsSending(true);

    try {
      const result = await sendAdminMessage(vendorId, messageText);
      if (result.error) {
        toast.error(result.error);
        setMessage(messageText); // Restore message on error
      } else if (result.message) {
        // Add new message to the list
        setMessages((prev) => [...prev, result.message as unknown as Message]);
        toast.success("Message sent");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setMessage(messageText); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isAdminMessage = (msg: Message) => {
    // Messages from system admin user (senderUser exists but senderVendor is null) are admin messages
    // Messages from vendor (senderVendor exists) are vendor messages
    return msg.senderUser && !msg.senderVendor;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={vendorImage || ""} alt={vendorName} />
              <AvatarFallback>
                {vendorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>Chat with {vendorName}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-md">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAdmin = isAdminMessage(msg);
              const senderName = isAdmin
                ? "Admin"
                : msg.senderVendor?.name || "Vendor";
              const senderImage = isAdmin
                ? null
                : msg.senderVendor?.image || null;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    isAdmin ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="size-8">
                    <AvatarImage src={senderImage || ""} alt={senderName} />
                    <AvatarFallback>
                      {senderName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col max-w-[70%] ${
                      isAdmin ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isAdmin
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex gap-2 pt-4 border-t">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none"
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
            size="icon"
            className="shrink-0"
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

