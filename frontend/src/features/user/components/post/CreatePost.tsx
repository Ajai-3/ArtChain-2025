import React, { useState } from "react";
import PostDetailsForm from "./PostDetailsForm";
import ImageUploadSection from "./ImageUploadSection";
import { useCreatePostMutation } from "../../hooks/art/useCreateArtPostMutation";
import type { CreatePostInput } from "../../../../types/art/CreatePostInput";
import toast from "react-hot-toast";

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ isOpen, onClose }) => {
  const createPostMutation = useCreatePostMutation(() => {
    // Reset form after success
    setUploadedImage(null);
    setPostDetails({
      title: "",
      description: "",
      artType: "",
      hashtags: [],
      commentingDisabled: false,
      downloadingDisabled: false,
      isPrivate: false,
      isSensitive: false,
      isForSale: false,
      priceType: "artcoin",
      artcoins: 0,
      fiatPrice: 0,
    });
    onClose();
  });

  const [uploadedImage, setUploadedImage] = useState<{
    file: File;
    urls: { originalUrl: string; previewUrl: string; watermarkedUrl: string };
    aspectRatio: string;
  } | null>(null);

  const [postDetails, setPostDetails] = useState<Omit<CreatePostInput, "originalUrl" | "previewUrl" | "watermarkedUrl" | "aspectRatio">>({
    title: "",
    description: "",
    artType: "",
    hashtags: [],
    commentingDisabled: false,
    downloadingDisabled: false,
    isPrivate: false,
    isSensitive: false,
    isForSale: false,
    priceType: "artcoin",
    artcoins: 0,
    fiatPrice: 0,
  });

  const handleSubmitPost = () => {
    if (!uploadedImage) return toast.error("Please upload an image first!");

    const payload: CreatePostInput = {
      ...postDetails,
      hashtags: postDetails.hashtags
        ? postDetails.hashtags.map((h) => h.trim())
        : [],
      originalUrl: uploadedImage.urls.originalUrl,
      previewUrl: uploadedImage.urls.previewUrl,
      watermarkedUrl: uploadedImage.urls.watermarkedUrl,
      aspectRatio: uploadedImage.aspectRatio,
    };

    createPostMutation.mutate(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex h-[650px] w-3/5 max-w-5xl bg-white dark:bg-secondary-color border border-zinc-600 dark:border-zinc-700 rounded-lg overflow-hidden">
        <ImageUploadSection
          onSubmitImage={(file, urls, aspectRatio) =>
            setUploadedImage({ file, urls, aspectRatio })
          }
          onClose={onClose}
        />
        <PostDetailsForm
          postDetails={postDetails}
          setPostDetails={setPostDetails}
          onSubmit={handleSubmitPost}
        />
      </div>
    </div>
  );
};

export default CreatePost;
