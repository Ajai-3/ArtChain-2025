import MessageBubble from "./MessageBubble";
import MessageOptions from "../MessageOptions";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import type {
  Message,
  Conversation,
  User,
} from "../../../../../types/chat/chat";

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
  userMap: Record<string, User | undefined>;
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
  userMap,
}) => {
  const [showOptions, setShowOptions] = useState<{
    messageId: string;
    position: { x: number; y: number };
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadLockRef = useRef(false);
  const autoScrollRef = useRef(true);
  const initialLoadRef = useRef(true);

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

    if (
      scrollTop <= 100 &&
      hasMore &&
      !loadLockRef.current &&
      !isFetchingMore
    ) {
      loadLockRef.current = true;
      console.log("ChatMessages: Scroll trigger - loading older messages");
      loadMoreMessages();
      setTimeout(() => {
        loadLockRef.current = false;
      }, 500);
    }
  }, [hasMore, isFetchingMore, loadMoreMessages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useLayoutEffect(() => {
    if (messages.length > 0 && initialLoadRef.current) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "auto",
          block: "end",
        });
        initialLoadRef.current = false;
      }
    }
  }, [messages.length]);

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

  useEffect(() => {
    if (conversation.id) {
      initialLoadRef.current = true;
      autoScrollRef.current = true;
      loadLockRef.current = false;
    }
  }, [conversation.id]);

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

  const resolveSender = useCallback(
    (message: Message) => {
      return userMap?.[message.senderId] || message.sender;
    },
    [userMap]
  );

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 relative"
    >
      {isLoading && messages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-10">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 border-4 border-main-color border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">
              Loading conversation…
            </p>
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
            {isFetchingMore && (
              <div className="flex justify-center py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/80 px-4 py-2 rounded-full shadow-sm backdrop-blur">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Fetching older messages…</span>
                </div>
              </div>
            )}

            {messages.map((message, index) => {
              const sender = resolveSender(message);
              const hydratedMessage =
                sender && sender !== message.sender
                  ? { ...message, sender }
                  : message;

              return (
                <div key={message.id}>
                  <div
                    className={`flex ${
                      isCurrentUser(hydratedMessage.senderId)
                        ? "justify-end"
                        : "justify-start"
                    } mb-1`}
                  >
                    {conversation.type === "GROUP" &&
                      !isCurrentUser(hydratedMessage.senderId) && (
                        <div className="flex items-end space-x-2 max-w-[70%]">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 text-white dark:bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-md font-medium">
                              {sender?.name?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <MessageBubble
                              message={hydratedMessage}
                              isCurrentUser={isCurrentUser(
                                hydratedMessage.senderId
                              )}
                              onRightClick={(e) =>
                                handleMessageRightClick(e, hydratedMessage.id)
                              }
                            />
                          </div>
                        </div>
                      )}

                    {(isCurrentUser(hydratedMessage.senderId) ||
                      conversation.type === "PRIVATE") && (
                      <div className="max-w-[70%]">
                        <MessageBubble
                          message={hydratedMessage}
                          isCurrentUser={isCurrentUser(
                            hydratedMessage.senderId
                          )}
                          onRightClick={(e) =>
                            handleMessageRightClick(e, hydratedMessage.id)
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
