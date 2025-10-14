/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Grip, Trash, LoaderIcon } from "lucide-react";
import { uploadFile, deleteFile } from "@/lib/upload-s3";

type FileState = {
  id: string;
  url: string;
  key?: string;
  isUploading: boolean;
  isBlob?: boolean;
  file?: File;
};

type Props = {
  onImageUpload: (urls: string[]) => void;
  defaultValues?: string[];
  className?: string;
  disabled?: boolean;
  maxImages: number;
  folder?: string;
  allowVideo?: boolean;
};

const MultipleImageUpload = ({
  onImageUpload,
  className,
  defaultValues = [],
  disabled,
  maxImages,
  folder = "uploads",
  allowVideo = false,
}: Props) => {
  const [files, setFiles] = useState<FileState[]>([]);
  const prevCompleted = useRef<string[]>([]);

  // Load default values once
  useEffect(() => {
    if (defaultValues.length > 0) {
      setFiles(
        defaultValues.map((url) => ({
          id: `existing-${url}-${Math.random().toString(36).substr(2, 9)}`,
          url,
          isUploading: false,
          isBlob: false,
        }))
      );
    }
  }, [defaultValues]);

  // Update parent only when completed URLs actually change
  useEffect(() => {
    const completed = files.filter((f) => !f.isUploading).map((f) => f.url).sort();
    const prev = JSON.stringify(prevCompleted.current);
    const next = JSON.stringify(completed);
    if (prev !== next) {
      onImageUpload(completed);
      prevCompleted.current = completed;
    }
  }, [files, onImageUpload]);

  const processBatchUpload = useCallback(
    async (batchFiles: FileState[]) => {
      const uploads = batchFiles.map(async (fileItem) => {
        const file = fileItem.file!;
        const toastId = toast.loading(`Uploading ${file.name}...`);
        try {
          const { url, key } = await uploadFile(file, folder);
          toast.success(`${file.name} uploaded!`, { id: toastId });
          return { ...fileItem, url, key, isUploading: false, isBlob: false };
        } catch (error) {
          console.error(error)
          toast.error(`Failed to upload ${file.name}`, { id: toastId });
          return null;
        }
      });

      const results = await Promise.all(uploads);
      const validResults = results.filter(Boolean) as FileState[];
      setFiles((prev) => [
        ...prev.map((f) =>
          batchFiles.some((b) => b.id === f.id)
            ? validResults.find((r) => r.id === f.id) || f
            : f
        ),
        ...validResults.filter((r) => !prev.some((p) => p.id === r.id)),
      ]);
    },
    [folder]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: allowVideo
      ? {
          "image/*": [],
          "video/mp4": [".mp4"],
        }
      : { "image/*": [] },
    maxFiles: maxImages,
    onDrop: async (acceptedFiles) => {
      if (disabled) return;

      if (files.length + acceptedFiles.length > maxImages) {
        toast.error(`Maximum ${maxImages} files allowed`);
        return;
      }

      const tooLarge = acceptedFiles.filter((f) => f.size > 20 * 1024 * 1024);
      if (tooLarge.length > 0) {
        toast.error(`${tooLarge.length} file(s) exceed 20MB limit`);
        return;
      }

      // Create new files and show preview immediately
      const newFileStates = acceptedFiles.map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: URL.createObjectURL(file),
        isUploading: true,
        isBlob: true,
        file,
      }));

      setFiles((prev) => [...prev, ...newFileStates]);

      // Batch upload
      processBatchUpload(newFileStates);
    },
  });

  const handleRemove = useCallback(
    async (index: number) => {
      const target = files[index];
      if (!target) return;
      if (target.isUploading) {
        toast.warning("Please wait until the upload completes");
        return;
      }

      if (target.key) {
        try {
          await deleteFile(target.key);
          toast.success("File deleted from S3");
        } catch {
          toast.error("Failed to delete from S3");
        }
      }

      if (target.isBlob) URL.revokeObjectURL(target.url);

      setFiles((prev) => prev.filter((_, i) => i !== index));
    },
    [files]
  );

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    setFiles((prev) => {
      const reordered = [...prev];
      const [moved] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, moved);
      return reordered;
    });
  }, []);

  // cleanup
  useEffect(() => {
    return () => {
      files.forEach((f) => f.isBlob && URL.revokeObjectURL(f.url));
    };
  }, [files]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="files" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn("flex items-center gap-3 flex-wrap", className)}
          >
            {files.map((file, index) => (
              <Draggable key={file.id} draggableId={file.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      "relative bg-zinc-100 w-32 h-[120px] rounded-md overflow-hidden border border-input flex items-center",
                      file.isUploading && "opacity-70"
                    )}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="p-2 cursor-grab absolute left-0 top-0 z-20"
                    >
                      <Grip className="h-4 w-4 text-gray-600" />
                    </div>

                    <div className="relative w-full h-full">
                      <div className="z-10 absolute top-1 right-1">
                        <Button
                          variant="destructive"
                          type="button"
                          size="sm"
                          onClick={() => handleRemove(index)}
                          className="h-8 w-8 p-0"
                          disabled={file.isUploading}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>

                      {file.url?.toLowerCase()?.endsWith?.(".mp4") ? (
                        <video
                          controls
                          className="object-cover w-full h-full"
                          src={file.url}
                        />
                      ) : (
                        <img
                          src={file.url}
                          alt={`Uploaded ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      )}

                      {file.isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <LoaderIcon className="size-8 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {files.length < maxImages && (
              <div
                {...getRootProps({
                  className: `w-32 h-[120px] border-[2px] rounded-md border-dashed border-input flex flex-col items-center justify-center ${
                    disabled
                      ? "pointer-events-none opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`,
                })}
              >
                <input {...getInputProps()} />
                <Plus className="w-5 h-5 text-gray-600" />
                <p className="mt-1 text-sm text-muted-foreground">Add File</p>
                <p className="text-xs text-muted-foreground">
                  ({files.length}/{maxImages})
                </p>
              </div>
            )}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MultipleImageUpload;
