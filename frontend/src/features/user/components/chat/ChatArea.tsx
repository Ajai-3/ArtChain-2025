// components/chat/ChatArea.tsx
import React, { useState } from "react";
import ChatHeader from "./chatArea/ChatHeader";
import ChatMessages from "./chatArea/ChatMessage";
import ChatInput from "./chatArea/Chatinput";
import ConversationDetails from "./chatArea/ConversationDetails";
import {
  type Conversation,
  type Message,
  DeleteMode,
  MediaType,
} from "../../../../types/chat/chat";
import { dummyConversations, dummyMessages } from "./dummyData";

interface ChatAreaProps {
  selectedConversation: string | null;
  onBack?: () => void;
  currentUserId: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedConversation,
  onBack,
  currentUserId,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [messages, setMessages] = useState<Message[]>(dummyMessages);

  const conversation = dummyConversations.find(
    (c) => c.id === selectedConversation
  );

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation!,
      senderId: currentUserId,
      content: text,
      readBy: [],
      deleteMode: DeleteMode.NONE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendImage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation!,
      senderId: currentUserId,
      content: "Check out this image!",
      mediaType: MediaType.IMAGE,
      mediaUrl: "https://example.com/image.jpg",
      readBy: [],
      deleteMode: DeleteMode.NONE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleDeleteMessage = (messageId: string, deleteForAll: boolean) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              deleteMode: deleteForAll ? DeleteMode.ALL : DeleteMode.ME,
              deletedAt: new Date(),
            }
          : msg
      )
    );
  };

  if (!selectedConversation || !conversation) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center">
        <div className="text-center p-8 max-w-md">
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
          <p className="text-muted-foreground text-sm mb-4">
            Select a conversation to start messaging
          </p>
          <button
            onClick={onBack}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Back to conversations
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div
      className="flex h-full w-full relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://pic.rutubelist.ru/video/84/49/84491f90cc1b8fea562ad525afaaf08f.jpg')",
      }}
    >
      {/* Dark theme image overlay */}
      <div className="dark:bg-[url('https://i.pinimg.com/originals/47/fb/b6/47fbb68a37492662cd74715d7787a212.jpg')] dark:bg-cover dark:bg-center dark:bg-no-repeat absolute inset-0"></div>
      {/* Main Chat Area */}
      <div
        className={`flex flex-col h-full transition-all duration-300 z-50 ${
          showDetails
            ? "w-0 md:w-[calc(100%-384px)]" // 384px = 96 * 4 (w-96)
            : "w-full"
        }`}
      >
        <ChatHeader
          currentUserId={currentUserId}
          conversation={conversation}
          onBack={onBack}
          onToggleDetails={() => setShowDetails(!showDetails)}
          showDetails={showDetails}
        />

        <ChatMessages
          messages={messages}
          conversation={conversation}
          currentUserId={currentUserId}
          onDeleteMessage={handleDeleteMessage}
        />

        <ChatInput
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
          disabled={conversation.locked}
        />
      </div>

      {/* Conversation Details Panel */}
      {showDetails && (
        <ConversationDetails
          conversation={conversation}
          onClose={() => setShowDetails(false)}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default ChatArea;
