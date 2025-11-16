// components/Chat.tsx
import React, { useState } from "react";
import ChatUserList from "../components/chat/ChatUserList";
import ChatArea from "../components/chat/ChatArea";

const Chat: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const currentUserId = "1";

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setMobileView("chat");
  };

  const handleBackToList = () => {
    setMobileView("list");
    setSelectedConversation(null);
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
          selectedConversation={selectedConversation}
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
          onBack={handleBackToList}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
};

export default Chat;
