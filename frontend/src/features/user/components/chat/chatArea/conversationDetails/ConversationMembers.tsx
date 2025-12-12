import React, { useState, useMemo } from "react";
import { UserPlus } from "lucide-react";
import { ConversationType } from "../../../../../../types/chat/chat";
import type { Conversation } from "../../../../../../types/chat/chat";
import MemberActionMenu from "./MemberActionMenu";
import AddMemberModal from "../AddMemberModal";
import type { User } from "../../../../../../types/users/user/user";

interface ConversationMembersProps {
  conversation: Conversation;
  currentUserId: string;
  user: User | null;
  membersData: any;
  isLoadingMembers: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  onAddAdmin: (userId: string) => void;
  onRemoveAdmin: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
  onAddMember: (userId: string) => void;
}

const ConversationMembers: React.FC<ConversationMembersProps> = ({
  conversation,
  currentUserId,
  user,
  membersData,
  isLoadingMembers,
  fetchNextPage,
  hasNextPage,
  onAddAdmin,
  onRemoveAdmin,
  onRemoveMember,
  onAddMember,
}) => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const isOwner = conversation.ownerId === currentUserId;
  const isAdmin = conversation.adminIds?.includes(currentUserId);
  const canAddMember = isOwner || isAdmin;

  const sortedMembers = useMemo(() => {
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
    return result;
  };

  const canPromote = (member: any) => {
    const result = (() => {
      if (member.role === "ADMIN" || member.role === "OWNER") return false;
      if (member.id === conversation.ownerId) return false;
      if (isOwner) return true;
      return false;
    })();
    return result;
  };

  const canDemote = (member: any) => {
    const result = (() => {
      if (member.role !== "ADMIN") return false;
      if (member.id === conversation.ownerId) return false;
      if (isOwner) return true;
      return false;
    })();
    return result;
  };

  return (
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
                    onPromote={() => onAddAdmin(member.id)}
                    onDemote={() => onRemoveAdmin(member.id)}
                    onRemove={() => onRemoveMember(member.id)}
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
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAddMember={onAddMember}
        existingMemberIds={conversation.memberIds || []}
      />
    </div>
  );
};

export default ConversationMembers;
