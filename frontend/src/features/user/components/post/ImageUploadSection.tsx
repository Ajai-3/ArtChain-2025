import React, { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import CropperComponent from "./CropperComponent";
import { useUploadArtImageMutation } from "../../hooks/art/useUploadArtImageMutation";

interface ImageUploadSectionProps {
  onClose: () => void;
  onSubmitImage: (file: File, urls: any) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  onClose,
  onSubmitImage,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadMutation = useUploadArtImageMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    const allowedTypes = ["image/jpeg", "image/jpg", "image/webp"];
    const maxSizeMB = 20;
    const fileSizeMB = file.size / (1024 * 1024);

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, and WEBP images are allowed!");
      e.target.value = "";
      return;
    }

    if (fileSizeMB > maxSizeMB) {
      setError("File size cannot exceed 20MB!");
      e.target.value = "";
      return;
    }

    setError(null);

    // ONLY set imageSrc for cropper; remove previewSrc here
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleSaveCrop = (file: File) => {
    // Set previewSrc only after saving
    const reader = new FileReader();
    reader.onload = () => setPreviewSrc(reader.result as string);
    reader.readAsDataURL(file);

    uploadMutation.mutate(file, {
      onSuccess: (res: any) => {
        setError(null);
        onSubmitImage(file, res.data);
      },
      onError: (err: any) => {
        console.error(err);
        setError(err?.response?.data?.message || "Upload failed!");
        setPreviewSrc(null);
      },
    });

    setImageSrc(null); // close cropper
  };

  return (
    <div className="p-6 w-full md:w-1/2 text-white border-r border-zinc-400 dark:border-zinc-700 flex flex-col relative">
      {/* Back button */}
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

      {/* File selection */}
      {!imageSrc && !previewSrc && (
        <label className="w-32 h-32 flex items-center justify-center border rounded cursor-pointer mx-auto">
          <Plus className="h-6 w-6 text-gray-400" />
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.webp"
          />
        </label>
      )}

      {/* Cropper */}
      {imageSrc && (
        <CropperComponent
          imageSrc={imageSrc}
          onCancel={() => setImageSrc(null)}
          onSave={handleSaveCrop}
        />
      )}

      {/* Preview + Uploading overlay */}
      {previewSrc && (
        <div className="relative mt-4 w-full h-96 max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-300 dark:border-zinc-700 shadow-lg flex items-center justify-center bg-gray-100 dark:bg-zinc-800 transition-all duration-300">
          {uploadMutation.isPending && (
            <img
              src={previewSrc}
              alt="Background preview"
              className="absolute inset-0 w-full h-full object-cover filter blur-md opacity-40 transition-opacity duration-300"
              aria-hidden="true"
            />
          )}

          <img
            src={previewSrc}
            alt="Image preview"
            className={`w-full h-full object-contain rounded-xl z-10 transition-all duration-300 ${
              uploadMutation.isPending ? "filter blur-sm opacity-80" : "hover:scale-[1.02]"
            }`}
            loading="lazy"
          />

          {uploadMutation.isPending && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 transition-opacity duration-300">
              <svg
                className="animate-spin h-14 w-14 text-white mb-4 drop-shadow-lg"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Loading"
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-80"
                  fill="currentColor"
                  d="M12 2a10 10 0 0110 10h-2a8 8 0 00-8-8V2z"
                />
              </svg>
              <span className="text-white font-semibold text-lg drop-shadow-md animate-pulse">
                Uploading...
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
};

export default ImageUploadSection;
