import React, { useState } from "react";
import { useUnifiedSearch } from "../../../../../api/user/search/queries";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../redux/selectors/userSelectors";
import apiClient from "../../../../../api/axios";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onGroupCreated,
}) => {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const currentUser = useSelector(selectCurrentUser);

  // Use unified search to find users
  const { data: searchResults, isLoading: isSearching } = useUnifiedSearch(
    searchQuery,
    "user"
  );

  const handleUserSelect = (user: any) => {
    if (selectedUsers.find((u) => u.id === user.id)) return;
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery(""); // Clear search after selection
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    setIsCreating(true);
    try {
      await apiClient.post("/api/v1/chat/conversation/group", {
        name: groupName,
        memberIds: selectedUsers.map((u) => u.id),
      });
      onGroupCreated();
      onClose();
      // Reset state
      setGroupName("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background w-full max-w-md rounded-xl border border-border shadow-lg overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold text-lg">Create New Group</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Group Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full bg-muted/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-none"
            />
          </div>

          {/* User Search */}
          <div>
            <label className="block text-sm font-medium mb-1">Add Members</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for users..."
              className="w-full bg-muted/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-none mb-2"
            />
            
            {/* Search Results Dropdown */}
            {searchQuery && (
              <div className="max-h-40 overflow-y-auto border border-border rounded-lg bg-card">
                {isSearching ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">Searching...</div>
                ) : searchResults?.length > 0 ? (
                  searchResults.map((user: any) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center gap-2"
                      disabled={selectedUsers.some(u => u.id === user.id) || user.id === currentUser?.id}
                    >
                      <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xs">
                            {user.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name || user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">No users found</div>
                )}
              </div>
            )}
          </div>

          {/* Selected Users List */}
          {selectedUsers.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Selected Members ({selectedUsers.length})</label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                  >
                    <span>{user.username}</span>
                    <button
                      onClick={() => handleUserRemove(user.id)}
                      className="hover:text-primary/80"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedUsers.length === 0 || isCreating}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
