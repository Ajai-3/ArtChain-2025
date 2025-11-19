// import { useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../../redux/store";
// import { updateMessage } from "../../../../../redux/slices/chatSlice";

// interface DeleteMessageParams {
//   messageId: string;
//   conversationId: string;
//   deleteForAll: boolean;
// }

// export const useDeleteMessage = () => {
//   const dispatch = useDispatch();
//   const socket = useSelector((s: RootState) => s.socket.chatSocket);

//   const deleteMessage = useCallback(
//     async ({
//       messageId,
//       conversationId,
//       deleteForAll,
//     }: DeleteMessageParams) => {
//       if (!messageId || !conversationId || !socket) {
//         console.error("Cannot delete message: missing required parameters");
//         return;
//       }

//       console.log("🗑️ Deleting message via socket:", {
//         messageId,
//         conversationId,
//         deleteForAll,
//       });

//       dispatch(
//         updateMessage({
//           id: messageId,
//           conversationId,
//           isDeleted: true,
//           content: "This message was deleted",
//           deletedAt: new Date().toISOString(),
//         })
//       );

//       try {
//         socket.emit("deleteMessage", {
//           messageId,
//           conversationId,
//           deleteForAll,
//         });
//       } catch (error) {
//         console.error("❌ Failed to delete message via socket:", error);
//       }
//     },
//     [dispatch, socket]
//   );

//   return { deleteMessage };
// };
