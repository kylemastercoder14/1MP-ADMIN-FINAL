/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { ChatModal } from "./chat-modal";
import { getVendorsWithLastMessage } from "@/actions/chat";
import { toast } from "sonner";

interface ChatWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatWrapper({ isOpen, onClose }: ChatWrapperProps) {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchVendors();
    }
  }, [isOpen]);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const result = await getVendorsWithLastMessage();
      if (result.error) {
        toast.error(result.error);
      } else if (result.vendors) {
        setVendors(result.vendors);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to load vendors");
    } finally {
      setIsLoading(false);
    }
  };

  return <ChatModal isOpen={isOpen} onClose={onClose} vendors={vendors} />;
}

