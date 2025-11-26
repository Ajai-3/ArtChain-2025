// components/chat/ConversationItem.tsx
import React from "react";
import {
  type Conversation,
  ConversationType,
} from "../../../../../types/chat/chat";
import { usePresence } from "../../../hooks/chat/usePresence";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (conversationId: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect,
}) => {
  const { isOnline } = usePresence(conversation.partner?.id);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (id: string) => {
    const colors = [
      { bg: "bg-blue-100", text: "text-blue-600" },
      { bg: "bg-pink-100", text: "text-pink-600" },
      { bg: "bg-green-100", text: "text-green-600" },
      { bg: "bg-purple-100", text: "text-purple-600" },
      { bg: "bg-orange-100", text: "text-orange-600" },
    ];
    const index = parseInt(id.replace(/\D/g, ""), 10) || 0;
    return colors[index % colors.length];
  };

  const color = getAvatarColor(conversation.id);

  const getProfileImage = () => {
    if (
      conversation.type === ConversationType.PRIVATE &&
      conversation.partner?.profileImage
    ) {
      return conversation.partner.profileImage;
    }
    if (
      conversation.type === ConversationType.GROUP &&
      conversation?.group?.profileImage
    ) {
      return conversation?.group?.profileImage;
    }
    return null;
  };

  const profileImage = getProfileImage();

  const renderLastMessage = () => {
    if (!conversation.lastMessage) return "No messages yet";

    const msg = conversation.lastMessage;

    if (msg.deleteMode !== "NONE") {
      switch (msg.deleteMode) {
        case "ALL":
          return "This message was deleted";
        case "ME":
          return "You deleted this message";
        default:
          return "Message deleted";
      }
    }

    if (msg.mediaType && msg.mediaType !== "TEXT") {
      switch (msg.mediaType) {
        case "IMAGE":
          return "📷 Photo";
        case "VIDEO":
          return "🎥 Video";
        case "AUDIO":
          return "🎵 Audio";
        default:
          return "📎 Attachment";
      }
    }

    return msg.content;
  };

  const getConversationName = () => {
    if (conversation.type === ConversationType.GROUP) {
      return conversation.name || conversation.group?.name || "Unnamed Group";
    }

    return conversation.partner?.name || "Unknown User";
  };

  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={`flex items-center p-2 m-2 rounded-lg cursor-pointer transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800 ${
        isSelected ? "bg-zinc-200 dark:bg-zinc-800" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${color.bg} ${color.text} overflow-hidden`}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={getConversationName()}
              className="w-full h-full object-cover"
            />
          ) : conversation.type === ConversationType.GROUP ? (
            <div className="flex flex-wrap w-6 h-6">
              <div className="w-3 h-3 bg-current rounded-tl-full opacity-70"></div>
              <div className="w-3 h-3 bg-current rounded-tr-full opacity-90"></div>
              <div className="w-3 h-3 bg-current rounded-bl-full opacity-50"></div>
              <div className="w-3 h-3 bg-current rounded-br-full opacity-80"></div>
            </div>
          ) : (
            <span className="text-sm font-medium">
              {getInitials(getConversationName())}
            </span>
          )}
        </div>

        {conversation.type === ConversationType.PRIVATE && isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background bg-green-500" />
        )}

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

      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm truncate flex items-center">
            {getConversationName()}
            {conversation.type === ConversationType.GROUP && (
              <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                Group
              </span>
            )}
          </h3>
          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
            {conversation.lastMessage?.createdAt
              ? new Date(
                  conversation.lastMessage.createdAt
                ).toLocaleTimeString()
              : ""}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate pr-2">
            {renderLastMessage()}
          </p>
          {conversation.unreadCount > 0 && (
            <div className="w-5 h-5 bg-main-color rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {conversation.unreadCount > 99
                  ? "99+"
                  : conversation.unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
