import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "../../../../../components/ui/button";

interface ProfileImageCropperProps {
  file: File;
  onCancel: () => void;
  onSave: (file: File) => void;
}

function getCroppedImg(imageSrc: string, crop: any): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject("Blob error");
        resolve(new File([blob], "profile-image.png", { type: "image/png" }));
      }, "image/png");
    };
    image.onerror = () => reject("Image load error");
  });
}

const ProfileImageCropper: React.FC<ProfileImageCropperProps> = ({
  file,
  onCancel,
  onSave,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Convert file to data URL
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
    onSave(croppedFile);
  };

  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-black bg-opacity-60 m-0 p-0">
      <div className="relative w-full max-w-md bg-zinc-200 dark:bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-600 dark:border-zinc-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-black dark:text-white">Crop Profile Image</h2>
          <Button variant="transparant" size="lg" onClick={onCancel}>
            X
          </Button>
        </div>

        {/* Cropper */}
        <div className="relative w-full h-96 bg-zinc-300 dark:bg-zinc-800">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="round"
            showGrid
          />
        </div>

        {/* Zoom slider */}
        <div className="px-6 py-4 flex flex-col items-center">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex justify-end gap-4 border-t border-zinc-300 dark:border-zinc-700">
          <Button variant="main" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageCropper;
