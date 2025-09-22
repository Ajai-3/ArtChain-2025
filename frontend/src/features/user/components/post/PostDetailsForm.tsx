// PostDetailsForm.tsx
import React, { useState } from "react";
import StepOneForm from "./StepOneForm";
import StepTwoForm from "./StepTwoForm";
import { Button } from "../../../../components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PostDetailsFormProps {
  postDetails: any;
  setPostDetails: (val: any) => void;
  onSubmit: () => void;
}

const PostDetailsForm: React.FC<PostDetailsFormProps> = ({
  postDetails,
  setPostDetails,
  onSubmit,
}) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (!value.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const isStep1Valid =
    postDetails.title.trim() &&
    postDetails.description.trim() &&
    postDetails.artType &&
    Object.keys(errors).length === 0;

  return (
    <div className="w-1/2 p-8 pb-10">
      {step === 1 ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => {}}
              className="p-0 text-black dark:text-white hover:bg-transparent"
            >
              <ArrowLeft className="h-5 w-5 mr-1" /> Back
            </Button>
            <Button
              onClick={() => isStep1Valid && setStep(2)}
              variant="transparant"
              className={`text-main-color hover:text-main-color-dark ${!isStep1Valid ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!isStep1Valid}
            >
              Next
            </Button>
          </div>
          <StepOneForm
            title={postDetails.title}
            setTitle={(val) => setPostDetails({ ...postDetails, title: val })}
            description={postDetails.description}
            setDescription={(val) => setPostDetails({ ...postDetails, description: val })}
            artType={postDetails.artType}
            setArtType={(val) => setPostDetails({ ...postDetails, artType: val })}
            hashtags={postDetails.hashtags}
            setHashtags={(val) => setPostDetails({ ...postDetails, hashtags: val })}
            errors={errors}
            validateField={validateField}
          />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="text-black dark:text-white hover:bg-transparent p-0"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
            <Button
              onClick={onSubmit}
              variant="transparant"
              className="hover:text-main-color"
            >
              Post
            </Button>
          </div>
          <StepTwoForm
            commenting={postDetails.commentingDisabled}
            setCommenting={(val) => setPostDetails({ ...postDetails, commentingDisabled: val })}
            downloading={postDetails.downloadingDisabled}
            setDownloading={(val) => setPostDetails({ ...postDetails, downloadingDisabled: val })}
            privateCollection={postDetails.isPrivate}
            setPrivateCollection={(val) => setPostDetails({ ...postDetails, isPrivate: val })}
            forSale={postDetails.isForSale}
            setForSale={(val) => setPostDetails({ ...postDetails, isForSale: val })}
            priceType={postDetails.priceType}
            setPriceType={(val) => setPostDetails({ ...postDetails, priceType: val })}
            artcoins={postDetails.artcoins}
            fiat={postDetails.fiatPrice}
            handleArtcoinChange={(val) =>
              setPostDetails({ ...postDetails, artcoins: Number(val), fiatPrice: Number(val) * 10 })
            }
            handleFiatChange={(val) =>
              setPostDetails({ ...postDetails, fiatPrice: Number(val), artcoins: Number(val) / 10 })
            }
          />
        </>
      )}
    </div>
  );
};

export default PostDetailsForm;
