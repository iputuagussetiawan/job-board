"use client";
import { cn } from "@/lib/utils";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { storage } from "@/config/firebase.config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { set } from "date-fns";
import { on } from "events";
import UploadingProgressStatus from "./uploading-progress";

interface ImagesUploadsProps {
  disabled?: boolean;
  multiple?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
  location: string;
}

interface UploadProgress {
  [key: string]: number;
}
const ImagesUploads = ({
  multiple = true,
  onChange,
  onRemove,
  value,
  location,
}: ImagesUploadsProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    if (!multiple && acceptedFiles.length > 1) {
      toast.error("Error", {
        description: "You can only upload one image",
      });

      return;
    }

    onUpload(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({ onDrop, accept: { "images/*": [] }, multiple });

  const onUpload = async (acceptedFiles: File[]) => {
    const files: File[] = Array.from(acceptedFiles || []);

    try {
      const uploadPromises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const fileName = `${Date.now()}-${file.name}`;
          const fileRef = ref(storage, `${location}/${fileName}`);

          const uploadTask = uploadBytesResumable(fileRef, file, {
            contentType: file.type,
          });

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress((prev) => ({
                ...prev,
                [fileName]: progress,
              }));
            },
            (error) => {
              toast.error("Upload Error", {
                description: (error as Error).message,
              });
              reject(error);
            },
            async () => {
              try {
                const downloadUrl = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                resolve(downloadUrl);
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      });

      const result = await Promise.all(uploadPromises);

      if (multiple) {
        onChange([...value, ...result]);
      } else {
        onChange([result[0]]);
      }

      setUploadProgress({});
    } catch (error) {
      toast.error("Upload Failed", {
        description: (error as Error).message,
      });
    }
  };
  const onDelete = (url: string) => {
    const fileRef = ref(storage, url);
    deleteObject(fileRef)
      .then(() => {
        onRemove(url);
        toast.success("Image Deleted", {
          description: "Image deleted successfully",
        });
      })
      .catch((error) => {
        toast.error("Error deleting image", {
          description: (error as Error).message,
        });
      });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 cursor-pointer">
      <div className="flex items-center justify-center h-96 col-span-3">
        <div
          {...getRootProps({
            className: `w-full h-full flex items-center justify-center  border border-dashed rounded-xl
                    ${isDragActive ? "border-blue-500 bg-blue-50" : ""}
                    ${isDragReject ? "border-red-500 bg-red-50" : ""} 
                    border-neutral-200 bg-neutral-50 cursor-pointer`,
          })}
        >
          <input {...getInputProps()} />
          {Object.keys(uploadProgress).length > 0 ? (
            <div className="flex flex-row gap-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <UploadingProgressStatus key={fileName} progress={progress} />
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 flex items-center justify-center flex-col gap-4">
              <ImagePlus className="h-10 w-10" />
              <p>
                {isDragActive
                  ? "Drop the image here"
                  : multiple
                  ? "Drag & Drop Multiple Images Here"
                  : "Drag & Drop Image Here, or click to select a file"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* display images */}

      {value.length > 0 && (
        <div
          className={cn(
            "grid gap-4 col-span-3",
            multiple
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {value.map((url) => (
            <div
              key={url}
              className="relative w-full h-96 flex items-center justify-center overflow-hidden rounded-md border p-2 "
            >
              <Image
                src={url}
                fill
                className="object-cover"
                alt="uploaded image"
                priority
              />
              <div className="absolute top-2 right-2 cursor-pointer">
                <Button
                  type="button"
                  onClick={() => onDelete(url)}
                  size={"icon"}
                  variant={"destructive"}
                  className="cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
``;
export default ImagesUploads;
