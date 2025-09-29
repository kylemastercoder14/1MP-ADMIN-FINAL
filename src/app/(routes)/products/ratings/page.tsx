import React from "react";
import Heading from "@/components/ui/heading";
import Client from "./_components/client";

const Page = () => {
  const mockProducts = [
    {
      id: "ckq1f8r2b0000v6t7x3d1a2b",
      name: "ASUS over-ear wireless headphones with microphone, foldable, long battery life, includes 3.5mm audio cable for PC connection",
      slug: "wireless-headphones",
      images: [
        "https://img.kwcdn.com/product/fancy/333bb429-eeab-40af-bb5a-381f92a95377.jpg?imageView2/2/w/800/q/70/format/webp",
      ],
      vendor: { name: "TechStore" },
      rating: 4.5,
      subCategory: { name: "Electronics" },
      updatedAt: new Date().toISOString(),
      adminApprovalStatus: "Approved",
    },
    {
      id: "ckq1f8r2b0001v6t7x3d1a2c",
      name: "INPHIC PG1 Wired Gaming Mouse, Ergonomic Design, Macro Programming, RGB Backlit",
      slug: "gaming-mouse",
      images: [
        "https://img.kwcdn.com/product/fancy/0804fc16-5193-460b-9898-55ff79de23ad.jpg?imageView2/2/w/800/q/70/format/webp",
      ],
      vendor: { name: "GamerWorld" },
      rating: 4.9,
      subCategory: { name: "Accessories" },
      updatedAt: new Date().toISOString(),
      adminApprovalStatus: "Pending",
    },
    {
      id: "ckq1f8r2b0002v6t7x3d1a2d",
      name: "Xiaomi Redmi Watch 5 Active 5.08cm LCD Display Wireless Phone Call 5ATM Alexa Built in",
      slug: "smart-watch",
      images: [
        "https://img.kwcdn.com/product/fancyalgo/toaster-api/toaster-processor-image-cm2in/5f167fc8-3b9c-11f0-b974-0a580a634d11.jpg?imageView2/2/w/800/q/70/format/webp",
      ],
      vendor: "Canonified",
      rating: 5,
      subCategory: "Consumer Electronics",
      updatedAt: new Date().toISOString(),
      adminApprovalStatus: "Rejected",
    },
    {
      id: "ckq1f8r2b0003v6t7x3d1a2e",
      name: "Portable Power Station Power Bank With AC Outlet Nexstorm S81 120W 24000mAh Solar Generator With LED Flashlight",
      slug: "portable-charger",
      images: [
        "https://img.kwcdn.com/product/fancy/b7a2195b-a9b6-4e74-a8f4-0f2dc65e6e54.jpg?imageView2/2/w/800/q/70/format/webp",
      ],
      vendor: { name: "PowerUp" },
      rating: 3.6,
      subCategory: { name: "Accessories" },
      updatedAt: new Date().toISOString(),
      adminApprovalStatus: "Deactivated",
    },
  ];
  return (
    <div>
      <div className="flex md:items-center items-start gap-3 md:flex-row flex-col justify-between mb-4">
        <Heading
          title="Manage Reviews"
          description="Here you can manage all reviewed products for each sellers."
        />
      </div>
      <Client data={mockProducts} />
    </div>
  );
};

export default Page;
