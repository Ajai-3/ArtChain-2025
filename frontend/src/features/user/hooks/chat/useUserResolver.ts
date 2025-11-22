import { useEffect } from "react";
import apiClient from "../../../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { cacheUsers } from "../../../../redux/slices/chatSlice";
import { type RootState } from "../../../../redux/store";

export const useUserResolver = (userIds: string[]) => {
  const dispatch = useDispatch();
  const userCache = useSelector((state: RootState) => state.chat.userCache);

  useEffect(() => {
    const resolveMissingUsers = async () => {
      const missingUserIds = userIds.filter((id) => !userCache[id]);

      if (missingUserIds.length > 0) {
        try {
          const response = await apiClient.post("/api/v1/user/batch", {
            ids: missingUserIds,
          });

          const users = response.data.data;
          dispatch(cacheUsers(users));
        } catch (error) {
          console.error("Failed to fetch users:", error);
        }
      }
    };

    if (userIds.length > 0) {
      resolveMissingUsers();
    }
  }, [userIds, userCache, dispatch]);

  return userCache;
};
