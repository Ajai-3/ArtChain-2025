// components/chat/ChatUserList.tsx
import React, { useState } from "react";
import ConversationItem from "./chatUserList/ConversationItem";
import { type Conversation, ConversationType } from "../../../../types/chat/chat";
import { dummyConversations } from "./dummyData";

interface ChatUserListProps {
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
}

type TabType = "private" | "group" | "requests";

const ChatUserList: React.FC<ChatUserListProps> = ({
  selectedConversation,
  onSelectConversation,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("private");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "private" as TabType, label: "Private", badge: null },
    { id: "group" as TabType, label: "Groups", badge: null },
    {
      id: "requests" as TabType,
      label: "Requests",
      badge: dummyConversations.filter((c) => c.locked).length,
    },
  ];

  const filteredConversations = dummyConversations.filter((conversation) => {
    const matchesSearch =
      conversation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.members?.some((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTab =
      (activeTab === "private" &&
        conversation.type === ConversationType.PRIVATE &&
        !conversation.locked) ||
      (activeTab === "group" &&
        conversation.type === ConversationType.GROUP &&
        !conversation.locked) ||
      (activeTab === "requests" && conversation.locked);

    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full h-full flex flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
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
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 flex-1 justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground p-4">
            <svg
              className="w-8 h-8 mb-2"
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
            <p className="text-sm text-center">No conversations found</p>
            <p className="text-xs text-center mt-1">
              {searchQuery
                ? "Try a different search term"
                : `No ${activeTab} conversations`}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversation === conversation.id}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatUserList;
