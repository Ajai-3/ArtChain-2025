import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConversationItem from "./chatUserList/ConversationItem";
import {
  type Conversation,
  ConversationType,
} from "../../../../types/chat/chat";
import { useRecentConversations } from "../../hooks/chat/useRecentConversations";
import {
  addConversation
} from "../../../../redux/slices/chatSlice";
import { type RootState } from "../../../../redux/store";

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
  const dispatch = useDispatch();

  const conversations = useSelector(
    (state: RootState) => state.chat.conversations || []
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRecentConversations();

  useEffect(() => {
    if (data?.pages) {
      const allConversations: Conversation[] =
        data.pages.flatMap((page) => page.conversations) || [];

      allConversations.forEach((conversation) => {
        dispatch(addConversation(conversation));
      });
    }
  }, [data, dispatch]);

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.memberIds?.some((memberId) => {
        const partner = conversation.partner;
        return partner?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      });

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

  console.log(filteredConversations);
  // Tabs
  const tabs = [
    { id: "private" as TabType, label: "Private" },
    { id: "group" as TabType, label: "Groups" },
    { id: "requests" as TabType, label: "Requests" },
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (
      scrollHeight - scrollTop <= clientHeight + 100 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

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
              className={`flex items-center flex-1 justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground p-4">
            <p className="text-sm text-center">No conversations found</p>
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
        {isFetchingNextPage && (
          <div className="text-center py-2 text-sm text-muted-foreground">
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUserList;
