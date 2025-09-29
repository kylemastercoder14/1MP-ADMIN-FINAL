"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/constants";
import GeneralSettings from "@/components/globals/settings/general";
import EmailSettings from "@/components/globals/settings/email";
import FaqsSettings from "@/components/globals/settings/faqs";
import OfficeHoursSettings from "@/components/globals/settings/office-hours";
import RefundPolicySettings from "@/components/globals/settings/refund";
import LegalNoticeSettings from "@/components/globals/settings/legal-notice";
import ProductListingSettings from "@/components/globals/settings/product-listing";
import IntellectualPropertySettings from "@/components/globals/settings/intellectual";
import PrivacyPolicySettings from "@/components/globals/settings/privacy";
import TermsOfUseSettings from "@/components/globals/settings/terms";
import IntegrityComplianceSettings from "@/components/globals/settings/integrity";
import { SettingsData } from '@/types';

const SettingsClient = ({ data }: { data: SettingsData }) => {
  const [activeSection, setActiveSection] = useState("general");

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSettings data={data} />;
      case "email":
        return <EmailSettings data={data} />;
      case "faqs":
        return <FaqsSettings data={data} />;
      case "officeHours":
        return <OfficeHoursSettings data={data} />;
      case "refund":
        return <RefundPolicySettings data={data} />;
      case "legalNotice":
        return <LegalNoticeSettings />;
      case "productListingPolicy":
        return <ProductListingSettings />;
      case "intellectualPropertyProtection":
        return <IntellectualPropertySettings />;
      case "privacyPolicy":
        return <PrivacyPolicySettings />;
      case "termsOfUse":
        return <TermsOfUseSettings />;
      case "integrityCompliance":
        return <IntegrityComplianceSettings />;
      default:
        return <GeneralSettings data={data} />;
    }
  };

  return (
    <div className="flex mt-10">
      {/* Sidebar */}
      <div className={cn("bg-card w-64 rounded-sm border-r")}>
        <div className="p-6">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    activeSection === item.id
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 lg:ml-5">{renderContent()}</div>
    </div>
  );
};

export default SettingsClient;
