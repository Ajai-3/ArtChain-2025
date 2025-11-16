// components/chat/chatArea/ChatHeader.tsx
import React from "react";
import {
  type Conversation,
  ConversationType,
} from "../../../../../types/chat/chat";

interface ChatHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
  onToggleDetails: () => void;
  showDetails: boolean;
  currentUserId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onBack,
  onToggleDetails,
  showDetails,
  currentUserId,
}) => {
  // Get the other user in private chat (excluding current user)
  const getOtherUser = () => {
    if (
      conversation.type === ConversationType.PRIVATE &&
      conversation.members
    ) {
      return conversation.members.find((member) => member.id !== currentUserId);
    }
    return null;
  };

  const otherUser = getOtherUser();

  // Get status text based on conversation type and status
  const getStatusText = () => {
    if (conversation.locked) {
      return "Pending request";
    }

    if (conversation.type === ConversationType.GROUP) {
      if (conversation.isOnline) {
        return `${
          conversation.members?.filter((m) => m.isOnline).length || 0
        } online`;
      }
      return `Last active ${conversation.lastSeen}`;
    }

    // Private chat
    if (otherUser) {
      if (otherUser.isOnline) {
        return "Online";
      }
      return `Last seen ${formatLastSeen(otherUser.lastSeen)}`;
    }

    return "Offline";
  };

  // Get display name
  const getDisplayName = () => {
    if (conversation.type === ConversationType.GROUP) {
      return conversation.name;
    }
    return otherUser?.name || conversation.name;
  };

  // Get avatar content
  const getAvatarContent = () => {
    if (conversation.type === ConversationType.GROUP) {
      return (
        <div className="flex flex-wrap w-6 h-6">
          <div className="w-3 h-3 bg-current rounded-tl-full opacity-70"></div>
          <div className="w-3 h-3 bg-current rounded-tr-full opacity-90"></div>
          <div className="w-3 h-3 bg-current rounded-bl-full opacity-50"></div>
          <div className="w-3 h-3 bg-current rounded-br-full opacity-80"></div>
        </div>
      );
    }

    return (
      <span className="text-white text-sm font-semibold">
        {otherUser?.name?.charAt(0) || "U"}
      </span>
    );
  };

  const getAvatarColor = (id: string) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-orange-500 to-orange-600",
      "from-teal-500 to-teal-600",
    ];
    return colors[parseInt(id) % colors.length];
  };

  return (
    <div className="flex items-center justify-between p-2 border-border backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center space-x-3">
        {/* Back Button for Mobile */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0"
            aria-label="Back to conversations"
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

        {/* Conversation Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(
              conversation.id
            )} rounded-full flex items-center justify-center`}
          >
            {getAvatarContent()}
          </div>

          {/* Online Status Indicator */}
          {conversation.isOnline && !conversation.locked && (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background bg-green-500" />
          )}

          {/* Locked/Pending Indicator */}
          {conversation.locked && (
            <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Conversation Info */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={onToggleDetails}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggleDetails();
            }
          }}
        >
          <h3 className="font-semibold text-base flex items-center space-x-2">
            <span className="truncate">{getDisplayName()}</span>
            {conversation.type === ConversationType.GROUP && (
              <span className="flex-shrink-0 text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                Group • {conversation.members?.length || 0}
              </span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        {/* Voice Call Button */}
        {!conversation.locked && (
          <button
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Voice call"
            disabled={conversation.locked}
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
        )}

        {/* Video Call Button */}
        {!conversation.locked && (
          <button
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Video call"
            disabled={conversation.locked}
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        )}

       

        {/* Conversation Info Toggle */}
        <button
          className={`p-2 rounded-full transition-colors ${
            showDetails ? "bg-muted text-primary" : "hover:bg-muted"
          }`}
          onClick={onToggleDetails}
          title="Conversation info"
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* More Options Menu */}
        <div className="relative">
          <button
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="More options"
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
      </div>
    </div>
  );
};

// Helper function to format last seen time
const formatLastSeen = (date?: Date): string => {
  if (!date) return "recently";

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};

export default ChatHeader;
