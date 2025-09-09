import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "../../../../components/ui/button";

interface CropperComponentProps {
  imageSrc: string;
  originalFileType: string;
  onCancel: () => void;
  onSave: (file: File, aspectRatio: string) => void; 
}

const ASPECT_RATIOS = [
  { label: "1:1", value: 1 / 1 },
  { label: "3:5", value: 3 / 5 },
  { label: "4:5", value: 4 / 5 },
  { label: "16:9", value: 16 / 9 },
];

function getCroppedImg(imageSrc: string, crop: any, fileType: string): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");
      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

      let extension = "jpg";
      if (fileType === "image/webp") extension = "webp";
      else if (fileType === "image/jpeg" || fileType === "image/jpg") extension = "jpg";

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Blob error");
          resolve(new File([blob], `cropped-image.${extension}`, { type: fileType }));
        },
        fileType,
        0.95
      );
    };
    image.onerror = () => reject("Image load error");
  });
}

const CropperComponent: React.FC<CropperComponentProps> = ({ imageSrc, originalFileType, onCancel, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(ASPECT_RATIOS[0].value);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, originalFileType);
    const arLabel = ASPECT_RATIOS.find((ar) => ar.value === aspect)?.label || "1:1";
    onSave(croppedFile, arLabel); // send file + aspect ratio
  };

  return (
    <div className="flex flex-col w-full items-center gap-4">
      <div className="relative w-full h-[360px] bg-zinc-700 rounded-lg overflow-hidden">
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
          style={{
            containerStyle: { width: "100%", height: "100%" },
            mediaStyle: { width: "100%", height: "100%", objectFit: "contain" },
          }}
        />
      </div>

      <div className="flex gap-2 justify-center w-full">
        {ASPECT_RATIOS.map((ar) => (
          <Button key={ar.label} onClick={() => setAspect(ar.value)} variant={aspect === ar.value ? "default" : "outline"}>
            {ar.label}
          </Button>
        ))}
      </div>

      <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />

      <div className="flex gap-4 justify-center w-full">
        <Button onClick={handleSave} variant="main">Save & Upload</Button>
        <Button onClick={onCancel} className="bg-red-500 hover:bg-red-600 text-white">Cancel</Button>
      </div>
    </div>
  );
};

export default CropperComponent;
