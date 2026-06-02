import apiClient from '../../../../api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '../../../../types/users/user/user';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useToggleBanUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      apiClient.patch(API_ENDPOINTS.ADMIN_USERS_1(userId)),

    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-users'] });
      const prevData = queryClient.getQueryData<{ data?: User[] }>([
        'admin-users',
      ]);

      queryClient.setQueryData(
        ['admin-users'],
        (old: { data?: User[] } | undefined) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.map((user) =>
              user.id === userId
                ? {
                    ...user,
                    status: user.status === 'banned' ? 'active' : 'banned',
                  }
                : user,
            ),
          };
        },
      );

      return { prevData };
    },

    onError: (err: Error, _, context?: { prevData?: { data?: User[] } }) => {
      console.error('Toggle failed:', err);
      if (context?.prevData) {
        queryClient.setQueryData(['admin-users'], context.prevData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};
