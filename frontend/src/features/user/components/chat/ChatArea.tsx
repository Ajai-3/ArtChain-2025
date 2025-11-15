import React from "react";

interface ChatAreaProps {
  selectedUser: string | null;
  onBack?: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedUser, onBack }) => {
  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-muted/20">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
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
          <h3 className="text-lg font-semibold mb-2">Your Messages</h3>
          <p className="text-muted-foreground text-sm">
            Send private messages to a friend or group.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background w-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-3 p-2 hover:bg-muted rounded-full transition-colors md:hidden"
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
          <div className="relative">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">JD</span>
            </div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-background" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-sm">John Doe</h3>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date divider */}
        <div className="flex justify-center">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            Today
          </span>
        </div>

        {/* Received Message */}
        <div className="flex justify-start">
          <div className="max-w-[70%] bg-muted rounded-2xl rounded-tl-none px-4 py-2">
            <p className="text-sm">Hey! How's it going? 👋</p>
            <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
          </div>
        </div>

        {/* Sent Message */}
        <div className="flex justify-end">
          <div className="max-w-[70%] bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-4 py-2">
            <p className="text-sm">
              I'm good! Just working on some new designs 🎨
            </p>
            <p className="text-xs text-primary-foreground/70 mt-1">10:31 AM</p>
          </div>
        </div>

        {/* Received Message */}
        <div className="flex justify-start">
          <div className="max-w-[70%] bg-muted rounded-2xl rounded-tl-none px-4 py-2">
            <p className="text-sm">That's awesome! Can't wait to see them 😄</p>
            <p className="text-xs text-muted-foreground mt-1">10:32 AM</p>
          </div>
        </div>

        {/* Sent Message with image */}
        <div className="flex justify-end">
          <div className="max-w-[70%]">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-4 py-2 mb-2">
              <p className="text-sm">
                Here's a preview of what I'm working on:
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border">
              <div className="w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  Design Preview
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              10:33 AM
            </p>
          </div>
        </div>

        {/* Received Message */}
        <div className="flex justify-start">
          <div className="max-w-[70%] bg-muted rounded-2xl rounded-tl-none px-4 py-2">
            <p className="text-sm">Wow, that looks incredible! 🔥</p>
            <p className="text-xs text-muted-foreground mt-1">10:34 AM</p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
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
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Message..."
            className="flex-1 bg-muted rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-none placeholder:text-muted-foreground"
          />
          <button className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
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
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
