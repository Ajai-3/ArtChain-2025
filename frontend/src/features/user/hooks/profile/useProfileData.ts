import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { useGetUserProfileByUsername } from "./useGetUserProfileByUsername";
import { setCurrentUser, updateSupportingCount, updateSupportersCount } from "../../../../redux/slices/userSlice";
import type { User } from "../../../../types/users/user/user";

export const useProfileData = (username?: string) => {
  const dispatch = useDispatch();
  const { user: reduxUser, supportingCount, supportersCount } = useSelector((state: RootState) => state.user);

  const { data, isLoading } = useGetUserProfileByUsername(username);

  const profileUser: User | null = data?.data?.user ?? (username ? null : reduxUser);
  const isOwnProfile = !username || reduxUser?.id === profileUser?.id;
  const isSupporting = data?.data?.isSupporting || false;

  useEffect(() => {
    if (!profileUser || !isOwnProfile) return;

    dispatch(setCurrentUser(profileUser));
    dispatch(updateSupportingCount(data?.data?.supportingCount ?? 0));
    dispatch(updateSupportersCount(data?.data?.supportersCount ?? 0));
  }, [profileUser, data, dispatch, isOwnProfile]);

  const displaySupportingCount = isOwnProfile
    ? supportingCount
    : data?.data?.supportingCount ?? 0;

  const displaySupportersCount = isOwnProfile
    ? supportersCount
    : data?.data?.supportersCount ?? 0;

  return {
    profileUser,
    isLoading,
    isOwnProfile,
    isSupporting,
    displaySupportingCount,
    displaySupportersCount,
  };
};
