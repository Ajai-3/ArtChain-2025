// components/chat/chatArea/ChatHeader.tsx
import React from "react";
import type { Conversation } from "../../../../../types/chat/chat";

interface ChatHeaderProps {
  conversation: Conversation;
  currentUserId: string;
  onBack?: () => void;
  onToggleDetails: () => void;
  showDetails: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  currentUserId,
  onBack,
  onToggleDetails,
  showDetails,
}) => {
  console.log("🟢 ChatHeader - Conversation:", conversation); // Debug log

  const getConversationName = () => {
    if (conversation.type === "GROUP") {
      return conversation.name || conversation.group?.name || "Unnamed Group";
    }
    return conversation.partner?.name || "Unknown User";
  };

  const getStatusText = () => {
    if (conversation.locked) return "Pending request";
    return "Online"; // You can make this dynamic later
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm">
      {/* Left side - Back button and conversation info */}
      <div className="flex items-center space-x-3">
        {/* Back button (mobile only) */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Conversation avatar and info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {getConversationName().charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              {getConversationName()}
            </h2>
            <p className="text-xs text-muted-foreground">{getStatusText()}</p>
          </div>
        </div>
      </div>

      {/* Right side - Details toggle */}
      <button
        onClick={onToggleDetails}
        className="p-2 hover:bg-muted rounded-full transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChatHeader;
