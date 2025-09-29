"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsData } from "@/types";
import Image from "next/image";
import { useAddressData } from "@/lib/address-selection";
import UploadImage from "./upload-image";
import { toast } from "sonner";
import { updateBasicInfo, updateCompanyInfo } from "@/actions";
import { useRouter } from "next/navigation";

const GeneralSettings = ({ data }: { data: SettingsData | null }) => {
  const router = useRouter();
  const [lightLogo, setLightLogo] = useState(data?.admin?.lightLogo);
  const [darkLogo, setDarkLogo] = useState(data?.admin?.darkLogo);
  const [profileImage, setProfileImage] = useState(data?.admin?.image);
  const [email, setEmail] = useState(data?.admin?.email);
  const [companyNumber, setCompanyNumber] = useState(
    data?.admin?.companyNumber
  );
  const [companyName, setCompanyName] = useState(data?.admin?.companyName);
  const [companyTagLine, setCompanyTagLine] = useState(
    data?.admin?.companyTagLine
  );
  const [selectedRegionName, setSelectedRegionName] = useState(
    data?.admin?.region || ""
  );
  const [selectedProvinceName, setSelectedProvinceName] = useState(
    data?.admin?.province || ""
  );
  const [selectedMunicipalityName, setSelectedMunicipalityName] = useState(
    data?.admin?.municipality || ""
  );
  const [selectedBarangayName, setSelectedBarangayName] = useState(
    data?.admin?.barangay
  );
  const [companyAddress, setCompanyAddress] = useState(
    data?.admin?.companyAddress
  );
  const [zipCode, setZipCode] = useState(data?.admin?.zipCode);
  const [commission, setCommission] = useState(data?.admin?.tax);

  const [loading, setLoading] = useState<"basic" | "company" | null>(
    null
  );

  const {
    regionOptions,
    provinceOptions,
    municipalityOptions,
    barangayOptions,
  } = useAddressData(
    selectedRegionName,
    selectedProvinceName,
    selectedMunicipalityName
  );

  const handleSubmitBasic = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading("basic");

    try {
      const response = await updateBasicInfo(
        email!,
        companyNumber!,
        data?.admin?.id as string
      );
      if (response.error) {
        toast.error(response.error);
      }

      toast.success("Basic information updated");
      router.refresh();
    } catch (error) {
      console.error("Error updating basic information:", error);
      toast.error(`Failed to update basic information`);
    } finally {
      setLoading(null);
    }
  };

  const handleSubmitCompany = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading("company");

    try {
      const response = await updateCompanyInfo(
        companyName!,
        companyTagLine!,
        selectedRegionName!,
        selectedProvinceName!,
        selectedMunicipalityName!,
        selectedBarangayName!,
        companyAddress!,
        zipCode!,
        commission!,
        data?.admin?.id as string
      );
      if (response.error) {
        toast.error(response.error);
      }

      toast.success("Company information updated");
      router.refresh();
    } catch (error) {
      console.error("Error updating company information:", error);
      toast.error(`Failed to update company information`);
    } finally {
      setLoading(null);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-balance">
          General Information
        </h1>
      </div>

      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <UploadImage
              label="Profile Image"
              value={profileImage || ""}
              onChange={setProfileImage}
              fallback="https://static.vecteezy.com/system/resources/previews/009/636/683/original/admin-3d-illustration-icon-png.png"
              field="image"
            />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading === "basic"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Company number</Label>
              <div className="flex gap-2">
                <Select disabled defaultValue="ph">
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ph">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_the_Philippines.svg/1920px-Flag_of_the_Philippines.svg.png"
                        alt="PH"
                        width={20}
                        height={20}
                        className="mr-1"
                      />
                      +63
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="flex-1"
                  placeholder="9123456789"
                  value={companyNumber || ""}
                  onChange={(e) => setCompanyNumber(e.target.value)}
                  disabled={loading === "basic"}
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleSubmitBasic}
            disabled={loading === "basic"}
            variant="primary"
            className="mt-5 ml-auto flex items-center justify-end"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={companyName || ""}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="1 Market Philippines"
                disabled={loading === "company"}
              />
            </div>

            <div className="space-y-2">
              <Label>Company Tag Line</Label>
              <Input
                value={companyTagLine || ""}
                onChange={(e) => setCompanyTagLine(e.target.value)}
                placeholder="Your one online place to find all the businesses in your neighborhood."
                disabled={loading === "company"}
              />
            </div>

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select
                  defaultValue={selectedRegionName || ""}
                  onValueChange={(value) => setSelectedRegionName(value)}
                  disabled={loading === "company"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map((item) => (
                      <SelectItem value={item} key={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Province</Label>
                <Select
                  defaultValue={selectedProvinceName || ""}
                  onValueChange={(value) => setSelectedProvinceName(value)}
                  disabled={!selectedRegionName || loading === "company"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinceOptions.map((item) => (
                      <SelectItem value={item} key={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Municipality</Label>
                <Select
                  defaultValue={selectedMunicipalityName || ""}
                  onValueChange={(value) => setSelectedMunicipalityName(value)}
                  disabled={
                    !selectedRegionName ||
                    !selectedProvinceName ||
                    loading === "company"
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select municipality" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalityOptions.map((item) => (
                      <SelectItem value={item} key={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Barangay</Label>
                <Select
                  defaultValue={selectedBarangayName || ""}
                  onValueChange={(value) => setSelectedBarangayName(value)}
                  disabled={
                    !selectedRegionName ||
                    !selectedProvinceName ||
                    !selectedMunicipalityName ||
                    loading === "company"
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select barangay" />
                  </SelectTrigger>
                  <SelectContent>
                    {barangayOptions.map((item) => (
                      <SelectItem value={item} key={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid lg:grid-cols-10 grid-cols-1 gap-6">
              <div className="space-y-2 lg:col-span-8">
                <Label>Company Address</Label>
                <Input
                  value={companyAddress || ""}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  disabled={loading === "company"}
                  placeholder="C-11 Manlunas St."
                />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label>Zip Code</Label>
                <Input
                  value={zipCode || ""}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="1006"
                  disabled={loading === "company"}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission">Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g. 10 for 10% per transaction"
                value={commission || 0}
                onChange={(e) =>
                  setCommission(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                This percentage will be deducted from each successful
                transaction as your profit.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleSubmitCompany}
            disabled={loading === "company"}
            className="mt-5 ml-auto flex items-center justify-end"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Other Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <UploadImage
              label="Light Logo"
              value={lightLogo || ""}
              onChange={setLightLogo}
              fallback="/main/logo-light.png"
              rounded={false}
              field="lightLogo"
            />

            <UploadImage
              label="Dark Logo"
              value={darkLogo || ""}
              onChange={setDarkLogo}
              fallback="/main/logo-dark.png"
              rounded={false}
              field="darkLogo"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
