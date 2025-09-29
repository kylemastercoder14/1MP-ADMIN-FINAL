import React from "react";
import Heading from "@/components/ui/heading";
import { ChatSidebar } from './_components/chat-sidebar';
import { ChatMain } from './_components/chat-main';

const Page = () => {
  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Help Center"
          description="Manage all the issues coming from your vendors and customers."
        />
      </div>
      {/* Content here */}
      <div className="flex h-screen mt-5">
        <ChatSidebar />
        <ChatMain />
      </div>
    </div>
  );
};

export default Page;
