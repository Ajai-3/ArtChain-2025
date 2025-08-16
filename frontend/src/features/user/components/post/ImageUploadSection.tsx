import { Plus } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import React, { useRef, useState } from "react";
import ImageCropModal from "../image/ImageCropModal";
import { Button } from "../../../../components/ui/button";

interface ImageUploadSectionProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
   onClose: () => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ 
  images, 
  setImages,
  onClose 
}) => {
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log(images)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (images.length >= 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadComplete = (url: string) => {
    setImages((prev) => {
      const updated = [...prev, url];
      if (updated.length === 1) setMainImageIndex(0);
      return updated;
    });
    setTempImage(null);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);

    if (index === mainImageIndex) {
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      setMainImageIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="p-6 w-full md:w-1/2 text-white border-r border-zinc-400 dark:border-zinc-700">
    <Button onClick={onClose} className="hover:text-main-color" variant="transparant">
      <ArrowLeft /> Back
    </Button>
      <h2 className="text-lg font-semibold mb-4">Upload Images</h2>

      <div className="flex flex-col justify-center items-center">
        {images.length > 0 && (
          <div className="mb-8">
            <img
              src={images[mainImageIndex]}
              alt="Main Preview"
              className="w-full h-96 object-contain rounded border"
            />
          </div>
        )}

        <div className="flex gap-2 mb-4 flex-wrap">
          {images.map((url, idx) => (
            <div key={idx} className="relative">
              <img
                src={url}
                onClick={() => setMainImageIndex(idx)}
                className={`w-16 h-16 object-cover border rounded cursor-pointer ${
                  idx === mainImageIndex ? "ring-2 ring-main-color" : ""
                }`}
                alt={`Uploaded ${idx}`}
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}

          {images.length < 3 && (
            <Button
              variant="outline"
              className="w-16 h-16 flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="h-16 w-16 text-gray-400" />
            </Button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {tempImage && (
        <ImageCropModal
          imageBase64={tempImage}
          onClose={() => setTempImage(null)}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
};

export default ImageUploadSection;