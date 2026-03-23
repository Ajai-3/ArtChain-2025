import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Switch } from "../../../../components/ui/switch";
import { useUpdateArtPost } from "../../hooks/art/useUpdateArtPost";
import CustomLoader from "../../../../components/CustomLoader";
import type { ArtPostResponseDTO } from "../../hooks/art/useGetAllArt";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

interface EditArtModalProps {
  isOpen: boolean;
  onClose: () => void;
  art: ArtPostResponseDTO;
}

export const EditArtModal: React.FC<EditArtModalProps> = ({ isOpen, onClose, art }) => {
  const [title, setTitle] = useState(art.title || "");
  const [description, setDescription] = useState(art.description || "");
  const [commentingDisabled, setCommentingDisabled] = useState(art.commentingDisabled || false);
  const [downloadingDisabled, setDownloadingDisabled] = useState(art.downloadingDisabled || false);
  const [isForSale, setIsForSale] = useState(art.isForSale || false);
  const [artcoins, setArtcoins] = useState(art.artcoins || 0);
  const artCoinValue = useSelector((state: RootState) => state.platform.artCoinRate);

  const fiatPreview = (artcoins || 0) * artCoinValue;

  const { mutate: updateArt, isPending } = useUpdateArtPost();

  // Dirty state — only enable save when something changed
  const isDirty =
    title !== (art.title || "") ||
    description !== (art.description || "") ||
    commentingDisabled !== (art.commentingDisabled || false) ||
    downloadingDisabled !== (art.downloadingDisabled || false) ||
    isForSale !== (art.isForSale || false) ||
    artcoins !== (art.artcoins || 0);

  useEffect(() => {
    if (isOpen) {
      setTitle(art.title || "");
      setDescription(art.description || "");
      setCommentingDisabled(art.commentingDisabled || false);
      setDownloadingDisabled(art.downloadingDisabled || false);
      setIsForSale(art.isForSale || false);
      setArtcoins(art.artcoins || 0);
    }
  }, [isOpen, art]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateArt(
      {
        id: art.id,
        title,
        description,
        commentingDisabled,
        downloadingDisabled,
        isForSale,
        priceType: "artcoin",
        artcoins,
        fiatPrice: fiatPreview,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 scrollbar overflow-y-scroll flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="text-xl font-semibold">Edit Artwork</DialogTitle>
        </DialogHeader>

        <div
          className="overflow-y-auto flex-1 px-6 py-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--main-color, #22c55e) transparent",
          }}
        >
          <form id="edit-art-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Artwork Preview */}
            <div className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center" style={{ maxHeight: "220px" }}>
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-[220px] object-contain"
              />
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  variant="green-focus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Art title..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your art..."
                  className="min-h-[90px] resize-none focus-visible:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Post Settings
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Turn off commenting</h4>
                  <p className="text-xs text-zinc-500">You can edit this anytime from the menu.</p>
                </div>
                <Switch
                  checked={commentingDisabled}
                  onCheckedChange={setCommentingDisabled}
                  variant="green"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Turn Off Downloading</h4>
                  <p className="text-xs text-zinc-500">Others won't be able to download your artwork.</p>
                </div>
                <Switch
                  checked={downloadingDisabled}
                  onCheckedChange={setDownloadingDisabled}
                  variant="green"
                />
              </div>
            </div>

            {/* For Sale */}
            <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Available for Sale</h4>
                  <p className="text-xs text-zinc-500">Enable to set a price for your artwork</p>
                </div>
                <Switch checked={isForSale} onCheckedChange={setIsForSale} variant="green" />
              </div>

              {isForSale && (
                <div className="space-y-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <Label htmlFor="edit-artcoins" className="text-sm font-medium">
                    Price in Art Coins
                  </Label>
                  <Input
                    id="edit-artcoins"
                    type="number"
                    min="0"
                    variant="green-focus"
                    placeholder="Enter amount (eg: 50, 100)"
                    value={artcoins === 0 ? "" : artcoins}
                    onChange={(e) => setArtcoins(Number(e.target.value))}
                  />
                  <p className="text-xs text-zinc-500">
                    Live conversion:{" "}
                    <span className="text-green-500 font-semibold">
                      {artcoins || 0} ArtCoins = ₹{fiatPreview}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant={"support"} type="submit" form="edit-art-form" disabled={isPending || !isDirty}>
            {isPending ? <CustomLoader /> : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
