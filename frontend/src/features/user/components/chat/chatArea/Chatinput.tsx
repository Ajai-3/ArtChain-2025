// components/chat/chatArea/ChatInput.tsx
import React, { useState } from "react";
import { Input } from "../../../../../components/ui/input";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendImage: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendImage,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Attachment Button */}
        <button
          type="button"
          onClick={onSendImage}
          disabled={disabled}
          className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach file"
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
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Input
          variant="search"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder={
              disabled ? "This conversation is locked" : "Type a message..."
            }
            className="w-full bg-zinc-800 px-4 py-3 text-sm placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-3 bg-primary text-primary-foreground rounded-full transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          title="Send message"
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
