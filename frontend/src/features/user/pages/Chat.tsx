import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import ChatArea from "../components/chat/ChatArea";
import type { RootState } from "../../../redux/store";
import { useParams, useNavigate } from "react-router-dom";
import ChatUserList from "../components/chat/ChatUserList";

const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();

  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const currentUserId = useSelector((state: RootState) => state.user.user?.id);
  const conversations = useSelector(
    (state: RootState) => state.chat?.conversations || {}
  );


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

  console.log("🟢 All conversations in Redux:", conversations);
  console.log("🟢 Selected conversation ID:", conversationId);
  console.log("🟢 Selected conversation data:", selectedConversation);

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