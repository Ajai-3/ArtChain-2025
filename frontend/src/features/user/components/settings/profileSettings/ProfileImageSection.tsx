import React, { useState, useRef } from "react";
import { Button } from "../../../../../components/ui/button";
import ProfileImageCropper from "./ProfileImageCropper";
import { useUpdateProfileImage } from "../../../hooks/profile/useUpdateProfileImage";

interface ProfileImageSectionProps {
  profileImage?: string | null;
  name?: string;
  username?: string;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  profileImage,
  name,
  username,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfileImageMutation = useUpdateProfileImage();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsCropperOpen(true);
      e.target.value = "";
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleCropSave = (file: File) => {
    setIsSaving(true);
    updateProfileImageMutation.mutate({ file }, {
      onSuccess: () => {
        setIsSaving(false);
        setIsCropperOpen(false);
        setSelectedFile(null);
      },
      onError: () => setIsSaving(false),
    });
  };

  const handleCropCancel = () => {
    setIsCropperOpen(false);
    setSelectedFile(null);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-zinc-300 dark:bg-zinc-900 p-4 rounded-3xl shadow-md">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-zinc-600 dark:bg-zinc-800 flex items-center justify-center rounded-full overflow-hidden border-2 border-gray-400 dark:border-zinc-700">
            {profileImage ? (
              <img
                src={profileImage}
                alt={name || "Profile Image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="ml-6">
            <p className="font-bold text-lg">{username}</p>
            <p className="font-thin text-sm">{name}</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button
          type="button"
          variant="main"
          className="px-4 py-2"
          onClick={handleChangePhotoClick}
        >
          Change photo
        </Button>
      </div>

      {isCropperOpen && selectedFile && (
        <ProfileImageCropper
          file={selectedFile}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
          isSaving={isSaving}
        />
      )}
    </>
  );
};

export default ProfileImageSection;
