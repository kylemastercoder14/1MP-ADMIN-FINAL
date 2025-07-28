/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn, ensureBlob } from "@/lib/utils";
import { UploadCloud, Trash } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const SingleImageUpload = ({
  onImageUpload,
  defaultValue = "",
  className,
  disabled,
  bucket = "vendors",
  folder,
}: {
  onImageUpload: (url: string) => void;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  bucket?: string;
  folder?: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setImageUrl(defaultValue);
    if (defaultValue) {
      const img = new Image();
      img.src = defaultValue;
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
    }
  }, [defaultValue]);

  const uploadToSupabase = async (file: File) => {
    const supabase = createClient();
    const client = await supabase;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    try {
      setIsUploading(true);
      const blob = await ensureBlob(file);

      const { data: uploadData, error: uploadError } = await client.storage
        .from(bucket)
        .upload(filePath, blob, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;
      if (!uploadData) throw new Error("Upload failed: No data returned");

      const {
        data: { publicUrl },
      } = client.storage.from(bucket).getPublicUrl(uploadData.path);

      if (!publicUrl) throw new Error("Could not generate public URL");

      return { url: publicUrl };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/webp": [".webp"],
      "image/svg+xml": [".svg"],
    },
    maxFiles: 1,
    multiple: false,
    onDrop: async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size exceeds 5MB limit.");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);

      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };

      try {
        toast.loading("Uploading image...");
        const { url } = await uploadToSupabase(file);
        setImageUrl(url);
        onImageUpload(url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Image upload error:", error);
        setImageUrl("");
        toast.error("Image upload failed. Please try again.");
      } finally {
        toast.dismiss();
      }
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ errors }) => {
        errors.forEach((error) => {
          toast.error(error.message);
        });
      });
    },
  });

  const handleRemoveImage = async () => {
    if (!imageUrl) return;

    try {
      const url = new URL(imageUrl);
      const filePath = url.pathname.split(`${bucket}/`).pop();

      if (filePath) {
        const supabase = createClient();
        const client = await supabase;
        const { error } = await client.storage.from(bucket).remove([filePath]);
        if (error) console.error("Error deleting file:", error);
      }
    } catch (error) {
      console.error("Error parsing URL:", error);
    }

    setImageUrl("");
    onImageUpload("");
  };

  return (
    <div className={cn("relative", className)}>
      {!imageUrl ? (
        <div
          {...getRootProps({
            className: `w-full h-[200px] border-2 rounded-md border-dashed border-input flex flex-col items-center justify-center text-center p-4 ${
              disabled || isUploading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`,
          })}
        >
          <input {...getInputProps()} disabled={disabled || isUploading} />
          <UploadCloud className="w-6 h-6 text-muted-foreground" />
          <p className="mt-2 font-medium text-sm text-black mb-1">
            Drag & drop image here
          </p>
          <p className="text-xs text-muted-foreground">
            Or click to browse (1 file, up to 5MB)
          </p>
          <Button
            variant="secondary"
            type="button"
            size="sm"
            className="mt-2"
            disabled={disabled || isUploading}
          >
            {isUploading ? "Uploading..." : "Browse files"}
          </Button>
        </div>
      ) : (
        <div className="relative flex items-center justify-center w-full h-auto min-h-[200px] border border-input rounded-md overflow-hidden bg-gray-50">
          <div className="relative p-4 w-full flex justify-center">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="max-w-full max-h-[400px] object-contain"
              style={{
                width:
                  imageDimensions.width > imageDimensions.height
                    ? "100%"
                    : "auto",
                height:
                  imageDimensions.height > imageDimensions.width
                    ? "100%"
                    : "auto",
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute top-4 right-4 z-10"
              onClick={handleRemoveImage}
              disabled={disabled || isUploading}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleImageUpload;
