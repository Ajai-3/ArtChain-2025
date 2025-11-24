import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArtImageSectionProps {
  imageUrl: string;
  title: string;
  onImageClick: () => void;
}

const ArtImageSection: React.FC<ArtImageSectionProps> = ({
  imageUrl,
  title,
  onImageClick,
}) => {
  return (
    <div className="relative w-full flex justify-center items-center">
      <img
        src={imageUrl || "/placeholder.png"}
        alt={title}
        className="w-full max-h-[500px] sm:max-h-[400px] md:max-h-[500px] object-contain rounded cursor-zoom-in shadow-sm"
        onClick={onImageClick}
      />
    </div>
  );
};

export default ArtImageSection;
