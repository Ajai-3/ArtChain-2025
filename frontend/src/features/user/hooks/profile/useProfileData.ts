import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { useUserProfile } from "./useUserProfile";
import { useUserProfileWithId } from './useUserProfileWithId';

import { setCurrentUser, updateSupportingCount, updateSupportersCount } from "../../../../redux/slices/userSlice";
import type { User } from "../../../../types/users/user/user";

export const useProfileData = (userId?: string) => {
  const dispatch = useDispatch();
  const { user: reduxUser, supportingCount, supportersCount } = useSelector((state: RootState) => state.user);

  const isOwnProfile = !userId || reduxUser?.id === userId;

  const { data: profileData, isLoading } = isOwnProfile
    ? useUserProfile()
    : useUserProfileWithId(userId ?? "");

  const profileUser: User | null = profileData?.data?.user ?? (isOwnProfile ? reduxUser : null);
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
    profileUser,
    isLoading,
    isOwnProfile,
    isSupporting,
    displaySupportingCount,
    displaySupportersCount,
  };
};
