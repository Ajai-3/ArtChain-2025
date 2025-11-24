import React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ZoomOverlayProps {
  isOpen: boolean;
  currentImageIndex: number;
  totalImages: number;
  currentArt: {
    art: {
      imageUrl: string;
      title: string;
    };
    user: {
      name: string;
    } | null;
  } | undefined;
  isFullscreen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoHome: () => void;
}

const ZoomOverlay: React.FC<ZoomOverlayProps> = ({
  isOpen,
  currentImageIndex,
  totalImages,
  currentArt,
  isFullscreen,
  onClose,
  onPrev,
  onNext,
  onGoHome,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="relative w-full h-full flex justify-center items-center p-6">
        {currentImageIndex > 0 && (
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full z-10 hover:bg-black/70 cursor-pointer transition-colors"
          >
            <ChevronLeft size={40} className="text-white" />
          </button>
        )}
        {currentImageIndex < totalImages && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full z-10 hover:bg-black/70 cursor-pointer transition-colors"
          >
            <ChevronRight size={40} className="text-white" />
          </button>
        )}
        <img
          src={currentArt?.art?.imageUrl || "/placeholder.png"}
          alt={currentArt?.art?.title}
          className="max-h-full max-w-full object-contain shadow-2xl"
        />
      </div>

      {isFullscreen && currentArt?.user && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white bg-black/50 px-6 py-3 rounded-lg">
          <h3 className="text-2xl font-bold">{currentArt.art.title}</h3>
          <p className="text-lg text-zinc-400">by {currentArt.user.name}</p>
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-zinc-300 transition-colors bg-black/50 hover:bg-black/70 p-3 rounded-full"
      >
        <X size={32} />
      </button>

      {isFullscreen && (
        <button
          onClick={onGoHome}
          className="absolute top-6 left-6 text-white hover:text-zinc-300 flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-3 rounded-full transition-colors"
        >
          <ChevronLeft size={20} /> <span className="font-medium">Home</span>
        </button>
      )}
    </div>
  );
};

export default ZoomOverlay;
