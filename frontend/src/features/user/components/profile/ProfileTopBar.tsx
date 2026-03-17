import React, { useState, useRef } from "react";
import { ArrowDownRight, Ellipsis, Upload, Trash2, Eye } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent } from "../../../../components/ui/dialog";
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
import { useCreatePrivateConversation } from "../../hooks/chat/useCreatePrivateConversation";
import { ContentOptionsModal } from "../report/ContentOptionsModal";
import { ROUTES } from "../../../../constants/routes";

const ProfileTopBar: React.FC<ProfileTopBarProps> = ({
  user,
  isOwnProfile,
  artWorkCount,
  supportingCount,
  supportersCount,
  isSupporting,
}) => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<
    "supporters" | "supporting" | null
  >(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
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

  const createPrivateConversationMutation = useCreatePrivateConversation();

  const handleCreatePrivateConversation = () => {
    const otherUserId = user.id;
    const userId = currentUser.user?.id;
    if (!userId || !otherUserId) return;

    createPrivateConversationMutation.mutate({
      userId,
      otherUserId,
    });
  };

  // ======= Actions =======
  const handleSupportClick = () => {
    if (!user?.id) return;
    if (!currentUser.user || !currentUser.isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    if (isSupporting)
      unSupportMutation.mutate({ userId: user.id, username: user.username });
    else supportMutation.mutate({ userId: user.id, username: user.username });
  };

  const handleSupportersModal = () => {
    if (!currentUser.user || !currentUser.isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    setModalType("supporters");
  };

  const handleSupportingModal = () => {
    if (!currentUser.user || !currentUser.isAuthenticated) {
      navigate(ROUTES.LOGIN);
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
      <div className="py-10 sm:py-20 px-4 sm:px-6 relative overflow-hidden group/banner">
        {user?.bannerImage ? (
          <>
            <img
              src={user.bannerImage}
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-105"
            />
            {/* Desktop only: Eye icon button in top-right of banner to zoom */}
            <button
              className="hidden md:flex absolute top-4 left-4 z-40 p-2 bg-black/40 rounded-full cursor-pointer items-center justify-center opacity-0 group-hover/banner:opacity-100 transition-opacity duration-300"
              onClick={() => handleViewImage(user.bannerImage!)}
              title="View Banner"
            >
              <Eye className="w-6 h-6 text-white" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 bg-zinc-950">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_right,#1f1f23_0px,#1f1f23_2px,transparent_2px,transparent_40px)]"></div>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#1f1f23_0px,#1f1f23_2px,transparent_2px,transparent_40px)]"></div>
          </div>
        )}

        {/* Banner Actions */}
        <div className="absolute right-4 flex gap-3 z-20 top-2 sm:top-auto sm:bottom-4">

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
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden relative group/profile aspect-square cursor-pointer pointer-events-auto"
            onClick={() => {
              if (user?.profileImage) handleViewImage(user.profileImage);
            }}
          >
            {user?.profileImage ? (
              <>
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover/profile:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover/profile:opacity-100 transition duration-300">
                  <Eye className="w-8 h-8 text-white pointer-events-none" />
                  {isOwnProfile && (
                    <div
                      title="Delete Profile Picture"
                      className={`${iconButtonClasses} pointer-events-auto`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProfileImage();
                      }}
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
          <div className="flex flex-col space-y-2 text-white relative flex-1">
            <div className="flex flex-col pr-12">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-200">@{user?.username}</p>
            </div>

            {/* Ellipsis Menu - Mobile Only */}
            {!isOwnProfile && (
              <div
                className={`md:hidden ${iconButtonClasses} absolute top-0 right-0`}
                onClick={() => setIsOptionsOpen(true)}
              >
                <Ellipsis />
              </div>
            )}

            <div className="flex gap-4 cursor-pointer">
              <p>{artWorkCount} Arts</p>
              <p onClick={handleSupportersModal}>
                {supportersCount} supporters
              </p>
              <p>|</p>
              <p onClick={handleSupportingModal}>
                {supportingCount} supporting
              </p>
            </div>

            {!isOwnProfile && (
              <div className="flex gap-4 items-center flex-wrap">
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
                <Button
                  variant="profileMessage"
                  size="profileMessage"
                  onClick={handleCreatePrivateConversation}
                  disabled={createPrivateConversationMutation.isPending}
                  className="relative flex items-center justify-center min-w-[120px]"
                >
                  <span className="flex items-center justify-center">
                    {createPrivateConversationMutation.isPending ? (
                      <CustomLoader />
                    ) : (
                      "Message"
                    )}
                  </span>
                </Button>



                {/* Ellipsis Menu - Desktop Only */}
                <div
                  className={`hidden md:flex ${iconButtonClasses}`}
                  onClick={() => setIsOptionsOpen(true)}
                >
                  <Ellipsis />
                </div>
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
      <Dialog open={!!zoomImage} onOpenChange={(open) => !open && handleCloseZoom()}>
        <DialogContent className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-7xl bg-transparent border-none shadow-none flex items-center justify-center p-0 outline-none">
          {zoomImage && (
            <img
              src={zoomImage}
              alt="Zoomed"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          )}
        </DialogContent>
      </Dialog>

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

      {user?.id && (
        <ContentOptionsModal
          isOpen={isOptionsOpen}
          onClose={() => setIsOptionsOpen(false)}
          targetId={user.id}
          targetType="user"
        />
      )}
    </div>
  );
};

export default ProfileTopBar;
