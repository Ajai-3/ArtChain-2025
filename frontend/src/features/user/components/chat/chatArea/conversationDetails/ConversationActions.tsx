import React from "react";
import { ConversationType } from "../../../../../../types/chat/chat";
import type { Conversation } from "../../../../../../types/chat/chat";

interface ConversationActionsProps {
  conversation: Conversation;
}

const ConversationActions: React.FC<ConversationActionsProps> = ({ conversation }) => {
  return (
    <div>
      <h4 className="font-medium text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 uppercase tracking-wide">
        ACTIONS
      </h4>
      <div className="space-y-1 md:space-y-2">
        {conversation.locked ? (
          <button className="w-full text-left p-3 md:p-4 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors flex items-center space-x-2 md:space-x-3">
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            </svg>
            <span className="text-sm">Accept Request</span>
          </button>
        ) : (
          <>
            <button className="w-full text-left p-3 md:p-4 rounded-lg hover:bg-muted transition-colors flex items-center space-x-2 md:space-x-3">
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="text-sm">Mute Notifications</span>
            </button>

            {conversation.type === ConversationType.PRIVATE && (
              <button className="w-full text-left p-3 md:p-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2 md:space-x-3">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="text-sm">Delete Conversation</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationActions;
