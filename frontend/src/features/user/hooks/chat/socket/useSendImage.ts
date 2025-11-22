// import { useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../../redux/store";
// import { addMessage } from "../../../../../redux/slices/chatSlice";
// import type { Message } from "../../../../../types/chat/chat";

// interface SendImageParams {
//   conversationId: string;
//   mediaUrl: string;
//   currentUserId: string;
// }

// export const useSendImage = () => {
//   const dispatch = useDispatch();
//   const socket = useSelector((s: RootState) => s.socket.chatSocket);

//   const sendImage = useCallback(
//     async ({ conversationId, mediaUrl, currentUserId }: SendImageParams) => {
//       if (!conversationId || !mediaUrl || !socket) {
//         console.error("Cannot send image: missing required parameters");
//         return;
//       }

//       const tempId = `temp-image-${Date.now()}`;
//       const tempMessage: Message = {
//         id: tempId,
//         conversationId,
//         senderId: currentUserId,
//         mediaUrl,
//         mediaType: "IMAGE",
//         createdAt: new Date().toISOString(),
//         readBy: [],
//         isOptimistic: true,
//       };

//       console.log("📤 Sending image via socket:", { conversationId, mediaUrl });

//       dispatch(addMessage(tempMessage));

//       try {
//         socket.emit("sendImage", {
//           conversationId,
//           mediaUrl,
//           tempId,
//         });
//       } catch (error) {
//         console.error("❌ Failed to send image via socket:", error);
//       }
//     },
//     [dispatch, socket]
//   );

//   return { sendImage };
// };
