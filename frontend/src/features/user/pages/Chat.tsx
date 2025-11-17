import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ChatArea from "../components/chat/ChatArea";
import type { RootState } from "../../../redux/store";
import ChatUserList from "../components/chat/ChatUserList";


const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  console.log(conversationId);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const currentUserId = useSelector((state: RootState) => state.user.user?.id) ;

  if (!currentUserId) {
    return <div>Loading...</div>;
  }

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
