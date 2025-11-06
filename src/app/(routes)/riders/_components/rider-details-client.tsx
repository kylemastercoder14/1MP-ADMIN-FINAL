"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDistanceToNowStrict, format } from "date-fns";
import { Rider } from "@prisma/client";
import {
  IconMail,
  IconPhone,
  IconCalendar,
  IconGenderBigender,
  IconBike,
  IconLicense,
  IconId,
  IconFileDescription,
  IconReceipt,
  IconPhoto,
  IconCheck,
  IconX,
  IconClock,
  IconClipboardList,
} from "@tabler/icons-react";
import ImageZoom from "@/components/globals/image-zoom";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const Client = ({
  rider,
  totalOrders,
}: {
  rider: (Rider & { orders?: { id: string }[] }) | null;
  totalOrders: number;
}) => {
  const router = useRouter();
  const [openAttachment, setOpenAttachment] = useState({
    toggle: false,
    data: "",
  });

  if (!rider) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Image
            src="/images/empty.svg"
            alt="Rider not found"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-medium text-gray-700">Rider not found</h3>
          <p className="text-gray-500">
            The rider you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/riders")} variant="outline">
            Back to Riders
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <div className="bg-green-200/30 inline-block text-green-600 text-xs py-1 font-semibold rounded-sm px-3">
            Approved
          </div>
        );
      case "Under Review":
        return (
          <div className="bg-blue-200/30 inline-block text-blue-600 text-xs py-1 font-semibold rounded-sm px-3">
            Under Review
          </div>
        );
      case "Rejected":
        return (
          <div className="bg-red-200/30 inline-block text-red-600 text-xs py-1 font-semibold rounded-sm px-3">
            Rejected
          </div>
        );
      case "Pending":
        return (
          <div className="bg-orange-200/30 inline-block text-orange-600 text-xs py-1 font-semibold rounded-sm px-3">
            Pending
          </div>
        );
      default:
        return (
          <div className="bg-gray-200/30 inline-block text-gray-600 text-xs py-1 font-semibold rounded-sm px-3">
            {status}
          </div>
        );
    }
  };

  return (
    <>
      {openAttachment.toggle && (
        <ImageZoom
          src={openAttachment.data}
          onClose={() => setOpenAttachment({ toggle: false, data: "" })}
        />
      )}
      <div className="mb-5">
        <Button
          variant="ghost"
          onClick={() => router.push("/riders")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Riders
        </Button>
      </div>

      <div className="grid mb-5 lg:grid-cols-13 grid-cols-1 gap-5">
        {/* Profile Card */}
        <div className="lg:col-span-4">
          <div className="flex flex-col items-start bg-gradient-to-r from-[#800020] to-[#a01530] rounded-md p-4 ring-2 ring-white/10 shadow-lg">
            <div className="flex items-center space-x-4 w-full">
              <div className="relative size-20 rounded-full overflow-hidden border-2 border-green-200 bg-white">
                {rider.profileImg ? (
                  <Image
                    src={rider.profileImg}
                    alt={rider.name || "Rider Image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl font-bold text-[#800020]">
                    {rider.name?.charAt(0).toUpperCase() || "R"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-white text-lg font-semibold">
                  {rider.name || "Unknown Rider"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`bg-${
                      rider.onDuty ? "green" : "gray"
                    }-500 rounded-full size-2`}
                  />
                  <p className="text-xs text-gray-300">
                    {rider.onDuty ? "On Duty" : "Off Duty"}
                  </p>
                </div>
                <div className="mt-2">{getStatusBadge(rider.adminApproval)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Column 1 */}
        <div className="lg:col-span-3 ml-5 mt-5 space-y-8">
          <div className="flex items-center space-x-2">
            <IconClipboardList className="text-gray-500" />
            <div className="flex items-center space-x-2">
              <p className="text-base text-gray-500">Total Orders:</p>
              <p className="font-medium text-base text-[#800020]">
                {totalOrders.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <IconMail className="text-gray-500" />
            <div className="flex items-center space-x-2">
              <p className="text-base text-gray-500">Email Verified:</p>
              {rider.isEmailVerified ? (
                <IconCheck className="text-green-600 size-5" />
              ) : (
                <IconX className="text-red-600 size-5" />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <IconClock className="text-gray-500" />
            <div className="flex items-center space-x-2">
              <p className="text-base text-gray-500">Joined:</p>
              <p className="font-medium text-base text-[#800020]">
                {formatDistanceToNowStrict(rider.createdAt)} ago
              </p>
            </div>
          </div>
        </div>

        {/* Stats Column 2 */}
        <div className="lg:col-span-3 ml-5 mt-5 space-y-8">
          <div className="flex items-center space-x-2">
            <IconBike className="text-gray-500" />
            <div className="flex items-center space-x-2">
              <p className="text-base text-gray-500">Vehicle Type:</p>
              <p className="font-medium text-base text-[#800020] capitalize">
                {rider.vehicleType || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <IconId className="text-gray-500" />
            <div className="flex items-center space-x-2">
              <p className="text-base text-gray-500">Plate Number:</p>
              <p className="font-medium text-base text-[#800020]">
                {rider.plateNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <IconLicense className="text-gray-500" />
            <div className="flex items-center space-x-2">
              <p className="text-base text-gray-500">License Number:</p>
              <p className="font-medium text-base text-[#800020]">
                {rider.licenseNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Column 3 */}
        <div className="lg:col-span-3 ml-5 mt-5 space-y-8">
          <div className="flex items-center space-x-2">
            <IconBike className="text-gray-500" />
            <div className="flex items-center space-x-2">
              <p className="text-base text-gray-500">Vehicle Ownership:</p>
              <p className="font-medium text-base text-[#800020] capitalize">
                {rider.vehicleOwnerShip || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <IconPhone className="text-gray-500" />
            <div className="flex items-center space-x-2">
              <p className="text-base text-gray-500">Phone:</p>
              <p className="font-medium text-base text-[#800020]">
                {rider.phoneNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <IconMail className="text-gray-500" />
            <div className="flex items-center space-x-2">
              <p className="text-base text-gray-500">Email:</p>
              <p className="font-medium text-base text-[#800020] truncate">
                {rider.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-lg border p-6 mb-5">
        <h3 className="text-xl font-bold tracking-tight mb-5">
          Personal Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <IconMail className="text-gray-500 size-5" />
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium text-base">{rider.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <IconPhone className="text-gray-500 size-5" />
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium text-base">
                {rider.phoneNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <IconGenderBigender className="text-gray-500 size-5" />
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium text-base capitalize">
                {rider.gender || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <IconCalendar className="text-gray-500 size-5" />
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-base">
                {rider.dateOfBirth || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle & License Information Section */}
      <div className="bg-white rounded-lg border p-6 mb-5">
        <h3 className="text-xl font-bold tracking-tight mb-5">
          Vehicle & License Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <IconBike className="text-gray-500 size-5" />
            <div>
              <p className="text-sm text-gray-500">Vehicle Type</p>
              <p className="font-medium text-base capitalize">
                {rider.vehicleType || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <IconId className="text-gray-500 size-5" />
            <div>
              <p className="text-sm text-gray-500">Plate Number</p>
              <p className="font-medium text-base">
                {rider.plateNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <IconLicense className="text-gray-500 size-5" />
            <div>
              <p className="text-sm text-gray-500">License Number</p>
              <p className="font-medium text-base">
                {rider.licenseNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <IconBike className="text-gray-500 size-5" />
            <div>
              <p className="text-sm text-gray-500">Vehicle Ownership</p>
              <p className="font-medium text-base capitalize">
                {rider.vehicleOwnerShip || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-lg border p-6 mb-5">
        <h3 className="text-xl font-bold tracking-tight mb-5">Documents</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Profile Image */}
          {rider.profileImg && (
            <div>
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <IconPhoto className="size-4" />
                Profile Image
              </p>
              <div
                className="relative h-48 w-full rounded-md overflow-hidden cursor-pointer border hover:opacity-80 transition-opacity"
                onClick={() =>
                  setOpenAttachment({
                    toggle: true,
                    data: rider.profileImg as string,
                  })
                }
              >
                <Image
                  src={rider.profileImg}
                  alt="Profile Image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* License ID Image */}
          {rider.licenseIdImg && (
            <div>
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <IconId className="size-4" />
                License ID
              </p>
              <div
                className="relative h-48 w-full rounded-md overflow-hidden cursor-pointer border hover:opacity-80 transition-opacity"
                onClick={() =>
                  setOpenAttachment({
                    toggle: true,
                    data: rider.licenseIdImg as string,
                  })
                }
              >
                <Image
                  src={rider.licenseIdImg}
                  alt="License ID"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Certificate of Registration */}
          {rider.certRegImg && (
            <div>
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <IconFileDescription className="size-4" />
                Certificate of Registration
              </p>
              <div
                className="relative h-48 w-full rounded-md overflow-hidden cursor-pointer border hover:opacity-80 transition-opacity"
                onClick={() =>
                  setOpenAttachment({
                    toggle: true,
                    data: rider.certRegImg as string,
                  })
                }
              >
                <Image
                  src={rider.certRegImg}
                  alt="Certificate of Registration"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Official Receipt */}
          {rider.officialReceiptImg && (
            <div>
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <IconReceipt className="size-4" />
                Official Receipt
              </p>
              <div
                className="relative h-48 w-full rounded-md overflow-hidden cursor-pointer border hover:opacity-80 transition-opacity"
                onClick={() =>
                  setOpenAttachment({
                    toggle: true,
                    data: rider.officialReceiptImg as string,
                  })
                }
              >
                <Image
                  src={rider.officialReceiptImg}
                  alt="Official Receipt"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Vehicle Back Image */}
          {rider.vehicleBackImg && (
            <div>
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <IconPhoto className="size-4" />
                Vehicle Back Image
              </p>
              <div
                className="relative h-48 w-full rounded-md overflow-hidden cursor-pointer border hover:opacity-80 transition-opacity"
                onClick={() =>
                  setOpenAttachment({
                    toggle: true,
                    data: rider.vehicleBackImg as string,
                  })
                }
              >
                <Image
                  src={rider.vehicleBackImg}
                  alt="Vehicle Back Image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Show message if no documents */}
        {!rider.profileImg &&
          !rider.licenseIdImg &&
          !rider.certRegImg &&
          !rider.officialReceiptImg &&
          !rider.vehicleBackImg && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Image
                  src="/images/empty.svg"
                  alt="No documents found"
                  width={200}
                  height={200}
                />
                <h3 className="text-xl font-medium text-gray-700">
                  No documents available
                </h3>
                <p className="text-gray-500">
                  This rider hasn&apos;t uploaded any documents yet.
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Account Status Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-bold tracking-tight mb-5">Account Status</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Admin Approval Status</p>
            <div>{getStatusBadge(rider.adminApproval)}</div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Duty Status</p>
            <div
              className={`inline-block text-xs py-1 font-semibold rounded-sm px-3 ${
                rider.onDuty
                  ? "bg-green-200/30 text-green-600"
                  : "bg-gray-200/30 text-gray-600"
              }`}
            >
              {rider.onDuty ? "On Duty" : "Off Duty"}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Email Verification</p>
            <div className="flex items-center gap-2">
              {rider.isEmailVerified ? (
                <>
                  <IconCheck className="text-green-600 size-5" />
                  <span className="font-medium text-green-600">Verified</span>
                </>
              ) : (
                <>
                  <IconX className="text-red-600 size-5" />
                  <span className="font-medium text-red-600">Not Verified</span>
                </>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Account Created</p>
            <p className="font-medium text-base">
              {format(new Date(rider.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Last Updated</p>
            <p className="font-medium text-base">
              {format(new Date(rider.updatedAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Client;


