import React from "react";
import { Clock, Check, CheckCheck, MoreVertical } from "lucide-react";
import type { Message } from "../../../../../types/chat/chat";

const MessageBubble: React.FC<{
  message: Message;
  isCurrentUser: boolean;
  onOptionsClick: (e: React.MouseEvent) => void;
  showOptions?: boolean;
}> = ({ message, isCurrentUser, onOptionsClick, showOptions }) => {
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const showSenderName = !isCurrentUser && message.sender;
  const isDeleted = message.isDeleted || message.deleteMode === "ALL";

  return (
    <div className="flex items-start gap-2 relative">
      {/* 3-dot button for RIGHT side messages (on LEFT outside) */}
      {!isDeleted && isCurrentUser && (isCurrentUser || showOptions) && (
        <button
          onClick={onOptionsClick}
          className="flex-shrink-0 p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-all mt-1"
          aria-label="Message options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      )}

      {/* Message bubble */}
      <div
        className={`rounded-2xl px-4 py-2 group ${
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-background border border-border rounded-bl-none"
        } ${isDeleted ? "opacity-60" : ""}`}
      >
        {showSenderName && (
          <div className="text-xs font-medium text-muted-foreground mb-1">
            {message.sender?.name}
          </div>
        )}

        {isDeleted ? (
          <p className="text-sm italic text-muted-foreground">
            "This message was deleted"
          </p>
        ) : (
          <>
            {message.content && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}

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

      {/* 3-dot button for LEFT side messages (on RIGHT outside) */}
      {!isDeleted && !isCurrentUser && (isCurrentUser || showOptions) && (
        <button
          onClick={onOptionsClick}
          className="flex-shrink-0 p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-all mt-1"
          aria-label="Message options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default MessageBubble;
