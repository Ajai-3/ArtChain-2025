import React from "react";
import {
  Dialog,
  DialogContent,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Sparkles, Download, Trash2, Loader2, X } from "lucide-react";
import type { AIGeneratedImage } from "../../../../types/ai";

interface LioraDetailModalProps {
  selectedImage: AIGeneratedImage | null;
  onClose: () => void;
  handleDownload: (url: string) => void;
  handleDeleteClick: (id: string, e: React.MouseEvent) => void;
  isDeleting: boolean;
}

export const LioraDetailModal: React.FC<LioraDetailModalProps> = ({
  selectedImage,
  onClose,
  handleDownload,
  handleDeleteClick,
  isDeleting,
}) => {
  return (
    <Dialog open={!!selectedImage} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border">
        <div className="flex flex-col h-full">
          {/* Image Area */}
          <div className="flex-1 relative bg-black/50 flex items-center justify-center p-4 overflow-hidden">
            {selectedImage && (
              <img
                src={selectedImage.url}
                alt="Zoomed"
                className="max-h-full max-w-full object-contain shadow-2xl rounded-sm"
              />
            )}
          </div>

          {/* Details Footer */}
          <div className="p-6 bg-background border-t border-border">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="px-3 py-1 border-primary/30 bg-primary/5 text-primary"
                  >
                    <Sparkles className="w-3 h-3 mr-1" /> {selectedImage?.model}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">
                    {/* ID Hidden as per request */}
                  </span>
                </div>
                <p className="text-sm md:text-base leading-relaxed text-foreground/90 font-medium">
                  "{selectedImage?.prompt}"
                </p>
              </div>

              <div className="flex gap-3 shrink-0">
                <Button
                  variant="outline"
                  onClick={() =>
                    selectedImage && handleDownload(selectedImage.url)
                  }
                >
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button
                  variant="destructive"
                  onClick={(e) =>
                    selectedImage && handleDeleteClick(selectedImage.id, e)
                  }
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
