import React, { useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import ConversationItem from "./chatUserList/ConversationItem";
import type { Conversation } from "../../../../types/chat/chat";
import { selectConversations } from "../../../../redux/selectors/chatSelectors";
import CreateGroupModal from "./chatUserList/CreateGroupModal";

interface ChatUserListProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  onScrollToLoadMore: () => void;
  isFetchingNextPage: boolean;
}

type TabType = "private" | "group" | "requests";

const ChatUserList: React.FC<ChatUserListProps> = ({
  selectedConversation,
  onSelectConversation,
  onScrollToLoadMore,
  isFetchingNextPage,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("private");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  const conversations = useSelector(selectConversations);

  const sortedConversations = useMemo(() => {
    const clone = [...conversations];
    clone.sort((a, b) => {
      const aTime = new Date(
        a.lastMessage?.createdAt || a.updatedAt || 0
      ).getTime();
      const bTime = new Date(
        b.lastMessage?.createdAt || b.updatedAt || 0
      ).getTime();
      return bTime - aTime;
    });
    return clone;
  }, [conversations]);

  const filtered = useMemo(() => {
    return sortedConversations.filter((c) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        c.name?.toLowerCase().includes(query) ||
        c.partner?.name?.toLowerCase().includes(query) ||
        false;

      const matchesTab =
        (activeTab === "private" && c.type === "PRIVATE" && !c.locked) ||
        (activeTab === "group" && c.type === "GROUP" && !c.locked) ||
        (activeTab === "requests" && c.locked);

      return matchesSearch && matchesTab;
    });
  }, [sortedConversations, searchQuery, activeTab]);

  const tabs = [
    { id: "private" as TabType, label: "Private" },
    { id: "group" as TabType, label: "Groups" },
    { id: "requests" as TabType, label: "Requests" },
  ];

  const handleScroll: React.UIEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const t = e.currentTarget;
      if (
        !isFetchingNextPage &&
        t.scrollHeight - t.scrollTop <= t.clientHeight + 100
      ) {
        onScrollToLoadMore();
      }
    },
    [isFetchingNextPage, onScrollToLoadMore]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleTabChange = useCallback((tabId: TabType) => {
    setActiveTab(tabId);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-background border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsCreateGroupModalOpen(true)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              title="Create Group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>

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
            onChange={handleSearchChange}
            className="w-full bg-muted/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
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

      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground p-4">
            <p className="text-sm text-center">No conversations found</p>
          </div>
        ) : (
          filtered.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              isSelected={selectedConversation === c.id}
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

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onGroupCreated={() => {
        }}
      />
    </div>
  );
};

export default ChatUserList;
