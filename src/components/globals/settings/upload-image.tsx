import React, { useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Trash, Loader2 } from "lucide-react";
import { deleteFile, uploadFile } from "@/lib/upload-s3";
import {
  deleteAdminFileFromDatabase,
  uploadAdminFileToDatabase,
} from "@/actions";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

interface UploadImageProps {
  label?: string;
  value: string | null;
  onChange: (val: string | null) => void;
  fallback?: string;
  rounded?: boolean;
  field: "image" | "lightLogo" | "darkLogo";
}

const UploadImage: React.FC<UploadImageProps> = ({
  label,
  value,
  onChange,
  fallback,
  rounded = true,
  field,
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<"upload" | "remove" | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading("upload");
    try {
      onChange(URL.createObjectURL(file)); // temporary preview

      const { url } = await uploadFile(file, "assets", (progress) =>
        console.log("Upload progress:", progress)
      );

      await uploadAdminFileToDatabase(url, field);
      onChange(url);

      toast.success(`${field} uploaded successfully`);
      router.refresh();
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error(`Failed to upload ${field}`);
    } finally {
      setLoading(null);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    setLoading("remove");
    try {
      const bucketUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`;
      const fileKey = value.replace(bucketUrl, "");

      await deleteFile(fileKey);
      await deleteAdminFileFromDatabase(field);

      onChange(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast.success(`${field} removed successfully`);
      router.refresh();
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error(`Failed to remove ${field}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex items-center gap-4">
        <Avatar className={`h-20 w-20 ${rounded ? "" : "rounded-none"}`}>
          <AvatarImage src={value || fallback} />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          <Button
            size="sm"
            onClick={handleUploadClick}
            disabled={loading !== null}
          >
            {loading === "upload" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {loading === "upload" ? "Uploading..." : "Upload"}
          </Button>

          {value && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={loading !== null}
            >
              {loading === "remove" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
              {loading === "remove" ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
