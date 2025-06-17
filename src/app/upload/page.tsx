"use client";

import Button from "@/components/Button";
import { useUserUUID } from "@/store/useUserID";
import { Flex, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ChevronLeft, ImageIcon, Sparkles, UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../client/trpc";

import { UploadResult } from "../api/upload/route";


export async function uploadImage(file: File, subId: string): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sub_id', subId);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = (await res.json()) as UploadResult;

    if (!data.success) {
      return data;
    }

    return data;
  } catch (error: any) {
    const errMessage = error?.message ?? 'Unknown error';


    return { success: false, error: errMessage };
  }
}


export default function UploadPage() {
  const router = useRouter();
  const [currentPicture, setCurrentPicture] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uuid = useUserUUID();
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!currentPicture) {
      setPreviewUrl(null);
      return;
    }

    let cancelled = false;

    // Detect iOS devices
    const isIOS = typeof window !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isIOS) {
      // Use FileReader fallback for iOS
      const reader = new FileReader();
      reader.onloadend = () => {
        if (!cancelled) {
          setPreviewUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(currentPicture);

      return () => {
        cancelled = true;
      };
    } else {
      // Use object URL for other devices
      const url = URL.createObjectURL(currentPicture);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        cancelled = true;
      };
    }
  }, [currentPicture]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragOver to false if we're leaving the drop zone entirely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      setCurrentPicture(files[0]);
    }
  };

  // Detect if device is mobile/touch
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
   const utils = trpc.useUtils(); // or trpc.useContext() in older versions


  return (
    <Flex
      h="100vh"
      w="100vw"
      justify="center"
      align="center"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <Flex
        p="xl"
        h={{
          base: "95vh",
          sm: "80vh",
        }}
        w={{
          base: "95vw",
          sm: "85vw",
          lg: "75vw",
        }}
        style={{
          borderRadius: "var(--mantine-radius-md)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          transition: "all 0.3s ease",
        }}
        direction={{
          base: "column",
          sm: "row",
        }}
        gap="xl"
      >
        {/* Left Side - Controls */}
        <Flex 
          flex={1} 
          justify="center" 
          align="center" 
          direction="column" 
          gap="xl"
        >
          {/* Header */}
          <Flex direction="column" align="center" gap="sm">
            <Flex align="center" gap="xs">
              <ImageIcon size={32} color="rgba(255, 255, 255, 0.9)" />
              <Sparkles size={24} color="rgba(255, 255, 255, 0.7)" />
            </Flex>
            <Text 
              size="xl" 
              fw={700}
              ta="center"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.5px",
              }}
            >
              Share Your Cat&#39;s Story
            </Text>
            <Text 
              size="md" 
              ta="center"
              c="rgba(255, 255, 255, 0.8)"
              style={{
                maxWidth: "280px",
                lineHeight: 1.6,
              }}
            >
              Upload beautiful cat images and let the world see your feline friend&#39;s personality
            </Text>
          </Flex>

          {/* Action Buttons */}
          <Flex 
            direction={{ base: "column", sm: "column" }} 
            gap="md" 
            align="center"
            w="100%"
            maw="300px"
          >
            <SelectPictureButton
              disabled={uploading}
              onChange={(file) => {
                setCurrentPicture(file);
              }}
            />

            <Button
              w='100%'
              color={'rgba(0, 150, 136, 0.8)'}
              disabled={!currentPicture || uploading}
              icon={!uploading ? 'Upload' : 'Uploading'}
              onClick={async () => {
                if (currentPicture) {
                  if (!uuid) {
                    notifications.show({
                      title: "No User ID",
                      message: "Please refresh the page to generate a user ID.",
                      color: "red",
                    });
                    return;
                  }
                  setUploading(true);
                  notifications.show({
                    title: "Uploading Image",
                    message: "Please wait while your image is being uploaded.",
                    color: "blue",
                  });
                  
                  const url = await uploadImage(currentPicture, uuid);
  
                  setUploading(false);
                  if (!url.success) {
                    notifications.show({
                      title: "Upload Failed",
                      message: "There was an error uploading your image. Please try again.",
                      color: "red",
                    });
                    return;
                  }
                 // Invalidate the specific tRPC query
                  await utils.cats.get.invalidate({ userId: uuid || "" });
                  
                  notifications.show({
                    title: "Upload Successful",
                    message: "Your image has been uploaded successfully.",
                    color: "green",
                  });
                  
                  router.push("/");
                } else {
                  notifications.show({
                    title: "No Image Selected",
                    message: "Please select an image to upload.",
                    color: "red",
                  });
                }
              }}
            >
              {!uploading ? (currentPicture ? "Upload Image" : "Select Image First") : "Uploading..."}
            </Button>

            <Button
              
              size="md"
              radius="lg"
              color="rgba(255, 255, 255, 0.8)"
              c='rgba(44, 62, 80, 0.9)'
              leftSection={<ChevronLeft size={18} />}
              onClick={() => {
                router.push("/");
              }}
              disabled={uploading}
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "14px",
                transition: "all 0.2s ease",
              }}
            >
              Back to Home
            </Button>
          </Flex>
        </Flex>

        {/* Right Side - Preview */}
        <Flex 
          flex={1} 
          justify="center" 
          align="center" 
          direction="column"
        >
          <Flex
            w="100%"
            h="100%"
            mah="400px"
            justify="center"
            align="center"
            direction="column"
            p="sm"
            style={{
              borderRadius: "var(--mantine-radius-md)",
              border: dragOver 
                ? "2px dashed rgba(0, 150, 136, 0.8)" 
                : previewUrl 
                  ? "2px solid rgba(255, 255, 255, 0.1)"
                  : "2px dashed rgba(255, 255, 255, 0.3)",
              background: dragOver
                ? "rgba(0, 150, 136, 0.1)"
                : previewUrl
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(255, 255, 255, 0.02)",
              transition: "all 0.3s ease",
              cursor: previewUrl ? "default" : "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onDragOver={!isMobile ? handleDragOver : undefined}
            onDragEnter={!isMobile ? handleDragEnter : undefined}
            onDragLeave={!isMobile ? handleDragLeave : undefined}
            onDrop={!isMobile ? handleDrop : undefined}
          >
            {previewUrl ? (
              <Flex direction="column" align="center" gap="md" w="100%" h="100%" justify={"center"}>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={200}
                  height={200}
                  style={{
                    borderRadius: "var(--mantine-radius-md)",
                    maxWidth: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                  unoptimized
                />
                <Text 
                  visibleFrom="md"
                  size="sm" 
                  c="rgba(255, 255, 255, 0.7)"
                  ta="center"
                  fw={500}
                >
                  Looking great! Ready to upload? 🐱
                </Text>
              </Flex>
            ) : (
              <Flex 
                justify="center" 
                align="center" 
                direction="column" 
                gap="lg"
                ta="center"
                h="100%"
              >
                <UploadCloudIcon 
                  size={80} 
                  color="rgba(255, 255, 255, 0.4)" 
                  style={{
                    animation: dragOver ? "bounce 1s infinite" : "none",
                  }}
                />
                <Flex direction="column" gap="xs">
                  {!isMobile ? (
                    <>
                      <Text 
                        size="lg" 
                        fw={600}
                        c="rgba(255, 255, 255, 0.8)"
                      >
                        Drop your image here
                      </Text>
                      <Text 
                        size="sm" 
                        c="rgba(255, 255, 255, 0.6)"
                      >
                        or click &quot;Select Picture&quot; below
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text 
                        size="lg" 
                        fw={600}
                        c="rgba(255, 255, 255, 0.8)"
                      >
                        Image Preview
                      </Text>
                      <Text 
                        size="sm" 
                        c="rgba(255, 255, 255, 0.6)"
                      >
                        Click &quot;Select Picture&quot; to choose an image
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </Flex>
  );
}

type SelectPictureButtonProps = {
  disabled?: boolean;
  onChange?: (file: File) => void;
};

function SelectPictureButton(props: SelectPictureButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        w='100%'
        icon="Image"
        color="rgba(0, 200, 136, 0.8)"
        onClick={() => {
          if (!props.disabled) {
            inputRef.current?.click();
          }
        }}
      >
        Select Picture
      </Button>
      <input
        type="file"
        id="file-upload-input"
        style={{ display: "none" }}
        accept="image/*"
        disabled={props.disabled}
        ref={inputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            props.onChange?.(file);
          }
        }}
      />
    </>
  );
}