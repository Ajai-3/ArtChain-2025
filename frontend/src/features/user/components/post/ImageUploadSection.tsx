import React, { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import CropperComponent from "./CropperComponent";

interface ImageUploadSectionProps {
  onClose: () => void;
  onSubmitImage: (file: File) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  onClose,
  onSubmitImage,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = "";
    }
  };

  return (
    <div className="p-6 w-full md:w-1/2 text-white border-r border-zinc-400 dark:border-zinc-700 flex flex-col">
      <div className="flex justify-start">
        <Button
          onClick={onClose}
          className="hover:text-main-color"
          variant="transparant"
        >
          <ArrowLeft /> Back
        </Button>
      </div>

      <h2 className="text-lg font-semibold mb-4">Upload Image</h2>

      {!imageSrc ? (
        <label className="w-32 h-32 flex items-center justify-center border rounded cursor-pointer mx-auto">
          <Plus className="h-6 w-6 text-gray-400" />
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      ) : (
        <CropperComponent
          imageSrc={imageSrc}
          onCancel={() => setImageSrc(null)}
          onSave={(file) => {
            onSubmitImage(file);
            setImageSrc(null);
          }}
        />
      )}
    </div>
  );
};

export default ImageUploadSection;
