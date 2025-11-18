import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ChatArea from "../components/chat/ChatArea";
import type { RootState } from "../../../redux/store";
import ChatUserList from "../components/chat/ChatUserList";
import type { Conversation } from "../../../types/chat/chat";
import type { User } from "../../../types/users/user/user";

interface LocationState {
  profileUser: User;
}

const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const currentUserId = useSelector((state: RootState) => state.user.user?.id);
  const conversations = useSelector(
    (state: RootState) => state.chat?.conversations || {}
  );

  // ✅ Get FULL user data from profile page
  const { profileUser } = (location.state as LocationState) || {};

  console.log("🟢 REAL Conversation ID:", conversationId);
  console.log("🟢 Profile User Data:", profileUser);

  // ✅ Get conversation from Redux (REAL ID only)
  const selectedConversation = conversationId
    ? conversations[conversationId]
    : null;

  // ✅ Get messages for REAL conversation
  const messages = useSelector((state: RootState) =>
    conversationId && state.chat?.messages
      ? state.chat.messages[conversationId] || []
      : []
  );

  // ✅ Auto-select conversation from URL
  useEffect(() => {
    if (conversationId) {
      console.log("🟡 Auto-selecting conversation:", conversationId);
      setMobileView("chat");
    }
  }, [conversationId]);

  const handleSelectConversation = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
    setMobileView("chat");
  };

  const handleBackToList = () => {
    navigate("/chat");
    setMobileView("list");
  };

  if (!currentUserId) {
    return <div>Loading...</div>;
  }

  // Message handlers
  const handleSendMessage = (text: string) => {
    if (!conversationId) return;
    console.log("Sending message to:", conversationId, text);
  };

  const handleSendImage = (mediaUrl?: string) => {
    if (!conversationId) return;
    console.log("Sending image to:", conversationId, mediaUrl);
  };

  const handleDeleteMessage = (messageId: string, deleteForAll: boolean) => {
    console.log("Deleting message:", messageId, deleteForAll);
  };

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* User List */}
      <div
        className={`
          ${mobileView === "list" ? "flex" : "hidden"} 
          md:flex w-full md:w-80 h-full flex-shrink-0
        `}
      >
        <ChatUserList
          selectedConversation={conversationId || null}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Chat Area */}
      <div
        className={`
          ${mobileView === "chat" ? "flex" : "hidden"} 
          md:flex flex-1 w-full
        `}
      >
        <ChatArea
          selectedConversation={selectedConversation}
          messages={messages}
          onBack={handleBackToList}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
          onDeleteMessage={handleDeleteMessage}
        />
      </div>
    </div>
  );
};

export default Chat;

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import ChatArea from "../components/chat/ChatArea";
// import type { RootState } from "../../../redux/store";
// import ChatUserList from "../components/chat/ChatUserList";
// import { addConversation } from "../../../redux/slices/chatSlice";
// import type { User, Conversation } from "../../../types/chat/chat";

// interface LocationState {
//   targetUser: User;
// }

// const Chat: React.FC = () => {
//   const { conversationId } = useParams<{ conversationId: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const [mobileView, setMobileView] = useState<"list" | "chat">("list");
//   const [isCreatingConversation, setIsCreatingConversation] = useState(false);

//   const currentUserId = useSelector((state: RootState) => state.user.user?.id);
//   const conversations = useSelector(
//     (state: RootState) => state.chat?.conversations || {}
//   );

//   // ✅ Get user data from navigation state (when coming from profile)
//   const { targetUser } = (location.state as LocationState) || {};

//   console.log("🟢 DEBUG - Conversation ID from URL:", conversationId);
//   console.log("🟢 DEBUG - Target User from profile:", targetUser);

//   // ✅ Determine conversation to show
//   let selectedConversation: Conversation | null = null;

//   if (conversationId) {
//     // Check if conversation exists in Redux
//     selectedConversation = conversations[conversationId] || null;

//     // If not in Redux but we have targetUser, create temp conversation
//     if (!selectedConversation && targetUser) {
//       selectedConversation = createTempConversation(targetUser, currentUserId!);
//     }
//   }

//   const messages = useSelector((state: RootState) =>
//     conversationId && state.chat?.messages
//       ? state.chat.messages[conversationId] || []
//       : []
//   );

//   // ✅ Create temporary conversation for immediate UI
//   function createTempConversation(
//     targetUser: User,
//     currentUserId: string
//   ): Conversation {
//     return {
//       id: conversationId!, // Use the URL ID as temp ID
//       type: "PRIVATE",
//       memberIds: [currentUserId, targetUser.id],
//       locked: false,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       unreadCount: 0,
//       partner: targetUser, // ✅ User data from profile
//       name: targetUser.name,
//     };
//   }

//   // ✅ Create real conversation when we have targetUser but conversation doesn't exist
//   useEffect(() => {
//     if (
//       conversationId &&
//       targetUser &&
//       !conversations[conversationId] &&
//       !isCreatingConversation
//     ) {
//       console.log("🟡 Creating conversation with:", targetUser.name);
//       setIsCreatingConversation(true);
//       createOrGetConversation(targetUser.id, conversationId);
//     }
//   }, [conversationId, targetUser, conversations, isCreatingConversation]);

//   // ✅ API call to create conversation
//   const createOrGetConversation = async (
//     targetUserId: string,
//     conversationId: string
//   ) => {
//     try {
//       const response = await fetch("/api/v1/chat/conversation/start", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ targetUserId, conversationId }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         const conversation = data.data;

//         // Add to Redux
//         dispatch(addConversation(conversation));

//         console.log("✅ Conversation created:", conversation.id);
//       }
//     } catch (error) {
//       console.error("❌ Failed to create conversation:", error);
//     } finally {
//       setIsCreatingConversation(false);
//     }
//   };

//   const handleSelectConversation = (conversationId: string) => {
//     navigate(`/chat/${conversationId}`);
//     setMobileView("chat");
//   };

//   const handleBackToList = () => {
//     navigate("/chat");
//     setMobileView("list");
//   };

//   if (!currentUserId) {
//     return <div>Loading...</div>;
//   }

//   // Message handlers
//   const handleSendMessage = (text: string) => {
//     if (!conversationId) return;

//     if (selectedConversation && selectedConversation.partner) {
//       // This is a temp conversation - create it first then send message
//       console.log("🟡 Creating conversation and sending message:", text);
//     } else {
//       // Existing conversation - send directly
//       console.log("Sending message to:", conversationId, text);
//     }
//   };

//   const handleSendImage = (mediaUrl?: string) => {
//     if (!conversationId) return;
//     console.log("Sending image to:", conversationId, mediaUrl);
//   };

//   const handleDeleteMessage = (messageId: string, deleteForAll: boolean) => {
//     console.log("Deleting message:", messageId, deleteForAll);
//   };

//   return (
//     <div className="flex h-full bg-background overflow-hidden">
//       {/* User List */}
//       <div
//         className={`
//           ${mobileView === "list" ? "flex" : "hidden"}
//           md:flex w-full md:w-80 h-full flex-shrink-0
//         `}
//       >
//         <ChatUserList
//           selectedConversation={conversationId}
//           onSelectConversation={handleSelectConversation}
//         />
//       </div>

//       {/* Chat Area */}
//       <div
//         className={`
//           ${mobileView === "chat" ? "flex" : "hidden"}
//           md:flex flex-1 w-full
//         `}
//       >
//         <ChatArea
//           selectedConversation={selectedConversation}
//           messages={messages}
//           onBack={handleBackToList}
//           currentUserId={currentUserId}
//           onSendMessage={handleSendMessage}
//           onSendImage={handleSendImage}
//           onDeleteMessage={handleDeleteMessage}
//         />
//       </div>
//     </div>
//   );
// };

// export default Chat;
