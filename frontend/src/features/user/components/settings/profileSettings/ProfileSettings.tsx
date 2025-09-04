import React, { useState } from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Textarea } from "../../../../../components/ui/textarea";
import { COUNTRIES } from "../../../../../constants/countries";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../redux/store";
import ProfileImageSection from "./ProfileImageSection";
import ImageCropper from "./ImageCropper";

const ProfileSettings: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.user);

  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropType, setCropType] = useState<"banner" | "background">("banner");

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "background"
  ) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setCropType(type);
      setCropperOpen(true);
      e.target.value = "";
    }
  };

  const handleCropSave = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    if (cropType === "banner") setBannerImage(previewUrl);
    else setBackgroundImage(previewUrl);

    setCropperOpen(false);
    setSelectedFile(null);
  };

  const handleCropCancel = () => {
    setCropperOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Profile
      </h1>

      <form>
        {/* Profile Image Section */}
        <ProfileImageSection
          profileImage={userData?.profileImage || null}
          name={userData?.name}
          username={userData?.username}
        />

        {/* Banner & Background */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Banner Upload */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2 block">
              Banner
            </label>
            <label className="relative cursor-pointer w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-900 hover:border-green-500 transition-colors">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Banner Preview"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <span className="text-zinc-500 text-sm">
                  Click to upload banner
                </span>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, "banner")}
              />
            </label>
          </div>

          {/* Background Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Background
            </label>
            <label className="relative cursor-pointer w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-900 hover:border-green-500 transition-colors">
              {backgroundImage ? (
                <img
                  src={backgroundImage}
                  alt="Background Preview"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <span className="text-zinc-500 text-sm">
                  Click to upload background
                </span>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, "background")}
              />
            </label>
          </div>
        </div>

        {/* Text inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <Input
              variant={"green-focus"}
              placeholder="Your full name"
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <Input
              variant={"green-focus"}
              placeholder="Your username"
              className="text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <Textarea
              variant={"green-focus"}
              placeholder="Tell something about yourself..."
              rows={3}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Country
            </label>
            <select className="w-full rounded-md border border-gray-300 bg-transparent dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600">
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => (
                <option
                  className="bg-zinc-200 dark:bg-zinc-950"
                  key={c}
                  value={c}
                >
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="main" className="px-6 py-2 text-sm">
            Save Changes
          </Button>
        </div>
      </form>

      {/* Cropper modal */}
      {cropperOpen && selectedFile && (
        <ImageCropper
          file={selectedFile}
          aspect={cropType === "banner" ? 16 / 9 : 4 / 3}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default ProfileSettings;
