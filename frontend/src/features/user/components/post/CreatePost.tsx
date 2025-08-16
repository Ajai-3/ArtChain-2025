import React from "react";
import { useForm } from "react-hook-form";
import PostDetailsForm from "./PostDetailsForm";
import ImageUploadSection from "./ImageUploadSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFormSchema } from "../../schemas/artSchema";
import type { PostFormValues } from "../../schemas/artSchema";
import { useCreateArtworkMutation } from "../../../../api/user/art/mutations";

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = React.useState(1);
  const [images, setImages] = React.useState<string[]>([]); // base64 strings

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      description: "",
      artType: undefined,
      hashtags: "",
      commentingDisabled: false,
      downloadingDisabled: false,
      isPrivate: false,
      isForSale: false,
      priceType: undefined,
      artcoins: undefined,
    },
  });

  const { mutate: createArtwork } = useCreateArtworkMutation();

  const handleConfirm = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const values = form.getValues();

    const payload = {
      ...values,
      images, 
    };

    createArtwork(payload);

    onClose();
    form.reset();
    setImages([]);
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex h-[650px] bg-white dark:bg-secondary-color w-3/5 max-w-5xl border border-zinc-400 dark:border-zinc-700 rounded-lg overflow-hidden">
        <ImageUploadSection images={images} setImages={setImages} onClose={onClose} />
        <PostDetailsForm
          form={form}
          step={step}
          setStep={setStep}
          onConfirm={handleConfirm}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default CreatePost;
