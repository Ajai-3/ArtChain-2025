import React from "react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: Date;
  isRead: boolean;
  type: "text" | "image";
  imageUrl?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  selectedUser: string | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  selectedUser,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const shouldShowDateDivider = (currentIndex: number) => {
    if (currentIndex === 0) return true;

    const currentDate = messages[currentIndex].timestamp.toDateString();
    const prevDate = messages[currentIndex - 1].timestamp.toDateString();

    return currentDate !== prevDate;
  };

  const getDateLabel = (date: Date) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const messageDate = date.toDateString();

    if (messageDate === today) return "Today";
    if (messageDate === yesterday) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div key={message.id}>
          {/* Date Divider */}
          {shouldShowDateDivider(index) && (
            <div className="flex justify-center my-4">
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {getDateLabel(message.timestamp)}
              </span>
            </div>
          )}

          {/* Message */}
          <div
            className={`flex ${
              message.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Text Message */}
            {message.type === "text" && (
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.sender === "me"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted rounded-tl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "me"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {formatTime(message.timestamp)}
                  {message.sender === "me" && (
                    <span className="ml-1">{message.isRead ? "✓✓" : "✓"}</span>
                  )}
                </p>
              </div>
            )}

            {/* Image Message */}
            {message.type === "image" && (
              <div className="max-w-[70%]">
                <div
                  className={`rounded-2xl overflow-hidden border ${
                    message.sender === "me"
                      ? "border-primary/20"
                      : "border-border"
                  }`}
                >
                  <div className="w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      Design Preview
                    </span>
                  </div>
                  {message.text && (
                    <div
                      className={`p-3 ${
                        message.sender === "me" ? "bg-primary/5" : "bg-muted/50"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  )}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "me" ? "text-right" : "text-left"
                  } ${
                    message.sender === "me"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {formatTime(message.timestamp)}
                  {message.sender === "me" && (
                    <span className="ml-1">{message.isRead ? "✓✓" : "✓"}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
