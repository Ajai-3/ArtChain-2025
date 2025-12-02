// components/chat/chatArea/ConversationDetails.tsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Trash2, Shield, MoreVertical, UserPlus } from "lucide-react";
import AddMemberModal from "./AddMemberModal";
import { useGroupMembers } from "../../../hooks/chat/useGroupMembers";
import { useGroupActions } from "../../../hooks/chat/useGroupActions";
import {
  type Conversation,
  ConversationType,
} from "../../../../../types/chat/chat";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../redux/store";

interface ConversationDetailsProps {
  conversation: Conversation;
  onClose: () => void;
  currentUserId: string;
}

interface MemberActionMenuProps {
  member: any;
  canPromote: boolean;
  canDemote: boolean;
  canRemove: boolean;
  onPromote: () => void;
  onDemote: () => void;
  onRemove: () => void;
}

const MemberActionMenu: React.FC<MemberActionMenuProps> = ({
  // member,
  canPromote,
  canDemote,
  canRemove,
  onPromote,
  onDemote,
  onRemove,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  console.log("🔧 MemberActionMenu render:", { canPromote, canDemote, canRemove, isOpen });

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log("🖱️ Toggle menu clicked! Current isOpen:", isOpen);
    
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const newPosition = {
        x: rect.right - 140,
        y: rect.bottom + 5,
      };
      console.log("📍 Setting position:", newPosition);
      setPosition(newPosition);
    }
    setIsOpen(!isOpen);
    console.log("✅ Will set isOpen to:", !isOpen);
  };

  React.useEffect(() => {
    console.log("🔄 useEffect - isOpen changed to:", isOpen);
    
    const handleClickOutside = (e: MouseEvent) => {
      console.log("👆 Click outside detected");
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        console.log("✖️ Closing menu");
        setIsOpen(false);
      }
    };

    if (isOpen) {
      console.log("⏱️ Adding click listener with setTimeout");
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
        console.log("✅ Click listener added");
      }, 0);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      console.log("🧹 Click listener removed");
    };
  }, [isOpen]);

  if (!canPromote && !canDemote && !canRemove) {
    console.log("⚠️ MemberActionMenu: No permissions, returning null");
    return null;
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
        aria-label="Member options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && createPortal(
        <>
          {console.log("🎨 Rendering menu at position:", position)}
          <div
            ref={menuRef}
            className="fixed bg-popover border border-border rounded-md shadow-lg py-1 min-w-[140px] z-[9999]"
            style={{
              left: Math.max(10, position.x),
              top: position.y,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {canPromote && (
              <button
                onClick={() => {
                  console.log("📢 Make Admin clicked");
                  onPromote();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center space-x-2"
              >
                <Shield className="w-3 h-3" />
                <span>Make Admin</span>
              </button>
            )}
            {canDemote && (
              <button
                onClick={() => {
                  console.log("⬇️ Remove Admin clicked");
                  onDemote();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center space-x-2"
              >
                <Shield className="w-3 h-3 text-orange-500" />
                <span>Remove Admin</span>
              </button>
            )}
            {canRemove && (
              <button
                onClick={() => {
                  console.log("🗑️ Remove clicked");
                  onRemove();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
};

const ConversationDetails: React.FC<ConversationDetailsProps> = ({
  conversation,
  onClose,
  currentUserId,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const isOwner = conversation.ownerId === currentUserId;
  const isAdmin = conversation.adminIds?.includes(currentUserId);

  const {
    data: membersData,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingMembers,
  } = useGroupMembers(conversation.id);

  const { removeMember, addAdmin, removeAdmin, addMember } = useGroupActions(conversation.id);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const sortedMembers = React.useMemo(() => {
    if (!membersData?.pages) return [];
    
    const allMembers = membersData.pages
      .flatMap((page: any) => page.members)
      .filter((m: any) => m.id !== currentUserId);

    return allMembers.sort((a: any, b: any) => {
      const getRolePriority = (role: string, id: string) => {
        if (id === conversation.ownerId) return 3;
        if (role === "ADMIN") return 2;
        return 1;
      };
      return getRolePriority(b.role, b.id) - getRolePriority(a.role, a.id);
    });
  }, [membersData, conversation.ownerId, currentUserId]);

  const ownerName = React.useMemo(() => {
     if (conversation.ownerId === currentUserId) return "You";
     const owner = membersData?.pages
        .flatMap((page: any) => page.members)
        .find((m: any) => m.id === conversation.ownerId);
     return owner?.name || "Owner";
  }, [membersData, conversation.ownerId, currentUserId]);

  const canRemove = (member: any) => {
    const result = (() => {
      if (member.id === currentUserId) return false;
      if (isOwner) return true;
      if (isAdmin) {
        if (member.role === "OWNER") return false;
        if (member.role === "ADMIN") return false;
        if (member.id === conversation.ownerId) return false;
        return true;
      }
      return false;
    })();
    console.log(`🔐 canRemove for member ${member.name}:`, result, { isOwner, isAdmin, memberRole: member.role, memberId: member.id });
    return result;
  };

  const canPromote = (member: any) => {
    const result = (() => {
      if (member.role === "ADMIN" || member.role === "OWNER") return false;
      if (member.id === conversation.ownerId) return false;
      if (isOwner) return true;
      return false;
    })();
    console.log(`⬆️ canPromote for member ${member.name}:`, result, { isOwner, memberRole: member.role, memberId: member.id });
    return result;
  };

  const canDemote = (member: any) => {
    const result = (() => {
      if (member.role !== "ADMIN") return false;
      if (member.id === conversation.ownerId) return false;
      if (isOwner) return true;
      return false;
    })();
    console.log(`⬇️ canDemote for member ${member.name}:`, result, { isOwner, memberRole: member.role, memberId: member.id });
    return result;
  };

  const canAddMember = isOwner || isAdmin;

  const getConversationName = () => {
    if (conversation.type === "GROUP") {
      return conversation.name || conversation.group?.name || "Unnamed Group";
    }
    return conversation.partner?.name || "Unknown User";
  };

  const getProfileImage = () => {
    if (conversation.type === "PRIVATE" && conversation.partner?.profileImage) {
      return conversation.partner.profileImage;
    }
    if (conversation.type === "GROUP" && conversation?.group?.profileImage) {
      return conversation?.group?.profileImage;
    }
    return null;
  };

  const profileImage = getProfileImage();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleViewProfile = () => {
    if (conversation.partner?.username) {
      navigate(`/${conversation.partner.username}`);
      onClose();
    }
  };

  return (
    <div className="w-full h-full bg-background/95 backdrop-blur z-50 md:z-auto md:relative md:w-96 border-l border-border flex flex-col">
      {/* Header */}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Profile Section */}
        <div className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4 overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt={getConversationName()}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl md:text-2xl font-semibold text-primary">
                {getInitials(getConversationName())}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-lg md:text-xl mb-1 md:mb-2">
            {getConversationName()}
          </h3>

          <p className="text-muted-foreground text-xs md:text-sm">
            {conversation.type === ConversationType.GROUP
              ? `${conversation.memberIds?.length || 0} members`
              : conversation.type === ConversationType.PRIVATE
              ? "Private conversation"
              : "Request conversation"}
          </p>

          {conversation.type === ConversationType.PRIVATE &&
            conversation.partner && (
              <button
                onClick={handleViewProfile}
                className="mt-2 md:mt-3 text-xs md:text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View Profile
              </button>
            )}
        </div>

        {/* Participants/Members Section */}
        <div>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h4 className="font-medium text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
              {conversation.type === ConversationType.GROUP
                ? `MEMBERS (${conversation.memberIds?.length || 0})`
                : "PARTICIPANTS"}
            </h4>
            {canAddMember && (
              <button
                onClick={() => setIsAddMemberModalOpen(true)}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                Add Member
              </button>
            )}
          </div>
          <div className="space-y-2 md:space-y-3">
            {conversation.type === ConversationType.PRIVATE &&
              conversation.partner && (
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="relative">
                      <div className="w-9 h-9 md:w-11 md:h-11 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                        {conversation.partner.profileImage ? (
                          <img
                            src={conversation.partner.profileImage}
                            alt={conversation.partner.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs md:text-sm font-medium">
                            {conversation.partner.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-background bg-green-500" />
                    </div>
                    <div>
                      <span className="text-xs md:text-sm font-medium block">
                        {conversation.partner.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Online
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                    User
                  </span>
                </div>
              )}

            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs md:text-sm font-medium">You</span>
                  )}
                </div>
                <div>
                  <span className="text-xs md:text-sm font-medium block">
                    You
                  </span>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {currentUserId === conversation.ownerId && (
                  <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-1.5 py-0.5 rounded border border-yellow-200 dark:border-yellow-700">
                    Owner
                  </span>
                )}
                {conversation.adminIds?.includes(currentUserId) && currentUserId !== conversation.ownerId && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-700">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {conversation.type === ConversationType.GROUP && (
              <div className="space-y-2">
                {isLoadingMembers && sortedMembers.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground">Loading members...</p>
                ) : (
                  sortedMembers.map((member: any) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {member.profileImage ? (
                            <img
                              src={member.profileImage}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs md:text-sm font-medium">
                              {member.name?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-xs md:text-sm font-medium block">
                            {member.name} {member.id === currentUserId && "(You)"}
                          </span>
                          <div className="flex items-center space-x-1">
                            {member.id === conversation.ownerId && (
                              <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-1.5 py-0.5 rounded border border-yellow-200 dark:border-yellow-700">
                                Owner
                              </span>
                            )}
                            {member.role === "ADMIN" && member.id !== conversation.ownerId && (
                              <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-700">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <MemberActionMenu 
                        member={member} 
                        canPromote={canPromote(member)} 
                        canDemote={canDemote(member)}
                        canRemove={canRemove(member)}
                        onPromote={() => addAdmin.mutate(member.id)}
                        onDemote={() => removeAdmin.mutate(member.id)}
                        onRemove={() => removeMember.mutate(member.id)}
                      />
                    </div>
                  ))
                )}
                
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    className="w-full text-xs text-center py-2 text-primary hover:underline"
                  >
                    Load more members
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions Section */}
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
      </div>
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAddMember={(userId) => addMember.mutate(userId)}
        existingMemberIds={conversation.memberIds || []}
      />
    </div>
  );
};

export default ConversationDetails;
