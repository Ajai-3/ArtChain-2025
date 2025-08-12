import React from "react";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import type { User } from "../../../../types/user";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import type { RootState } from "../../../../redux/store";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import { Textarea } from "../../../../components/ui/textarea";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import ART_TYPES from "../../../../constants/artTypesConstants";

interface PostDetailsFormProps {
  form: any;
  onConfirm: () => void;
  onClose: () => void;
  setStep: (step: number) => void;
  step: number;
}

const PostDetailsForm: React.FC<PostDetailsFormProps> = ({
  form,
  onConfirm,
  setStep,
  step,
}) => {
  const { user } = useSelector((state: RootState) => state.user) as {
    user: User | null;
  };

  const { control, watch, trigger, formState: { errors } } = form;
  const isForSale = watch("isForSale");

  const handleNext = async () => {
    const isValid = await trigger(["title", "description", "artType"]);
    if (isValid) {
      setStep(2);
    }
  };

  if (step === 1) {
    return (
      <div className="w-1/2 p-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center rounded-full">
                  <span className="text-xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold">{user?.name}</h1>
              <p className="text-gray-500 text-sm">@{user?.username}</p>
            </div>
          </div>

          <Button
            onClick={handleNext}
            variant="transparant"
            className="text-main-color hover:text-main-color-dark"
          >
            Next
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-main-color">*</span>
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    {...field}
                    variant="green-focus"
                    placeholder="Enter art work title"
                    className="w-full"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-main-color">*</span>
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div>
                  <Textarea
                    {...field}
                    variant="green-focus"
                    placeholder="Enter description for your art work"
                    className="w-full min-h-[180px]"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Art type <span className="text-main-color">*</span>
            </Label>
            <Controller
              name="artType"
              control={control}
              render={({ field }) => (
                <div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger variant="green-focus" className="w-full">
                      <SelectValue placeholder="Select art type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ART_TYPES.map((artType, i) => (
                        <SelectItem key={i} value={artType}>
                          {artType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.artType && (
                    <p className="text-red-500 text-sm mt-1">{errors.artType.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hashtags
            </Label>
            <Controller
              name="hashtags"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  variant="green-focus"
                  type="text"
                  placeholder="#digitalart #ai"
                  className="w-full"
                />
              )}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/2 p-8 pb-10">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => setStep(1)}
          variant="ghost"
          className="text-black dark:text-white hover:bg-transparent p-0"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Button>

        <Button
          onClick={onConfirm}
          variant="transparant"
          className="hover:text-main-color"
        >
          Post
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Turn off commenting</h3>
            <p className="text-sm text-gray-500">
              You can edit this anytime from the menu.
            </p>
          </div>
          <Controller
            name="commentingDisabled"
            control={control}
            render={({ field }) => (
              <Switch
                id="commenting"
                variant="green"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Turn Off Downloading</h3>
            <p className="text-sm text-gray-500">
              Others won't be able to download your artwork.
            </p>
          </div>
          <Controller
            name="downloadingDisabled"
            control={control}
            render={({ field }) => (
              <Switch
                id="downloading"
                variant="green"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Make as Private Collection</h3>
            <p className="text-sm text-gray-500">
              Only subscribers can view this. Hidden from public gallery.
            </p>
          </div>
          <Controller
            name="isPrivate"
            control={control}
            render={({ field }) => (
              <Switch
                id="private"
                variant="green"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h2 className="font-medium mb-4">Pricing & Availability</h2>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Available for Sale</h3>
              <p className="text-sm text-gray-500">
                Enable to set a price for your artwork
              </p>
            </div>
            <Controller
              name="isForSale"
              control={control}
              render={({ field }) => (
                <Switch
                  id="for-sale"
                  variant="green"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {isForSale && (
            <>
              <div className="mb-4">
                <h3 className="font-medium mb-2">
                  How would you like to set your price?
                </h3>
                <Controller
                  name="priceType"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-4">
                      <Button
                        type="button"
                        variant={field.value === "artcoin" ? "outline" : "ghost"}
                        className={`${
                          field.value === "artcoin"
                            ? "border-main-color text-main-color hover:bg-main-color/10"
                            : ""
                        }`}
                        onClick={() => field.onChange("artcoin")}
                      >
                        ArtCoin (Recommended)
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "fiat" ? "outline" : "ghost"}
                        onClick={() => field.onChange("fiat")}
                      >
                        Fiat Currency
                      </Button>
                    </div>
                  )}
                />
                {errors.priceType && (
                  <p className="text-red-500 text-sm mt-1">{errors.priceType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="artcoins" className="block mb-2">
                  Enter Art Coins (eg: 50, 100)
                </Label>
                <Controller
                  name="artcoins"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="artcoins"
                        variant="green-focus"
                        type="number"
                        placeholder="Enter amount"
                        className="w-full"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      {errors.artcoins && (
                        <p className="text-red-500 text-sm mt-1">{errors.artcoins.message}</p>
                      )}
                    </div>
                  )}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Conversion Preview: ₹54543 = 545 ArtCoins
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailsForm;