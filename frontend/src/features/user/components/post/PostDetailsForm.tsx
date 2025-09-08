import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import StepOneForm from "./StepOneForm";
import StepTwoForm from "./StepTwoForm";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

const PostDetailsForm: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.user);

  const [step, setStep] = useState(1);

  // Step 1
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artType, setArtType] = useState<string | undefined>(undefined);
  const [hashtags, setHashtags] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Step 2
  const [commenting, setCommenting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [privateCollection, setPrivateCollection] = useState(false);
  const [forSale, setForSale] = useState(false);
  const [priceType, setPriceType] = useState<"artcoin" | "fiat">("artcoin");
  const [artcoins, setArtcoins] = useState<number | "">("");
  const [fiat, setFiat] = useState<number | "">("");
  const conversionRate = 10;

  const validateField = (field: string, value: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (!value.trim()) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleArtcoinChange = (value: string) => {
    const num = Number(value);
    if (/^\d*$/.test(value)) {
      setArtcoins(value === "" ? "" : num);
      setFiat(value === "" ? "" : num * conversionRate);
    }
  };

  const handleFiatChange = (value: string) => {
    const num = Number(value);
    if (/^\d*$/.test(value)) {
      setFiat(value === "" ? "" : num);
      setArtcoins(value === "" ? "" : num / conversionRate);
    }
  };

  const isStep1Valid =
    title.trim() &&
    description.trim() &&
    artType &&
    Object.keys(errors).length === 0;

  return (
    <div className="w-1/2 p-8 pb-10">
      {step === 1 ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center rounded-full">
                {userData?.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt={userData?.name || "Profile Image"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {userData?.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold">{userData?.name}</h1>
                <p className="text-gray-500 text-sm">@{userData?.username}</p>
              </div>
            </div>
            <Button
              onClick={() => isStep1Valid && setStep(2)}
              variant="transparant"
              className={`text-main-color hover:text-main-color-dark ${
                !isStep1Valid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isStep1Valid}
            >
              Next
            </Button>
          </div>
          <StepOneForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            artType={artType}
            setArtType={setArtType}
            hashtags={hashtags}
            setHashtags={setHashtags}
            errors={errors}
            validateField={validateField}
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="text-black dark:text-white hover:bg-transparent p-0"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
            <Button variant="transparant" className="hover:text-main-color">
              Post
            </Button>
          </div>
          <StepTwoForm
            commenting={commenting}
            setCommenting={setCommenting}
            downloading={downloading}
            setDownloading={setDownloading}
            privateCollection={privateCollection}
            setPrivateCollection={setPrivateCollection}
            forSale={forSale}
            setForSale={setForSale}
            priceType={priceType}
            setPriceType={setPriceType}
            artcoins={artcoins}
            fiat={fiat}
            handleArtcoinChange={handleArtcoinChange}
            handleFiatChange={handleFiatChange}
          />
        </>
      )}
    </div>
  );
};

export default PostDetailsForm;
