import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserProfile } from "./useUserProfile";
import type { User } from "../../../../types/user/user";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { useUserProfileWithId } from "./useUserProfileWithId";
import {
  setCurrentUser,
  updateSupportersCount,
  updateSupportingCount,
} from "../../../../redux/slices/userSlice";

export const useProfileData = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("gallery");

  const {
    user: reduxUser,
    supportingCount,
    supportersCount,
  } = useSelector((state: RootState) => state.user);

  const { userId } = useParams<{ userId?: string }>();
  const isOwnProfile = !userId || reduxUser?.id === userId;

  const { data: profileData, isLoading } = isOwnProfile
    ? useUserProfile()
    : useUserProfileWithId(userId ?? "");

  const profileUser: User | null = isOwnProfile
    ? profileData?.data?.user ?? reduxUser
    : profileData?.data?.user ?? null;

  const isSupporting = profileData?.data?.isSupporting || false;

  useEffect(() => {
    if (!profileUser || !isOwnProfile) return;

    dispatch(setCurrentUser(profileUser));
    dispatch(updateSupportingCount(profileData?.data?.supportingCount ?? 0));
    dispatch(updateSupportersCount(profileData?.data?.supportersCount ?? 0));
  }, [profileUser, profileData, dispatch, isOwnProfile]);

  const displaySupportingCount = isOwnProfile
    ? supportingCount
    : profileData?.data?.supportingCount ?? 0;

  const displaySupportersCount = isOwnProfile
    ? supportersCount
    : profileData?.data?.supportersCount ?? 0;

  return {
    activeTab,
    setActiveTab,
    isLoading,
    profileUser,
    isOwnProfile,
    isSupporting,
    displaySupportingCount,
    displaySupportersCount,
  };
};
