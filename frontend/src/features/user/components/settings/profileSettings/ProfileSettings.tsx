import React, { useState } from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Textarea } from "../../../../../components/ui/textarea";
import { COUNTRIES } from "../../../../../constants/countries";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../redux/store";
import ProfileImageSection from "./ProfileImageSection";
import ImageCropper from "./ImageCropper";
import { useUploadUserImage } from "../../../hooks/profile/useUploadUserImage";
import { useUpdateProfileMutation } from "../../../hooks/profile/useUpdateProfileMutation";

const ProfileSettings: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.user);

  const [bannerImage, setBannerImage] = useState<string | null>(userData?.bannerImage || null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(userData?.backgroundImage || null);

  const [name, setName] = useState(userData?.name || "");
  const [username, setUsername] = useState(userData?.username || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [country, setCountry] = useState(userData?.country || "");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropType, setCropType] = useState<"banner" | "background">("banner");
  const [isSaving, setIsSaving] = useState(false);

  const uploadUserImage = useUploadUserImage();
  const updateProfileMutation = useUpdateProfileMutation();

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
    if (!file) return;

    setIsSaving(true);

    const imageType = cropType === "banner" ? "bannerImage" : "backgroundImage";

    uploadUserImage.mutate(
      { file, type: imageType },
      {
        onSuccess: (updatedUser) => {
          if (cropType === "banner") setBannerImage(updatedUser.bannerImage || null);
          else setBackgroundImage(updatedUser.backgroundImage || null);

          setCropperOpen(false);
          setSelectedFile(null);
          setIsSaving(false);
        },
        onError: () => {
          setCropperOpen(false);
          setSelectedFile(null);
          setIsSaving(false);
        },
      }
    );
  };

  const handleCropCancel = () => {
    setCropperOpen(false);
    setSelectedFile(null);
  };

  const handleSaveProfile = () => {
    const updatedFields: any = {};
    if (name !== userData?.name) updatedFields.name = name;
    if (username !== userData?.username) updatedFields.username = username;
    if (bio !== userData?.bio) updatedFields.bio = bio;
    if (country !== userData?.country) updatedFields.country = country;

    if (Object.keys(updatedFields).length > 0) {
      updateProfileMutation.mutate(updatedFields);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Profile
      </h1>

      <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
        {/* Profile Image Section */}
        <ProfileImageSection
          profileImage={userData?.profileImage || null}
          name={name}
          username={username}
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
                  className="w-full h-full object-cover rounded-xl"
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
                  className="w-full h-full object-cover rounded-xl"
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

        {/* Text Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <Input
              variant="green-focus"
              placeholder="Your full name"
              className="text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <Input
              variant="green-focus"
              placeholder="Your username"
              className="text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <Textarea
              variant="green-focus"
              placeholder="Tell something about yourself..."
              rows={3}
              className="text-sm"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-transparent dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-zinc-200 dark:bg-zinc-950">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="main" className="px-6 py-2 text-sm" disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Cropper Modal */}
      {cropperOpen && selectedFile && (
        <ImageCropper
          file={selectedFile}
          aspect={cropType === "banner" ? 21 / 4 : 6 / 2.75}
          cropShape="rect"
          onSave={handleCropSave}
          onCancel={handleCropCancel}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default ProfileSettings;
