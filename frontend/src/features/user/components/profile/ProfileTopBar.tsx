import React, { useState, useRef } from "react";
import { ArrowDownRight, Ellipsis, View, Upload, Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { SupportModal } from "./SupportModal";
import CustomLoader from "../../../../components/CustomLoader";
import type { ProfileTopBarProps } from "../../../../types/users/profile/ProfileTopBarProps";
import { useSupportMutation } from "../../hooks/profile/useSupportMutation";
import { useUnSupportMutation } from "../../hooks/profile/useUnSupportMutation";
import { useDeleteUserImage } from "../../hooks/profile/useDeleteUserImage";
import { useUploadUserImage } from "../../hooks/profile/useUploadUserImage";
import ImageCropper from "../settings/profileSettings/ImageCropper";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { useNavigate } from "react-router-dom";

const ProfileTopBar: React.FC<ProfileTopBarProps> = ({
  user,
  isOwnProfile,
  supportingCount,
  supportersCount,
  isSupporting,
}) => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<
    "supporters" | "supporting" | null
  >(null);
  const currentUser = useSelector((state: RootState) => state.user);

  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadType, setUploadType] = useState<"profileImage" | "bannerImage">(
    "profileImage"
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportMutation = useSupportMutation();
  const unSupportMutation = useUnSupportMutation();
  const deleteUserImageMutation = useDeleteUserImage();
  const uploadUserImageMutation = useUploadUserImage();

  const isMutating = supportMutation.isPending || unSupportMutation.isPending;

  // ======= Actions =======
  const handleSupportClick = () => {
    if (!user?.id) return;
    if (!currentUser.user || !currentUser.isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isSupporting)
      unSupportMutation.mutate({ userId: user.id, username: user.username });
    else supportMutation.mutate({ userId: user.id, username: user.username });
  };

  const handleSupportersModal = () => {
    if (!currentUser.user || !currentUser.isAuthenticated) {
      navigate("/login");
      return;
    }
    setModalType("supporters");
  };

  const handleSupportingModal = () => {
    if (!currentUser.user || !currentUser.isAuthenticated) {
      navigate("/login");
      return;
    }
    setModalType("supporting");
  };

  const handleViewImage = (imageUrl: string) => setZoomImage(imageUrl);
  const handleCloseZoom = () => setZoomImage(null);

  const handleDeleteProfileImage = () =>
    deleteUserImageMutation.mutate({ type: "profileImage" });
  const handleDeleteBannerImage = () =>
    deleteUserImageMutation.mutate({ type: "bannerImage" });

  const handleUploadClick = (type: "profileImage" | "bannerImage") => {
    setUploadType(type);
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsCropperOpen(true);
      e.target.value = "";
    }
  };

  const handleCropSave = (file: File) => {
    setIsSaving(true);
    uploadUserImageMutation.mutate(
      { file, type: uploadType },
      {
        onSuccess: () => {
          setIsSaving(false);
          setIsCropperOpen(false);
          setSelectedFile(null);
        },
        onError: () => setIsSaving(false),
      }
    );
  };

  const handleCropCancel = () => {
    setIsCropperOpen(false);
    setSelectedFile(null);
  };

  const iconButtonClasses =
    "p-2 bg-zinc-700/80 rounded-full transition cursor-pointer";

  return (
    <div className="relative">
      {/* Banner Section */}
      <div className="py-10 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        {user?.bannerImage ? (
          <>
            <img
              src={user.bannerImage}
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 dark:bg-black/10"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-zinc-950">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_right,#1f1f23_0px,#1f1f23_2px,transparent_2px,transparent_40px)]"></div>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#1f1f23_0px,#1f1f23_2px,transparent_2px,transparent_40px)]"></div>
          </div>
        )}

        {/* Banner Actions */}
        <div className="absolute right-4 flex gap-3 z-20 top-2 sm:top-auto sm:bottom-4">
          {user?.bannerImage && (
            <div
              title="View Banner"
              className={iconButtonClasses}
              onClick={() => handleViewImage(user.bannerImage!)}
            >
              <View className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          )}

          {isOwnProfile && (
            <>
              {user?.bannerImage ? (
                <div
                  title="Delete Banner"
                  className={iconButtonClasses}
                  onClick={handleDeleteBannerImage}
                >
                  <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                </div>
              ) : (
                <div
                  title="Upload Banner"
                  className={`flex items-center ${iconButtonClasses}`}
                  onClick={() => handleUploadClick("bannerImage")}
                >
                  <Upload className="w-6 h-6 text-white" />
                  <p className="ml-2 hidden md:block text-white text-md">
                    Upload
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Profile Image & Info */}
        <div className="relative z-10 flex items-center gap-6 sm:h-28">
          {/* Profile Image */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden relative group/profile aspect-square">
            {user?.profileImage ? (
              <>
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover/profile:opacity-100 transition duration-300">
                  <div
                    title="View Profile Picture"
                    className={iconButtonClasses}
                    onClick={() => handleViewImage(user.profileImage!)}
                  >
                    <View className="w-5 h-5 text-white" />
                  </div>
                  {isOwnProfile && (
                    <div
                      title="Delete Profile Picture"
                      className={iconButtonClasses}
                      onClick={handleDeleteProfileImage}
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-zinc-500 dark:bg-zinc-800 flex items-center justify-center relative group/profile">
                <span className="text-7xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </span>
                {isOwnProfile && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/profile:opacity-100 transition duration-300">
                    <div
                      title="Upload Profile Picture"
                      className={iconButtonClasses}
                      onClick={() => handleUploadClick("profileImage")}
                    >
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex flex-col space-y-2 text-white">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-200">@{user?.username}</p>
            </div>

            <div className="flex gap-4 cursor-pointer">
              <p onClick={handleSupportersModal}>
                {supportersCount} supporters
              </p>
              <p>|</p>
              <p onClick={handleSupportingModal}>
                {supportingCount} supporting
              </p>
            </div>

            {!isOwnProfile && (
              <div className="flex gap-4 items-center">
                <Button
                  variant={isSupporting ? "unSupport" : "support"}
                  size="support"
                  onClick={handleSupportClick}
                  disabled={isMutating}
                  className="relative flex items-center justify-center min-w-[120px]"
                >
                  {isMutating ? (
                    <CustomLoader />
                  ) : isSupporting ? (
                    <>
                      Supporting <ArrowDownRight />
                    </>
                  ) : (
                    "Support"
                  )}
                </Button>
                <Button variant="profileMessage" size="profileMessage">
                  Message
                </Button>
                <Ellipsis />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {modalType && (
        <SupportModal
          type={modalType}
          userId={user?.id!}
          onClose={() => setModalType(null)}
        />
      )}

      {/* Zoomed Profile Image Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer  backdrop-blur-sm"
          onClick={handleCloseZoom}
        >
          <img
            src={zoomImage}
            alt="Profile Zoom"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {isCropperOpen && selectedFile && (
        <ImageCropper
          file={selectedFile}
          aspect={uploadType === "profileImage" ? 1 : 21 / 4}
          cropShape={uploadType === "profileImage" ? "round" : "rect"}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default ProfileTopBar;
