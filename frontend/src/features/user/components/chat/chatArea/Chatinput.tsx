import React, { useState, useRef, useEffect } from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendImage: () => void;
  onTyping?: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendImage,
  onTyping,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (onTyping) {
      onTyping();
    }
  };

  // close picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current?.contains(e.target as Node) ||
        emojiButtonRef.current?.contains(e.target as Node)
      )
        return;
      setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-2 border-t border-border bg-background/80 backdrop-blur-sm relative">
      {/* anchored emoji picker */}
      {showEmojiPicker && (
        <div ref={pickerRef} className="absolute bottom-full mb-2 left-14 z-50">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={Theme.DARK}
            width={350}
            height={400}
            searchDisabled={false}
            skinTonesDisabled={true}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* attachment + emoji */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSendImage}
            disabled={disabled}
            className="p-2.5 hover:bg-muted rounded-xl transition-all disabled:opacity-40"
            title="Attach file"
          >
            <svg
              className="w-5 h-5 text-muted-foreground"
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

          <button
            ref={emojiButtonRef}
            type="button"
            onClick={() => setShowEmojiPicker((s) => !s)}
            disabled={disabled}
            className="p-2.5 hover:bg-muted rounded-xl transition-all disabled:opacity-40"
            title="Add emoji"
          >
            <svg
              className="w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        {/* input */}
        <div className="flex-1">
          <Input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            disabled={disabled}
            placeholder={
              disabled ? "This conversation is locked" : "Type a message…"
            }
            className="w-full bg-muted/50 border-0 rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* send */}
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
          className="h-12 w-12 rounded-full"
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
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
