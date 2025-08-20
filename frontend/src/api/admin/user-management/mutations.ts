import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../axios';

export const useToggleBanUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      apiClient.patch(`/api/v1/admin/users/${userId}/ban-toggle`),

    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-users'] });
      const prevData = queryClient.getQueryData<any>(['admin-users']);

      queryClient.setQueryData(['admin-users'], (old: any) => {
        if (!old || !old.data) return old;

        return {
          ...old,
          data: old.data.map((user: any) =>
            user.id === userId
              ? {
                  ...user,
                  status: user.status === "banned" ? "active" : "banned",
                }
              : user
          ),
        };
      });

      return { prevData };
    },

    onError: (err, _, context: any) => {
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