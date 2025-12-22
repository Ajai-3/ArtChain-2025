import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import {
  Loader2,
  Wand2,
  Maximize2,
  Download,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import type { AIGeneratedImage } from "../../../../types/ai";

interface LioraImageGridProps {
  isGenerating: boolean;
  model: string;
  allImages: AIGeneratedImage[];
  historyLoading: boolean;
  setSelectedImage: (img: AIGeneratedImage) => void;
  handleDownload: (url: string, e: React.MouseEvent) => void;
  handleDeleteClick: (id: string, e: React.MouseEvent) => void;
  isDeleting: boolean;
}

export const LioraImageGrid: React.FC<LioraImageGridProps> = ({
  isGenerating,
  model,
  allImages,
  historyLoading,
  setSelectedImage,
  handleDownload,
  handleDeleteClick,
  isDeleting,
}) => {
  return (
    <div className="flex-1 overflow-auto p-4 lg:p-6 bg-muted/10">
      {/* Generating State Loader */}
      {isGenerating && (
        <div className="mb-6 p-4 rounded-xl bg-background border border-border shadow-sm animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Creating your masterpiece with {model}...
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {allImages?.map((img: AIGeneratedImage) => (
          <Card
            key={`${img.id}-${img.url}`}
            className="group relative bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Image Container */}
            <div className="aspect-square w-full bg-muted/30 flex items-center justify-center p-2">
              <img
                src={img.url}
                alt={img.prompt}
                className="max-h-full max-w-full object-contain rounded-md shadow-sm"
                loading="lazy"
              />
            </div>

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200"
                onClick={() => setSelectedImage(img)}
                title="Zoom & Details"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200"
                onClick={(e) => handleDownload(img.url, e)}
                title="Download"
              >
                <Download className="w-5 h-5" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md text-red-100 border border-white/20 hover:bg-red-500/80 hover:text-white hover:scale-105 transition-all duration-200"
                onClick={(e) => handleDeleteClick(img.id, e)}
                disabled={isDeleting}
                title="Delete"
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </Button>
            </div>
          </Card>
        ))}

        {!historyLoading && allImages.length === 0 && !isGenerating && (
          <div className="col-span-full flex flex-col items-center justify-center h-64 text-muted-foreground p-6 border-2 border-dashed border-border rounded-xl bg-muted/20">
            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium">No images generated yet</p>
            <p className="text-sm">Start creating by entering a prompt below!</p>
          </div>
        )}
      </div>
    </div>
  );
};
