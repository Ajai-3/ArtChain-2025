import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ChatArea from "../components/chat/ChatArea";
import type { RootState } from "../../../redux/store";
import ChatUserList from "../components/chat/ChatUserList";

const Chat: React.FC = () => {
  const { conversationId: urlConversationId } = useParams<{
    conversationId: string;
  }>();
  const navigate = useNavigate();

  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const currentUserId = useSelector((state: RootState) => state.user.user?.id);

  // ✅ Get conversations from Redux
  const conversations = useSelector(
    (state: RootState) => state.chat?.conversations || {}
  );

  // ✅ Use URL conversation ID as the selected one
  const selectedConversationId = urlConversationId || null;

  console.log("🟢 DEBUG - URL Conversation ID:", urlConversationId);
  console.log("🟢 DEBUG - Conversations in Redux:", Object.keys(conversations));
  console.log("🟢 DEBUG - Selected Conversation ID:", selectedConversationId);

  // ✅ Get selected conversation data
  const selectedConversation = selectedConversationId
    ? conversations[selectedConversationId]
    : null;

  // ✅ Get messages for selected conversation
  const messages = useSelector((state: RootState) =>
    selectedConversationId && state.chat?.messages
      ? state.chat.messages[selectedConversationId] || []
      : []
  );

  // ✅ Auto-select conversation from URL when component loads
  useEffect(() => {
    if (urlConversationId) {
      console.log(
        "🟡 Auto-selecting conversation from URL:",
        urlConversationId
      );
      setMobileView("chat");

      // Check if conversation exists in Redux
      if (!conversations[urlConversationId]) {
        console.error(
          "❌ Conversation from URL not found in Redux:",
          urlConversationId
        );
      }
    }
  }, [urlConversationId, conversations]);

  // ✅ Handle conversation selection - UPDATE URL
  const handleSelectConversation = (conversationId: string) => {
    console.log("🟡 Selecting conversation:", conversationId);

    if (conversations[conversationId]) {
      // ✅ Update URL to /chat/conversationId
      navigate(`/chat/${conversationId}`);
      setMobileView("chat");
    } else {
      console.error("❌ Conversation not found:", conversationId);
    }
  };

  // ✅ Handle back to list - CLEAR URL
  const handleBackToList = () => {
    navigate("/chat"); // Go back to /chat without conversation ID
    setMobileView("list");
  };

  if (!currentUserId) {
    return <div>Loading...</div>;
  }

  // Message handlers
  const handleSendMessage = (text: string) => {
    if (!selectedConversationId) return;
    console.log("Sending message to:", selectedConversationId, text);
  };

  const handleSendImage = (mediaUrl?: string) => {
    if (!selectedConversationId) return;
    console.log("Sending image to:", selectedConversationId, mediaUrl);
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
          selectedConversation={selectedConversationId}
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