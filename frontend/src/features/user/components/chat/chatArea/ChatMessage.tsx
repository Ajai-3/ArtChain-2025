// components/chat/chatArea/ChatMessage.tsx
import MessageBubble from "./MessageBubble";
import MessageOptions from "../MessageOptions";
import React, { useState, useRef, useEffect, useCallback } from "react";
import type { Message, Conversation } from "../../../../../types/chat/chat";

interface ChatMessagesProps {
  messages: Message[];
  conversation: Conversation;
  currentUserId: string;
  onDeleteMessage: (messageId: string, deleteForAll: boolean) => void;
  loadMoreMessages: () => void;
  hasMore: boolean;
  isLoading: boolean;
  isFetchingMore: boolean;
  isVirtualPagination?: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages = [],
  conversation,
  currentUserId,
  onDeleteMessage,
  loadMoreMessages,
  hasMore,
  isLoading,
  isFetchingMore,
  isVirtualPagination = false,
}) => {
  const [showOptions, setShowOptions] = useState<{
    messageId: string;
    position: { x: number; y: number };
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);
  const prevMessagesLengthRef = useRef(0);
  const prevScrollHeightRef = useRef(0);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (autoScrollRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior,
        block: "end",
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const scrollPosition = scrollHeight - scrollTop - clientHeight;
    autoScrollRef.current = scrollPosition < 100;
  }, []);

  // Track scroll position
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Initial scroll to bottom when messages first load
  useEffect(() => {
    if (messages.length > 0 && prevMessagesLengthRef.current === 0) {
      setTimeout(() => {
        scrollToBottom("auto");
      }, 100);
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, scrollToBottom]);

  // Maintain scroll position when loading older messages
  useEffect(() => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const currentScrollHeight = container.scrollHeight;
    const previousScrollHeight = prevScrollHeightRef.current;

    // If messages increased and we're not at bottom, maintain position
    if (
      messages.length > prevMessagesLengthRef.current &&
      !autoScrollRef.current
    ) {
      const heightDiff = currentScrollHeight - previousScrollHeight;
      if (heightDiff > 0) {
        container.scrollTop += heightDiff;
      }
    }

    prevScrollHeightRef.current = currentScrollHeight;
  }, [messages.length]);

  // Auto-scroll for new messages (when at bottom)
  useEffect(() => {
    if (messages.length > 0 && autoScrollRef.current) {
      const latestMessage = messages[messages.length - 1];
      const isRecent =
        Date.now() - new Date(latestMessage.createdAt!).getTime() < 2000;
      if (isRecent) {
        scrollToBottom("smooth");
      }
    }
  }, [messages, scrollToBottom]);

  // Intersection Observer for loading more
  useEffect(() => {
    if (!hasMore || !loadMoreTriggerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          console.log("Triggering load more");
          loadMoreMessages();
        }
      },
      {
        root: messagesContainerRef.current,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(loadMoreTriggerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isFetchingMore, loadMoreMessages]);

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
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 relative"
    >
      {isLoading && messages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      )}

      <div className="min-h-full flex flex-col justify-end">
        {messages.length === 0 && !isLoading ? (
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
          <>
            {hasMore && <div ref={loadMoreTriggerRef} className="h-4" />}

            {isFetchingMore && (
              <div className="flex justify-center py-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {isVirtualPagination
                      ? "Loading more messages..."
                      : "Loading older messages..."}
                  </span>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={message.id}>
                {message.createdAt && shouldShowDateDivider(index) && (
                  <div className="flex justify-center my-6">
                    <span className="text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full border backdrop-blur-sm">
                      {getDateLabel(message.createdAt)}
                    </span>
                  </div>
                )}

                <div
                  className={`flex ${
                    isCurrentUser(message.senderId)
                      ? "justify-end"
                      : "justify-start"
                  } mb-1`}
                >
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

                  {(isCurrentUser(message.senderId) ||
                    conversation.type === "PRIVATE") && (
                    <div className="max-w-[70%]">
                      <MessageBubble
                        message={message}
                        isCurrentUser={isCurrentUser(message.senderId)}
                        onRightClick={(e) =>
                          handleMessageRightClick(e, message.id)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div ref={messagesEndRef} />

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
