"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Paperclip, Smile, X } from "lucide-react";
import { format } from "date-fns";
import { sendAdminMessage, getAdminVendorMessages, sendAdminMessageWithAttachment } from "@/actions/chat";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import Image from "next/image";
import { uploadFile } from "@/lib/upload-s3";

// Dynamically import emoji picker to avoid SSR issues
const EmojiPicker = dynamic(
  () => import("emoji-picker-react"),
  { ssr: false }
);

interface Message {
  id: string;
  body: string | null;
  image: string | null;
  file: string | null;
  video: string | null;
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

interface Vendor {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
  lastMessage?: {
    body: string | null;
    createdAt: Date;
  } | null;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: Vendor[];
}

export function ChatModal({
  isOpen,
  onClose,
  vendors,
}: ChatModalProps) {
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId);

  const fetchMessages = React.useCallback(async () => {
    if (!selectedVendorId) return;

    setIsLoading(true);
    try {
      const result = await getAdminVendorMessages(selectedVendorId);
      if (result.error) {
        toast.error(result.error);
      } else if (result.messages) {
        setMessages(result.messages as Message[]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [selectedVendorId]);

  // Fetch messages when vendor is selected
  useEffect(() => {
    if (selectedVendorId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedVendorId, fetchMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEmojiPicker]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && attachedFiles.length === 0) || isSending) return;

    const messageText = message;
    const filesToSend = [...attachedFiles];
    setMessage("");
    setAttachedFiles([]);
    setIsSending(true);

    try {
      // If there are files, upload them first
      if (filesToSend.length > 0) {
        const uploadPromises = filesToSend.map(async (file) => {
          try {
            const { url } = await uploadFile(file, "chat-attachments");
            return url;
          } catch (error) {
            console.error("Error uploading file:", error);
            toast.error(`Failed to upload ${file.name}`);
            return null;
          }
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        const validUrls = uploadedUrls.filter((url) => url !== null) as string[];

        // Send message with attachments
        for (const url of validUrls) {
          const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
          const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

          const result = await sendAdminMessageWithAttachment(
            selectedVendorId!,
            messageText || null,
            isImage ? url : null,
            !isImage && !isVideo ? url : null,
            isVideo ? url : null
          );

          if (result.error) {
            toast.error(result.error);
          } else if (result.message) {
            setMessages((prev) => [...prev, result.message as unknown as Message]);
          }
        }

        // If there's a text message and files, send it separately
        if (messageText.trim()) {
          const result = await sendAdminMessage(selectedVendorId!, messageText);
          if (result.error) {
            toast.error(result.error);
          } else if (result.message) {
            setMessages((prev) => [...prev, result.message as unknown as Message]);
          }
        }
      } else {
        // Send text message only
        const result = await sendAdminMessage(selectedVendorId!, messageText);
        if (result.error) {
          toast.error(result.error);
          setMessage(messageText); // Restore message on error
        } else if (result.message) {
          setMessages((prev) => [...prev, result.message as unknown as Message]);
        }
      }

      toast.success("Message sent");
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

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file sizes (max 20MB)
    const validFiles = files.filter((file) => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 20MB limit`);
        return false;
      }
      return true;
    });

    setAttachedFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isAdminMessage = (msg: Message) => {
    return msg.senderUser && !msg.senderVendor;
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl! h-[700px] p-0 flex flex-col">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold mb-3">Conversations</h2>
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredVendors.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No vendors found
                  </div>
                ) : (
                  filteredVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      onClick={() => setSelectedVendorId(vendor.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                        selectedVendorId === vendor.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarImage src={vendor.image || ""} alt={vendor.name || ""} />
                          <AvatarFallback>
                            {vendor.name?.charAt(0).toUpperCase() || "V"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{vendor.name || "Vendor"}</p>
                          {vendor.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">
                              {vendor.lastMessage.body || "Attachment"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedVendor ? (
              <>
                {/* Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={selectedVendor.image || ""} alt={selectedVendor.name || ""} />
                    <AvatarFallback>
                      {selectedVendor.name?.charAt(0).toUpperCase() || "V"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedVendor.name || "Vendor"}</p>
                    <p className="text-sm text-muted-foreground">{selectedVendor.email}</p>
                  </div>
                </div>

                {/* Messages area */}
                <ScrollArea className="flex-1 p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => {
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
                            <Avatar className="size-8 shrink-0">
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
                                {msg.image && (
                                  <div className="mb-2">
                                    <Image
                                      src={msg.image}
                                      alt="Attachment"
                                      width={300}
                                      height={200}
                                      className="rounded-lg object-cover max-w-full"
                                    />
                                  </div>
                                )}
                                {msg.video && (
                                  <div className="mb-2">
                                    <video
                                      src={msg.video}
                                      controls
                                      className="rounded-lg max-w-full max-h-64"
                                    />
                                  </div>
                                )}
                                {msg.file && (
                                  <div className="mb-2">
                                    <a
                                      href={msg.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-sm underline"
                                    >
                                      <Paperclip className="size-4" />
                                      Download file
                                    </a>
                                  </div>
                                )}
                                {msg.body && (
                                  <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground mt-1">
                                {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Attachments preview */}
                {attachedFiles.length > 0 && (
                  <div className="px-4 py-2 border-t flex gap-2 flex-wrap">
                    {attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative group border rounded-lg p-2"
                      >
                        {file.type.startsWith("image/") ? (
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            width={100}
                            height={100}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2">
                            <Paperclip className="size-4" />
                            <span className="text-xs truncate max-w-[100px]">
                              {file.name}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => removeAttachment(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input area */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="min-h-[60px] resize-none pr-10"
                        disabled={isSending}
                      />
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isSending}
                        >
                          <Paperclip className="size-4" />
                        </Button>
                        <div className="relative" ref={emojiPickerRef}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            disabled={isSending}
                          >
                            <Smile className="size-4" />
                          </Button>
                          {showEmojiPicker && (
                            <div className="absolute bottom-full right-0 mb-2 z-50">
                              <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                lazyLoadEmojis={true}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={
                        (!message.trim() && attachedFiles.length === 0) || isSending
                      }
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
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a vendor to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

