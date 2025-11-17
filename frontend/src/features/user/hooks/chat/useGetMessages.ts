// import apiClient from "../../../../api/axios";
// import { useInfiniteQuery } from "@tanstack/react-query";

// interface FetchMessagesParams {
//   conversationId: string;
//   pageParam?: number;
//   limit?: number;
// }

// export const useGetMessages = (conversationId: string | null, limit = 20) => {
//   return useInfiniteQuery<Message[], Error>(
//     ["messages", conversationId],
//     async ({ pageParam = 0 }) => {
//       if (!conversationId) throw new Error("No conversation ID provided");
//       const res = await apiClient.get(
//         `/api/v1/chat/message/${conversationId}`,
//         {
//           params: { offset: pageParam, limit },
//         }
//       );
//       return res.data;
//     },
//     {
//       getNextPageParam: (lastPage, allPages) => {
//         // If last page length < limit, no more pages
//         if (lastPage.length < limit) return undefined;
//         return allPages.length * limit; // next offset
//       },
//       enabled: !!conversationId,
//       staleTime: 1000 * 60, // 1 minute
//     }
//   );
// };
