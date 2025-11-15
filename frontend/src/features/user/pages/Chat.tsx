import React, { useState } from "react";
import ChatUserList from "../components/chat/ChatUserList";
import ChatArea from "../components/chat/ChatArea";

const Chat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
    setMobileView("chat");
  };

  const handleBackToList = () => {
    setMobileView("list");
    setSelectedUser(null);
  };

  return (
    <div className="flex h-full bg-background">
      {/* User List - Hidden on mobile when chat is open */}
      <div
        className={`
        ${mobileView === "list" ? "flex" : "hidden"} 
        md:flex w-full md:w-80 h-full flex-shrink-0
      `}
      >
        <ChatUserList
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
        />
      </div>

      {/* Chat Area - Hidden on mobile when list is open */}
      <div
        className={`
        ${mobileView === "chat" ? "flex" : "hidden"} 
        md:flex flex-1 w-full
      `}
      >
        <ChatArea selectedUser={selectedUser} onBack={handleBackToList} />
      </div>
    </div>
  );
};

export default Chat;
