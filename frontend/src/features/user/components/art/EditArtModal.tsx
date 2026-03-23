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
import { useUpdateArtPost } from "../../hooks/art/useUpdateArtPost";
import CustomLoader from "../../../../components/CustomLoader";
import type { ArtPostResponseDTO } from "../../hooks/art/useGetAllArt";

interface EditArtModalProps {
  isOpen: boolean;
  onClose: () => void;
  art: ArtPostResponseDTO;
}

export const EditArtModal: React.FC<EditArtModalProps> = ({ isOpen, onClose, art }) => {
  const [artName, setArtName] = useState(art.artName || "");
  const [title, setTitle] = useState(art.title || "");
  const [description, setDescription] = useState(art.description || "");

  const { mutate: updateArt, isPending } = useUpdateArtPost();

  useEffect(() => {
    if (isOpen) {
      setArtName(art.artName || "");
      setTitle(art.title || "");
      setDescription(art.description || "");
    }
  }, [isOpen, art]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateArt(
      { id: art.id, artName, title, description },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Art Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Art title..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artName">Art Name (Unique Identifier)</Label>
            <Input
              id="artName"
              value={artName}
              onChange={(e) => setArtName(e.target.value)}
              placeholder="art-name-123"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your art..."
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <CustomLoader /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
