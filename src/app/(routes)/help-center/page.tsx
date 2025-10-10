import React from "react";
import Heading from "@/components/ui/heading";
import { mails } from './data';
import { Mail } from './_components/mail';

const Page = async () => {
  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Help Center"
          description="Manage all the issues coming from your vendors and customers."
        />
      </div>
      {/* Content here */}
      <div className="h-screen rounded-md border">
        <Mail
          mails={mails}
        />
      </div>
    </div>
  );
};

export default Page;
