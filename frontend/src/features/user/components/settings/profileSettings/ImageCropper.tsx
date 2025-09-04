import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "../../../../../components/ui/button";

interface ImageCropperProps {
  file: File;
  aspect: number; // ratio: banner = 16/9, background = 4/3 etc
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
        resolve(new File([blob], "cropped-image.png", { type: "image/png" }));
      }, "image/png");
    };
    image.onerror = () => reject("Image load error");
  });
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  file,
  aspect,
  onCancel,
  onSave,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden bg-zinc-800">
        {/* Header */}
        <div className="px-6 py-3 border-b border-zinc-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Crop Image</h2>
          <Button variant="outline" size="sm" onClick={onCancel}>
            X
          </Button>
        </div>

        {/* Cropper */}
        <div className="relative w-full h-80 bg-zinc-700">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect"
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
        <div className="px-6 py-4 flex justify-end gap-4 border-t border-zinc-700">
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

export default ImageCropper;
