// components/ImageCropModal.tsx
import React, { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import type { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "../../../../components/ui/button";
import { X } from "lucide-react";


interface Props {
  imageBase64: string;
  onClose: () => void;
  onUploadComplete: (url: string) => void;
}

const ASPECT_RATIOS = ["1:1", "4:3", "3:4", "16:9", "9:16"];

const ImageCropModal: React.FC<Props> = ({ imageBase64, onClose, onUploadComplete }) => {
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 80, height: 80, x: 10, y: 10 });
  const [isUploading, setIsUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const getCroppedImg = async (): Promise<Blob> => {
    const image = imgRef.current!;
    const canvas = document.createElement("canvas");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelCrop = {
      x: crop.x! * scaleX,
      y: crop.y! * scaleY,
      width: crop.width! * scaleX,
      height: crop.height! * scaleY,
    };

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((res, rej) =>
      canvas.toBlob((blob) => (blob ? res(blob) : rej("Blob failed")), "image/jpeg", 0.95)
    );
  };

  const handleSave = async () => {
    setIsUploading(true);
    try {
      const blob = await getCroppedImg();
      const file = new File([blob], `cropped-${Date.now()}.jpg`, { type: "image/jpeg" });


      onClose();
    } catch (err) {
      console.error("Crop error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
<div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
  <div className="bg-zinc-900 text-white p-6 rounded-lg w-[95vw] md:w-[520px] max-w-[520px] relative">
    <button
      onClick={onClose}
      className="absolute top-2 right-2 bg-main-color text-black rounded-full w-6 h-6 flex items-center justify-center"
    >
      <X size={16} />
    </button>

    <h2 className="text-lg font-semibold mb-4">Crop Image</h2>

  <div className="flex justify-center items-center">
      <ReactCrop
      crop={crop}
      onChange={setCrop}
      aspect={Number(aspectRatio.split(":")[0]) / Number(aspectRatio.split(":")[1])}
    >
      <img
        ref={imgRef}
        src={imageBase64}
        alt="Crop"
        className="w-full h-[300px] object-contain"
      />
    </ReactCrop>
  </div>

    <div className="flex gap-2 mt-4 flex-wrap">
      {ASPECT_RATIOS.map((ratio) => (
        <Button
          key={ratio}
          size="sm"
          variant={aspectRatio === ratio ? "main" : "outline"}
          onClick={() => setAspectRatio(ratio)}
        >
          {ratio}
        </Button>
      ))}
    </div>

    <div className="mt-6 flex justify-end">
      <Button onClick={handleSave} disabled={isUploading} variant="main">
        {isUploading ? "Uploading..." : "Save & Upload"}
      </Button>
    </div>
  </div>
</div>
  );
};

export default ImageCropModal;
