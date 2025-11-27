import React, { useEffect } from "react";
import { useCreateGroupModal } from "../../../hooks/chat/useCreateGroupModal";

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
  const {
    groupName,
    setGroupName,
    searchQuery,
    setSearchQuery,
    selectedUsers,
    isCreating,
    searchResults,
    isSearching,
    currentUser,
    handleUserSelect,
    handleUserRemove,
    handleCreateGroup,
    resetForm,
  } = useCreateGroupModal();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const onSubmit = async () => {
    await handleCreateGroup(() => {
      onGroupCreated();
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-background w-full max-w-md rounded-xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold text-lg">Create New Group</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Group Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full bg-muted/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-none"
              autoFocus
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
              <div className="max-h-40 overflow-y-auto border border-border rounded-lg bg-card relative z-10">
                {isSearching ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">Searching...</div>
                ) : searchResults?.length > 0 ? (
                  searchResults.map((user: any) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center gap-2 transition-colors"
                      disabled={selectedUsers.some(u => u.id === user.id) || user.id === currentUser?.id}
                      type="button"
                    >
                      <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
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
                      className="hover:text-primary/80 transition-colors"
                      type="button"
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
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!groupName.trim() || selectedUsers.length === 0 || isCreating}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {isCreating ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
