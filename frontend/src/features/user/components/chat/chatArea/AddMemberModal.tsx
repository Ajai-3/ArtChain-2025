import React, { useState, useEffect } from "react";
import { useUnifiedSearch } from "../../../hooks/search/useUnifiedSearch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../redux/selectors/userSelectors";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (userId: string) => void;
  existingMemberIds: string[];
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  existingMemberIds,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = useSelector(selectCurrentUser);

  const { data: searchResults, isLoading: isSearching } = useUnifiedSearch(
    searchQuery,
    "user"
  );

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

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
          <h3 className="font-semibold text-lg">Add Member</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* User Search */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for users..."
              className="w-full bg-muted/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-none mb-2"
              autoFocus
            />
            
            {/* Search Results Dropdown */}
            {searchQuery && (
              <div className="max-h-60 overflow-y-auto border border-border rounded-lg bg-card relative z-10">
                {isSearching ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">Searching...</div>
                ) : searchResults?.length > 0 ? (
                  searchResults.map((user: any) => {
                    const isMember = existingMemberIds.includes(user.id);
                    const isSelf = user.id === currentUser?.id;
                    const isDisabled = isMember || isSelf;

                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          onAddMember(user.id);
                          onClose();
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors ${
                          isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"
                        }`}
                        disabled={isDisabled}
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
                        {isMember && <span className="text-xs text-muted-foreground">Member</span>}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">No users found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
