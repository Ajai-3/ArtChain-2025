import React from "react";
import PostDetailsForm from "./PostDetailsForm";
import ImageUploadSection from "./ImageUploadSection";

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const onSubmitImage = (file: File, urls: any) => {
    console.log("Uploaded image URLs:", urls);
    // You can store these in your post form state to submit later
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex h-[650px] bg-white dark:bg-secondary-color w-3/5 max-w-5xl border border-zinc-400 dark:border-zinc-700 rounded-lg overflow-hidden">
        <ImageUploadSection onSubmitImage={onSubmitImage} onClose={onClose} />
        <PostDetailsForm />
      </div>
    </div>
  );
};

export default CreatePost;
