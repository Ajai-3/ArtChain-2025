import apiClient from '../../../../api/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Notification } from '../../../../types/notification/notification';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface NotificationResponse {
  notifications: Notification[];
}

export const useNotifications = () => {
  return useInfiniteQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get<NotificationResponse>(API_ENDPOINTS.NOTIFICATIONS, {
        params: { page: pageParam, limit: 10 },
      });

      return res.data.notifications;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
};
