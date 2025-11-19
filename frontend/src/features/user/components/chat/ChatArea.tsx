import { useSelector } from "react-redux";
import ChatInput from "./chatArea/ChatInput";
import ChatHeader from "./chatArea/ChatHeader";
import React, { useState, useMemo } from "react";
import ChatMessages from "./chatArea/ChatMessage";
import { type RootState } from "../../../../redux/store";
import { type Conversation } from "../../../../types/chat/chat";
import ConversationDetails from "./chatArea/ConversationDetails";
import { useUserResolver } from "../../hooks/chat/useUserResolver";
import { useInitialMessages } from "../../hooks/chat/useInitialMessages";

interface ChatAreaProps {
  selectedConversation: Conversation | null;
  onBack?: () => void;
  currentUserId: string;
  onSendMessage: (text: string) => void;
  onSendImage: (mediaUrl?: string) => void;
  onDeleteMessage: (messageId: string, deleteForAll: boolean) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedConversation,
  onBack,
  currentUserId,
  onSendMessage,
  onSendImage,
  onDeleteMessage,
}) => {
  const convId = selectedConversation?.id ?? "";

  // Get messages from hook - it handles Redux and HTTP
  const {
    messages,
    loadMoreMessages,
    hasMore,
    isLoading,
    isFetchingMore,
    totalCount,
  } = useInitialMessages(convId);


  const [showDetails, setShowDetails] = useState(false);

  const userCache = useSelector((s: RootState) => s.chat?.userCache ?? {});

  // Get sender IDs for user resolution
  const senderIds = useMemo(
    () => messages.map((m) => m.senderId).filter(Boolean),
    [messages]
  );

  useUserResolver(senderIds);

  const handleVideoCall = () =>
    console.log("Video call with:", selectedConversation?.partner?.name);
  const handleVoiceCall = () =>
    console.log("Voice call with:", selectedConversation?.partner?.name);

  if (!selectedConversation) {
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
      <div className="dark:bg-[url('https://i.pinimg.com/originals/47/fb/b6/47fbb68a37492662cd74715d7787a212.jpg')] dark:bg-cover dark:bg-center dark:bg-no-repeat absolute inset-0"></div>
      <div
        className={`flex flex-col h-full transition-all duration-300 z-50 ${
          showDetails ? "w-0 md:w-[calc(100%-384px)]" : "w-full"
        }`}
      >
        <ChatHeader
          currentUserId={currentUserId}
          conversation={selectedConversation}
          onBack={onBack}
          onToggleDetails={() => setShowDetails(!showDetails)}
          showDetails={showDetails}
          onVideoCall={handleVideoCall}
          onVoiceCall={handleVoiceCall}
        />

        <ChatMessages
          messages={messages}
          conversation={selectedConversation}
          currentUserId={currentUserId}
          onDeleteMessage={onDeleteMessage}
          loadMoreMessages={loadMoreMessages}
          hasMore={hasMore}
          isLoading={isLoading}
          isFetchingMore={isFetchingMore}
          userMap={userCache}
        />

        <ChatInput
          onSendMessage={onSendMessage}
          onSendImage={onSendImage}
          disabled={selectedConversation.locked}
        />
      </div>

      {showDetails && (
        <ConversationDetails
          conversation={selectedConversation}
          onClose={() => setShowDetails(false)}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default ChatArea;
