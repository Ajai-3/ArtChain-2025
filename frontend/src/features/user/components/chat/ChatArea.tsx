import React, { useState } from "react";
import ChatHeader from "./chatArea/ChatHeader";
import ChatMessages from "./chatArea/ChatMessage";
import ChatInput from "./chatArea/Chatinput";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: Date;
  isRead: boolean;
  type: "text" | "image";
  imageUrl?: string;
}

interface ChatAreaProps {
  selectedUser: string | null;
  onBack?: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedUser, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! How's it going? 👋",
      sender: "them",
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
      type: "text",
    },
    {
      id: "2",
      text: "I'm good! Just working on some new designs 🎨",
      sender: "me",
      timestamp: new Date(Date.now() - 3500000),
      isRead: true,
      type: "text",
    },
    {
      id: "3",
      text: "That's awesome! Can't wait to see them 😄",
      sender: "them",
      timestamp: new Date(Date.now() - 3400000),
      isRead: true,
      type: "text",
    },
    {
      id: "4",
      text: "Here's a preview of what I'm working on:",
      sender: "me",
      timestamp: new Date(Date.now() - 3300000),
      isRead: true,
      type: "image",
      imageUrl: "design-preview",
    },
    {
      id: "5",
      text: "Wow, that looks incredible! 🔥",
      sender: "them",
      timestamp: new Date(Date.now() - 3200000),
      isRead: true,
      type: "text",
    },
  ]);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "me",
      timestamp: new Date(),
      isRead: false,
      type: "text",
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendImage = () => {
    // Handle image upload logic
    console.log("Send image");
  };

  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-muted/20">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Your Messages</h3>
          <p className="text-muted-foreground text-sm">
            Send private messages to a friend or group.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background w-full">
      <ChatHeader selectedUser={selectedUser} onBack={onBack} />

      <ChatMessages messages={messages} selectedUser={selectedUser} />

      <ChatInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
      />
    </div>
  );
};

export default ChatArea;
