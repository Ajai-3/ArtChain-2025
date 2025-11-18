// components/chat/chatArea/ChatMessages.tsx
import MessageBubble from "./MessageBubble";
import React, { useState, useRef, useEffect } from "react";
import MessageOptions from "../MessageOptions";
import type { Message, Conversation } from "../../../../../types/chat/chat";

interface ChatMessagesProps {
  messages: Message[];
  conversation: Conversation;
  currentUserId: string;
  onDeleteMessage: (messageId: string, deleteForAll: boolean) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages = [],
  conversation,
  currentUserId,
  onDeleteMessage,
}) => {
  const [showOptions, setShowOptions] = useState<{
    messageId: string;
    position: { x: number; y: number };
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const shouldShowDateDivider = (currentIndex: number) => {
    if (currentIndex === 0) return true;
    if (
      !messages[currentIndex]?.createdAt ||
      !messages[currentIndex - 1]?.createdAt
    )
      return false;

    const currentDate = new Date(
      messages[currentIndex].createdAt!
    ).toDateString(); 
    const prevDate = new Date(
      messages[currentIndex - 1].createdAt!
    ).toDateString();

    return currentDate !== prevDate;
  };

  const getDateLabel = (dateString?: string) => {

    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const messageDate = date.toDateString();

    if (messageDate === today) return "Today";
    if (messageDate === yesterday) return "Yesterday";
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isCurrentUser = (senderId: string) => {
    return senderId === currentUserId;
  };

  const handleMessageRightClick = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();
    setShowOptions({
      messageId,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const isUserAdmin = () => {
    return (
      conversation.adminIds?.includes(currentUserId) ||
      conversation.ownerId === currentUserId
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
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
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">
              Start a conversation by sending a message
            </p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <div key={message.id}>
            {/* Date Divider */}
            {message.createdAt && shouldShowDateDivider(index) && (
              <div className="flex justify-center my-6">
                <span className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full border">
                  {getDateLabel(message.createdAt)}
                </span>
              </div>
            )}

            {/* Message */}
            <div
              className={`flex ${
                isCurrentUser(message.senderId)
                  ? "justify-end"
                  : "justify-start"
              } group`}
            >
              {/* Sender Info for Group Messages */}
              {conversation.type === "GROUP" &&
                !isCurrentUser(message.senderId) && (
                  <div className="flex items-start space-x-2 max-w-[70%]">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-medium">
                        {message.sender?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">
                        {message.sender?.name || "Unknown"}
                      </p>
                      <MessageBubble
                        message={message}
                        isCurrentUser={isCurrentUser(message.senderId)}
                        onRightClick={(e) =>
                          handleMessageRightClick(e, message.id)
                        }
                      />
                    </div>
                  </div>
                )}

              {/* Current User Message or Private Chat */}
              {(isCurrentUser(message.senderId) ||
                conversation.type === "PRIVATE") && (
                <div className="max-w-[70%]">
                  <MessageBubble
                    message={message}
                    isCurrentUser={isCurrentUser(message.senderId)}
                    onRightClick={(e) => handleMessageRightClick(e, message.id)}
                  />
                </div>
              )}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />

      {/* Message Options Menu */}
      {showOptions && (
        <MessageOptions
          messageId={showOptions.messageId}
          isOwnMessage={isCurrentUser(
            messages.find((m) => m.id === showOptions.messageId)?.senderId || ""
          )}
          isGroup={conversation.type === "GROUP"}
          isAdmin={isUserAdmin()}
          onDeleteForMe={() => onDeleteMessage(showOptions.messageId, false)}
          onDeleteForAll={() => onDeleteMessage(showOptions.messageId, true)}
          position={showOptions.position}
          onClose={() => setShowOptions(null)}
        />
      )}
    </div>
  );
};

export default ChatMessages;
