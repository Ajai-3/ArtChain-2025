import React from "react";
import { Clock, Check, CheckCheck } from "lucide-react";
import type { Message } from "../../../../../types/chat/chat";

const MessageBubble: React.FC<{
  message: Message;
  isCurrentUser: boolean;
  onRightClick: (e: React.MouseEvent) => void;
}> = ({ message, isCurrentUser, onRightClick }) => {
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // NEW: Show sender name for group chats
  const showSenderName = !isCurrentUser && message.sender;

  return (
    <div
      onContextMenu={onRightClick}
      className={`relative rounded-2xl px-4 py-2 ${
        isCurrentUser
          ? "bg-primary text-primary-foreground rounded-br-none"
          : "bg-background border border-border rounded-bl-none"
      } ${message.isDeleted ? "opacity-60" : ""} cursor-context-menu`}
    >
      {/* NEW: Sender name for group chats */}
      {showSenderName && (
        <div className="text-xs font-medium text-muted-foreground mb-1">
          {message.sender?.name}
        </div>
      )}

      {message.isDeleted ? (
        <p className="text-sm italic text-muted-foreground">
          "This message was deleted"
        </p>
      ) : (
        <>
          {/* Media Message */}
          {/* {message.mediaType && (
            <div className="mb-2 last:mb-0">
              <div className="w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {message.mediaType === "IMAGE" && "📷 Image"}
                  {message.mediaType === "AUDIO" && "🎵 Audio"}
                  {message.mediaType === "VIDEO" && "🎥 Video"}
                </span>
              </div>
            </div>
          )} */}

          {/* Message Content */}
          {message.content && (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}

          {/* Message Time and Status */}
          <p
            className={`text-xs mt-1 ${
              isCurrentUser
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            } flex items-center justify-end space-x-1`}
          >
            <span>{formatTime(message.createdAt)}</span>
            {isCurrentUser && (
              <span className="inline-flex items-center">
                {(() => {
                  const readBy = message.readBy || [];

                  if (readBy.length === 0) {
                    return <Clock className="w-4 h-4 text-red-600" />;
                  }

                  if (readBy.length === 1 && readBy[0] === message.sender?.id) {
                    return <Check className="w-4 h-4 text-gray-500" />;
                  }

                  if (
                    readBy.length > 1 ||
                    (readBy.length === 1 && readBy[0] !== message.sender?.id)
                  ) {
                    return <CheckCheck className="w-4 h-4 text-blue-500" />;
                  }

                  return null;
                })()}
              </span>
            )}
          </p>
        </>
      )}
    </div>
  );
};

export default MessageBubble;
