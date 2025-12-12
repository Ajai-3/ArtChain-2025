// components/chat/chatArea/ChatHeader.tsx
import React from "react";
import { Video, Phone, MoreVertical } from "lucide-react";
import type { Conversation } from "../../../../../types/chat/chat";
import { usePresence } from "../../../hooks/chat/usePresence";

interface ChatHeaderProps {
  conversation: Conversation;
  currentUserId: string;
  onBack?: () => void;
  onToggleDetails: () => void;
  showDetails: boolean;
  onVideoCall?: () => void;
  onVoiceCall?: () => void;
  onSearch?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  currentUserId,
  onBack,
  onToggleDetails,
  // showDetails,
  onVideoCall,
  onVoiceCall,
}) => {
  console.log("🟢 ChatHeader - Conversation:", conversation);

  const partnerId = conversation.type === "PRIVATE" 
    ? (conversation.memberIds?.find(id => id !== currentUserId) || conversation.partner?.id)
    : undefined;
  
  const { isOnline, typingUsers, onlineUsers } = usePresence(partnerId, conversation.id);

  const getConversationName = () => {
    if (conversation.type === "GROUP") {
      return conversation.name || conversation.group?.name || "Unnamed Group";
    }
    return conversation.partner?.name || "Unknown User";
  };

  const getProfileImage = () => {
    if (conversation.type === "PRIVATE" && conversation.partner?.profileImage) {
      return conversation.partner.profileImage;
    }
    if (conversation.type === "GROUP" && conversation?.group?.profileImage) {
      return conversation?.group?.profileImage;
    }
    return null;
  };

  const profileImage = getProfileImage();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusText = () => {
    if (conversation.locked) return "Pending request";
    if (typingUsers.length > 0) return "typing...";
    if (conversation.type === "GROUP") {
       const onlineCount = conversation.memberIds?.filter(id => onlineUsers.has(id)).length || 0;
       return `${onlineCount} online`;
    }
    return isOnline ? "Online" : "Offline";
  };

  return (
    <div className="flex items-center justify-between py-2 px-4 border-b border-border bg-background/80 backdrop-blur-sm">
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
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onToggleDetails}>
          <div className="relative w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt={getConversationName()}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-primary">
                {getInitials(getConversationName())}
              </span>
            )}
            {/* Green dot for online status */}
            {conversation.type === "PRIVATE" && isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              {getConversationName()}
            </h2>
            <p className={`text-xs ${typingUsers.length > 0 ? "text-green-500" : "text-muted-foreground"}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {onVoiceCall && conversation.type === "PRIVATE" && (
          <button
            onClick={onVoiceCall}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
        )}

        {onVideoCall && conversation.type === "PRIVATE" && (
          <button
            onClick={onVideoCall}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={onToggleDetails}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          title="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
