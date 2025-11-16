// components/chat/chatArea/ConversationDetails.tsx
import React from "react";
import { type Conversation, ConversationType } from "../../../../../types/chat/chat";

interface ConversationDetailsProps {
  conversation: Conversation;
  onClose: () => void;
  currentUserId: string;
}

const ConversationDetails: React.FC<ConversationDetailsProps> = ({
  conversation,
  onClose,
  currentUserId,
}) => {
  const isOwner = conversation.ownerId === currentUserId;
  const isAdmin = conversation.adminIds?.includes(currentUserId);

  return (
    <div className="w-full md:w-96 border-l border-border bg-background/95 backdrop-blur h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Conversation Info</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
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

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Conversation Info */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-semibold">
              {conversation.type === ConversationType.GROUP ? "G" : "U"}
            </span>
          </div>

          <h3 className="font-semibold text-xl mb-2">
            {conversation.name ||
              conversation.members
                ?.filter((m) => m.id !== currentUserId)
                .map((m) => m.name)
                .join(", ")}
          </h3>

          <p className="text-muted-foreground text-sm">
            {conversation.type === ConversationType.GROUP
              ? `${conversation.members?.length || 0} members`
              : conversation.isOnline
              ? "Online"
              : "Offline"}
          </p>

          {conversation.type === ConversationType.GROUP &&
            conversation.description && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Group Description
                </p>
                <p className="text-sm">{conversation.description}</p>
              </div>
            )}
        </div>

        {/* Members */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-4 uppercase tracking-wide">
            {conversation.type === ConversationType.GROUP
              ? `MEMBERS (${conversation.members?.length || 0})`
              : "PARTICIPANTS"}
          </h4>
          <div className="space-y-3">
            {conversation.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    {member.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background bg-green-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium block">
                      {member.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {member.isOnline
                        ? "Online"
                        : member.lastSeen
                        ? `Last seen ${formatTime(member.lastSeen)}`
                        : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {conversation.ownerId === member.id && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Owner
                    </span>
                  )}
                  {conversation.adminIds?.includes(member.id) &&
                    conversation.ownerId !== member.id && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  {member.id === currentUserId && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      You
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-4 uppercase tracking-wide">
            ACTIONS
          </h4>
          <div className="space-y-2">
            {conversation.locked ? (
              <button className="w-full text-left p-4 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors flex items-center space-x-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                </svg>
                <span>Accept Request</span>
              </button>
            ) : (
              <>
                <button className="w-full text-left p-4 rounded-lg hover:bg-muted transition-colors flex items-center space-x-3">
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span>Mute Notifications</span>
                </button>

                <button className="w-full text-left p-4 rounded-lg hover:bg-muted transition-colors flex items-center space-x-3">
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
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                  <span>Change Theme</span>
                </button>

                {conversation.type === ConversationType.GROUP && (
                  <button className="w-full text-left p-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3">
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Leave Group</span>
                  </button>
                )}

                {(isOwner || isAdmin) &&
                  conversation.type === ConversationType.GROUP && (
                    <button className="w-full text-left p-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3">
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Delete Group</span>
                    </button>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

export default ConversationDetails;
