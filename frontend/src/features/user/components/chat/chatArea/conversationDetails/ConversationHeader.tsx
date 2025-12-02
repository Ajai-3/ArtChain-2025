import React from "react";

interface ConversationHeaderProps {
  onClose: () => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Conversation Info</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="Close conversation details"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ConversationHeader;
