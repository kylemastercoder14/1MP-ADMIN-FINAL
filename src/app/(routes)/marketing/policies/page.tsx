"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaLock, FaFileAlt } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { FaUserGear } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { GiBrain } from "react-icons/gi";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div>
      <h3 className="text-2xl font-bold tracking-tighter">Policies Settings</h3>
      <Card className="mt-5 p-0">
        <CardContent className="p-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-7">
            <div
              onClick={() => router.push("/marketing/policies/legal-notice")}
              className="border cursor-pointer hover:bg-accent/70 rounded-md flex items-center gap-5 p-5"
            >
              <div className="bg-[#800020]/20 flex items-center justify-center size-14 rounded-md">
                <GoAlertFill className="text-[#800020] size-9" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Legal Notice</h3>
                <p className="text-muted-foreground">
                  View and manage legal disclosures, disclaimers, and required
                  notifications
                </p>
              </div>
            </div>

            <div
              onClick={() => router.push("/marketing/policies/product-listing-policy")}
              className="border cursor-pointer hover:bg-accent/70 rounded-md flex items-center gap-5 p-5"
            >
              <div className="bg-[#800020]/20 flex items-center justify-center size-14 rounded-md">
                <AiFillProduct className="text-[#800020] size-9" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  Product Listing Policy
                </h3>
                <p className="text-muted-foreground">
                  Configure rules and requirements for listing products in our
                  marketplace
                </p>
              </div>
            </div>

            <div
              onClick={() => router.push("/marketing/policies/intellectual-property-protection")}
              className="border cursor-pointer hover:bg-accent/70 rounded-md flex items-center gap-5 p-5"
            >
              <div className="bg-[#800020]/20 flex items-center justify-center size-14 rounded-md">
                <GiBrain className="text-[#800020] size-9" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  Intellectual Property Protection
                </h3>
                <p className="text-muted-foreground">
                  Manage copyright, trademark, and other IP protection policies
                </p>
              </div>
            </div>

            <div
              onClick={() => router.push("/marketing/policies/privacy-policy")}
              className="border cursor-pointer hover:bg-accent/70 rounded-md flex items-center gap-5 p-5"
            >
              <div className="bg-[#800020]/20 flex items-center justify-center size-14 rounded-md">
                <FaLock className="text-[#800020] size-9" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Privacy Policy</h3>
                <p className="text-muted-foreground">
                  Review and update how we collect, use, and protect user data
                </p>
              </div>
            </div>

            <div
              onClick={() => router.push("/marketing/policies/terms-of-use")}
              className="border cursor-pointer hover:bg-accent/70 rounded-md flex items-center gap-5 p-5"
            >
              <div className="bg-[#800020]/20 flex items-center justify-center size-14 rounded-md">
                <FaFileAlt className="text-[#800020] size-9" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Terms of Use</h3>
                <p className="text-muted-foreground">
                  Manage the legal agreement between the service and its users
                </p>
              </div>
            </div>

            <div
              onClick={() => router.push("/marketing/policies/integrity-compliance")}
              className="border cursor-pointer hover:bg-accent/70 rounded-md flex items-center gap-5 p-5"
            >
              <div className="bg-[#800020]/20 flex items-center justify-center size-14 rounded-md">
                <FaUserGear className="text-[#800020] size-9" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Integrity Compliance</h3>
                <p className="text-muted-foreground">
                  Ensure adherence to ethical standards and anti-corruption
                  policies
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
