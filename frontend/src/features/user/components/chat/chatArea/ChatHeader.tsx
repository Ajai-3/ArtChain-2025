import React from "react";

interface ChatHeaderProps {
  selectedUser: string | null;
  onBack?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedUser, onBack }) => {
  const userData = {
    name: "John Doe",
    username: "johndoe",
    isOnline: true,
    lastSeen: "Active now",
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">JD</span>
          </div>
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
              userData.isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div className="ml-3">
          <h3 className="font-semibold text-sm">{userData.name}</h3>
          <p className="text-xs text-muted-foreground">
            {userData.isOnline
              ? userData.lastSeen
              : `Last seen ${userData.lastSeen}`}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <button
          className="p-2 hover:bg-muted rounded-full transition-colors"
          title="Voice call"
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </button>

        <button
          className="p-2 hover:bg-muted rounded-full transition-colors"
          title="Video call"
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>

        <button
          className="p-2 hover:bg-muted rounded-full transition-colors"
          title="User info"
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
